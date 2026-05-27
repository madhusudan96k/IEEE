# IEEE Student Chapter – DBATU 🎓⚡

**Dr. Babasaheb Ambedkar Technological University, Lonere, Raigad**  
Full-stack website for the IEEE Student Chapter with a live admin dashboard.

---

## 🗂️ Project Structure

```
ieee-dbatu/
├── server.js                 ← Express server (entry point)
├── package.json
├── .env.example              ← Copy to .env and configure
├── routes/
│   ├── _db.js                ← JSON file storage helper
│   ├── auth.js               ← JWT login/verify
│   ├── events.js             ← Events CRUD
│   ├── committee.js          ← Committee CRUD
│   └── members.js            ← Members CRUD + approval
├── middleware/
│   └── auth.js               ← JWT protection middleware
├── data/
│   ├── events.json           ← Event records (auto-managed)
│   ├── committee.json        ← Committee records
│   └── members.json          ← Student registration records
└── public/                   ← Static frontend
    ├── index.html            ← Home page
    ├── about.html            ← About IEEE
    ├── team.html             ← Committee page
    ├── events.html           ← Events listing
    ├── membership.html       ← Membership + registration form
    ├── gallery.html          ← Photo gallery
    ├── contact.html          ← Contact form
    ├── admin.html            ← 🔐 Admin dashboard
    ├── css/
    │   ├── style.css         ← Public site styles
    │   └── admin.css         ← Admin panel styles
    └── js/
        ├── api.js            ← Centralised API client
        ├── nav.js            ← Shared navbar/footer + theme
        ├── home.js           ← Home counter animations
        ├── events.js         ← Events page logic
        └── team.js           ← Committee page logic
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd ieee-dbatu
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your preferred admin credentials
```

### 3. Start the server
```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

### 4. Open in browser
- 🌐 **Website**: http://localhost:3000
- 🔐 **Admin Panel**: http://localhost:3000/admin.html

---

## 🔐 Admin Login

Default credentials (change in `.env`):
| Field    | Value           |
|----------|-----------------|
| Username | `admin`         |
| Password | `ieee@dbatu2024`|

---

## 📡 API Endpoints

### Auth
| Method | Endpoint          | Access | Description        |
|--------|-------------------|--------|--------------------|
| POST   | `/api/auth/login` | Public | Get JWT token      |
| GET    | `/api/auth/verify`| Admin  | Verify token       |

### Events
| Method | Endpoint            | Access | Description         |
|--------|---------------------|--------|---------------------|
| GET    | `/api/events`       | Public | List all events     |
| GET    | `/api/events?type=upcoming` | Public | Filter by type |
| GET    | `/api/events/:id`   | Public | Get single event    |
| POST   | `/api/events`       | Admin  | Create event        |
| PUT    | `/api/events/:id`   | Admin  | Update event        |
| DELETE | `/api/events/:id`   | Admin  | Delete event        |

### Committee
| Method | Endpoint               | Access | Description          |
|--------|------------------------|--------|----------------------|
| GET    | `/api/committee`       | Public | List all members     |
| GET    | `/api/committee/:id`   | Public | Get single member    |
| POST   | `/api/committee`       | Admin  | Add member           |
| PUT    | `/api/committee/:id`   | Admin  | Update member        |
| DELETE | `/api/committee/:id`   | Admin  | Delete member        |

### Student Members
| Method | Endpoint                      | Access | Description          |
|--------|-------------------------------|--------|----------------------|
| GET    | `/api/members`                | Admin  | List all members     |
| POST   | `/api/members`                | Public | Register (self)      |
| PATCH  | `/api/members/:id/status`     | Admin  | Approve/Reject       |
| DELETE | `/api/members/:id`            | Admin  | Delete member        |

### Stats
| Method | Endpoint     | Access | Description         |
|--------|-------------|--------|---------------------|
| GET    | `/api/stats` | Public | Dashboard stats     |

---

## 🎨 Pages

| Page             | File                | Description                              |
|------------------|---------------------|------------------------------------------|
| Home             | `index.html`        | Hero, highlights, counters, events teaser|
| About            | `about.html`        | IEEE intro, mission, vision, benefits    |
| Committee        | `team.html`         | Cards loaded from API                    |
| Events           | `events.html`       | Filterable/searchable events from API    |
| Membership       | `membership.html`   | Plan, steps, self-registration form      |
| Gallery          | `gallery.html`      | Photo grid with lightbox                 |
| Contact          | `contact.html`      | Contact form + details                   |
| **Admin Panel**  | `admin.html`        | Full dashboard – events, committee, members|

---

## ✨ Features

- **Dark mode** toggle (persisted in localStorage)
- **Fully responsive** (mobile, tablet, desktop)
- **Admin Dashboard** with live stats, charts, and CRUD
- **JWT Authentication** for admin routes
- **Member Approval System** (pending → approved/rejected)
- **Search & Filter** in both events page and admin tables
- **Lightbox Gallery**
- **Newsletter Signup** UI
- **Scroll reveal animations**
- **No database required** — JSON file storage out of the box

---

## 📦 Dependencies

| Package     | Purpose                     |
|-------------|-----------------------------|
| express     | Web server                  |
| bcryptjs    | Password hashing            |
| jsonwebtoken| JWT auth tokens             |
| cors        | Cross-origin requests       |
| dotenv      | Environment variables       |
| uuid        | Unique IDs for records      |
| nodemon     | Dev auto-reload (devDep)    |

---

## 🔧 Customization

1. **College name** — Search and replace `DBATU` across HTML files
2. **Colors** — Edit `--ieee-blue`, `--accent` in `css/style.css`
3. **Seed data** — Edit `data/events.json` and `data/committee.json`
4. **Google Maps** — Replace the placeholder in `contact.html` with an `<iframe>` embed
5. **Social links** — Update `nav.js` footer social `href` values
6. **Email** — Integrate Nodemailer in a new `/api/contact` route for real email sending

---

© 2025 IEEE Student Chapter DBATU. All rights reserved.
