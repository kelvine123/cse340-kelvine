# Common Ground

## Run locally

1. Install dependencies with `npm ci` (or `npm install`).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string.
3. Start the server with `npm start`.
4. Open `http://localhost:3000`.

## Project paths

- `server.js` configures Express, EJS, static files, and page routes using ES modules.
- `controllers/baseController.js` contains the page render handlers.
- `views/` contains the EJS pages and shared header/footer partials.
- `public/css/styles.css` is served at `/css/styles.css`.
- `public/images/` is served at `/images/`; the pages use `community.jpeg`, `education.jpeg`, `environment.jpeg`, and `health.jpeg`.
- `.env` is local configuration and is excluded from Git. Use `.env.example` as the safe template.

Available pages are `/`, `/organizations`, `/projects`, and `/categories`.

## Database setup

`src/setup.sql` defines the PostgreSQL organizations, service projects,
categories, and their relationships, and seeds example records. Create a
PostgreSQL database, set its connection string as `DATABASE_URL` in `.env`
(see `.env.example`), then run:

```sh
psql -d your_database -f src/setup.sql
```

The `/categories` page retrieves category names from that database. Configure
the same `DATABASE_URL` environment variable in your hosting service to use it
there. The organizations page displays organization names, descriptions,
contact emails, and logos from the database. The projects page displays project
names, descriptions, locations, and their organizations.

## Render deployment

The root `render.yaml` defines a Node web service. In Render, choose **New > Blueprint**, connect this GitHub repository, and deploy the blueprint. Render uses `npm ci` to install dependencies and `npm start` to launch the app; the service reads Render's `PORT` environment variable.
