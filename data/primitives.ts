/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

import { GuildMemberProfileFlags, PublicUserFlags } from "./flags.ts";
import { Snowflake } from "./snowflake.ts";

export interface PartialUser {
	/** The unique identifier (snowflake) for this user */
	readonly id: Snowflake;
	/** The username of the user, not unique across the platform */
	readonly username: string;
	/** The four-digit discriminator tag of the user */
	readonly discriminator: string;
	/** The display name of the user, if set */
	readonly globalName: string;
	/** The hash of the user avatar image */
	readonly avatar?: string;
	/** The dominant avatar color of the user as an integer */
	readonly avatarColor?: number;
	/** Whether the user is a bot account */
	readonly bot?: boolean;
	/** Whether the user is an official system user */
	readonly system?: boolean;
	readonly flags: PublicUserFlags;
}

export interface Member {
	readonly user: PartialUser;
	/** The nickname of the member in this guild */
	readonly nick?: string;
	/** The hash of the member guild-specific avatar */
	readonly avatar?: string;
	/** The hash of the member guild-specific banner */
	readonly banner?: string;
	/** The accent colour of the member guild profile as an integer */
	readonly accentColor?: string;
	/** Array of role IDs the member has */
	readonly roles: Snowflake[];
	/** ISO8601 timestamp of when the user joined the guild */
	readonly joinedAt: Date;
	/** Whether the member is muted in voice channel */
	readonly mute: boolean;
	/** Whether the member is deafened in voice channels */
	readonly deaf: boolean;
	/** ISO8601 timestamp until which the member is timed out */
	readonly communicationDisabledUntil?: Date;
	readonly flags: GuildMemberProfileFlags;
}
