# ustacik.com

A trusted craftsman platform for Northern Cyprus, built as part of the **Ata Bilişim Teknolojileri** internship program.

---

# 📖 About

**ustacik.com** connects customers with trusted craftsmen across Northern Cyprus (Nicosia, Kyrenia, Famagusta, Larnaca, Morphou, Güzelyurt, and more).

The platform aims to bridge the trust gap between customers and service providers through manual admin verification, verified multi-metric reviews, and transparent craftsman profiles.

---

# 🎯 Project Objectives

- **Connect Customers & Craftsmen**: Enable seamless discovery and job requests for local home and trade services.
- **Verification System**: Implement a 3-tier manual verification process (Registered, Verified, Approved).
- **Multidimensional Reviews**: Transparent feedback based on punctuality, workmanship, price honesty, and communication.
- **Role-Based Experience**: Dedicated dashboards for Customers, Craftsmen, and Administrators.
- **Mobile-First & Modern UI**: Built with a responsive, accessible, and high-performance design.

---

# ✨ Core Features

- 🔍 **Craftsman Directory**: Search and filter craftsmen by name, business, category, sub-service, region, verification level, and rating.
- 🏷️ **Categories & Sub-Services**: Detailed categorization spanning Plumbing, Electrical, Painting, Carpentry, HVAC, Gardening, Appliances, Aluminium/Glass, and more.
- 🛡️ **3-Tier Verification**: Admin-managed verification badges backed by document and reference checks.
- ⭐ **Multidimensional Review Engine**: Customer reviews covering 4 core metrics with photo attachments and craftsman reply capabilities.
- 📊 **Role-Based Dashboards**:
  - **Admin Dashboard**: Verification queue management, platform growth statistics, user/craftsman metrics, and activity logs.
  - **Craftsman Dashboard**: Work requests overview, completed jobs tracking, profile management, and revenue stats.
  - **Customer Dashboard**: Job request tracking, past reviews, and account settings.
- 🔐 **Authentication & Security**: Multi-session authentication via Better Auth supporting Email/Password (with password strength enforcement) and Google OAuth.
- ⚡ **Performance Optimized**: Cached ISR queries using Next.js `unstable_cache` for featured craftsmen and dynamic API pagination.

---

## 🏗 Tech Stack

### Frontend & Application Framework

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Actions)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/)
- **Icons & Theme**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), `next-themes` (Dark/Light mode)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), `@hookform/resolvers`

### Backend & Database

