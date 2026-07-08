# Module 3 – Task Management

## Objective

The Task module is the core of the Project Management application. It allows organization members to create, manage, assign, update, and archive tasks while maintaining proper authentication, authorization, and clean backend architecture.

---

# Features Implemented

## ✅ Create Task

**Endpoint**

```
POST /api/tasks/:projectId
```

### Functionality

* Creates a task inside a project.
* Automatically links the task to its project.
* Stores the creator of the task.
* Allows setting priority and due date.

### Validations

* Title is required.
* User must belong to the organization.
* Project must exist.
* Project must not be archived.

### Concepts Learned

* Using `req.project` from middleware.
* Creating related MongoDB documents.
* Keeping controllers focused on business logic.

---

## ✅ Get All Tasks

**Endpoint**

```
GET /api/tasks/project/:projectId
```

### Functionality

Returns every active task belonging to a project.

### Population

* Created By
* Assigned Member
* User details of assigned member

### Concepts Learned

* Nested Populate
* Sorting with

```javascript
.sort({ createdAt: -1 })
```

Newest tasks appear first.

---

## ✅ Get Single Task

**Endpoint**

```
GET /api/tasks/:taskId
```

### Functionality

Returns complete information of one task.

### Population

* Project
* Creator
* Assigned Member
* Assigned User

### Concepts Learned

* Middleware chaining
* Nested populate
* Reusing middleware instead of duplicate queries

---

## ✅ Update Task

**Endpoint**

```
PATCH /api/tasks/:taskId
```

### Functionality

Updates selected task fields.

### Editable Fields

* title
* description
* priority
* dueDate

### Production Pattern

Instead of

```javascript
if(title){
   ...
}
```

we used

```javascript
if(title !== undefined){
   ...
}
```

This allows updating values even if they are:

* Empty string
* null
* false

Only missing fields remain unchanged.

### Concepts Learned

* PATCH vs PUT
* Partial updates
* Field whitelisting

---

## ✅ Assign Task

**Endpoint**

```
PATCH /api/tasks/:taskId/assign
```

### Functionality

Assigns a task to a member.

### Validations

* Member ID required
* Member exists
* Member belongs to same organization
* Project exists

### Important Learning

A task stores

```
Member ID
```

NOT

```
User ID
```

because roles belong to Members.

---

## ✅ Update Task Status

**Endpoint**

```
PATCH /api/tasks/:taskId/status
```

### Functionality

Updates task workflow.

### Allowed Status

* Todo
* In Progress
* Done

### Validation Pattern

```javascript
const validStatus = [
    "Todo",
    "In Progress",
    "Done"
];

validStatus.includes(status)
```

instead of multiple `if` conditions.

### Concepts Learned

* Cleaner validation
* Maintainable code

---

## ✅ Archive Task

**Endpoint**

```
PATCH /api/tasks/:taskId/archive
```

### Functionality

Performs a soft delete.

Instead of deleting the task

```
DELETE
```

we update

```javascript
archived = true
```

### Benefits

* Recover accidentally archived tasks.
* Preserve history.
* Better for analytics.
* Better for auditing.

---

# Middleware Used

## authMiddleware

Purpose

* Verify JWT
* Authenticate user

Attaches

```javascript
req.user
```

---

## projectMiddleware

Purpose

* Verify project exists.
* Verify project is active.
* Verify user belongs to organization.

Attaches

```javascript
req.project
```

---

## taskMiddleware

Purpose

* Verify task exists.
* Verify task is not archived.
* Verify authenticated user can access task.
* Avoid duplicate database queries.

Attaches

```javascript
req.task
```

---

# Database Relationships

```
Organization
      │
      │
      ▼
Project
      │
      │
      ▼
Task
      │
      ├──────────────► Created By (User)
      │
      └──────────────► Assigned To (Member)
                              │
                              ▼
                            User
```

---

# User vs Member

## User

Represents a person registered in the application.

Stores

* Name
* Email
* Password

A User exists globally.

---

## Member

Represents a user's membership inside an organization.

Stores

* userId
* organizationId
* role

One User can have multiple Member records.

Example

```
Prachi

↓

Organization A

↓

Owner

----------------

Prachi

↓

Organization B

↓

Member
```

---

# Soft Delete

Instead of

```javascript
Task.findByIdAndDelete(id)
```

we use

```javascript
task.archived = true
```

Archived tasks remain inside MongoDB but are hidden from normal APIs.

---

# Populate Strategy

Instead of sending ObjectIds,

we populate

* createdBy
* assignedTo
* projectId

Benefits

* Fewer API calls
* Better frontend performance
* Cleaner responses

---

# Security Practices Used

* JWT Authentication
* Organization Authorization
* Middleware-based Access Control
* Field Whitelisting
* Soft Delete
* Centralized Error Handling

---

# Common Interview Questions

### Why PATCH instead of PUT?

PATCH updates only the fields sent by the client, whereas PUT replaces the entire resource.

---

### Why use Middleware?

Middleware removes duplicate validation logic and keeps controllers focused on business logic.

---

### Why store Member instead of User in assignedTo?

Because Member contains the organization and role information. A User can belong to multiple organizations with different roles.

---

### Why use Soft Delete?

It preserves historical data, allows recovery of archived records, and supports auditing and reporting.

---

### Why use Populate?

Populate returns related documents in a single API response, reducing frontend requests and improving performance.

---

### Why attach task to req.task?

To avoid repeated database queries across multiple controllers and improve performance.

---

# Viva Questions

### Q1. Explain the difference between User and Member.

**Answer**

A User represents a registered account, while a Member represents that user's participation in a specific organization along with their role.

---

### Q2. Why did you create taskMiddleware?

**Answer**

To centralize task validation and authorization so that multiple controllers could reuse the same logic without duplicate database queries.

---

### Q3. Why didn't you permanently delete tasks?

**Answer**

Because soft delete allows recovery, maintains history, and is a better design for production systems.

---

### Q4. What is Nested Populate?

**Answer**

Nested populate loads referenced documents inside other referenced documents, such as Task → Member → User.

---

### Q5. What is Field Whitelisting?

**Answer**

Only explicitly allowed fields are updated, preventing users from modifying protected fields like `createdBy` or `projectId`.

---

# What I Learned

* Designing reusable Express middleware.
* Building secure REST APIs.
* Implementing partial updates using PATCH.
* Using nested populate in Mongoose.
* Understanding User vs Member relationships.
* Implementing soft delete.
* Reducing database queries by attaching resources to `req`.
* Writing cleaner validation logic using arrays and `includes()`.
* Thinking about backend architecture instead of just writing code.

---

# Module Summary

By completing Module 3, I built a production-style Task Management system with authentication, authorization, middleware chaining, nested document population, soft delete, and secure CRUD operations. This module strengthened my understanding of Express architecture, MongoDB relationships, REST API design, and backend engineering best practices.
