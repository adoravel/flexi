/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

import { FluxerApiError, FluxerHttpError, FluxerRestError, RequestTimeoutError } from "./error.ts";
import { RateLimitStore } from "./limiter.ts";
import { FormPayload, JsonPayload, Payload } from "./payload.ts";

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_RETRIES = 3;

function isJsonPayload(payload: Payload): payload is JsonPayload {
	return !("files" in payload);
}

function buildFormData(payload: FormPayload): FormData {
	const form = new FormData();
	const json = payload.data ?? {};

	const attachments = (json as { attachments?: unknown[] }).attachments ??
		payload.files.map((f, i) => ({
			id: i,
			filename: f.filename,
			description: f.description,
		}));

	form.append("payload_json", JSON.stringify({ ...json, attachments }));

	for (let i = 0; i < payload.files.length; i++) {
		const file = payload.files[i]!;
		const blob = file.data instanceof Blob ? file.data : new Blob([file.data]);

		const data = new File([blob], file.filename, { type: "application/octet-stream" });
		form.append(`files[${i}]`, data, file.filename);
	}

	return form;
}

export function buildRequest(
	method: Parameters<FluxerRestClient["request"]>[0],
	path: string,
	config: RestConfig,
	payload?: Payload,
): { url: string; init: RequestInit } {
	const headers = new Headers({
		"User-Agent": config.userAgent,
		"Accept": "application/json",
	});

	if (config.token) {
		headers.set("Authorization", `Bot ${config.token}`);
	}

	let body: BodyInit | undefined;
	if (payload) {
		if (isJsonPayload(payload)) {
			headers.set("Content-Type", "application/json");
			body = JSON.stringify(payload);
		} else {
			body = buildFormData(payload);
		}
	}

	return { url: `${config.api}/v${config.version}${path}`, init: { method, headers, body } };
}

export interface RestClient {
	get<T = unknown>(route: string): Promise<T>;
	post<T = unknown>(route: string, body?: Payload): Promise<T>;
	patch<T = unknown>(route: string, body?: Payload): Promise<T>;
	put<T = unknown>(route: string, body?: Payload): Promise<T>;
	delete<T = unknown>(route: string): Promise<T>;
}

export interface RestConfig {
	/** full API base URL, e.g. `https://api.fluxer.app` */
	readonly api: string;
	readonly version: number;
	readonly token?: string;
	/** cooldown before a single fetch attempt is aborted. defaults to 15_000 */
	readonly timeoutMs: number;
	/** max additional attempts after the first failure. defaults to 3 */
	readonly maxRetries: number;
	/** `User-Agent` header value */
	readonly userAgent: string;
}

export class FluxerRestClient implements RestClient {
	readonly config: RestConfig;
	private readonly limiter = new RateLimitStore();

	constructor(config: Partial<RestConfig> = {}) {
		this.config = {
			api: config.api ?? "https://api.fluxer.app",
			version: config.version || 1,
			token: config.token,
			timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
			maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
			userAgent: config.userAgent ?? "flexi/0.1.0",
		};
	}

	public get<T = unknown>(route: string): Promise<T> {
		return this.request<T>("GET", route);
	}

	public post<T = unknown>(route: string, payload?: Payload): Promise<T> {
		return this.request<T>("POST", route, payload);
	}

	public patch<T = unknown>(route: string, payload?: Payload): Promise<T> {
		return this.request<T>("PATCH", route, payload);
	}

	public put<T = unknown>(route: string, payload?: Payload): Promise<T> {
		return this.request<T>("PUT", route, payload);
	}

	public delete<T = unknown>(route: string): Promise<T> {
		return this.request<T>("DELETE", route);
	}

	private async request<T>(
		method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
		route: string,
		payload?: Payload,
		attempt: number = 0,
	): Promise<T> {
		const release = await this.limiter.acquire(route);

		const { url, init } = buildRequest(method, route, this.config, payload);

		try {
			const response = await fetch(url, { ...init, signal: AbortSignal.timeout(this.config.timeoutMs) });
			release(response.headers, response.status);

			if (!response.ok) {
				if (attempt < this.config.maxRetries) {
					return this.request<T>(method, route, payload, attempt + 1);
				}
				if (response.status === 429) {
					throw new FluxerRestError("rate limit exceeded and max retries reached");
				}
				if (response.status >= 500) {
					throw new FluxerHttpError(response.status, await response.text());
				}
				throw await this.parseApiError(response);
			}

			if (response.status === 204) return undefined as T;

			const text = await response.text();
			try {
				return JSON.parse(text) as T;
			} catch {
				return text as T;
			}
		} catch (err: any) {
			release(new Headers(), 0);

			if (err?.name === "AbortError") {
				throw new RequestTimeoutError(route, this.config.timeoutMs);
			}
			throw err;
		}
	}

	private async parseApiError(response: Response): Promise<FluxerApiError> {
		const text = await response.text();
		try {
			const json = JSON.parse(text) as { message: string; code?: number };
			return new FluxerApiError(response.status, json);
		} catch {
			return new FluxerApiError(response.status, { code: -1, message: text });
		}
	}
}
