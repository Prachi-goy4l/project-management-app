🎯 Objective

The Project Module is responsible for managing all project-related operations within an organization.

It allows authenticated organization members to:

Create projects
View projects
Update project details
Archive projects
Add members to projects
Remove members from projects

The module also ensures that only authorized users belonging to the same organization can access or modify project data.

📁 Folder Structure
modules/
└── projects/
      │
      ├── project.model.js
      ├── project.controller.js
      └── project.routes.js

middlewares/
      └── project.middleware.js
🗂 Database Schema
Project Model
Project
{
    name
    description
    organizationId
    createdBy
    members[]
    status
    startDate
    endDate
}
Relationship Diagram
Organization
      │
      ├──────────────┐
      │              │
      ▼              ▼
Members         Projects
                    │
                    │
                    ▼
            Project Members

A project belongs to one organization.

One organization can have many projects.

A project can contain many members.

A member can work on multiple projects.

This is a Many-to-Many Relationship.

📌 APIs Developed
1. Create Project
Endpoint
POST /api/projects
Authentication

✅ Required

Request Body
{
    "name":"Website Redesign",
    "description":"Company Website",
    "organizationId":"...",
    "startDate":"2026-06-27",
    "endDate":"2026-07-15"
}
Flow
User

↓

Authenticate

↓

Organization Exists?

↓

User belongs to Organization?

↓

Validate Dates

↓

Create Project

↓

Return Response
2. Get All Projects
Endpoint
GET /api/projects/organization/:organizationId
Features
Returns all projects of an organization
Populates creator details
Populates project members
3. Get Single Project
Endpoint
GET /api/projects/:projectId
Features
Returns complete project details
Populates:
createdBy

members.userId
4. Update Project
Endpoint
PUT /api/projects/:projectId
Features

Can update:

Name
Description
Status
Start Date
End Date
Validation

End Date cannot be before Start Date.

5. Archive Project
Endpoint
PATCH /api/projects/:projectId/archive
Purpose

Instead of deleting projects permanently, the status is updated to:

Archived
6. Add Member
Endpoint
POST /api/projects/:projectId/members
Request
{
    "memberId":"..."
}
Validations

✔ Member Exists

✔ Member belongs to same Organization

✔ Member is not already assigned

7. Remove Member
Endpoint
DELETE /api/projects/:projectId/members/:memberId
Features
Checks member exists in project
Removes member from project
🔄 Request Flow
Client

↓

JWT Authentication

↓

authMiddleware

↓

projectMiddleware

↓

Controller

↓

MongoDB

↓

Response
📦 Middleware Used
1. authMiddleware

Purpose

Verify JWT Token
Authenticate User

Attaches

req.user
2. organizationMiddleware

Purpose

Verify Organization Exists
Verify User belongs to Organization

Attaches

req.organization

req.member
3. projectMiddleware

Purpose

Verify Project Exists
Verify User has Project Access

Attaches

req.project

req.member
⭐ Why Middleware?

Without middleware

Every controller would contain

Project.findById()

Member.findOne()

Access Validation()

Project Exists()

Authorization()

Repeated again...

and again...

and again...

Instead

Middleware

↓

Validate Once

↓

Controller focuses only on Business Logic
🎓 What I Learned (With Explanation)
1. Middleware
Concept

Middleware is a function that executes before the controller.

It can:

Validate requests
Authenticate users
Authorize access
Modify request objects

Example from our project

req.project = project;

next();

The controller can directly use

req.project

instead of querying the database again.

2. Request Lifecycle

Every request follows:

Client

↓

Route

↓

Middleware

↓

Controller

↓

Database

↓

Response

Understanding this helped organize responsibilities across different layers of the application.

3. Separation of Concerns

Instead of putting everything in controllers

We divided responsibilities.

Middleware

Authentication

Authorization

Validation

Controller

Business Logic

Model

Database Structure

This makes the application easier to maintain.

4. Single Responsibility Principle (SRP)

Each file should have one responsibility.

Example

authMiddleware

↓

Only Authentication

projectMiddleware

↓

Only Project Validation

Controller

↓

Only Project Logic

Changing authentication logic later won't require changes in every controller.

5. Populate

MongoDB stores only ObjectIds.

Instead of

createdBy

↓

68653ab12...

populate converts it into

{
    name:"Aman",
    email:"aman@test.com"
}

This allows returning meaningful data to the frontend without additional API calls.

6. Many-to-Many Relationship

A project has multiple members.

A member can belong to multiple projects.

This relationship was implemented using an array of Member ObjectIds inside the Project model.

7. Partial Updates

Instead of replacing the entire document

Only fields sent by the client are updated.

Example

{
    "status":"Completed"
}

Only status changes.

Everything else remains unchanged.

This prevents accidental data loss.

8. Soft Delete

Instead of

findByIdAndDelete()

We archive projects.

project.status = "Archived";

Benefits

Keeps project history
Preserves reports
Prevents accidental deletion
Common practice in enterprise applications
9. Authorization

Authentication answers

Who are you?

Authorization answers

What are you allowed to do?

Our middleware ensures users can only access projects belonging to organizations they are members of.

10. Business Rules

Not every validation is technical.

Example

A member from Organization A should never be added to a project in Organization B.

This is a business rule that protects data integrity.

Viva / Interview Questions
Q1. Why did you create projectMiddleware?

Answer:

To centralize project validation and authorization. It checks whether the project exists and whether the authenticated user belongs to the project's organization. It also attaches req.project and req.member, allowing controllers to focus only on business logic.

Q2. Why use populate()?

Answer:

MongoDB stores only ObjectIds. populate() replaces those IDs with the referenced documents, allowing the frontend to receive complete user or member details without making additional requests.

Q3. Why archive instead of delete?

Answer:

Archiving preserves historical data, tasks, reports, and activity logs. This is a soft delete approach commonly used in enterprise applications where historical records are important.

Q4. What is the difference between Authentication and Authorization?

Answer:

Authentication verifies the user's identity (using JWT in our project).
Authorization checks whether the authenticated user has permission to access or modify a specific resource.
Q5. Why store Member IDs instead of User IDs in a project?

Answer:

A Member represents a user's membership within a specific organization and contains both the userId and the role. Storing Member IDs preserves organization context and simplifies authorization and role checks.

Q6. Why did you use save() instead of findByIdAndUpdate()?

Answer:

The project document was already fetched by projectMiddleware and attached to req.project. Using save() avoids another database query and ensures Mongoose validations and document middleware execute correctly.

🎯 Module Summary

By completing the Project Module, you built a production-style backend with reusable middleware, secure authorization, RESTful APIs, MongoDB relationships, and clean architecture. More importantly, you learned not just how to build these features, but why they are designed this way—giving you strong material to discuss confidently in interviews.

✅ Module Status

Module 2 - Project Management: Completed 🎉