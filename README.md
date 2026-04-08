# ClaimFlow

ClaimFlow is a full-stack claims management application built to simulate a real enterprise claims operations system. The project includes secure authentication, claims CRUD, claim error tracking, claim notes, audit history, dashboard analytics, search, filtering, and pagination.

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger

### Frontend
- React
- React Router
- Axios
- Recharts
- Inline CSS styling

## Core Features

- User login with JWT authentication
- Auto logout after token expiry
- Protected frontend routes
- Role-based access for claim deletion
- Claims CRUD operations
- Search by Claim ID, Member ID, and Provider ID
- Filters by state and status
- Client-side pagination
- Claim error tracking
- Claim notes by user
- Audit history for claim actions
- Dashboard with KPI cards and charts

## Modules

### Authentication
- Login API
- JWT token generation
- Token-based protected APIs
- Auto logout after expiry

### Claims
- Create, view, update, delete claims
- Search and filtering
- Pagination
- Role-based delete access

### Claim Errors
- Add claim errors
- View errors by claim
- Update resolution status

### Claim Notes
- Add notes to a claim
- View note history with user name and timestamp

### Audit Logs
- Track claim create, update, and delete actions
- View audit history by claim

### Dashboard
- Total claims
- Pending, approved, rejected claims
- Internal vs external breakdown
- Claims by state

## Project Structure

```text
ClaimFlow/
  backend/
    ClaimFlow.API/
      Controllers/
      DTOs/
      Models/
      Data/
      Auth/
      Middleware/
  frontend/
    claimflow-ui/
      src/
        api/
        components/
        context/
        pages/
        routes/
        utils/
  docs/