- **API**: Next.js App Router API Handlers (`app/api/`)
- **Database**: PostgreSQL hosted on [Neon](https://neon.tech/)
- **ORM**: [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-neon` serverless driver
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Prisma adapter & plugins (`admin`, `multiSession`, `nextCookies`)

---

## 🔒 Trust & Verification Model

Every craftsman profile is categorized under one of three verification levels managed manually by administrators:

| Level          | Badge    | Description                                                                                                          |
| :------------- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| **REGISTERED** | Standard | Default state upon account creation. Phone & basic profile provided.                                                 |
| **VERIFIED**   | Verified | Identity & phone number verified by admin.                                                                           |
| **APPROVED**   | Premium  | Full background check completed: Business registration, work photos, references, and workmanship guarantee verified. |

---

# ⭐ Review System

Reviews are restricted to completed jobs to maintain integrity.

Each review measures four specific criteria on a 1–5 scale:

1. ⏰ **Punctuality**: Timeliness and schedule adherence.
2. 🔨 **Workmanship**: Quality of service and craftsmanship.
3. 💰 **Price Honesty**: Transparency and adherence to quoted pricing.
4. 💬 **Communication**: Clarity, responsiveness, and professionalism.

Customers can attach photo evidence, and craftsmen have the ability to post official replies to reviews.

---

## 📁 Directory Structure

```text
ustacik/
├── app/
│   ├── (auth)/                # Authentication routes (sign-in, sign-up)
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── admin/             # Admin management & queue dashboard
│   │   ├── craftsman/         # Craftsman job & profile dashboard
│   │   ├── customer/          # Customer job requests & profile dashboard
│   │   └── profile/           # Unified user account settings
│   ├── (public)/              # Public landing pages
│   │   ├── become-craftsman/  # Craftsman onboarding & application page
│   │   ├── craftsmen/[id]/    # Detailed craftsman profile page
│   │   └── find-craftsmen/    # Search & filter directory page
│   └── api/                   # REST API routes
│       ├── auth/[...all]/     # Better Auth API endpoints
│       ├── craftsmen/         # Craftsman directory & detail APIs
│       ├── featured-craftsmen/# Featured top-rated craftsmen API
│       └── sub-services/      # Sub-services lookup API
├── components/                # Modular React components
│   ├── become-craftsman/      # Onboarding components
│   ├── craftsman-profile/     # Profile page detail components
│   ├── craftsmen/             # Directory cards, filters, and search
│   ├── landing/               # Homepage hero, stats, testimonials, footer
│   ├── sidebar/               # Navigation sidebars
│   └── ui/                    # Base UI / Shadcn design primitives
├── lib/                       # Core utilities & server clients
│   ├── api/                   # Response & error handling helpers
│   ├── auth.ts                # Better Auth server configuration
│   ├── auth-client.ts         # Better Auth client hooks
│   ├── get-session.ts         # Server-side cached session retriever
│   └── prisma.ts              # Neon-adapted Prisma Client instance
├── prisma/
│   └── schema.prisma          # Database models & enums
└── public/                    # Static assets & public media
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL Database**: Neon serverless PostgreSQL instance (or local PostgreSQL)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ustacik-team/Ustacik.git
cd ustacik
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/ustacik?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here"
NEXT_APP_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Overview

| Endpoint                  | Method     | Description                                                                                         |
| :------------------------ | :--------- | :-------------------------------------------------------------------------------------------------- |
| `/api/auth/[...all]`      | GET / POST | Better Auth endpoints (sign-in, sign-up, sign-out, session).                                        |
| `/api/craftsmen`          | GET        | List craftsmen with pagination, search, category, subService, region, verification, & sort filters. |
| `/api/craftsmen/[id]`     | GET        | Fetch full profile, reviews, photos, verification records, and related craftsmen for a specific ID. |
| `/api/featured-craftsmen` | GET        | Fetch top-rated, approved craftsmen for landing page highlights.                                    |
| `/api/sub-services`       | GET        | Retrieve sub-services mapped to their parent categories.                                            |

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ustacik-team/Ustacik.git
```

## 2. Navigate into the project

```bash
cd Ustacik
```

## 3. Install dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

## 4. Configure environment variables

Create a `.env` file in the project root (I will send the secret keys privately).

Example:

```env
DATABASE_URL=
DIRECT_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

NEXT_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> Contact a project maintainer to obtain the required environment variables.

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Start the development server

Using npm:

```bash
npm run dev
```

Or using pnpm:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 📂 Useful Commands

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start the development server |
| `npm run build`       | Build the application        |
| `npm run start`       | Run the production build     |
| `npm run lint`        | Run ESLint                   |
| `npx prisma generate` | Generate Prisma Client       |
| `npx prisma studio`   | Open Prisma Studio           |

---

# 🏛 Project Structure

```
app/
components/
lib/
├── api/
├── auth/
prisma/
public/
```

The project follows a modular architecture with clear separation of concerns:

- **Components** for reusable UI
- **Services** for business logic
- **Mappers** for response transformations
- **API Helpers** for reusable API utilities
- **Validations** for Zod schemas
- **Prisma** for database access

---

# 🌿 Git Workflow

The project follows a Git Flow–inspired workflow.

```text
main
│
develop
  ├── feature/auth
  ├── feature/backend
  ├── feature/frontend
  ├── feature/admin
  ├── feature/reviews
  └── feature/jobs
```

> **Please create a new branch from `develop` for every major feature or bug fix to keep development organized.**

---

## 📌 Development Guidelines

- Keep commits small and meaningful.
- Use descriptive commit messages following Conventional Commits.
- Open a Pull Request for every feature.
- Test your changes before opening a Pull Request (`npm run lint`, `npm run build`).
- Follow the agreed project architecture.

### 📝 Commit Message Convention

```text
feat: add craftsman profile page
feat: implement job request endpoint
fix: resolve authentication middleware issue
refactor: simplify craftsmen service
docs: update project README
style: format dashboard components
```

---

# 📋 Development Guidelines

- Follow the existing project architecture.
- Keep components modular and reusable.
- Use **shadcn/ui** wherever appropriate.
- Prefer **Server Components** unless client-side interactivity is required.
- Validate all user input using **Zod**.
- Keep Route Handlers thin by moving business logic into services.
- Reuse helpers, mappers, validators, and utilities whenever possible.
- Write descriptive commit messages.
- Keep Pull Requests focused on a single feature.
- Ensure responsive layouts across desktop, tablet, and mobile devices.
- Test your feature before opening a Pull Request.

---

# 🤝 Team Collaboration

To keep the project consistent:

- Discuss architectural decisions before implementing major changes.
- Follow the established folder structure.
- Keep code readable and maintainable.
- Review Pull Requests constructively.
- Maintain a consistent coding style across the project.

---

# 📄 License

This repository is created for the Ata Bilişim Teknolojileri internship project.
