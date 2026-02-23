/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

import { GuildMemberProfileFlags, GuildSplashCardAlignment, PublicUserFlags } from "./flags.ts";
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

export interface UserProfile {
	/** The user biography text */
	readonly bio?: string | null;
	/** The hash of the user profile banner image */
	readonly banner?: string | null;
	/** The default banner color if no custom banner is set */
	readonly bannerColor?: number | null;
	/** The preferred pronouns of the user */
	readonly pronouns?: string | null;
	/** The user-selected accent color as an integer */
	readonly accentColor?: number | null;
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

export interface Guild {
	/** The unique identifier (snowflake) for this guild */
	readonly id: string;
	/** The name of the guild */
	readonly name: string;
	/** The hash of the guild icon */
	readonly icon: string | null;
	/** The hash of the guild banner */
	readonly banner?: string | null;
	/** The width of the guild banner in pixels */
	readonly bannerWidth?: number | null;
	/** The height of the guild banner in pixels */
	readonly bannerHeight?: number | null;
	/** The hash of the guild splash screen */
	readonly splash?: string | null;
	/** The width of the guild splash in pixels */
	readonly splashWidth?: number | null;
	/** The height of the guild splash in pixels */
	readonly splashHeight?: number | null;
	/** The alignment of the splash card */
	readonly splashCardAlignment?: GuildSplashCardAlignment;
	/** The hash of the embedded invite splash */
	readonly embedSplash?: string | null;
	/** The width of the embedded invite splash in pixels */
	readonly embedSplashWidth?: number | null;
	/** The height of the embedded invite splash in pixels */
	readonly embedSplashHeight?: number | null;
	/** The vanity URL code for the guild */
	readonly vanityUrlCode: string | null;
	/** The ID of the guild owner */
	readonly ownerId: string;
	/** The ID of the channel where system messages are sent */
	readonly systemChannelId: string | null;
	/** System channel behavior flags */
	readonly systemChannelFlags?: number;
	/** The ID of the rules channel */
	readonly rulesChannelId?: string | null;
	/** The ID of the AFK voice channel */
	readonly afkChannelId?: string | null;
	/** AFK timeout in seconds before moving users to the AFK channel */
	readonly afkTimeout?: number;
	/** Array of guild feature flags */
	readonly features: ReadonlyArray<string>;
	/** Required verification level for members to participate */
	readonly verificationLevel?: number;
	/** Required MFA level for moderation actions */
	readonly mfaLevel?: number;
	/** The NSFW level of the guild */
	readonly nsfwLevel?: number;
	/** Level of content filtering for explicit media */
	readonly explicitContentFilter?: number;
	/** Default notification level for new members */
	readonly defaultMessageNotifications?: number;
	/** Disabled guild operations bitfield */
	readonly disabledOperations?: number;
	/**
	 * ISO8601 timestamp controlling how far back members without
	 * Read Message History can access messages.
	 * When null, no historical access is allowed.
	 */
	readonly messageHistoryCutoff?: string | null;
	/** ISO8601 timestamp of when the current user joined the guild */
	readonly joinedAt?: string;
	/** Whether the guild is unavailable (e.g. due to outage) */
	readonly unavailable?: boolean;
	/** Approximate number of members in the guild */
	readonly memberCount?: number;
}

export interface GuildRole {
	/** The unique identifier (snowflake) for this role */
	readonly id: string;
	/** The name of the role */
	readonly name: string;
	/** The colour of the role as an integer */
	readonly color: number;
	/** The position of the role in the role hierarchy */
	readonly position: number;
	/** The position of the role in the hoisted member list */
	readonly hoistPosition?: number | null;
	/** The permissions bitfield for the role */
	readonly permissions: string;
	/** Whether this role is displayed separately in the member list */
	readonly hoist: boolean;
	/** Whether this role can be mentioned by anyone */
	readonly mentionable: boolean;
	/** The unicode emoji for this role */
	readonly unicodeEmoji?: string | null;
}

export interface ChannelPermissionOverwrite {
	/** The unique identifier for the role or user this overwrite applies to */
	readonly id: string;
	/**
	 * The type of entity the overwrite applies to.
	 * 0 = role, 1 = member
	 */
	readonly type: 0 | 1;
	/** The bitwise value of allowed permissions */
	readonly allow: string;
	/** The bitwise value of denied permissions */
	readonly deny: string;
}

export interface Channel {
	/** The unique identifier (snowflake) for this channel */
	readonly id: string;
	/** The ID of the guild this channel belongs to */
	readonly guildId?: string;
	/** The name of the channel */
	readonly name?: string;
	/** The topic of the channel */
	readonly topic?: string | null;
	/** The URL associated with the channel */
	readonly url?: string | null;
	/** The icon hash of the channel (for group DMs) */
	readonly icon?: string | null;
	/** The ID of the owner of the channel (for group DMs) */
	readonly ownerId?: string | null;
	/** The type of the channel */
	readonly type: number;
	/** The position of the channel in the guild channel list */
	readonly position?: number;
	/** The ID of the parent category for this channel */
	readonly parentId?: string | null;
	/** The bitrate of the voice channel in bits per second */
	readonly bitrate?: number | null;
	/** The maximum number of users allowed in the voice channel */
	readonly userLimit?: number | null;
	/** The voice region ID for the voice channel */
	readonly rtcRegion?: string | null;
	/** The ID of the last message sent in this channel */
	readonly lastMessageId?: string | null;
	/** The ISO 8601 timestamp of when the last pinned message was pinned */
	readonly lastPinTimestamp?: string | null;
	/** The permission overwrites for this channel */
	readonly permissionOverwrites: Map<Snowflake, ChannelPermissionOverwrite>;
	/** The recipients of the DM channel */
	readonly recipients?: ReadonlyArray<PartialUser>;
	/** Whether the channel is marked as NSFW */
	readonly nsfw?: boolean;
	/** Slowmode rate limit per user in seconds */
	readonly rateLimitPerUser?: number;
	/** Custom nicknames for users in this channel (for group DMs) */
	readonly nicks?: Readonly<Record<string, string>>;
}
