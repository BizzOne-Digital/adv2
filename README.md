# Light for Immigrants

Production-quality website and custom admin CMS for **Light for Immigrants**, an Ontario not-for-profit supporting immigrants and Canadian communities.

## Features

- **Public site**: Cinematic animations (GSAP, Motion, Lenis), responsive editorial design, MongoDB-driven content
- **Admin CMS** at `/admin`: Pages, services, gallery, testimonials, FAQs, team, blog, bookings, inquiries, settings, uploads
- **Local uploads** to `public/uploads` (persistent volume required in production)
- **Security**: bcrypt passwords, signed HTTP-only sessions (jose), rate limiting, honeypots, sanitized rich text

## Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Docker)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, for inspecting data)

## Quick start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your SESSION_SECRET and admin credentials

# Start MongoDB locally, then:
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## MongoDB Compass connection

```
mongodb://127.0.0.1:27017/light_for_immigrants
```

Database name: `light_for_immigrants`

## Environment variables

See `.env.example`. Required for development:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Default: `mongodb://127.0.0.1:27017/light_for_immigrants` |
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` |
| `SESSION_SECRET` | Long random string (32+ chars) |
| `ADMIN_SEED_EMAIL` | First admin email (seed only) |
| `ADMIN_SEED_PASSWORD` | First admin password (seed only, never commit) |

Optional SMTP variables send email notifications when contact or booking forms are submitted (database storage always works).

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | e.g. `smtp.hostinger.com` |
| `SMTP_PORT` | `465` (SSL) or `587` (TLS) |
| `SMTP_SECURE` | `true` for port 465, `false` for 587 |
| `SMTP_USER` | Full mailbox address, e.g. `info@lightimmigrants.ca` |
| `SMTP_PASSWORD` | Mailbox password (never commit) |
| `SMTP_FROM` | Sender address (usually same as `SMTP_USER`) |
| `SMTP_TO` | Inbox for form notifications (defaults to `SMTP_FROM`) |

Test SMTP after configuring `.env.local`:

```bash
npm run test-smtp
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run seed` | Idempotent database seed |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests |

## Docker (optional)

```bash
docker compose up -d mongodb
npm run seed
npm run dev
```

Full stack with persistent uploads:

```bash
docker compose up --build
```

Volumes: `lfi_mongo_data`, `lfi_uploads`

## Admin modules

- **Dashboard** — counts, warnings, quick actions
- **Pages** — section-by-section editors for all public pages
- **Services** — card/listing + detail page tabs, dynamic `/services/[slug]` routes
- **Gallery, Testimonials, FAQs, Team, Blogs** — dedicated CRUD
- **Bookings & Inquiries** — submission management
- **Products & Pricing** — catalog and contact-us pricing cards
- **Media Library** — local upload management
- **Settings** — single source of truth for contact info, branding, SEO, donation links

## Content architecture

- **SiteSettings** — contact email, phone, address, social links, footer (never hardcode email in components)
- **Page** — hero + ordered `ContentSection[]` per route
- **Service** — card fields + detail page fields → auto-routed at `/services/[slug]`
- **Forms** — Contact & booking requests stored in MongoDB

## Local uploads

Files save to `public/uploads/images/YYYY/MM/` and `public/uploads/videos/YYYY/MM/`. Images are processed with Sharp (WebP + thumbnails).

**Important:** Vercel and other serverless platforms use ephemeral filesystems. This app requires a **persistent Node server** (VPS, Docker volume, etc.) for uploads. Do not deploy uploads to serverless without external storage.

## Replace before launch

1. **Email** — Settings → Contact → replace `firstimmigrants@gmail.com` with final domain email
2. **Placeholder media** — Admin Media Library / Gallery / Page sections
3. **Testimonials** — Publish real quotes (seed samples are draft)
4. **Team** — Publish real names and photos
5. **Impact metrics** — Replace placeholder counters on Home
6. **Donation link** — Settings → Actions
7. **Social links** — Settings → Social
8. **Verified office hours** — Settings → Contact

## Deployment checklist

- [ ] Set production env vars on your host (**required for build and runtime**):
  - `MONGODB_URI` — same Atlas URI as local (database: `light_for_immigrants`)
  - `SESSION_SECRET` — 32+ random characters
  - `NEXT_PUBLIC_SITE_URL` — e.g. `https://your-domain.com`
- [ ] **MongoDB Atlas** → Network Access → allow `0.0.0.0/0` (or your host IPs) so serverless can connect
- [ ] After first deploy, run `npm run seed` locally (uses `.env.local`) or `npm run publish-services` to ensure services are `published`
- [ ] Redeploy after setting env vars (Vercel/Netlify rebuild on env change)
- [ ] Configure persistent volume for `public/uploads`
- [ ] Replace Gmail with domain email in Settings
- [ ] Configure MongoDB backups
- [ ] Use HTTPS (Secure cookies enabled in production automatically)

### Vercel

1. Project → Settings → Environment Variables → add all three required vars for **Production** and **Preview**
2. Redeploy from Deployments tab
3. If services still missing, run locally: `npm run publish-services` then hard refresh the live site

## Logo

Brand logo: `public/logo.png` — used in header, intro, and admin login.

## License

Private — Light for Immigrants.
