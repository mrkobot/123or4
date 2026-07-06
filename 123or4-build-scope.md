# 123or4 — Build Scope

A bilingual community classifieds and reviews hub for Chinese Americans, starting in Phoenix and built to replicate city by city. This document is written to be built from, by a developer or by Claude Code. A crew-facing version framed around market and return can be derived from the Overview and Phasing sections.

## 1. What it is

Two pillars, one mechanic.

- **Classifieds** are the hook. Individuals post far more than businesses do, listings are cheap and high-volume, and they drive the daily habit that brings people back.
- **Best Eats** is the promise. A named local food editor reviews restaurants, the community weighs in, and people who came for the classifieds stay for the reviews.
- **The 1 to 4 rating is the mechanic and the name.** The site asks one question about everything, a listing or a restaurant alike: 1, 2, 3, or 4. The name and the rating are the same thing.

Audience is bilingual, English and Traditional Chinese. First city is Phoenix, seeded from the existing newspaper's roughly thirty restaurants and its advertiser base. The architecture assumes more cities will follow.

## 2. Product rules, non-negotiable

These are the decisions that protect the trust the whole thing runs on. They belong in code, not just in spirit.

- **Two ratings never merge.** The editor's rating and the community rating are stored and shown as separate numbers. The editor's is set by staff. The community's moves only with user votes.
- **The review is never for sale.** A business can request and pay to be listed and verified. It can never buy a review or a rating. Listing is a service. The review is editorial.
- **Removed content is archived, never hard-deleted.** Every removal carries a reason and is reversible, for audit and safety.
- **Trust is ported to a system, not a person.** Verification badges, a community rating, and community flagging carry trust at a scale and across cities that no single editor can reach personally.
- **Low technical upkeep is a hard constraint.** Posting, payment, and expiry are self-serve and automatic. Non-technical staff maintain content through the staff portal and never touch code. Human effort is episodic, verifying a business, handling an escalation, not a daily moderation queue.

## 3. The 1 to 4 rating

A four-point scale with a word under each number, so a tap carries meaning without needing the scale explained. Words are bilingual and appear everywhere a rating appears.

| Score | English | Chinese | Sense |
|---|---|---|---|
| 1 | Meh | 普普 | so-so, nothing special, gentle |
| 2 | Average | 還行 | it's alright, does the job |
| 3 | Good | 不錯 | pretty good, everyday warm praise |
| 4 | Excellent | 一流 | first-rate, top tier |

The Chinese set is pending final confirmation, sincere as above or younger swaps, 麻麻 for Meh and 神級 for Excellent. Every rateable item, listing or restaurant, uses the same scale. Reviews additionally carry the editor's own 1 to 4 rating, shown apart from the community aggregate.

## 4. Bilingual model, three layers

- **Identity layer**, shown in both scripts together: wordmark, section labels, category names, restaurant names, editor names. This is the belonging cue, drawn from the 2007 masthead.
- **Function layer**, one language per user via a persistent toggle: navigation, buttons, forms, chrome.
- **Content layer**, posted language plus automatic AI translation: every listing is translated into the other language the moment it posts, and both versions are stored, so the whole community sees the whole inventory and search finds everything in either script. Machine translations are labeled. Editorial reviews get a human-edited translation rather than raw machine output, to preserve the voice.

## 5. User-facing portal, v1

- Browse classifieds by category: Hiring, Rentals, Homes, Cars, Services, plus Best Eats.
- Post a classified, fully self-serve: category, details, photos, pay, auto-post, auto-expire.
- Rate anything 1 to 4 in one tap. See each item's community rating inline.
- Restaurant and review pages: editor rating and community rating shown separately, the review text, comments and discussion.
- Editor and contributor profiles, followable, a named local food friend rather than an anonymous desk.
- Request to be listed and reviewed, a form that lands in the staff queue.
- Search across both scripts. Filter and sort so key details show at a glance.
- Language toggle, persistent. Flag a listing or review.
- Lightweight accounts, required to vote, comment, or post.

## 6. Staff-facing portal, v1

The login home is a work queue, not a blank admin panel: pending client requests, flagged content, listings nearing expiry. Guided actions:

- **Add restaurant and review**, one flow: restaurant details, verified toggle, official review, editor's 1 to 4 rating, publish.
- **Add classified**, for staff posting on behalf of the print migration.
- **Edit** any listing or review.
- **Remove**, with a required reason, archived not destroyed.
- **Verify**, applying the badge, defaulted on for print imports.
- **Client requests** queue, approve into a pre-filled Add task or decline with a templated reason.
- **Contact client**, logging a call or sending a templated message against the client record.
- **Batch upload**, CSV import for the initial roughly thirty restaurants and listings, verified badge applied on import.
- **Moderate**, the flagged-content queue, remove or dismiss.
- **Manage editor profiles**, name, photo, city, bio.

