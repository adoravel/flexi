/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

export interface FileAttachment {
	readonly data: Blob | Uint8Array<ArrayBuffer>;
	readonly filename: string;
	readonly description?: string;
}

export type JsonPayload = ({ readonly [key: string]: unknown } | unknown[]) & {
	readonly __$: "json";
};

export type FormPayload = {
	readonly files: FileAttachment[];
	readonly data?: JsonPayload;
} & {
	readonly __$: "form";
};

export type Payload = JsonPayload | FormPayload;

export function jsonPayload(data: Record<string, unknown> | unknown[]): JsonPayload {
	return data as JsonPayload;
}

export function formPayload(
	files: readonly FileAttachment[],
	data?: Record<string, unknown> | unknown[],
): FormPayload {
	return { files, data } as FormPayload;
}
