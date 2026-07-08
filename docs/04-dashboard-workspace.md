# Module 4: Dashboard & Analytics

## Overview

This module provides analytical APIs for organizations and projects. Instead of returning raw data, it generates dashboard statistics using MongoDB Aggregation Pipelines. These endpoints are optimized to minimize database queries and provide frontend-ready responses.

---

# Features Implemented

* Organization Dashboard Overview
* Recent Tasks Dashboard
* Project Dashboard
* MongoDB Aggregation Pipelines
* Cross-collection joins using `$lookup`
* Optimized database queries
* Dashboard-ready responses

---

# APIs

## 1. Get Organization Overview

### Endpoint

```
GET /api/dashboard/overview/:organizationId
```

### Middleware

* Authentication Middleware
* Organization Middleware

### Description

Returns overall statistics for an organization.

### Response

```json
{
  "success": true,
  "data": {
    "projects": 5,
    "totalTasks": 42,
    "completedTasks": 20,
    "pendingTasks": 22
  }
}
```

---

## 2. Get Recent Tasks

### Endpoint

```
GET /api/dashboard/recent-tasks/:organizationId
```

### Middleware

* Authentication Middleware
* Organization Middleware

### Description

Returns the latest five active tasks across all projects in an organization.

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Create Landing Page",
      "status": "Todo",
      "priority": "High",
      "project": "Website Redesign",
      "createdAt": "2026-06-29T11:01:12.600Z"
    }
  ]
}
```

---

## 3. Get Project Dashboard

### Endpoint

```
GET /api/dashboard/project/:projectId
```

### Middleware

* Authentication Middleware
* Project Middleware

### Description

Returns task statistics and completion percentage for a single project.

### Response

```json
{
  "success": true,
  "data": {
    "project": "Website Redesign",
    "totalTasks": 18,
    "todo": 6,
    "inProgress": 5,
    "done": 7,
    "completionPercentage": 38.89
  }
}
```

---

# Aggregation Concepts Used

## `$match`

Filters documents before processing.

Example:

```javascript
{
  $match: {
    archived: false,
    projectId: { $in: projectIds }
  }
}
```

---

## `$group`

Groups documents and performs calculations.

Used to calculate:

* Total Tasks
* Completed Tasks
* Pending Tasks
* Todo Tasks
* In Progress Tasks
* Done Tasks

---

## `$sum`

Counts matching documents.

Example:

```javascript
totalTasks: {
    $sum: 1
}
```

---

## `$cond`

Performs conditional counting.

Example:

```javascript
completedTasks: {
    $sum: {
        $cond: [
            { $eq: ["$status", "Done"] },
            1,
            0
        ]
    }
}
```

---

## `$lookup`

Joins the `tasks` collection with the `projects` collection.

Example:

```javascript
{
    $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project"
    }
}
```

---

## `$unwind`

Converts the lookup array into a single object.

Example:

```javascript
{
    $unwind: "$project"
}
```

---

## `$project`

Returns only the required fields to the client.

Example:

```javascript
{
    $project: {
        title: 1,
        status: 1,
        priority: 1,
        createdAt: 1,
        project: "$project.name"
    }
}
```

---

## `$sort`

Orders recent tasks by creation date.

Example:

```javascript
{
    $sort: {
        createdAt: -1
    }
}
```

---

## `$limit`

Restricts the number of returned documents.

Example:

```javascript
{
    $limit: 5
}
```

---

# Design Decisions

* Aggregation pipelines were used instead of multiple `countDocuments()` queries to reduce database round trips.
* `$match` is placed before `$lookup` to reduce the number of documents processed during joins.
* Project details are joined using `$lookup` instead of issuing separate queries.
* Responses are shaped with `$project` to avoid exposing unnecessary fields.
* Dashboard controllers remain focused on analytics while authentication and authorization are handled by middleware.

---

# Middleware Used

* Authentication Middleware
* Organization Middleware
* Project Middleware

---

# Key Learning Outcomes

* Building analytics APIs with MongoDB Aggregation
* Optimizing database queries
* Using conditional aggregation with `$cond`
* Joining collections using `$lookup`
* Transforming aggregation results with `$project`
* Sorting and limiting data efficiently
* Designing scalable dashboard endpoints

---

# Module Summary

Module 4 extends the application beyond CRUD operations by introducing analytics and reporting capabilities. It demonstrates how aggregation pipelines can efficiently generate dashboard data, perform cross-collection joins, and return frontend-ready responses while maintaining clean architecture and separation of concerns.
