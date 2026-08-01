# ustacik.com

A trusted craftsman platform for Northern Cyprus built as part of the Ata Bilişim Teknolojileri internship program.

## 📖 About

ustacik.com connects customers with trusted craftsmen across Northern Cyprus.

The goal is not just to help people find craftsmen, but to build trust through manual verification, verified reviews, and transparent profiles.

This project is being developed over **2 weeks** by a team of interns.

---

## 🎯 Project Goals

- Connect customers with skilled craftsmen.
- Build a trusted verification system.
- Allow customers to request jobs.
- Enable craftsmen to manage their profiles.
- Support English and Turkish.
- Provide a mobile-first experience.

---

## 🛠 Core Features

- Craftsman directory
- Categories & sub-services
- Customer job requests
- Craftsman profiles
- Manual verification system
- Verified customer reviews
- Craftsman dashboard
- Admin dashboard
- Notifications
- SEO-friendly pages

---

## 🔒 Trust Model

Every craftsman belongs to one of three verification levels:

- Registered
- Verified
- Approved

Verification is performed manually by administrators.

---

## ⭐ Review System

Reviews are only allowed after a completed job.

Each review includes:

- Punctuality
- Workmanship
- Price honesty
- Communication

Customers may also leave comments and photos.

---

## 🏗 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- Prisma ORM
- PostgreSQL (Neon)

### Authentication

- Better Auth

### Version Control

- Git & GitHub

---

## 👥 Team Workflow

- Create a feature branch from `develop`.
- Make your changes and commit regularly.
- Open a Pull Request into `develop`.
- After review, the Pull Request will be merged into `develop`.
- Only project maintainers can merge `develop` into `main`.

> ⚠️ **Do not push directly to `main`.**

---

## 🌿 Branch Strategy

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
- Use descriptive commit messages.
- Open a Pull Request for every feature.
- Test your changes before opening a Pull Request.
- Follow the agreed project architecture.
- Keep discussions and code reviews respectful and constructive.

## 📝 Commit Message Convention

Examples:

```text
feat: add job request endpoint
fix: resolve login validation bug
docs: update README
refactor: improve notification service
style: format dashboard components
```

---

## 📄 License

This repository is created for the Ata Bilişim Teknolojileri internship project.