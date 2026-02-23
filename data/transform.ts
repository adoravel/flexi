/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

/** converts a single `snake_case` string literal type to `camelCase` */
export type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Head}${Capitalize<CamelCase<Tail>>}`
	: S;

/** recursively transforms all keys of an object type from `snake_case` to `camelCase` */
export type DeepCamelCase<T> = T extends null | undefined | boolean | number | string ? T
	: T extends readonly (infer U)[] ? readonly DeepCamelCase<U>[]
	: T extends object ? { readonly [K in keyof T as CamelCase<K & string>]: DeepCamelCase<T[K]> }
	: T;

/** converts a single `camelCase` string literal type to `snake_ase` */
export type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Head extends Uppercase<Head> ? Head extends Lowercase<Head> ? `${Head}${SnakeCase<Tail>}`
		: `_${Lowercase<Head>}${SnakeCase<Tail>}`
	: `${Head}${SnakeCase<Tail>}`
	: S;

/** recursively transforms all keys of an object type from `camelCase` to `snake_case` */
export type DeepSnakeCase<T> = T extends null | undefined | boolean | number | string ? T
	: T extends readonly (infer U)[] ? readonly DeepSnakeCase<U>[]
	: T extends object ? { readonly [K in keyof T as SnakeCase<K & string>]: DeepSnakeCase<T[K]> }
	: T;

/** converts a single `snake_case` string to `camelCase` at runtime */
export function toCamelCase(s: string): string {
	let result = "", camel = false;

	for (let i = 0; i < s.length; i++) {
		const char = s[i];

		if (char === "_") {
			camel = true;
		} else {
			result += camel ? char.toUpperCase() : char;
			camel = false;
		}
	}
	return result;
}

/** recursively converts all object keys from `snake_case` to `camelCase` */
export function deepCamelCase<T>(value: T): DeepCamelCase<T> {
	if (value === null || value === undefined) {
		return value as DeepCamelCase<T>;
	}

	if (Array.isArray(value)) {
		return value.map(deepCamelCase) as DeepCamelCase<T>;
	}

	if (typeof value === "object") {
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(value)) {
			result[toCamelCase(key)] = deepCamelCase(
				(value as Record<string, unknown>)[key],
			);
		}
		return result as DeepCamelCase<T>;
	}

	return value as DeepCamelCase<T>;
}

/** converts a single `camelCase` string to `snake_ase` at runtime */
export function toSnakeCase(s: string): string {
	let result = "";

	for (let i = 0; i < s.length; i++) {
		const char = s[i];
		const code = char.charCodeAt(0);

		if (code >= 65 && code <= 90) {
			result += "_" + char.toLowerCase();
		} else {
			result += char;
		}
	}

	return result;
}

/** recursively converts all object keys from `camelCase` to `snake_case` */
export function deepSnakeCase<T>(value: T): DeepSnakeCase<T> {
	if (value === null || value === undefined) {
		return value as DeepSnakeCase<T>;
	}

	if (Array.isArray(value)) {
		return value.map(deepSnakeCase) as DeepSnakeCase<T>;
	}

	if (typeof value === "object") {
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(value as object)) {
			result[toSnakeCase(key)] = deepSnakeCase(
				(value as Record<string, unknown>)[key],
			);
		}
		return result as DeepSnakeCase<T>;
	}

	return value as DeepSnakeCase<T>;
}
