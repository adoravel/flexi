/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Gateway opcodes indicate the type of payload being sent or received.
 *
 * Clients send and receive different opcodes depending on their role in the connection lifecycle.
 *
 * @see {@link https://github.com/fluxerapp/fluxer/blob/refactor/fluxer_docs/gateway/opcodes.mdx|
 fluxerapp/fluxer:fluxer_docs/gateway/opcodes.mdx}
 */
export const enum Opcode {
	/** Dispatches an event to the client */
	Dispatch = 0,
	/** Fired periodically to keep the connection alive */
	Heartbeat = 1,
	/** Starts a new session during the initial handshake */
	Identify = 2,
	/** Updates the client presence */
	PresenceUpdate = 3,
	/** Joins, moves, or disconnects from a voice channel */
	VoiceStateUpdate = 4,
	/** Pings the voice server */
	VoiceServerPing = 5,
	/** Resumes a previous session after a disconnect */
	Resume = 6,
	/** Indicates the client should reconnect to the gateway */
	Reconnect = 7,
	/** Requests members for a guild */
	RequestGuildMembers = 8,
	/** Session has been invalidated; client should reconnect and identify */
	InvalidSession = 9,
	/** Sent immediately after connecting; contains heartbeat interval */
	Hello = 10,
	/** Acknowledgement of a heartbeat */
	HeartbeatAck = 11,
	/** Indicates an error occurred while processing a gateway message */
	GatewayError = 12,
	/** Requests lazy-loaded guild data */
	LazyRequest = 14,
}

/**
 * When the gateway closes a connection, it sends a close code indicating why.
 *
 * Some close codes are recoverable (the client should reconnect), while others are not.
 *
 * @see {@link https://github.com/fluxerapp/fluxer/blob/refactor/fluxer_docs/gateway/close_codes.mdx|
 fluxerapp/fluxer:fluxer_docs/gateway/close_codes.mdx}
 */
export const enum CloseCode {
	/** Unknown error occurred */
	UnknownError = 4000,
	/** Sent an invalid gateway opcode */
	UnknownOpcode = 4001,
	/** Sent an invalid payload */
	DecodeError = 4002,
	/** Sent a payload before identifying */
	NotAuthenticated = 4003,
	/** Account token is invalid */
	AuthenticationFailed = 4004,
	/** Sent more than one identify payload */
	AlreadyAuthenticated = 4005,
	/** Sent an invalid sequence when resuming */
	InvalidSeq = 4007,
	/** Sending payloads too quickly */
	RateLimited = 4008,
	/** Session timed out; reconnect and start a new one */
	SessionTimedOut = 4009,
	/** Sent an invalid shard when identifying */
	InvalidShard = 4010,
	/** Session would have handled too many guilds; sharding is required */
	ShardingRequired = 4011,
	/** Sent an invalid gateway version */
	InvalidApiVersion = 4012,
}

type TerminationCode =
	| CloseCode.AuthenticationFailed
	| CloseCode.InvalidShard
	| CloseCode.ShardingRequired
	| CloseCode.InvalidApiVersion;

export function isTerminationCode(closeCode: CloseCode): closeCode is TerminationCode {
	return closeCode == CloseCode.AuthenticationFailed || closeCode >= CloseCode.InvalidShard;
}
