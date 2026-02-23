/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

export class LRUCache<K, V> {
	private readonly map = new Map<K, V>();

	constructor(
		private readonly maxSize: number = 1024,
		private readonly evictCount: number = 16,
	) {
		if (maxSize <= 0) throw new Error("maxSize must be > 0");
		if (evictCount <= 0) throw new Error("evictCount must be > 0");
	}

	get(key: K): V | undefined {
		const value = this.map.get(key);
		if (value === undefined) return undefined;

		// refresh LRU order
		this.map.delete(key);
		this.map.set(key, value);

		return value;
	}

	set(key: K, value: V): void {
		if (this.map.has(key)) {
			this.map.delete(key);
		}

		this.map.set(key, value);

		if (this.map.size > this.maxSize) {
			this.evictOldest();
		}
	}

	has(key: K): boolean {
		return this.map.has(key);
	}

	get size(): number {
		return this.map.size;
	}

	clear(): void {
		this.map.clear();
	}

	private evictOldest(): void {
		let removed = 0;

		for (const key of this.map.keys()) {
			this.map.delete(key);
			if (++removed >= this.evictCount) break;
		}
	}
}
