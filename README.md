# Trainingslager Antalya

Full-stack enquiry website for football training camps.

## Stack

- Frontend: responsive HTML/CSS/JavaScript landing page with German/English UI
- Backend: Node.js 20 + Express
- Database: MySQL 8
- Email: SMTP via Nodemailer
- Admin: API-key protected enquiry dashboard at `/admin.html`

## Run locally

1. Install Node.js 20+ and Docker.
2. Start PostgreSQL:

   ```sh
   docker compose up -d mysql
   ```

3. Configure the app:

   ```sh
   cp .env.example .env
   ```

   Set a strong `ADMIN_API_KEY`. SMTP variables are required for email notifications and can be left blank while testing the form.

4. Install and start:

   ```sh
   npm install
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000). The database table is created automatically on startup.

5. Open `/admin.html`, enter `ADMIN_API_KEY`, and load enquiries.

## API

- `GET /api/health` checks the API and database connection.
- `POST /api/enquiries` validates and stores a new enquiry, then sends an admin notification and applicant confirmation when SMTP is configured.
- `GET /api/admin/enquiries` lists the latest 200 enquiries and requires `x-admin-key`.
- `PATCH /api/admin/enquiries/:id` updates an enquiry status (`new`, `contacted`, or `closed`) and requires `x-admin-key`.

## Production configuration

Set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `ADMIN_API_KEY`, and all `SMTP_*`/`ADMIN_EMAIL` values in the hosting provider's secret environment variables. Do not commit `.env`. Use a managed MySQL database and enable HTTPS at the hosting layer.

## MySQL Workbench

Connect with:

- Connection method: Standard TCP/IP
- Hostname: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Password: leave blank for this local development install
- Default schema: `trainingslager`

The enquiries table is `trainingslager.enquiries`.
