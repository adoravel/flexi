/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

import { Opcode } from "./opcodes.ts";

export interface GatewayPayload<
	Op extends Opcode = Opcode,
	D = unknown,
	T extends string | null = string | null,
> {
	/** opcode */
	readonly op: Op;
	/** data */
	readonly d: D;
	/** sequence number (only for op 0 `DISPATCH`) */
	readonly s: number | null;
	/** event identifier (only for op 0 `DISPATCH`) */
	readonly t: T;
}

export type StatusType = "online" | "idle" | "dnd" | "invisible";
export type ActivityType = 0 | 1 | 2 | 3 | 5;

export interface Activity {
	readonly name: string;
	readonly type: ActivityType;
	readonly url?: string | null;
}

export interface PresenceData {
	readonly status: StatusType;
	readonly afk: boolean;
	readonly since: number | null;
	readonly activities: readonly Activity[];
}

export interface HelloData {
	/** interval in milliseconds at which the client should send heartbeats */
	readonly heartbeatInterval: number;
}

export interface IdentifyData {
	readonly token: string;
	readonly intents: number;
	readonly properties: {
		readonly os: string;
		readonly browser: string;
		readonly device: string;
	};
	readonly presence?: PresenceData;
	readonly shard?: readonly [number, number];
	readonly compress?: boolean;
	readonly largeThreshold?: number;
}

export interface ResumeData {
	readonly token: string;
	readonly sessionId: string;
	readonly seq: number | null;
}

export interface RequestGuildMembersData {
	readonly guildId: string;
	readonly query?: string;
	readonly limit: number;
	readonly presences?: boolean;
	readonly userIds?: readonly string[];
	readonly nonce?: string;
}

export interface VoiceStateUpdateData {
	readonly guildId: string;
	readonly channelId: string | null;
	readonly selfMute: boolean;
	readonly selfDeaf: boolean;
	readonly selfVideo?: boolean;
	readonly stream?: boolean;
}

export interface LazyRequestData {
	readonly guild_id: string;
	readonly channels?: Record<string, readonly [number, number][]>;
	readonly members?: boolean;
	readonly threads?: boolean;
	readonly activities?: boolean;
}

/** payload for the `GatewayError` opcode (12) */
export interface GatewayErrorData {
	readonly code: number;
	readonly message: string;
}

export type InboundPayload =
	| GatewayPayload<Opcode.Heartbeat, null, null>
	| GatewayPayload<Opcode.Reconnect, null, null>
	| GatewayPayload<Opcode.InvalidSession, boolean, null>
	| GatewayPayload<Opcode.Hello, HelloData, null>
	| GatewayPayload<Opcode.HeartbeatAck, null, null>
	| GatewayPayload<Opcode.GatewayError, GatewayErrorData, null>;

export type OutboundPayload =
	| GatewayPayload<Opcode.Heartbeat, number | null, null>
	| GatewayPayload<Opcode.Identify, IdentifyData, null>
	| GatewayPayload<Opcode.PresenceUpdate, PresenceData, null>
	| GatewayPayload<Opcode.VoiceStateUpdate, VoiceStateUpdateData, null>
	| GatewayPayload<Opcode.Resume, ResumeData, null>
	| GatewayPayload<Opcode.RequestGuildMembers, RequestGuildMembersData, null>
	| GatewayPayload<Opcode.LazyRequest, LazyRequestData, null>;

/** narrows `InboundPayload` to the specific shape for a given `Opcode` */
export type NarrowPayload<Op extends Opcode> = Extract<InboundPayload, { op: Op }>;
