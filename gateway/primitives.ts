import { PartialUser, UserProfile } from "@404/flexi/data/primitives.ts";

export type RequiredAction =
	| "REQUIRE_VERIFIED_EMAIL"
	| "REQUIRE_REVERIFIED_EMAIL"
	| "REQUIRE_VERIFIED_PHONE"
	| "REQUIRE_REVERIFIED_PHONE"
	| "REQUIRE_VERIFIED_EMAIL_OR_VERIFIED_PHONE"
	| "REQUIRE_REVERIFIED_EMAIL_OR_VERIFIED_PHONE"
	| "REQUIRE_VERIFIED_EMAIL_OR_REVERIFIED_PHONE"
	| "REQUIRE_REVERIFIED_EMAIL_OR_REVERIFIED_PHONE";

export interface PendingBulkMessageDeletion {
	/** ISO8601 timestamp of when the deletion was scheduled */
	readonly scheduledAt: string;
	/** The number of channels with messages to delete */
	readonly channelCount: number;
	/** The total number of messages to delete */
	readonly messageCount: number;
}

export interface FavoriteMeme {
	/** Unique identifier for the favorite meme */
	readonly id: string;
	/** ID of the user who owns this favorite meme */
	readonly userId: string;
	/** Display name of the meme */
	readonly name: string;
	/** Alternative text description for accessibility */
	readonly altText?: string | null;
	/** Tags for categorizing and searching the meme */
	readonly tags: ReadonlyArray<string>;
	/** ID of the attachment storing the meme */
	readonly attachmentId: string;
	/** Original filename of the meme */
	readonly filename: string;
	/** MIME type of the meme file */
	readonly contentType: string;
	/** Hash of the file content for deduplication */
	readonly contentHash?: string | null;
	/** File size in bytes */
	readonly size: number;
	/** Width of the image or video in pixels */
	readonly width?: number | null;
	/** Height of the image or video in pixels */
	readonly height?: number | null;
	/** Duration of the video in seconds */
	readonly duration?: number | null;
	/** CDN URL to access the meme */
	readonly url: string;
	/** Whether the meme is a video converted from GIF */
	readonly isGifv?: boolean;
	/** Klipy clip slug if the meme was sourced from Klipy */
	readonly klipySlug?: string | null;
	/** Tenor view/<slug>-<id> identifier if the meme was sourced from Tenor */
	readonly tenorSlugId?: string | null;
}

export interface PrivateUser extends PartialUser, UserProfile {
	/** Whether the user has staff permissions */
	readonly isStaff: boolean;
	/** The email address associated with the account */
	readonly email: string | null;
	/** Whether the current email address is marked as bounced by the mail provider */
	readonly emailBounced?: boolean;
	/** Whether multi-factor authentication is enabled */
	readonly mfaEnabled: boolean;
	/** The phone number associated with the account */
	readonly phone: string | null;
	/** The types of authenticators configured for MFA */
	readonly authenticatorTypes: ReadonlyArray<number>;
	/** Whether the email address has been verified */
	readonly verified: boolean;
	/** The type of premium subscription */
	readonly premiumType: number | null;
	/** ISO8601 timestamp of when premium was first activated */
	readonly premiumSince: string | null;
	/** ISO8601 timestamp of when the current premium period ends */
	readonly premiumUntil: string | null;
	/** Whether premium is set to cancel at the end of the billing period */
	readonly premiumWillCancel: boolean;
	/** The billing cycle for the premium subscription */
	readonly premiumBillingCycle: string | null;
	/** The sequence number for lifetime premium subscribers */
	readonly premiumLifetimeSequence: number | null;
	/** Whether the premium badge is hidden on the profile */
	readonly premiumBadgeHidden: boolean;
	/** Whether the premium badge shows a masked appearance */
	readonly premiumBadgeMasked: boolean;
	/** Whether the premium start timestamp is hidden */
	readonly premiumBadgeTimestampHidden: boolean;
	/** Whether the lifetime sequence number is hidden */
	readonly premiumBadgeSequenceHidden: boolean;
	/** Whether premium purchases are disabled for this account */
	readonly premiumPurchaseDisabled: boolean;
	/** Whether premium features are enabled via override */
	readonly premiumEnabledOverride: boolean;
	/** ISO8601 timestamp of the last password change */
	readonly passwordLastChangedAt: string | null;
	/** Actions the user must complete before full access */
	readonly requiredActions: ReadonlyArray<RequiredAction> | null;
	/** Whether the user is allowed to view NSFW content */
	readonly nsfwAllowed: boolean;
	/** Information about a pending bulk message deletion request */
	readonly pendingBulkMessageDeletion: PendingBulkMessageDeletion | null;
	/** Whether the user has dismissed the premium onboarding flow */
	readonly hasDismissedPremiumOnboarding: boolean;
	/** Whether the user has ever made a purchase */
	readonly hasEverPurchased: boolean;
	/** Whether there are unread items in the gift inventory */
	readonly hasUnreadGiftInventory: boolean;
	/** The number of unread gift inventory items */
	readonly unreadGiftInventoryCount: number;
	/** Whether the user has ever used the mobile client */
	readonly usedMobileClient: boolean;
	/** Access control list entries for the user */
	readonly acls: ReadonlyArray<string>;
	/** Special traits assigned to the user account */
	readonly traits: ReadonlyArray<string>;
}
