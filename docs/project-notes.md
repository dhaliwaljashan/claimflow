# Project Notes

## Day 4
- Installed Entity Framework Core SQL Server packages
- Created first migration: InitialCreate
- Created ClaimFlowDb database
- Verified core tables in SQL Server

## Day 6
- Added update and delete endpoints for claims
- Added basic filtering by state and status
- Added validation to ensure CreatedByUserId exists
- Completed first CRUD module for Claims

## Day 7
- Added Claim Errors module
- Implemented create error endpoint
- Implemented get errors by claim endpoint
- Implemented update resolution status endpoint
- Connected claim errors to existing claims

## Day 8
- Added authentication DTOs
- Added password hashing helper
- Configured JWT settings in appsettings.json
- Added JWT authentication setup in Program.cs
- Seeded sample users for login flow

## Day 9
- Added JWT token generation helper
- Added AuthController with login endpoint
- Implemented email and password verification
- Returning JWT token and user details on successful login
- Tested successful and failed login scenarios

## Day 10
- Protected Claims and Claim Errors APIs with JWT authentication
- Restricted claim deletion to Admin role only
- Configured Swagger to support Bearer token authorization
- Tested login and protected endpoint flow
- Verified role-based access control with Admin and Analyst users

## Day 11
- Added Dashboard module
- Implemented summary endpoint with key claim metrics
- Added counts for total, pending, approved, and rejected claims
- Added internal vs external claim counts
- Added state-wise claim grouping for charts

## Day 12
- Set up frontend routing with React Router
- Added main pages: Login, Dashboard, Claims, Create Claim
- Added Navbar component for navigation
- Added axios base client for backend API calls
- Added basic AuthContext structure

## Day 13
- Implemented frontend login form
- Connected React frontend to backend login API
- Stored JWT token and user data in localStorage
- Added login and logout functions in AuthContext
- Redirected users to dashboard after successful login
- Displayed login error for invalid credentials

## Day 14
- Added ProtectedRoute component
- Protected dashboard, claims, and create claim pages
- Redirected unauthenticated users to login
- Redirected logged-in users away from login page
- Added auth-based redirect for root route

## Day 15
- Connected Claims page to backend API
- Implemented claims list display in table
- Added loading, error, and empty states
- Successfully fetched and displayed real data from database

## Day 16
- Implemented Create Claim frontend form
- Connected create form to backend claims API
- Added basic client-side validation
- Redirected to Claims page after successful creation
- Verified new claims appear in claims list

## Day 17
- Connected Dashboard page to backend API
- Displayed KPI cards for claims summary
- Implemented bar chart for claims by state using Recharts
- Implemented pie chart for internal vs external claims
- Added loading and error handling for dashboard