// bitflag constants and utilities for all fluxer flag types

export type Flags = Record<string, number>;

export type Flag<F extends Flags> = F[keyof F];

/**
 * returns `true` if `value` has the given `flag` bit set
 *
 * @example
 * ```ts
 * hasFlag(user.public_flags, PublicUserFlags.STAFF) // either `true` or `false``
 * ```
 */
export function hasFlag<F extends Flags>(
	value: number,
	flag: Flag<F>,
): boolean {
	return (value & flag) === flag;
}

/**
 * returns `true` if `value` contains **any** of the given flags set
 */
export function hasSomeFlag<F extends Flags>(
	value: number,
	...flags: Flag<F>[]
): boolean {
	return flags.some((f) => (value & f) !== 0);
}

/**
 * returns `true` if `value` contains **all** of the given flags set
 */
export function hasEveryFlag<F extends Flags>(
	value: number,
	...flags: Flag<F>[]
): boolean {
	return flags.every((f) => (value & f) === f);
}

/**
 * returns an array of known flag names that are set in `value`
 *
 * @example
 * ```ts
 * describeFlags(6, PublicUserFlags) // ["CTP_MEMBER", "PARTNER"]
 * ```
 */
export function describeFlags<F extends Flags>(
	value: number,
	flags: F,
): (keyof F)[] {
	return Object.entries(flags)
		.filter(([, bit]) => (value & bit) === bit)
		.map(([name]) => name);
}

/**
 * combines multiple flag values into a bitset
 */
export function combineFlags<F extends Flags>(...flags: Flag<F>[]): number {
	return flags.reduce((acc, f) => acc | f, 0);
}

/**
 * removes a flag from a bitset
 */
export function removeFlag(value: number, flag: number): number {
	return value & ~flag;
}

/** The public flags on the user account */
export const enum PublicUserFlags {
	/** User is a staff member */
	Staff = 1 << 0,
	/** User is a community test program member */
	CommunityTestProgramMember = 1 << 1,
	/** User is a partner */
	Partner = 1 << 2,
	/** User is a bug hunter */
	BugHunter = 1 << 3,
	/** Bot accepts friend requests from users */
	FriendlyBot = 1 << 4,
	/** Bot requires manual approval for friend requests */
	FriendlyBotManualApproval = 1 << 5,
}

export type PublicUserFlagName = keyof typeof PublicUserFlags;
export type PublicUserFlag = (typeof PublicUserFlags)[PublicUserFlagName];

/** Member profile flags */
export const enum GuildMemberProfileFlags {
	/** Guild member avatar is unset */
	AvatarUnset = 1,
	/** Guild member banner is unset */
	BannerUnset = 2,
}
