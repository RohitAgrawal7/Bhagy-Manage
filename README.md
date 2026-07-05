# Bhagyalaxmi Trading Corporation — Inventory Management

Admin inventory dashboard for **Bhagyalaxmi Trading Corporation**, a bathroom equipment trading business.

Built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Admin dashboard** — stock overview, alerts, charts, recent movements
- **Products** — full bathroom equipment catalog (faucets, showers, closets, basins, heaters, etc.) with detailed specs and pricing
- **Inventory** — stock in / out / transfer / adjustment across shops, movement log
- **Showrooms (3 shops)** — Beed by pass (Mumbai), CIDCO (Pune), aurangpura with per-shop inventory
- **Sales team** — staff profiles, roles, targets, commission, shop assignment
- **Distributors** — supplier details, GST, categories, credit limits, payment terms

All admin forms support create, edit, and delete. Data is stored in `localStorage`.

## Login

Open the app and sign in on the entrance page.

| Field | Demo value |
|---|---|
| Email | `admin@bhagyalaxmi.co.in` |
| Password | `admin123` |

Session is stored in `localStorage`. Use **Logout** in the header to return to login.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```
