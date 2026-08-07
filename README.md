# ustacik.com

A trusted craftsman marketplace for Northern Cyprus, developed during the **Ata Bilişim Teknolojileri Internship Program**.

---

# 📖 About

**ustacik.com** connects homeowners with trusted craftsmen across Northern Cyprus.

Unlike traditional directories or social media groups, the platform focuses on **trust** through manual verification, verified customer reviews, transparent profiles, and a structured job request system.

This project is being developed over a **2-week internship** by a team of interns working together to build a production-ready platform.

---

# 🎯 Project Objectives

- Connect customers with skilled craftsmen.
- Build a transparent trust and verification system.
- Allow customers to submit job requests.
- Enable craftsmen to manage their professional profiles.
- Provide multilingual support (English & Turkish).
- Deliver a fast, responsive, mobile-first experience.

---

# ✨ Core Features

## Public Platform

- Landing page
- Craftsman directory
- Advanced search & filtering
- Individual craftsman profiles
- Job request system
- SEO-optimized pages
- English & Turkish localization

## Craftsman Portal

- Dashboard
- Profile management
- Work photo management
- Job management
- Verification status
- Reviews

## Admin Portal

- User management
- Craftsman verification
- Category management
- Region management
- Job management
- Review moderation
- Platform analytics

---

# 🔒 Trust System

Every craftsman belongs to one of three verification levels.

| Level | Requirements |
|--------|--------------|
| **Registered** | Phone verification, category selection, and region |
| **Verified** | ID verification, previous customer references, and work photos |
| **Approved** | Business registration and workmanship guarantee |

Verification is carried out manually by administrators to maintain trust and authenticity across the platform.

---

# ⭐ Review System

Only customers who have completed a job through the platform can leave reviews.

Each review includes:

- Punctuality
- Workmanship
- Price Honesty
- Communication
- Optional comment
- Optional photos

Craftsmen may publish one public reply to each review.

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

## Backend

- Next.js App Router
- Route Handlers
- Prisma ORM
- PostgreSQL (Neon)

## Authentication

- Better Auth

## Development

- Git
- GitHub

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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open Prisma Studio |

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
├── feature/frontend
├── feature/backend
├── feature/jobs
├── feature/admin
├── feature/reviews
└── feature/...
```

### Branch Rules

- Always branch from **develop**
- Create one branch per feature or bug fix
- Open Pull Requests into **develop**
- Only maintainers merge into **main**

> ⚠️ **Never push directly to `main`.**

---

# 📝 Commit Convention

Use conventional commits whenever possible.

Examples:

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

This repository was created as part of the **Ata Bilişim Teknolojileri Internship Program** for the development of **ustacik.com**.