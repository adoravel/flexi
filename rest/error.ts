/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

export interface ApiErrorBody {
	message: string;
	code?: string | number;
	errors?: Record<string, unknown>;
	retryAfter?: number;
	global?: boolean;
}

export class FluxerRestError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = this.constructor.name;
	}
}

export class FluxerHttpError extends FluxerRestError {
	constructor(
		public readonly status: number,
		public readonly body: string,
		options?: ErrorOptions,
	) {
		super(`HTTP ${status}: ${body.slice(0, 200) || "(empty)"}`, options);
	}
	get isRetryable(): boolean {
		return this.status === 429 || (this.status >= 500 && this.status < 600);
	}
}

export class FluxerApiError extends FluxerRestError {
	constructor(
		public readonly status: number,
		public readonly body: ApiErrorBody,
		options?: ErrorOptions,
	) {
		super(`[${status}] ${body.message} (code: ${body.code ?? "unknown"})`, options);
	}
	get isRetryable(): boolean {
		return this.status === 429 || (this.status >= 500 && this.status < 600);
	}
}

export class RateLimitError extends FluxerApiError {
	constructor(
		public readonly retryAfterMs: number,
		public readonly isGlobal: boolean,
		body: ApiErrorBody,
		options?: ErrorOptions,
	) {
		super(429, body, options);
		this.name = "RateLimitError";
	}
}

export class RequestTimeoutError extends FluxerRestError {
	constructor(
		public readonly url: string,
		public readonly timeoutMs: number,
	) {
		super(`request to ${url} timed out after ${timeoutMs}ms`);
	}
}

export class NetworkError extends FluxerRestError {
	constructor(public readonly url: string, cause: unknown) {
		super(
			`network error @ ${url}: ${cause instanceof Error ? cause.message : String(cause)}`,
			{ cause: cause instanceof Error ? cause : new Error(String(cause)) },
		);
	}
}
