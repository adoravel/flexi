/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type IsNumeric<S extends string> = S extends `${infer H}${infer T}` ? H extends Digit ? IsNumeric<T>
	: false
	: true;

type LengthOfString<
	S extends string,
	Acc extends unknown[] = [],
> = S extends `${infer _}${infer Rest}` ? LengthOfString<Rest, [...Acc, unknown]>
	: Acc["length"];

type CompareLength<A extends number, B extends number, T extends unknown[] = []> = T["length"] extends A ? true
	: T["length"] extends B ? false
	: CompareLength<A, B, [unknown, ...T]>;

type IsValidLength<S extends string> = LengthOfString<S> extends infer L ? L extends number ? L extends 0 ? false
		: CompareLength<L, 20> // snowflakes kinda have a maximum length of 20
	: false
	: false;

type NoLeadingZero<S extends string> = S extends "0" | `${Exclude<Digit, "0">}${string}` ? true : false;

type IsSnowflakeLiteral<S extends string> = IsNumeric<S> extends true ? IsValidLength<S> extends true ? NoLeadingZero<S>
	: false
	: false;

declare const __snowflake: unique symbol;

/**
 * twitter's format for uniquely identifiable descriptors (IDs), guaranteed to be unique across all of the application
 *
 * @see {@link https://github.com/twitter-archive/snowflake/tree/snowflake-2010}
 */
export type Snowflake<T extends string = string> = string extends T ? string & { readonly [__snowflake]: void }
	: IsSnowflakeLiteral<T> extends true ? T & { readonly [__snowflake]: void }
	: never;

export function assertSnowflake(value: string): asserts value is Snowflake {
	const n = BigInt(value);
	if (n < 0n || n > 0xFFFFFFFFFFFFFFFFn) throw new Error();
	const timestamp = (n >> 22n) + 1420070400000n;
	if (timestamp < 1420070400000n) throw new Error();
}
