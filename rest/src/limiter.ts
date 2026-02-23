/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

import { LRUCache } from "./cache.ts";

class BucketRouteHasher {
	private readonly cache: LRUCache<string, string>;

	constructor(maxSize = 32 * 8) {
		this.cache = new LRUCache<string, string>(maxSize, 16);
	}

	hash(route: string): string {
		const query = route.indexOf("?");
		const path = query === -1 ? route : route.slice(0, query);

		const cached = this.cache.get(path);
		if (cached !== undefined) return cached;

		const normalized = this.normalize(path);
		this.cache.set(path, normalized);

		return normalized;
	}

	private normalize(path: string): string {
		let begin = 0, result = "";

		for (let i = 0; i <= path.length; i++) {
			if (i === path.length || path.charCodeAt(i) === 47) {
				const segment = path.slice(begin, i);
				if (result.length > 0) result += "/";
				result += this.isNumeric(segment) ? ":id" : segment;
				begin = i + 1;
			}
		}

		return result;
	}

	private isNumeric(str: string): boolean {
		if (str.length === 0) return false;

		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i);
			if (code < 48 || code > 57) return false;
		}
		return true;
	}
}

export class RateLimitBucket {
	constructor(
		public limit: number = 64,
		public remaining: number = 64,
		public resetAt: number = 0,
	) {}

	private reserved = 0;
	private lock: Promise<void> = Promise.resolve();

	/**
	 * acquires a slot from this bucket and returns a releasing function.
	 *
	 * the returned function must be invoked once the request lifecycle
	 * has fully completed to free the slot
	 */
	async acquire(): Promise<typeof this.release> {
		await this.lock;

		const now = Date.now();

		if (now >= this.resetAt) {
			this.remaining = this.limit;
			this.reserved = 0;
		}

		if (this.remaining - this.reserved <= 0) {
			const wait = Math.max(0, this.resetAt - now);

			await (this.lock = this.lock.then(() => new Promise((resolve) => setTimeout(resolve, wait))));
			this.remaining = 0, this.reserved = 0;
		}

		return this.reserved++, this.release.bind(this);
	}

	private release(headers: Headers, status: number): void {
		if (this.reserved !== 0) this.reserved--;

		if (status === 429) {
			const retryAfter = (parseFloat(headers.get("Retry-After") ?? "0") * 1000) || 5000;
			this.remaining = 0, this.resetAt = Date.now() + retryAfter;
			return;
		}

		const limit = headers.get("X-RateLimit-Limit");
		const remaining = headers.get("X-RateLimit-Remaining");
		const reset = headers.get("X-RateLimit-Reset");

		if (limit && remaining && reset) {
			this.limit = parseInt(limit, 10);
			this.remaining = parseInt(remaining, 10);
			this.resetAt = Math.ceil(parseFloat(reset) * 1000);
		}
	}
}

export interface RateLimitedResponse {
	readonly retryAfter: number;
	readonly global: boolean;
	readonly bucketId?: string;
}

export class RateLimitStore {
	private readonly ids = new Map<string, string>();
	private readonly buckets = new Map<string, RateLimitBucket>();

	private globalReset = 0;
	private globalLock: Promise<void> = Promise.resolve();

	constructor(private readonly hasher: BucketRouteHasher = new BucketRouteHasher()) {}

	/**
	 * Acquires a rate limit slot for the given route. returns a function that *MUST* be invoked
	 * once the completion of the request's lifecycle to free up its respective bucket slot.
	 */
	async acquire(route: string): ReturnType<RateLimitBucket["acquire"]> {
		await this.ensureLock();

		const hash = this.hasher.hash(route);
		const id = this.ids.get(hash) ?? hash;

		const bucket = this.getOrCreateBucket(id);
		const release = await bucket.acquire();
		return (headers: Headers, status: number) => {
			this.release(route, headers, status);
			release(headers, status);
		};
	}

	private async ensureLock(): Promise<void> {
		const now = Date.now();
		if (now < this.globalReset) {
			const wait = this.globalReset - now;
			await (this.globalLock = this.globalLock.then(() => new Promise((resolve) => setTimeout(resolve, wait))));
		} else {
			this.globalLock = Promise.resolve();
			this.globalReset = 0;
		}
	}

	private release(hash: string, headers: Headers, status: number): void {
		if (status === 429 && headers.get("X-RateLimit-Global") === "true") {
			const retryAfter = (parseFloat(headers.get("Retry-After") ?? "0") * 1000) || 5000;
			this.globalReset = Date.now() + retryAfter;
			this.globalLock = Promise.resolve();
		}

		const bucketId = headers.get("X-RateLimit-Bucket");
		if (bucketId) {
			this.ids.set(hash, bucketId);
		}
	}

	private getOrCreateBucket(id: string): RateLimitBucket {
		let bucket = this.buckets.get(id);
		if (!bucket) {
			bucket = new RateLimitBucket();
			this.buckets.set(id, bucket);
		}
		return bucket;
	}
}
