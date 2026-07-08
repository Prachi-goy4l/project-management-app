# Module 5: Real-Time Communication (Socket.IO)

## Objective

Implement real-time communication so that users viewing the same project receive task updates instantly without refreshing the page.

---

## Features Implemented

### Socket.IO Server Setup

* Configured Socket.IO with the Express HTTP server.
* Enabled CORS for client connections.
* Exported:

  * `initSocket(server)` to initialize Socket.IO.
  * `getIO()` to access the Socket.IO instance throughout the application.

---

### Project Rooms

Implemented project-based rooms.

Clients can join a project room using:

```
project:<projectId>
```

Example:

```
project:6a3f8f01968b9c4912b05c02
```

This ensures events are only delivered to users viewing that specific project.

---

### Socket Events

#### Client → Server

##### `join-project`

Allows a connected client to subscribe to updates for a specific project.

---

#### Server → Client

##### `task-created`

Broadcast when a new task is created.

Payload:

* Complete task object

---

##### `task-updated`

Broadcast when task details are modified.

Payload:

* Updated task object

---

##### `task-assigned`

Broadcast when a task is assigned to a member.

Payload:

* Updated task object

---

##### `task-status-updated`

Broadcast when task status changes.

Payload:

* Updated task object

---

##### `task-archived`

Broadcast when a task is archived.

Payload:

* Task ID

---

## Controller Integration

Socket events were integrated into the following controllers:

* Create Task
* Update Task
* Assign Task
* Update Task Status
* Archive Task

Each controller follows the same workflow:

1. Validate request
2. Update MongoDB
3. Populate required references
4. Emit Socket.IO event
5. Return HTTP response

---

## Event Broadcasting

Events are emitted only to the corresponding project room.

Example:

```javascript
io.to(`project:${projectId}`).emit(eventName, payload);
```

This prevents unrelated users from receiving updates.

---

## Benefits

* Instant task synchronization
* Reduced need for manual page refreshes
* Efficient communication through project-specific rooms
* Scalable event broadcasting
* Backend ready for real-time frontend integration

---

## Module Outcome

The backend now supports real-time collaboration. Any task creation, update, assignment, status change, or archive action is immediately broadcast to all connected users viewing the same project.

This completes the real-time communication layer and prepares the application for frontend integration in Module 6.