## 7. System and AI

- Automated payment, auto-posting, auto-expiry for classifieds.
- AI translation on submit: generate the other-language version, store both, label machine output, route editorial reviews to a human-edit step.
- Verification badge system.
- Rating engine: editor rating fixed by staff, community rating as an aggregate of user 1 to 4 votes, stored and displayed separately.
- Roles and permissions: public, staff, admin.
- Search indexing both scripts.
- Per-city scoping on every record from day one.
- Reputation scoring is phase two, not v1.

## 8. Data model, key entities

- **cities**: name, slug, active.
- **users**: auth, language_preference, role, reputation (phase two).
- **listings**: city, category, title and body in both languages, translation_source and machine_translated flag, price, photos, verified, community_rating aggregate, vote_count, status, expires_at, payment_status.
- **restaurants**: city, name in both scripts, cuisine, address, hours, verified.
- **reviews**: restaurant, editor, body in both languages with human-edited translation, editor_rating (1 to 4), community_rating aggregate.
- **ratings**: user, item type and id, value (1 to 4), created_at.
- **editors**: profile, city, followable.
- **client_requests**: business, contact, requested action, status.
- **flags**: item, reporter, reason, status.

Every rateable item carries both-language fields and a community rating. Bilingual and rating fields are cheaper to build in now than to retrofit after the first import.

## 9. Stack and hosting

- **Next.js** on **Vercel** for the app, one codebase, no iframes.
- **Supabase** for Postgres, auth, storage, and role-based access.
- **Stripe** for self-serve payments.
- **AI translation** via a model API called on insert.
- **Domain** 123or4.com stays registered at Namecheap, DNS pointed to Vercel. Not WordPress.

## 10. Design and brand

- Register: The Nudge's cheerful warmth and named-friend model, with Airbnb's belonging, coral standing in for yellow.
- Coral lead, #ff5a4d, on a warm ground so cards lift. Large, bold, friendly type, Manrope with Noto Sans TC for Chinese.
- Eyebrow, English: Classifieds and Best Eats for Chinese Americans in Phoenix.
- Eyebrow, Chinese: 鳳凰城美國華人分類廣告與美食。
- Headline: The community's classifieds, and the best eats in town. 社區的分類廣告，與城裡最棒的美食。
- Two-score Best Eats, named editor as a followable local food friend, bilingual identity throughout, cards that show a rating at a glance.

## 11. Phasing

- **v1**: one city, Phoenix. Classifieds, Best Eats, the 1 to 4 rating everywhere, bilingual auto-translation, self-serve posting and payment, the staff portal, seeded with the existing thirty restaurants and the advertiser listings.
- **Future**: full reputation layer, multi-city replication tooling, premium business tiers, more rated categories, deals or group-buys that seed activity, native mobile.

## 12. Out of scope for v1

- No heavy human moderation. Verification-gate the money-moving categories, let low-stakes ones run open, lean on community flagging.
- No on-platform transactions or escrow. Buyers and sellers connect and transact off-platform in v1.
- No native mobile apps yet. The web app is responsive.

## 13. Locked defaults

These were open and are now set, each easy to change later in one place.

- Name: 123or4 is both the product name and the rating mechanic. The site asks one question about everything—1, 2, 3, or 4.
- Chinese rating words: the sincere set—普普 Meh, 還行 Average, 不錯 Good, 一流 Excellent. Stored as a single lookup so all four can be swapped globally in one edit.
- Community rating display: the word alone in feeds and cards, which reads warmer than a decimal. The exact average appears only on an item's own page, next to the vote count.

## 14. Build sequence and environment

Build against free tiers, point the domain last. The agent scaffolds and writes the code; the accounts, the keys, and the DNS stay in your hands by design.

- Accounts you create, and keys you paste into the environment: Vercel, Supabase, Stripe, and an Anthropic API key for the translation. The agent never handles these—it reads them from environment variables you set.
- Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ANTHROPIC_API_KEY.
- Deploy: connect the GitHub repo to Vercel once, after which every push deploys itself. The Supabase schema is created and migrated from the command line.
- Domain, done last and once: add 123or4.com inside Vercel, copy the two or three DNS records it shows, paste them into Namecheap. Five minutes, manual, kept in your control.

## 15. Build guidance for the agent

- Build the v1 scope only. Everything under Future stays unbuilt until asked for.
- Self-serve and low-upkeep are hard requirements. No staff action should be needed for a normal paid post to go live and later expire.
- Two ratings never merge, the review is never for sale, removed content is archived rather than deleted. Enforce these in the schema and the access rules, not only in the interface.
- Bilingual fields and a community rating exist on every rateable item from the first migration.
- Every record is scoped to a city from day one.
- Mobile-responsive, keyboard-accessible, and legible in both scripts.
