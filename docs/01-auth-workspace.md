"How I Would Explain This Module in an Interview"

Imagine the interviewer says:

"Can you explain the authentication module you built?"

You'll already have a polished 2–3 minute answer.

For Module 1, it might go like this:

"I started by implementing JWT-based authentication where users can register and log in securely. Passwords are hashed using bcrypt before storing them in MongoDB. After login, the backend generates a JWT, which the frontend sends with every protected request. I then built an organization system where authenticated users can create workspaces, invite members using secure invite tokens, and manage roles like Owner, Admin, and Member. To keep the code modular, I created reusable middleware for authentication and organization authorization. This architecture made it easy to protect future modules like Projects and Tasks without duplicating permission checks."
# Module 01 - Authentication & Workspace Management

## Module Overview

This module is responsible for user authentication, workspace (organization) creation, team member invitations, and organization-level authorization.

It serves as the foundation of the Project Management Application. Every user must register, authenticate, create or join an organization, and become an organization member before accessing project-related features.

---

# Features Implemented

## Authentication

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes using Middleware

---

## Organization Management

- Create Organization
- Organization Owner Assignment
- Industry Selection
- Organization Member Management

---

## Team Invitation

- Generate Invite Token
- Invite Member via Email
- Accept Invite
- Add User to Organization

---

## Authorization

- JWT Authentication Middleware
- Organization Membership Middleware
- Role Based Authorization
    - Owner
    - Admin
    - Member

---

# Folder Structure

```
src
│
├── modules
│
│   ├── auth
│   │      ├── user.model.js
│   │      ├── auth.controller.js
│   │      ├── auth.routes.js
│   │
│   ├── organizations
│   │      ├── organization.model.js
│   │      ├── organization.controller.js
│   │      ├── organization.routes.js
│   │
│   ├── members
│   │      └── member.model.js
│   │
│   └── invites
│          ├── invite.model.js
│          ├── invite.controller.js
│          └── invite.routes.js
│
├── middlewares
│      ├── auth.middleware.js
│      └── organization.middleware.js
│
└── routes
       └── index.js
```

---

# Database Collections

## User

| Field | Type |
|--------|------|
| name | String |
| email | String |
| password | String |

---

## Organization

| Field | Type |
|--------|------|
| name | String |
| industry | String |
| owner | ObjectId(User) |

---

## Member

| Field | Type |
|--------|------|
| userId | ObjectId(User) |
| organizationId | ObjectId(Organization) |
| role | Owner/Admin/Member |

---

## Invite

| Field | Type |
|--------|------|
| email | String |
| role | String |
| organizationId | ObjectId |
| token | String |
| expiresAt | Date |

---

# APIs

## Authentication

### Register

POST /api/auth/register

Creates a new user.

---

### Login

POST /api/auth/login

Returns JWT token after successful authentication.

---

## Organization

### Create Organization

POST /api/organizations

Creates a new workspace.

---

### Invite Member

POST /api/organizations/:organizationId/invite

Generates an invite token.

---

### Accept Invite

POST /api/accept/:token

Accepts an organization invitation.

---

# Middleware

## authMiddleware

Responsibilities

- Verify JWT Token
- Authenticate User
- Attach User to Request

---

## organizationMiddleware

Responsibilities

- Validate Organization
- Check Membership
- Verify User Role
- Attach Organization to Request
- Attach Member to Request

---

# User Flow

Register
        ↓
Login
        ↓
Create Organization
        ↓
Become Owner
        ↓
Invite Members
        ↓
Members Accept Invite
        ↓
Organization Ready

---

# Business Rules

- One user can own multiple organizations.
- Every organization has one owner.
- Members can have Owner, Admin or Member roles.
- Protected APIs require a valid JWT token.
- Organization resources are accessible only to organization members.
- Role-based authorization is enforced through middleware.

---

# Module Status

✅ Completed

Date Completed: 25 June 2026

# What I Learned (Module 1)

---

## 1. JWT Authentication

### What is JWT?

JWT (JSON Web Token) is a secure token that proves the identity of a logged-in user.

Instead of storing user sessions on the server, the server generates a signed token after successful login. Every protected API request includes this token, allowing the server to verify the user's identity.

### Why did we use JWT?

Our application has multiple protected APIs:

* Create Organization
* Invite Members
* Create Projects
* Get Projects

Only authenticated users should access these APIs.

JWT allows the backend to identify the user without storing session data.

### How is it implemented in our project?

Login API

↓

User credentials verified

↓

JWT generated

↓

Frontend stores token

↓

Every API sends

Authorization: Bearer <token>

↓

authMiddleware verifies token

↓

req.user becomes available

### Code Reference

Login Controller

```js
const token = jwt.sign(
    {
        id: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
```

Authentication Middleware

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = decoded;
```

### Interview Question

Q. Why JWT instead of Sessions?

Answer:

JWT is stateless.

The server does not store session information.

It scales better for REST APIs and microservices.

---

## 2. Password Hashing using bcrypt

### What is Password Hashing?

Passwords should never be stored as plain text.

Hashing converts a password into an irreversible encrypted string.

Example

Password

```
admin123
```

Stored in Database

```
$2b$10$Qj4n9.........
```

### Why did we use bcrypt?

If the database gets compromised, attackers cannot immediately know user passwords.

bcrypt also automatically adds a salt, making rainbow table attacks difficult.

### Project Usage

During Registration

↓

Password hashed

↓

Stored in MongoDB

During Login

↓

bcrypt.compare()

↓

Checks entered password against stored hash.

### Interview Question

Q. Why can't we decrypt bcrypt passwords?

Because hashing is one-way.

Passwords are verified using compare(), not decrypted.

---

## 3. MongoDB Relationships

MongoDB is a NoSQL database.

Instead of joins, documents are connected using ObjectIds.

### Our Project Relationships

User

↓

Organization (owner)

↓

Member

↓

Project

Example

Organization

```js
owner: ObjectId(User)
```

Member

```js
userId: ObjectId(User)

