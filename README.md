# GuruHome

GuruHome is a production-oriented two-sided marketplace platform connecting parents and tutors across India.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, React Router, TanStack Query
- Backend: FastAPI, SQLAlchemy, Alembic, Celery
- Database: PostgreSQL
- Cache and queue broker: Redis
- Storage integration hooks: Cloudinary
- Auth: JWT, OTP, email/password
- Infra: Docker Compose, Nginx

## Quick Start

1. Copy `.env.example` to `.env`
2. Run database migrations: `docker compose run --rm backend alembic upgrade head`
3. Seed sample users: `docker compose run --rm backend python -m app.db.seed`
4. Run `docker compose up --build`
5. Frontend: `http://localhost`
6. API docs: `http://localhost/api/docs`

## Structure

- `frontend/`: React application
- `backend/`: FastAPI application
- `backend/alembic/`: database migrations
- `infra/nginx/`: Nginx reverse proxy configuration

## Notes

- Payment verification is designed around manual admin approval of uploaded UPI payment proof.
- Phone numbers are encrypted before database persistence.
- The project ships as a secure, modular starter with core marketplace flows.
- All seeded users use password `Test@12345`.
