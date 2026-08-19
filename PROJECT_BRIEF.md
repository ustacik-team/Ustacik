```md
# ustacik.com Project Brief

**Owner:** Ata Bilişim Teknolojileri  
**Product:** ustacik.com — The Trusted Craftsman Platform for Northern Cyprus

**Project Format**

- Duration: 2 weeks
- Participants: 30 interns
- Structure: 3 competing groups

---

# 1. What We Are Building

**ustacik.com** connects people in Northern Cyprus who need a job done with trusted craftsmen who can do it.

Today, finding a craftsman usually means:

- Asking neighbours
- Posting in Facebook groups
- Hoping someone is reliable

There is no reliable way to determine:

- Whether someone can be trusted
- Whether the quoted price is fair
- Who is accountable if work goes wrong

This project is **not** about building another search engine.

It is about building **a trust layer**.

Every product decision should answer one question:

> **Does this make it easier for a stranger to trust a craftsman they have never met?**

A website can be built in a few days.

Building **supply** (craftsmen) and **trust** takes the entire two weeks.

The biggest bottleneck is **collecting verified craftsmen**, not writing code.

---

# 2. Business Model

## Current

The platform is completely free.

- Free for customers
- Free for craftsmen

The goal is to build supply and trust before monetization.

---

## Future

Craftsmen will pay a **monthly subscription**.

Customers will always remain free.

There will be **no commission model** because most work in Northern Cyprus is paid in cash, making commissions impractical.

---

## Product Implications

Even though subscriptions are not yet active, the platform must already track:

- Completed jobs
- Jobs received through the platform
- Value generated for each craftsman

When subscriptions launch, the value proposition becomes:

> "We sent you 63 jobs."

rather than

> "Please pay us."

The data model should already include subscription-related fields, initialized as **Free**.

---

# 3. Service Categories

The following eight categories are fixed across all groups.

| #   | English                        | Turkish                       |
| --- | ------------------------------ | ----------------------------- |
| 1   | Plumbing & Water Systems       | Su Tesisatı                   |
| 2   | Electrical                     | Elektrik                      |
| 3   | HVAC & Refrigeration           | Klima & Soğutma               |
| 4   | Appliance & Electronics Repair | Beyaz Eşya & Elektronik Tamir |
| 5   | Painting & Plastering          | Boya & Alçı                   |
| 6   | Carpentry & Furniture          | Marangoz & Mobilya            |
| 7   | Aluminium, PVC & Glass         | Alüminyum, PVC & Cam          |
| 8   | Garden & Pool Maintenance      | Bahçe & Havuz Bakımı          |

## Sub-services

Sub-services are **not predefined**.

Each group should define them collaboratively so that all collected datasets remain compatible.

---

# 4. Trust Model

The trust system is the core differentiator of the platform.

There are three verification levels.

| Level              | Requirements                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| Registered         | Phone verified, category selected, region selected                           |
| Verified           | ID verified, two previous customers contacted, previous work photos provided |
| Approved Craftsman | Verified status plus business registration and written workmanship guarantee |

---

## Manual Verification

Verification is entirely manual.

Although manual verification does not scale easily, it provides a competitive advantage because:

- Anyone can build a directory.
- Very few companies manually verify identities.

Every verification must record:

- What was checked
- Who performed the verification
- When it was completed

This creates an audit trail if verification is ever questioned.

---

# 5. Reviews

Reviews are only allowed from customers whose jobs originated through the platform.

There are:

- No anonymous reviews
- No public review forms

This significantly reduces fake reviews.

---

## Review Categories

Each review contains four scores (1–5):

- Punctuality
- Workmanship
- Price Honesty
- Communication

Price Honesty is intentionally separate because pricing disputes are expected to be the most common issue.

Reviews may also include:

- Optional written comments
- Photos

---

## Review Rules

- Average ratings are hidden until at least **three reviews** exist.
- Negative reviews are never hidden.
- Craftsmen may post **one public reply**.
- Craftsmen cannot delete reviews.
- Reviews are removed only for:
  - Abuse
  - Fake reviews with no real job

Reviews are **never** removed simply because they are negative.

---

# 6. Project Scope

## Build

- Craftsman directory
- Category browsing
- Region browsing
- Craftsman profiles
- Work photo galleries
- Price ranges
- Customer job requests
- Craftsman notifications
- Review system
- Craftsman dashboard
- Admin dashboard
- Turkish & English localization
- SEO landing pages for every Category × Region combination

---

## Do Not Build

- In-app payments
- Mobile applications
- Live chat
- Booking calendars
- Bidding systems
- Subscription billing
- WhatsApp Business API

---

## Mobile First

The majority of users will access the platform from mobile devices.

Notifications should use:

- SMS
- `wa.me` links

Avoid integrations that could delay product delivery.

---

# 7. Competition Structure

There are:

- 3 independent teams
- 10 interns per team

Each team designs and builds:

- Architecture
- Infrastructure
- UI/UX
- Branding
- Matching logic
- Database
- Backend
- Frontend

No architecture is provided.

---

## Craftsman Collection

Each team collects its own craftsmen using separate phone numbers.

---

## Required Cross-Team Agreements

To prevent duplicate calls and inconsistent datasets, all teams must agree on:

### Shared Craftsman Template

Every craftsman should contain the same fields in the same format.

---

### Phone Number Standardization

Phone numbers are the unique identifier.

All groups must normalize them identically.

---

### Territory Allocation

Teams must coordinate who contacts which craftsmen.

Duplicate calls count against the team.

---

### Shared Sub-Service List

Sub-services must be standardized across all teams.

---

# 8. Judging Criteria

Final presentations take place at the end of Week 2.

Evaluation is weighted approximately as follows:

- End-to-end working product (highest priority)
- Number and quality of collected craftsmen
- Mobile performance and usability
- Craftsman dashboard usability (tested with a real craftsman over 50 years old)
- Trust system implementation
- Review system implementation
- SEO groundwork
- Quality of technical decisions and ability to justify them

---

# 9. Project Timeline

## Week 1

- Cross-group agreement
- Shared template finalized
- Territory assignment
- Field visits begin immediately
- Craftsman registration begins
- Basic working product online by Friday

Every team should have a functioning product by the end of Week 1.

---

## Week 2

Focus shifts toward:

- Scaling craftsmen numbers
- Verification
- Reviews
- Craftsman dashboard
- SEO pages
- Polish and improvements

Final presentations take place on Friday.

> **Ship something ugly that works before something beautiful that doesn't.**

---

# 10. Non-Negotiables

Before publishing any profile:

- Explain exactly what information will be public:
  - Name
  - Phone number
  - Work photos
- Obtain verbal approval.

The platform matches customers and craftsmen.

It **does not guarantee workmanship**.

This must be clearly stated in the Terms of Service.

Every intern must introduce themselves as representing:

**Ata Bilişim Teknolojileri**

---

# 11. Working Principles

## Talk to Craftsmen Before Building for Craftsmen

Every engineer must participate in at least one field visit.

A dashboard designed without speaking to real craftsmen is unlikely to pass live usability testing.

---

## Always Ask the Trust Question

Whenever priorities are unclear, ask:

> **Does this feature make it easier to trust a stranger?**

If the answer is **no**, it is not a priority.

---

# Project Summary

**Project:** ustacik.com

**Owner:** Ata Bilişim Teknolojileri

**Mission:** Build the most trusted platform connecting customers with verified craftsmen throughout Northern Cyprus by prioritizing trust, manual verification, transparency, and real-world usability.
```

