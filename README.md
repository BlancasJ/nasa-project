# nasa-project

Full-stack NASA mission control dashboard for scheduling and managing interplanetary launches.

## Context
- **Course:** ZTM (Zero to Mastery) Backend Course
- **Date:** 2022

## Tech Stack
- **Frontend:** React 17, Arwes (sci-fi UI), React Router
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **APIs:** SpaceX API (historical launches)
- **Infra:** Docker, PM2 (clustering), Jest/Supertest (testing)

## What It Does
A mission control app where users schedule rocket launches to habitable exoplanets (filtered from NASA Kepler data). The backend integrates real SpaceX launch history, provides paginated launch data, and supports aborting missions. Includes a monorepo setup with separate client/server packages, Docker deployment, and API tests.
