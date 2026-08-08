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
