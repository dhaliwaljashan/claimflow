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