ustacik.com
Project Brief · Ata Bilişim Teknolojileri · 2 weeks · 30 interns · 3 competing groups
Owner: Ata Bilişim Teknolojileri Product: ustacik.com — the trusted craftsman platform for Northern Cyprus Format: 2 weeks ·
30 interns · 3 competing groups

1. What we are building
   ustacik.com connects people in Northern Cyprus who need a job done with craftsmen who can do it.
   Today, finding a craftsman here means asking a neighbour or posting in a Facebook group. There is no way to know who is reliable,
   no idea what a fair price is, and no accountability when the work goes wrong.
   We are not building a search engine. We are building a trust layer. Test every decision against one question: does this
   make it easier for a stranger to trust a craftsman they have never met?
   One thing to understand before you start: this is not mainly a coding problem. A website can be built in a few days. Craftsmen take
   the whole two weeks. Supply is the bottleneck.
2. Business model
   Now: completely free. Free for craftsmen, free for customers. This is a real commercial product going live, but we are buying
   supply and trust with free access.
   Later: monthly subscription for craftsmen. Once the platform is strong, craftsmen pay a monthly fee. Customers stay free. No
   commission — in TRNC almost everything settles in cash, so commission is uncollectable.
   What this means for your build: even though nothing is charged now, track completed jobs and show each craftsman how much
   work the platform has sent them. On the day we introduce pricing, the argument is "we sent you 63 jobs," not "please pay us."
   Leave room in your data structure for subscription fields, set to free.
