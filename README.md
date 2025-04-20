# Food Expiration Tracker

## Overview
Food Expiration Tracker is a web application designed to help you and your family keep track of food items in your kitchen and their expiration dates. The app notifies you when items are about to expire, helping reduce food waste and keep your kitchen organized.

## Features
- View all previously entered food items with their expiration dates.
- Add new food items with name and expiration date.
- Prevent duplicate food items from being added.
- Visual status indicator showing if an item is expiring soon (within 1 week) or good to use.
- Delete food items from the list.
- Multi-language support with English, French, and German languages.
- Email notifications sent to configured email addresses when items are 1 week near expiration.
- Responsive UI built with React and Bootstrap.
- Backend API built with ASP.NET Core minimal APIs.
- Data persistence using PostgreSQL.
- Containerized with Docker and orchestrated with Docker Compose for easy deployment.

## Technology Stack
- **Frontend:**
  - React
  - TypeScript
  - Bootstrap
  - Vite (build tool)
  - react-i18next (internationalization)
- **Backend:**
  - ASP.NET Core Minimal APIs
  - Entity Framework Core with PostgreSQL provider
  - Background service for email notifications
- **Database:**
  - PostgreSQL
- **Containerization:**
  - Docker
  - Docker Compose
- **Deployment Target:**
  - Azure (planned)

## Project Structure
- `/backend` - ASP.NET Core backend project
- `/frontend` - React frontend project
- `docker-compose.yml` - Orchestrates backend, frontend, and PostgreSQL containers

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- .NET 7 SDK (for backend development)
- Node.js and npm (for frontend development)

### Running with Docker Compose
1. Clone the repository.
2. Navigate to the project root directory.
3. Update the PostgreSQL credentials and notification email in `docker-compose.yml` and `backend/appsettings.json`.
4. Run the following command to build and start all services:
   ```
   docker-compose up --build
   ```
5. Access the frontend at [http://localhost:3000](http://localhost:3000).
6. The backend API is available at [http://localhost:5000](http://localhost:5000).

### Development
- **Backend:**
  - Navigate to `/backend`.
  - Use `dotnet run` to start the API.
  - Use Entity Framework Core CLI for migrations.
- **Frontend:**
  - Navigate to `/frontend`.
  - Run `npm install` to install dependencies.
  - Run `npm run dev` to start the development server.

## Internationalization
The app supports English, French, and German languages. Users can select their preferred language from a dropdown in the UI. Translations are managed using `react-i18next`.

## Email Notifications
A background service in the backend checks daily for food items expiring within a week and sends email notifications to configured addresses. SMTP settings should be configured in the backend.

## License
This project is open source and available under the MIT License.