organizationId: ObjectId(Organization)
```

Project

```js
createdBy: ObjectId(User)

members: [ObjectId(Member)]
```

Later we use populate() to retrieve related documents.

---

## 4. Mongoose Models

Models define the structure of our MongoDB collections.

Example

User Model

```js
name

email

password
```

Organization Model

```js
name

industry

owner
```

Every model represents one collection inside MongoDB.

---

## 5. Express Routing

Routes connect URLs to controller functions.

Example

```
POST /api/projects
```

↓

createProject()

Routes keep the application modular.

Each module has its own route file.

---

## 6. Middleware Chaining

Middleware executes before controllers.

Our Request Flow

Client

↓

authMiddleware

↓

organizationMiddleware

↓

Controller

This keeps controllers clean.

Instead of checking authentication and authorization repeatedly, middleware performs these checks once.

---

## 7. Role-Based Authorization

Every organization member has a role.

Owner

Admin

Member

organizationMiddleware verifies whether the current user's role is allowed before accessing a route.

Example

```js
organizationMiddleware(["Owner","Admin"])
```

Only Owners and Admins can create projects.

---

## 8. Invite Token Generation

When inviting a user, we generated a unique token using:

```js
crypto.randomBytes(32)
```

The token is stored in MongoDB and later verified when the invited user accepts the invitation.

This prevents unauthorized users from joining organizations.

---

## 9. Environment Variables

Sensitive information should never be hardcoded.

Examples

JWT_SECRET

MONGO_URI

FRONTEND_URL

These values are stored inside the .env file.

The application accesses them using

```js
process.env.JWT_SECRET
```

---

## 10. Git & GitHub Workflow

Instead of directly coding on main, we maintain feature branches.

Example

main

↓

project-module

↓

task-module

Benefits

* Better version control
* Safe experimentation
* Easy rollback
* Professional development workflow


Viva Questions

Not generic ones.

Questions that your examiner will ACTUALLY ask.

Example

Q1. Why did you use JWT instead of Sessions?

Answer

In my project, I wanted the backend to be stateless because the frontend and backend communicate using REST APIs.

When a user logs in, the backend generates a JWT token.

Every protected API request includes that token.

The backend verifies the token using middleware and identifies the user.

Since the server doesn't maintain session data, the application is scalable and works well with distributed systems.

Q2. Why did you create a Member collection?

Answer

A user and a membership are different concepts.

A user represents a person.

A membership represents that person's role inside an organization.

For example

Aman

↓

Organization A → Owner

↓

Organization B → Member

↓

Organization C → Admin

If I stored users directly inside Organization, role management would become difficult.

Using a Member collection allows one user to belong to multiple organizations with different roles.

Q3. Why Middleware?

Answer

Instead of checking authentication inside every controller, I created reusable middleware.

Example

Create Project

Get Projects

Create Tasks

Delete Tasks

All of them require authentication.

Instead of repeating JWT verification everywhere,

I created authMiddleware.

Similarly,

organizationMiddleware validates organization membership and role.

This keeps controllers clean and reusable.

Q4. Why MongoDB?

Answer

The project contains nested and flexible data like

Organizations

Projects

Tasks

Comments

Activity Logs

MongoDB's document model allows flexible schemas while Mongoose provides validation and relationships using ObjectIds.

Q5. Explain your Authentication Flow.

Then we'll literally draw

Login

↓

Verify Password

↓

Generate JWT

↓

Frontend stores token

↓

Bearer Token

↓

authMiddleware

↓

Protected API
Section 11 : Interview Questions

These are a little harder.

Example

Difference between Authentication and Authorization?

Authentication

↓

Who are you?

Authorization

↓

What are you allowed to do?

Project Example

JWT verifies identity

↓

organizationMiddleware verifies permission
Why bcrypt?

Why not SHA256?

We'll explain

Salt
Rainbow attacks
Adaptive hashing
Explain populate()

Using our own Project module.

Explain ObjectId relationships.

Using our Member model.

Explain Middleware Chaining.

Using our routing.

Section 12 : Common Mistakes

This is my favourite section 😂

We'll write mistakes WE made.

Example

❌ Forgot

app.use(express.json())

Result

req.body = undefined

❌ Wrong route

POST

/api/invites/accept

instead of

/api/accept

❌ Forgot

type: module

❌ Wrong Mongo URI

❌ Forgot JWT Header

When you revise,

you'll instantly remember

"OH YES I GOT THIS ERROR."

Section 13 : Future Improvements

Like a real SRS document.

Example

Current

↓

Email invite link returned in API

Future

↓

Send actual email using Nodemailer.
Current

↓

Manual Role Management

Future

↓

Permission Matrix.
Current

↓

JWT only

Future

↓

Google OAuth.
Section 14 : Module Summary

Example

In this module I learned

✔ JWT

✔ bcrypt

✔ MongoDB Relations

✔ Middleware

✔ Role Based Access

✔ Invite System

✔ REST APIs

✔ Environment Variables

✔ Git Workflow