3. The eight categories
   Locked. Same eight for all three groups.

#

English
1
Plumbing & Water Systems
Turkish
Su Tesisatı
2
Electrical
Elektrik
3
HVAC & Refrigeration
Klima & Soğutma
4
Appliance & Electronics Repair
Beyaz Eşya & Elektronik Tamir
5
Painting & Plastering
Boya & Alçı
6
Carpentry & Furniture
Marangoz & Mobilya
7
Aluminium, PVC & Glass
Alüminyum, PVC & Cam
8
Garden & Pool Maintenance
Bahçe & Havuz Bakımı
Sub-services under each category are yours to define — but agree them across the three groups so the data merges. 4. Trust model
The core of the product and the only real difference between us and a Facebook group. Three levels, shared by all groups:
Level
Registered
Requirements
Phone verified · category · region
Verified
ID seen · two previous customers called · photos of past work
Approved Craftsman
Verified, plus business registration and a written workmanship guarantee
Verification is manual. It does not scale, and it does not need to. Anyone can build a directory; almost nobody will sit in a workshop
checking an ID. That manual work is the moat.
Record every verification: what was checked, by whom, when. If a badge is ever disputed, we must be able to show our work. 5. Reviews
A review can only come from a customer whose job went through the platform. No open review form, no anonymous
reviews. This one rule removes almost all fake review risk.
Four sub-scores, each 1–5: punctuality · workmanship · price honesty · communication. Price honesty is separate on
purpose — nearly every dispute in this market will be about price. Plus an optional comment and photos.
Rules: - No average shown until a craftsman has at least three reviews. - Negative reviews are never hidden. Hiding them is what
destroys trust in a review system. - The craftsman gets one public reply per review, and cannot delete reviews. - Removal only for
abuse or a review with no real job behind it — never for a low score. 6. Scope
Build: directory by category and region · craftsman profiles with work photos · price ranges · customer job request · notification to
the craftsman · reviews · craftsman panel · admin panel · Turkish and English · SEO landing pages for category × region.
Do not build: in-app payments · mobile apps · live chat · booking calendar · bidding engine · subscription billing screens ·
WhatsApp Business API.
Mobile first — most traffic will be from phones. Use
wa.me links and SMS for notification, not the WhatsApp API. Do not take on an
integration that can block the whole product. 7. How the competition works
Three groups of ten. Each group builds its own design and its own infrastructure, end to end. Technical decisions,
architecture, stack, UX, matching logic, branding within the name — all yours. Nobody hands you an architecture.
Each group also collects its own craftsmen, calling from its own phone lines.
The one thing you must coordinate
Three groups working in parallel will otherwise call the same craftsman three times. That burns the brand on first contact and
produces data that cannot be merged.
Before Day 1 ends, the three groups meet and agree between themselves:
A shared craftsman template — the fields everyone collects, in the same format, so three datasets become one at the end.
Phone number normalised the same way by everyone; it is the key that identifies a craftsman.
A way to see who has already contacted whom, and how territory is split.
The shared sub-service list.
We are not dictating how. Agree it, write it down, and hold each other to it. Duplicate calls to the same craftsman count against
you.
Judging — end of Week 2
Each group presents its live platform and its craftsman data. Weighted roughly:
Does it work, end to end, with a real job request — heaviest
Number and quality of craftsmen collected
Mobile experience and speed
Craftsman panel usable, unaided, by a craftsman over 50 — tested live with a real craftsman
Trust and review system implemented properly
SEO groundwork
Quality of decisions and how they are defended 8. Two weeks
Week 1 — Cross-group agreement on the shared template and territory on Day 1. Then: field work starts immediately, craftsmen
registered, product skeleton live by end of week. Every group has something working by Friday, however rough.
Week 2 — Craftsman numbers scale up, verification, reviews, craftsman panel, SEO pages, polish. Final presentation Friday.
Ship something ugly that works before something beautiful that does not. 9. Non-negotiables
Tell every craftsman what will be published — their name, phone number and work photos — and get their verbal approval
before the profile goes live.
ustacik.com matches, it does not guarantee the work. Say this clearly in the terms of service.
Every intern introduces themselves as representing Ata Bilişim. 10. Two working principles
Talk to craftsmen before you build for craftsmen. Every engineer joins at least one field visit. A craftsman panel designed by
someone who has never met a craftsman will fail the live test, and that test is worth a lot of points.
When in doubt, ask the trust question. If a feature does not make it easier to trust a stranger, it is not a priority.
ustacik.com | Ata Bilişim Teknolojileri | Project Brief
