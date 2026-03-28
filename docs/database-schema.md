# ClaimFlow Database Schema

## Users
- UserId (int, PK)
- FullName (string)
- Email (string, unique)
- PasswordHash (string)
- Role (string)
- CreatedAt (datetime)

## Claims
- ClaimId (int, PK)
- MemberId (string)
- ProviderId (string)
- State (string)
- ClaimType (string)
- Amount (decimal)
- Status (string)
- SubmissionDate (datetime)
- IsInternal (bool)
- CreatedByUserId (int, FK)
- CreatedAt (datetime)
- UpdatedAt (datetime, nullable)

## ClaimErrors
- ClaimErrorId (int, PK)
- ClaimId (int, FK)
- ErrorCode (string)
- ErrorType (string)
- Description (string)
- ResolutionStatus (string)
- CreatedAt (datetime)

## StateRules
- StateRuleId (int, PK)
- StateCode (string)
- RuleName (string)
- RuleDescription (string)
- IsActive (bool)
- CreatedAt (datetime)

## AuditLogs
- AuditLogId (int, PK)
- UserId (int, FK)
- ActionType (string)
- EntityName (string)
- EntityId (int)
- Timestamp (datetime)