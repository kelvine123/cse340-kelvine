# Common Ground

## Run locally

1. Install dependencies with `npm ci` (or `npm install`).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string.
3. Set `SESSION_SECRET` to a long random value in production.
4. Start the server with `npm start`.
5. Open `http://localhost:3000`.

## Project paths

- `server.js` configures Express, EJS, static files, and error handling.
- `src/routes.js` maps URL paths to controller functions.
- `src/controllers/` coordinates model calls and page rendering.
- `src/models/` contains PostgreSQL queries for organizations, projects, and categories.
- `views/` contains the EJS list, detail, and error pages plus shared partials.
- `public/css/styles.css` is served at `/css/styles.css`.
- `public/images/` is served at `/images/`; the pages use `community.jpeg`, `education.jpeg`, `environment.jpeg`, and `health.jpeg`.
- `.env` is local configuration and is excluded from Git. Use `.env.example` as the safe template.

Available list pages are `/`, `/organizations`, `/projects`, and `/categories`.
Detail routes use `/organization/:id`, `/project/:id`, and `/category/:id`.
Create and edit forms are available at `/new-organization`,
`/edit-organization/:id`, `/new-project`, `/edit-project/:id`,
`/new-category`, and `/edit-category/:id`. Form submissions use POST routes at
the same paths and display server-side validation errors without discarding the
submitted values.

## Database setup

`src/setup.sql` defines the PostgreSQL organizations, service projects,
categories, users, volunteer signups, and their relationships, and seeds
example records. Create a PostgreSQL database, set its connection string as
`DATABASE_URL` in `.env` (see `.env.example`), then run:

```sh
psql -d your_database -f src/setup.sql
```

The setup script also creates the administrator account
`admin@example.com` with the password `cse340!`. The server's authentication
startup also verifies and updates this account.

Each service project has a date, and the setup script seeds at least five
projects for each organization with category associations.

The `/categories` page retrieves category names from that database. Configure
the same `DATABASE_URL` environment variable in your hosting service to use it
there. The organizations page displays organization names, descriptions,
contact emails, and logos from the database. The projects page displays project
names, descriptions, locations, and their organizations.

Logged-in users can sign up for projects from a project's detail page and
manage their signups from the dashboard.

## Render deployment

The root `render.yaml` defines a Node web service. In Render, choose **New > Blueprint**, connect this GitHub repository, and deploy the blueprint. Render uses `npm ci` to install dependencies and `npm start` to launch the app; the service reads Render's `PORT` environment variable.
