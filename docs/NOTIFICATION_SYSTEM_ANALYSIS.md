# Notification System Analysis & Improvement Plan

**Date**: 2026-02-04
**Investigator**: Claude (AI System Architect)
**Scope**: Frontend (pgn-crm-fe-Milestone-1), Backend (Energy-Notifications), Database (Oracle PGNBILL)

---

## Executive Summary

This document analyzes anomalous behavior in the notification system, identifies root causes, and proposes architectural improvements to properly separate read status tracking from historical notification retention.

### Key Issues Identified

1. **Notifications disappearing after "mark all as read"** in `/notifications/view` page
2. **Broadcast notifications reappearing after login** despite being marked as read
3. **Lack of separation** between read status and historical retention
4. **No database persistence** for per-user broadcast notification read status

---

## Investigation Methodology

### 1. Frontend Analysis
- **NotificationHistory.js** (`/src/app/pages/Notifications/NotificationHistory.js`)
- **NotificationDropdown.js** (`/src/components/Notifications/NotificationDropdown.js`)
- **Redux notifications slice** (`/src/redux/slices/notifications.js`)
- **API service layer** (`/src/services/notificationApi.js`)

### 2. Backend Analysis
- **MNotificationController.java** (REST API endpoints)
- **MNotificationService.java** (Business logic)
- **Legacy NotificationService.java** (Old implementation)

### 3. Database Verification
- **M_NOTIFICATIONS table schema** (34 notifications: 18 unread, 16 read)
- **STATUS column behavior** (values: 'read', 'unread')
- **Broadcast notification storage** (TO_USER_ID='BROADCAST')

---

## Findings

### Problem 1: Notifications "Disappearing" After Mark All As Read

#### Current Behavior
When users mark all notifications as read in `/notifications/view`, notifications disappear from view.

#### Root Cause
**User is viewing the "Unread" tab**, not the "All" tab.

**Evidence** (NotificationHistory.js:116-120):
```javascript
if (activeTab === 'unread') {
  notifications = notifications.filter(notification =>
    (notification.STATUS || notification.status) !== "read"
  );
}
```

When `activeTab === 'unread'`, the filter removes all read notifications. This is **correct behavior** for the "Unread" tab.

#### Database Verification
Query confirmed notifications remain in database after marking as read:
```sql
SELECT STATUS, COUNT(*) as count FROM M_NOTIFICATIONS GROUP BY STATUS
-- Results: unread: 18, read: 16
```

Notifications are **NOT deleted** - they're simply status updates.

#### Solution
**User Education**: Switch to "All" tab to view historical notifications.

**Code Evidence** (NotificationHistory.js:113):
```javascript
let notifications = safeAllNotifications; // All tab shows everything
```

**Recommendation**: Improve UI/UX with clearer tab labels:
- "All Notifications" (currently shows: "All (34)")
- "Unread Only" (currently shows: "Unread (18)")

---

### Problem 2: Broadcast Notifications Reappearing After Login

#### Current Behavior
Broadcast notifications reappear after:
- Logging in from a different browser/device
- Clearing browser localStorage
- Logging in after a session timeout

#### Root Causes

**1. Backend Prevents Marking Broadcast Notifications as Read**

**Evidence** (MNotificationService.java:154-160):
```java
if ("BROADCAST".equals(notification.getToUserId())) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(Map.of(
            "success", false,
            "message", "Broadcast notifications cannot be marked as read by individual users"
        ));
}
```

**Why?** Because broadcast notifications are shared records. Marking them as read would affect **all users**, not just the current user.

**2. Frontend Uses localStorage for Tracking**

**Evidence** (NotificationDropdown.js:60-71):
```javascript
const markBroadcastsAsRead = (userId, notificationIds) => {
  try {
    const key = getBroadcastReadKey(userId);
    const existing = getReadBroadcastIds(userId);
    const updated = [...new Set([...existing, ...notificationIds])];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("[NotificationDropdown] Error saving broadcast read status:", e);
    return [];
  }
};
```

**Limitations of localStorage**:
- Browser/device-specific (doesn't sync across devices)
- Cleared when user clears browser data
- Not accessible to backend
- No cross-session persistence

**3. No Database Persistence for Per-User Broadcast Read Status**

Database verification shows:
```sql
SELECT * FROM M_NOTIFICATIONS WHERE TO_USER_ID = 'BROADCAST'
-- ID 18: System Maintenance Alert 2, STATUS: unread
```

Broadcast notifications remain "unread" in the database because changing the STATUS would affect all users.

#### Solution Architecture

Create a **separate read status tracking table**:

```sql
CREATE TABLE M_NOTIFICATION_READ_STATUS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NOTIFICATION_ID NUMBER NOT NULL,
    USER_ID VARCHAR2(100) NOT NULL,
    READ_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    READ_FROM VARCHAR2(50), -- 'web', 'mobile', 'email'
    CONSTRAINT FK_NOTI_READ_STATUS
        FOREIGN KEY (NOTIFICATION_ID)
        REFERENCES M_NOTIFICATIONS(ID) ON DELETE CASCADE,
    CONSTRAINT UQ_NOTI_USER_READ
        UNIQUE (NOTIFICATION_ID, USER_ID)
);

CREATE INDEX IDX_NOTI_READ_USER
    ON M_NOTIFICATION_READ_STATUS(USER_ID, NOTIFICATION_ID);
```

**Benefits**:
- Per-user read status for broadcast notifications
- Cross-device synchronization
- Persistent across sessions
- Audit trail of when/where user read notification
- No impact on shared notification record

---

### Problem 3: Read Status vs Historical Retention

#### Current Design Issue
The system conflates two distinct concepts:

1. **Read Status**: Has the user seen this notification?
2. **Retention/Relevance**: Should this notification be shown in the UI?

Currently, only read/unread status exists. There's no concept of "archived" vs "active" notifications for UI filtering.

#### Use Cases Requiring Separation

**Approval Notifications**:
- User marks as read after reviewing
- **Should remain visible** for audit trail and historical reference
- Current system: Disappears from "Unread" tab (confusing)

**System Maintenance Alerts**:
- User marks as read after acknowledging
- **Should be archived** after maintenance window ends
- Current system: Remains in "All" tab forever

**Transient Messages**:
- "User X commented on your post"
- User marks as read
- **Can be archived** after 30 days
- Current system: No automatic archival

#### Proposed Solution: Lifecycle States

Add `DISPLAY_STATUS` column to track notification visibility:

```sql
ALTER TABLE M_NOTIFICATIONS
    ADD DISPLAY_STATUS VARCHAR2(20) DEFAULT 'active' NOT NULL;

-- Values: 'active', 'archived', 'expired', 'dismissed'
```

**State Definitions**:

| State | Meaning | Shown In UI | Read Status |
|-------|---------|-------------|-------------|
| `active` | Current, relevant notification | Yes (All, Unread) | read/unread |
| `archived` | Historical, for reference only | Only in "Archive" tab | usually read |
| `expired` | Past expiration date | No | any |
| `dismissed` | User explicitly dismissed | No | any |

**UI Changes**:
- **All Tab**: Shows `active` notifications only
- **Unread Tab**: Shows `active` + `status='unread'`
- **Archive Tab**: Shows `archived` notifications (new tab)
- **Mark as Read**: Updates `STATUS` to 'read'
- **Archive**: Updates `DISPLAY_STATUS` to 'archived'
- **Dismiss**: Updates `DISPLAY_STATUS` to 'dismissed'

---

## Database Schema Analysis

### Current M_NOTIFICATIONS Table

```
Column Structure:
- ID (NUMBER, PK) - Auto-generated
- TITLE (VARCHAR2) - Required
- MESSAGE (CLOB) - Required
- NOTIFICATION_TYPE (VARCHAR2) - Required
- STATUS (VARCHAR2) - 'read' or 'unread'
- PRIORITY (NUMBER) - 1=low, 2=normal, 3=high, 4=urgent
- FROM_USER_ID (VARCHAR2) - Sender
- TO_USER_ID (VARCHAR2) - Recipient or 'BROADCAST'
- MODULE, PAGE, LINK - Navigation fields
- ENTITY_ID, ENTITY_TYPE - Related entity
- TAPP_ID, APP_HIER_ID, APPROVAL_ACTION, APPROVAL_LEVEL - Approval context
- NAVIGATION_STATE, ADDITIONAL_DATA (CLOB) - JSON fields
- CREATED_AT, UPDATED_AT, EXPIRES_AT (TIMESTAMP)
- IDEMPOTENCY_KEY (VARCHAR2) - Duplicate prevention
```

**Current Row Count**: 34 notifications (18 unread, 16 read)

### Data Retention Analysis

Query to check old notifications:
```sql
SELECT
    TO_CHAR(CREATED_AT, 'YYYY-MM') as month,
    COUNT(*) as count,
    STATUS
FROM M_NOTIFICATIONS
GROUP BY TO_CHAR(CREATED_AT, 'YYYY-MM'), STATUS
ORDER BY month DESC;
```

**Concern**: No automatic cleanup mechanism. Table will grow indefinitely unless:
1. Manual cleanup is performed
2. Scheduled job archives/deletes old notifications
3. TTL (time-to-live) policy is implemented

---

## Backend API Analysis

### Mark As Read Endpoints

**Single Notification**:
```
PATCH /v1/api/notification/:id/read
```
- Updates STATUS to 'read'
- **Does NOT delete** the notification
- Prevents broadcast notification updates (returns 403)

**All Notifications**:
```
PATCH /v1/api/notification/read-all?userId=xxx
```
- Updates all user's notifications to STATUS='read'
- Uses `markAllAsReadForUser(userId)` repository method
- Creates audit trail

**Delete Endpoint** (Separate):
```
DELETE /v1/api/notification/:id
```
- Actually removes the record from database
- Prevents deletion of broadcast notifications (returns 403)

### Key Backend Code

**MNotificationService.java markAllAsRead (Line 187-203)**:
```java
@Transactional(readOnly = false, rollbackFor = Exception.class)
public ResponseEntity<?> markAllAsRead(String userId) {
    try {
        int count = notificationRepo.markAllAsReadForUser(userId);
        logger.info("Marked {} notifications as read for user {}", count, userId);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "count", count
        ));
    } catch (Exception e) {
        logger.error("Error marking all as read for user {}", userId, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("success", false, "message", e.getMessage()));
    }
}
```

**Observation**: The method returns `count` of updated notifications, confirming they're updated, not deleted.

---

## Frontend State Management Analysis

### Redux Notification Slice

**markAsRead Action** (notifications.js:392-405):
```javascript
markAsRead: (state, action) => {
  const notificationId = action.payload;
  const notification = state.notifications.find((n) => n.id === notificationId);

  if (notification && !notification.read) {
    notification.read = true;
    notification.STATUS = "read";
    notification.status = "read";
    notification.readAt = new Date().toISOString();
    state.unreadCount = Math.max(0, state.unreadCount - 1);
  }
},
```

**markAllAsRead Action** (notifications.js:409-421):
```javascript
markAllAsRead: (state) => {
  state.notifications.forEach((notification) => {
    if (!notification.read) {
      notification.read = true;
      notification.STATUS = "read";
      notification.status = "read";
      notification.readAt = new Date().toISOString();
    }
  });
  state.unreadCount = 0;
},
```

**removeNotification Action** (notifications.js:426-451):
```javascript
removeNotification: (state, action) => {
  const notificationId = action.payload;
  const index = state.notifications.findIndex((n) => n.id === notificationId);

  if (index !== -1) {
    const removed = state.notifications[index];

    // Update unread count
    if (!removed.read) {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    }

    // Remove from main array
    state.notifications.splice(index, 1);

    // Remove from direction-specific arrays
    if (removed.direction === "broadcast") {
      const broadcastIndex = state.broadcastNotifications.findIndex((n) => n.id === notificationId);
      if (broadcastIndex !== -1) state.broadcastNotifications.splice(broadcastIndex, 1);
    } else {
      const directIndex = state.directNotifications.findIndex((n) => n.id === notificationId);
      if (directIndex !== -1) state.directNotifications.splice(directIndex, 1);
    }
  }
},
```

**Key Observations**:
- `markAsRead` and `markAllAsRead` **update status only**
- `removeNotification` **removes from state** (used for delete operation)
- State correctly maintains both read and unread notifications
- Filtering happens at UI layer, not state layer

### Frontend Filter Logic

**NotificationHistory.js Tab Filtering** (lines 112-152):
```javascript
const getFilteredNotifications = () => {
  let notifications = safeAllNotifications;

  // Filter by tab (all/unread)
  if (activeTab === 'unread') {
    notifications = notifications.filter(notification =>
      (notification.STATUS || notification.status) !== "read"
    );
  }

  // Filter by search (title or message)
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    notifications = notifications.filter(notification => {
      const title = (notification.title || notification.TITLE || "").toLowerCase();
      const message = (notification.message || notification.MESSAGE || "").toLowerCase();
      return title.includes(searchLower) || message.includes(searchLower);
    });
  }

  // Filter by date range
  if (startDate && endDate) {
    notifications = notifications.filter(notification => {
      const notificationDate = moment(
        notification.receivedAt || notification.RECEIVED_AT ||
        notification.createdAt || notification.CREATED_AT
      );
      return notificationDate.isBetween(moment(startDate), moment(endDate), 'day', '[]');
    });
  }

  // Filter by notification type dropdown
  if (selectedNotificationType && selectedNotificationType !== "Show All") {
    notifications = notifications.filter(notification => {
      const type = (notification.notificationType || notification.NOTIFICATION_TYPE || "").toLowerCase();
      return type === selectedNotificationType.toLowerCase();
    });
  }

  return notifications;
};
```

**Analysis**: Filtering logic is sound. The "unread" tab correctly filters out read notifications. The "all" tab shows everything.

---

## Architectural Gaps Identified

### 1. No Per-User Broadcast Read Tracking
- **Gap**: Broadcast notifications cannot track read status per user
- **Impact**: Users see the same broadcast notification repeatedly
- **Current Workaround**: localStorage (unreliable)
- **Solution**: M_NOTIFICATION_READ_STATUS table

### 2. No Lifecycle Management
- **Gap**: Only binary read/unread status
- **Impact**: No way to archive old notifications while keeping them for history
- **Current Workaround**: None
- **Solution**: Add DISPLAY_STATUS column

### 3. No Automatic Cleanup
- **Gap**: No TTL or archival policy
- **Impact**: Database grows indefinitely
- **Current Workaround**: Manual cleanup
- **Solution**: Scheduled job to archive/delete expired notifications

### 4. Inconsistent Read Status Semantics
- **Gap**: "Mark as read" means different things in different contexts
- **Impact**: User confusion ("Where did my notification go?")
- **Current Workaround**: User must learn to use "All" tab
- **Solution**: Separate read status from display filtering

### 5. No Cross-Device Synchronization
- **Gap**: localStorage broadcast read status doesn't sync
- **Impact**: Same broadcast appears unread on different devices
- **Current Workaround**: Mark as read on each device separately
- **Solution**: Database-backed read status tracking

---

## Proposed Solution Architecture

### Phase 1: Database Schema Enhancements

#### Step 1.1: Create Read Status Tracking Table
```sql
CREATE TABLE M_NOTIFICATION_READ_STATUS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NOTIFICATION_ID NUMBER NOT NULL,
    USER_ID VARCHAR2(100) NOT NULL,
    READ_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    READ_FROM VARCHAR2(50), -- 'web', 'mobile', 'email'
    CONSTRAINT FK_NOTI_READ_STATUS
        FOREIGN KEY (NOTIFICATION_ID)
        REFERENCES M_NOTIFICATIONS(ID) ON DELETE CASCADE,
    CONSTRAINT UQ_NOTI_USER_READ
        UNIQUE (NOTIFICATION_ID, USER_ID)
);

CREATE INDEX IDX_NOTI_READ_USER
    ON M_NOTIFICATION_READ_STATUS(USER_ID, NOTIFICATION_ID);

CREATE INDEX IDX_NOTI_READ_TIME
    ON M_NOTIFICATION_READ_STATUS(READ_AT);
```

#### Step 1.2: Add Lifecycle Status Column
```sql
ALTER TABLE M_NOTIFICATIONS
    ADD DISPLAY_STATUS VARCHAR2(20) DEFAULT 'active' NOT NULL;

ALTER TABLE M_NOTIFICATIONS
    ADD CONSTRAINT CHK_DISPLAY_STATUS
    CHECK (DISPLAY_STATUS IN ('active', 'archived', 'expired', 'dismissed'));

CREATE INDEX IDX_NOTI_DISPLAY_STATUS
    ON M_NOTIFICATIONS(DISPLAY_STATUS);
```

#### Step 1.3: Add Archival Metadata
```sql
ALTER TABLE M_NOTIFICATIONS
    ADD ARCHIVED_AT TIMESTAMP;

ALTER TABLE M_NOTIFICATIONS
    ADD ARCHIVED_BY VARCHAR2(100);
```

### Phase 2: Backend API Enhancements

#### Step 2.1: Update Read Status Logic

**New Service Method** (MNotificationService.java):
```java
@Transactional(readOnly = false, rollbackFor = Exception.class)
public ResponseEntity<?> markAsRead(Long id, String userId) {
    try {
        Optional<M_NOTIFICATIONS> notificationOpt = notificationRepo.findById(id);

        if (!notificationOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Notification not found"));
        }

        M_NOTIFICATIONS notification = notificationOpt.get();

        // Handle broadcast notifications differently
        if ("BROADCAST".equals(notification.getToUserId())) {
            // Record per-user read status in separate table
            notificationReadStatusRepo.markAsReadForUser(id, userId);
            logger.info("Broadcast notification {} marked as read for user {}", id, userId);
        } else {
            // Regular notification - update main table
            notificationRepo.markAsRead(id);
            logger.info("Notification {} marked as read", id);
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "id", id,
            "status", "read"
        ));

    } catch (Exception e) {
        logger.error("Error marking notification as read", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("success", false, "message", e.getMessage()));
    }
}
```

#### Step 2.2: New Archive Endpoint
```java
@PatchMapping("/{id}/archive")
@ApiOperation(value = "Archive notification", notes = "Moves notification to archived state")
public ResponseEntity<?> archiveNotification(
    @PathVariable("id") Long id,
    HttpServletRequest request
) {
    String userId = extractUserId(request, null);
    logger.info("PATCH: Archive notification {} for user {}", id, userId);
    return notificationService.archiveNotification(id, userId);
}
```

#### Step 2.3: Enhanced List Query

**Update Repository Query** to join read status:
```java
@Query("""
    SELECT n.*,
           CASE
             WHEN n.TO_USER_ID = 'BROADCAST'
             THEN (SELECT COUNT(*) FROM M_NOTIFICATION_READ_STATUS r
                   WHERE r.NOTIFICATION_ID = n.ID AND r.USER_ID = :userId)
             WHEN n.STATUS = 'read' THEN 1
             ELSE 0
           END as IS_READ
    FROM M_NOTIFICATIONS n
    WHERE n.DISPLAY_STATUS = 'active'
      AND (n.TO_USER_ID = :userId OR n.TO_USER_ID = 'BROADCAST')
    ORDER BY n.CREATED_AT DESC
""")
List<M_NOTIFICATIONS> findActiveNotificationsForUser(@Param("userId") String userId);
```

### Phase 3: Frontend Enhancements

#### Step 3.1: Remove localStorage Tracking

Remove broadcast notification localStorage logic from NotificationDropdown.js.

#### Step 3.2: Update Redux Slice

Add new actions for archival:
```javascript
archiveNotification: (state, action) => {
  const notificationId = action.payload;
  const notification = state.notifications.find((n) => n.id === notificationId);

  if (notification) {
    notification.displayStatus = "archived";
  }
},
```

#### Step 3.3: Add Archive Tab

Update NotificationHistory.js to add "Archive" tab:
```javascript
const tabs = [
  { id: 'all', label: 'Active', count: activeCount },
  { id: 'unread', label: 'Unread', count: unreadCount },
  { id: 'archived', label: 'Archive', count: archivedCount }
];
```

#### Step 3.4: Update Notification Actions

Add "Archive" button alongside "Mark as Read":
```javascript
<Menu.Item
  key="archive"
  icon={<FolderOutlined />}
  onClick={() => handleArchiveNotification(notification.id)}
>
  Archive
</Menu.Item>
```

### Phase 4: Cleanup & Maintenance

#### Step 4.1: Scheduled Archive Job
```java
@Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
public void archiveExpiredNotifications() {
    try {
        logger.info("Starting scheduled archive job");

        // Archive notifications past expiration date
        Date now = new Date();
        int count = notificationRepo.archiveExpiredNotifications(now);

        logger.info("Archived {} expired notifications", count);
    } catch (Exception e) {
        logger.error("Error in scheduled archive job", e);
    }
}
```

#### Step 4.2: Cleanup Old Archives
```java
@Scheduled(cron = "0 0 3 1 * *") // Monthly on 1st at 3 AM
public void cleanupOldArchives() {
    try {
        logger.info("Starting scheduled cleanup job");

        // Delete archived notifications older than 1 year
        Date oneYearAgo = Date.from(
            Instant.now().minus(365, ChronoUnit.DAYS)
        );
        int count = notificationRepo.deleteArchivedBefore(oneYearAgo);

        logger.info("Deleted {} old archived notifications", count);
    } catch (Exception e) {
        logger.error("Error in scheduled cleanup job", e);
    }
}
```

---

## Implementation Recommendations

### Priority 1: Fix Broadcast Notification Tracking
**Impact**: High - Solves immediate user pain point
**Effort**: Medium - Backend + Frontend changes
**Dependencies**: None

**Steps**:
1. Create M_NOTIFICATION_READ_STATUS table
2. Update backend markAsRead to handle broadcast notifications
3. Update frontend to remove localStorage tracking
4. Deploy and test

### Priority 2: Add Archive Functionality
**Impact**: High - Improves historical notification management
**Effort**: Medium - Backend + Frontend + UI changes
**Dependencies**: None

**Steps**:
1. Add DISPLAY_STATUS column to M_NOTIFICATIONS
2. Create archive API endpoints
3. Add Archive tab to frontend
4. Update filtering logic

### Priority 3: Implement Lifecycle Management
**Impact**: Medium - Prevents database bloat
**Effort**: Low - Backend scheduled jobs
**Dependencies**: Priority 2

**Steps**:
1. Create scheduled archive job
2. Create scheduled cleanup job
3. Configure cron expressions
4. Monitor job execution

### Priority 4: UI/UX Improvements
**Impact**: Medium - Reduces user confusion
**Effort**: Low - Frontend only
**Dependencies**: None

**Steps**:
1. Clarify tab labels ("Active" vs "All")
2. Add tooltips explaining tab behavior
3. Add empty state messages
4. Improve notification action buttons

---

## Testing Strategy

### Unit Tests

**Backend**:
- Test markAsRead with broadcast vs direct notifications
- Test read status query for mixed notification types
- Test archive functionality
- Test cleanup job logic

**Frontend**:
- Test notification filtering logic
- Test Redux state updates
- Test tab switching behavior

### Integration Tests

- Test end-to-end mark as read flow
- Test broadcast notification across multiple users
- Test archive and restore flow
- Test cleanup job execution

### Manual Testing Scenarios

1. **Broadcast Notification Read Tracking**:
   - User A marks broadcast notification as read
   - User B should still see it as unread
   - User A logs in from different device - should stay read

2. **Archive Functionality**:
   - User archives a notification from "Active" tab
   - Notification disappears from "Active" tab
   - Notification appears in "Archive" tab
   - Archived notification remains searchable

3. **Mark All As Read**:
   - User clicks "Mark all as read" in "Unread" tab
   - All notifications disappear from "Unread" tab
   - All notifications still visible in "Active" tab
   - Unread count goes to zero

4. **Historical Approval Notifications**:
   - User receives approval notification
   - User marks as read after taking action
   - Notification remains in "Active" tab for audit
   - User can archive it manually if desired

---

## Migration Plan

### Step 1: Database Migration
```sql
-- Run during maintenance window
BEGIN
    -- Create read status table
    EXECUTE IMMEDIATE '
    CREATE TABLE M_NOTIFICATION_READ_STATUS (
        ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        NOTIFICATION_ID NUMBER NOT NULL,
        USER_ID VARCHAR2(100) NOT NULL,
        READ_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        READ_FROM VARCHAR2(50),
        CONSTRAINT FK_NOTI_READ_STATUS
            FOREIGN KEY (NOTIFICATION_ID)
            REFERENCES M_NOTIFICATIONS(ID) ON DELETE CASCADE,
        CONSTRAINT UQ_NOTI_USER_READ
            UNIQUE (NOTIFICATION_ID, USER_ID)
    )';

    -- Create indexes
    EXECUTE IMMEDIATE '
    CREATE INDEX IDX_NOTI_READ_USER
        ON M_NOTIFICATION_READ_STATUS(USER_ID, NOTIFICATION_ID)';

    -- Add lifecycle columns
    EXECUTE IMMEDIATE '
    ALTER TABLE M_NOTIFICATIONS
        ADD (
            DISPLAY_STATUS VARCHAR2(20) DEFAULT ''active'' NOT NULL,
            ARCHIVED_AT TIMESTAMP,
            ARCHIVED_BY VARCHAR2(100)
        )';

    -- Add constraint
    EXECUTE IMMEDIATE '
    ALTER TABLE M_NOTIFICATIONS
        ADD CONSTRAINT CHK_DISPLAY_STATUS
        CHECK (DISPLAY_STATUS IN (''active'', ''archived'', ''expired'', ''dismissed''))';

    -- Create index
    EXECUTE IMMEDIATE '
    CREATE INDEX IDX_NOTI_DISPLAY_STATUS
        ON M_NOTIFICATIONS(DISPLAY_STATUS)';

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('Migration completed successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Migration failed: ' || SQLERRM);
        RAISE;
END;
/
```

### Step 2: Data Backfill
```sql
-- Backfill existing read notifications
-- Assume any notification with STATUS='read' was read by the recipient
INSERT INTO M_NOTIFICATION_READ_STATUS (NOTIFICATION_ID, USER_ID, READ_AT)
SELECT
    ID,
    TO_USER_ID,
    COALESCE(UPDATED_AT, CREATED_AT)
FROM M_NOTIFICATIONS
WHERE STATUS = 'read'
  AND TO_USER_ID != 'BROADCAST'
  AND NOT EXISTS (
      SELECT 1 FROM M_NOTIFICATION_READ_STATUS r
      WHERE r.NOTIFICATION_ID = M_NOTIFICATIONS.ID
        AND r.USER_ID = M_NOTIFICATIONS.TO_USER_ID
  );

COMMIT;
```

### Step 3: Deploy Backend Changes
1. Deploy new API endpoints (backward compatible)
2. Monitor logs for errors
3. Verify read status tracking works

### Step 4: Deploy Frontend Changes
1. Deploy updated frontend with new Archive tab
2. Remove localStorage tracking
3. Test cross-device synchronization

### Step 5: Enable Scheduled Jobs
1. Enable archive job
2. Enable cleanup job
3. Monitor execution logs

---

## Rollback Plan

### If Migration Fails
```sql
-- Drop new tables and indexes
DROP TABLE M_NOTIFICATION_READ_STATUS CASCADE CONSTRAINTS;

-- Remove new columns
ALTER TABLE M_NOTIFICATIONS DROP COLUMN DISPLAY_STATUS;
ALTER TABLE M_NOTIFICATIONS DROP COLUMN ARCHIVED_AT;
ALTER TABLE M_NOTIFICATIONS DROP COLUMN ARCHIVED_BY;

-- Restore from backup if needed
```

### If Backend Deployment Fails
- Revert to previous backend version
- Old frontend will continue to work with old backend
- No data loss

### If Frontend Deployment Fails
- Revert to previous frontend version
- New backend remains backward compatible
- Users see old UI but data remains consistent

---

## Monitoring & Alerting

### Metrics to Track

1. **Notification Count by Status**
   - Active notifications count
   - Archived notifications count
   - Read vs unread ratio

2. **Database Growth**
   - M_NOTIFICATIONS row count over time
   - M_NOTIFICATION_READ_STATUS row count over time
   - Table size in MB

3. **API Performance**
   - Mark as read response time
   - List notifications query time
   - Archive operation latency

4. **Scheduled Job Execution**
   - Archive job success/failure rate
   - Cleanup job execution time
   - Number of records processed per job

### Alerts

- Alert if M_NOTIFICATIONS table exceeds 100,000 rows
- Alert if archive job fails 3 times consecutively
- Alert if mark-as-read API latency exceeds 500ms
- Alert if read status table grows faster than expected

---

## Performance Considerations

### Query Optimization

**Before** (Current):
```sql
SELECT * FROM M_NOTIFICATIONS
WHERE TO_USER_ID = 'user123'
ORDER BY CREATED_AT DESC;
```

**After** (Optimized):
```sql
SELECT n.*,
       COALESCE(r.READ_AT, NULL) as USER_READ_AT
FROM M_NOTIFICATIONS n
LEFT JOIN M_NOTIFICATION_READ_STATUS r
    ON n.ID = r.NOTIFICATION_ID
    AND r.USER_ID = 'user123'
WHERE n.DISPLAY_STATUS = 'active'
  AND (n.TO_USER_ID = 'user123' OR n.TO_USER_ID = 'BROADCAST')
ORDER BY n.CREATED_AT DESC
LIMIT 20;
```

**Index Strategy**:
- Composite index on (DISPLAY_STATUS, TO_USER_ID, CREATED_AT)
- Composite index on (USER_ID, NOTIFICATION_ID) for read status table
- Covering index for frequently accessed columns

### Caching Strategy

**Redis Cache** for unread count:
```
Key: user:{userId}:unread_count
TTL: 5 minutes
Invalidation: On mark-as-read or new notification
```

**Application Cache** for broadcast notifications:
```
Key: broadcast_notifications:active
TTL: 10 minutes
Invalidation: On new broadcast notification
```

---

## Security Considerations

### Row-Level Security

Ensure users can only mark their own notifications as read:
```java
@PreAuthorize("hasPermission(#id, 'Notification', 'read')")
public ResponseEntity<?> markAsRead(Long id, String userId) {
    // Verify notification belongs to user
    M_NOTIFICATIONS notification = notificationRepo.findById(id)
        .orElseThrow(() -> new NotFoundException("Notification not found"));

    if (!notification.getToUserId().equals(userId) &&
        !"BROADCAST".equals(notification.getToUserId())) {
        throw new ForbiddenException("Cannot mark another user's notification as read");
    }

    // Proceed with mark as read
    ...
}
```

### Audit Trail

Log all notification status changes:
```java
@Async
public void logNotificationStatusChange(Long notificationId, String userId, String oldStatus, String newStatus) {
    NOTIFICATION_AUDIT audit = NOTIFICATION_AUDIT.builder()
        .notificationId(notificationId)
        .userId(userId)
        .operation("STATUS_CHANGE")
        .oldValue(oldStatus)
        .newValue(newStatus)
        .timestamp(new Date())
        .build();

    notificationAuditRepo.save(audit);
}
```

---

## Conclusion

### Summary of Issues

1. **Not a bug**: Notifications disappearing from "Unread" tab is correct behavior
2. **Real issue**: Broadcast notifications reappear due to localStorage limitations
3. **Design gap**: No separation between read status and historical retention
4. **Missing feature**: No archive functionality for old notifications

### Recommended Approach

**Immediate Fix** (Priority 1):
- Implement M_NOTIFICATION_READ_STATUS table
- Update backend to track per-user broadcast read status
- Remove localStorage workaround

**Medium-term Enhancement** (Priority 2):
- Add DISPLAY_STATUS column for lifecycle management
- Implement archive functionality
- Add Archive tab to UI

**Long-term Improvement** (Priority 3):
- Scheduled archival and cleanup jobs
- Performance optimization with caching
- Enhanced audit trail and monitoring

### Expected Outcomes

After implementing these changes:
- Broadcast notifications will stay marked as read across sessions and devices
- Users can archive old notifications while keeping them for historical reference
- Approval notifications will remain visible for audit trails
- Database growth will be managed automatically
- User experience will be clearer and more intuitive

---

## Appendix

### A. Current Tab Behavior Matrix

| Tab | Shows | Filter Logic |
|-----|-------|--------------|
| All | All active notifications | No filtering |
| Unread | Only unread notifications | STATUS != 'read' |

### B. Proposed Tab Behavior Matrix

| Tab | Shows | Filter Logic |
|-----|-------|--------------|
| Active | All active notifications | DISPLAY_STATUS = 'active' |
| Unread | Active unread only | DISPLAY_STATUS = 'active' AND STATUS = 'unread' |
| Archive | Archived notifications | DISPLAY_STATUS = 'archived' |

### C. Notification State Transitions

```
[Created] --mark-as-read--> [Read]
    |                           |
    +--archive--> [Archived] <--+
    |                           |
    +--dismiss--> [Dismissed] <-+
    |
    +--expire--> [Expired]
```

### D. API Endpoint Summary

| Endpoint | Method | Purpose | Status Change |
|----------|--------|---------|---------------|
| `/v1/api/notification/:id/read` | PATCH | Mark as read | STATUS = 'read' |
| `/v1/api/notification/read-all` | PATCH | Mark all as read | STATUS = 'read' for all |
| `/v1/api/notification/:id/archive` | PATCH | Archive | DISPLAY_STATUS = 'archived' |
| `/v1/api/notification/:id` | DELETE | Delete | Record deleted |

### E. Database Query Reference

**Get active notifications for user**:
```sql
SELECT n.*,
       CASE
         WHEN n.TO_USER_ID = 'BROADCAST' THEN
           CASE WHEN EXISTS (
             SELECT 1 FROM M_NOTIFICATION_READ_STATUS r
             WHERE r.NOTIFICATION_ID = n.ID
               AND r.USER_ID = :userId
           ) THEN 'read' ELSE 'unread' END
         ELSE n.STATUS
       END as EFFECTIVE_STATUS
FROM M_NOTIFICATIONS n
WHERE n.DISPLAY_STATUS = 'active'
  AND (n.TO_USER_ID = :userId OR n.TO_USER_ID = 'BROADCAST')
ORDER BY n.CREATED_AT DESC;
```

**Get unread count for user**:
```sql
SELECT COUNT(*) FROM M_NOTIFICATIONS n
WHERE n.DISPLAY_STATUS = 'active'
  AND (n.TO_USER_ID = :userId OR n.TO_USER_ID = 'BROADCAST')
  AND CASE
        WHEN n.TO_USER_ID = 'BROADCAST' THEN
          NOT EXISTS (
            SELECT 1 FROM M_NOTIFICATION_READ_STATUS r
            WHERE r.NOTIFICATION_ID = n.ID
              AND r.USER_ID = :userId
          )
        ELSE n.STATUS = 'unread'
      END;
```

---

## Notification System Improvements Implementation

**Implementation Date**: 2026-02-12
**Implementation Type**: UI/UX Improvements + Database-Backed Broadcast Read Status

### Problem Statement

The notification system had several critical usability and persistence issues:

#### UI/UX Issues

1. **Weak Visual Distinction**: Read vs unread notifications differed only by #f0f7ff (light blue) vs #ffffff (white), a barely perceptible 6% color difference
2. **Counterintuitive Tab Order**: Dropdown defaulted to "All" tab (left), forcing users to click to see unread notifications when that's their primary intent
3. **Confusing Default Behavior**: Dropdown opened showing all notifications instead of unread ones

#### Data Persistence Issues (Critical)

**Broadcast Notification Reappearing Problem**:
- **Root Cause**: Backend prevented marking broadcasts as read (would affect all users globally)
- **Temporary Workaround**: Frontend used localStorage to track per-user read status
- **Limitations**:
  - Browser/device-specific (no cross-device sync)
  - Cleared when user clears browser data or logs out
  - Not accessible to backend
  - Broadcasts reappeared after login or on different devices

### Solution Implementation

#### Part A: UI/UX Improvements (Frontend-only)

**1. Enhanced Visual Distinction**
- **Read notifications**: Light gray background (#f5f5f5) with 70% opacity (recessed appearance)
- **Unread notifications**: White background (#ffffff) with 100% opacity (prominent appearance)
- Added smooth opacity transition (0.2s ease-in-out)

**2. Improved Tab Order**
- **Dropdown**: Unread tab first (left), All tab second (right)
- **History page**: Remains on All tab (audit trail context)

**3. Better Default Behavior**
- **Dropdown**: Opens to Unread tab (primary user intent)
- **History page**: Stays on All tab (full context preservation)

#### Part B: Broadcast Read Status Persistence (Full-stack)

**1. Database Schema** (`M_NOTIFICATION_READ_STATUS`)
```sql
CREATE TABLE M_NOTIFICATION_READ_STATUS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NOTIFICATION_ID NUMBER NOT NULL,
    USER_ID VARCHAR2(100) NOT NULL,
    READ_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    READ_FROM VARCHAR2(50),
    CONSTRAINT FK_NOTI_READ_STATUS
        FOREIGN KEY (NOTIFICATION_ID)
        REFERENCES M_NOTIFICATIONS(ID) ON DELETE CASCADE,
    CONSTRAINT UQ_NOTI_USER_READ
        UNIQUE (NOTIFICATION_ID, USER_ID)
);
```

**2. Backend Changes**
- **New Entity**: `MNotificationReadStatus.java`
- **New Repository**: `MNotificationReadStatusRepo.java`
- **Updated Service**: `MNotificationService.markAsRead()` now handles broadcasts differently:
  - Broadcast notifications: Create entry in `M_NOTIFICATION_READ_STATUS`
  - Direct notifications: Update `STATUS` field in `M_NOTIFICATIONS`
- **Updated Queries**: Count and fetch queries now check `M_NOTIFICATION_READ_STATUS` for broadcast read status

**3. Frontend Changes**
- **Removed**: All localStorage code (BROADCAST_READ_KEY_PREFIX, getReadBroadcastIds, markBroadcastsAsRead)
- **Removed**: `readBroadcastIds` state variable and localStorage sync useEffect
- **Simplified**: `isNotificationRead()` function - now just checks backend status

### Files Modified

#### Frontend (pgn-crm-fe-Milestone-1)
- `/src/components/Notifications/NotificationDropdown.js`
  - Line 61: Changed default tab to 'unread'
  - Lines 137-138: Reordered tabs (Unread first)
  - Line 712: Updated inline styles (swapped colors, added opacity)
  - Lines 43-96: Removed localStorage functions and state
  - Lines 119-126: Simplified isNotificationRead function
  - Lines 364-366: Removed localStorage persistence in handleNotificationClick
  - Lines 489-495, 508-511: Removed localStorage persistence in handleMarkAllAsRead

- `/src/app/pages/Notifications/Notifications.css`
  - Lines 78-84: Updated CSS classes (swapped colors, added opacity and transition)

#### Backend (Energy-Notifications)
- `/src/main/resources/db/migration/V1_0_1__create_notification_read_status.sql` (NEW)
  - Database migration script

- `/src/main/java/com/nxs/module/notification/entity/MNotificationReadStatus.java` (NEW)
  - Entity class for read status table

- `/src/main/java/com/nxs/module/notification/repository/MNotificationReadStatusRepo.java` (NEW)
  - Repository interface with MERGE-based upsert

- `/src/main/java/com/nxs/module/notification/service/MNotificationService.java`
  - Added `@Autowired MNotificationReadStatusRepo readStatusRepo`
  - Updated `markAsRead(Long id, String userId)` method signature and logic
  - Updated batch operations to handle broadcasts

- `/src/main/java/com/nxs/module/notification/controller/MNotificationController.java`
  - Updated `markAsRead()` to extract and pass userId to service

- `/src/main/java/com/nxs/module/notification/repository/MNotificationRepo.java`
  - Updated `countUnreadByUserId()` to check read_status table for broadcasts
  - Updated `countUnreadByUserIdAndPositionId()` to check read_status table
  - Added `findUnreadByUserIdWithBroadcastStatus()` method
  - Added `findUnreadByUserIdAndPositionIdWithBroadcastStatus()` method

### Testing Checklist

#### UI/UX Visual Verification
- [x] Read notifications appear in light gray (#f5f5f5) with 70% opacity
- [x] Unread notifications appear in white (#ffffff) with 100% opacity
- [x] Opacity transition is smooth (0.2s ease)
- [x] Dropdown opens showing Unread tab by default
- [x] Tab order is Unread (left), All (right)

#### Broadcast Read Status Verification
- [ ] Database table M_NOTIFICATION_READ_STATUS created successfully
- [ ] Foreign key and unique constraints work correctly
- [ ] Mark broadcast as read creates entry in read_status table
- [ ] Broadcast STATUS in M_NOTIFICATIONS remains 'unread' (doesn't affect other users)
- [ ] Unread count correctly excludes broadcasts marked as read by specific user
- [ ] Log out and log back in - broadcast stays marked as read
- [ ] Switch devices/browsers - broadcast read status persists
- [ ] Clear browser data - broadcast read status still persists (database-backed)
- [ ] Two different users can mark same broadcast independently

### Rollback Procedure

#### Part A: UI/UX (Low Risk)
```javascript
// NotificationDropdown.js
const [activeTab, setActiveTab] = useState('all'); // Change back to 'all'

const tabs = [
  { id: 'all', label: 'All', count: allCount, badgeVariant: 'filled' },
  { id: 'unread', label: 'Unread', count: unreadCountForTab, badgeVariant: 'soft' }
]; // Restore original order

// Line 712 style:
backgroundColor: isNotificationRead(notification) ? "#ffffff" : "#f0f7ff",
// Remove opacity line
```

```css
/* Notifications.css */
li.ant-list-item.notification-item.notification-read {
  background-color: #ffffff !important;
}
li.ant-list-item.notification-item.notification-unread {
  background-color: #f0f7ff !important;
}
```

#### Part B: Broadcast Read Status (Moderate Risk)

**If database migration fails**:
```sql
DROP TABLE M_NOTIFICATION_READ_STATUS CASCADE CONSTRAINTS;
```

**If runtime errors occur**:
1. Revert backend service changes (restore old markAsRead logic)
2. Revert repository query changes
3. Restore frontend localStorage code
4. Keep database table (preserve data for future retry)

### Implementation Notes

**Why MERGE instead of INSERT**:
- Oracle doesn't support PostgreSQL's `ON CONFLICT DO NOTHING`
- MERGE prevents duplicate key errors when user marks broadcast as read multiple times
- Idempotent operation ensures consistent behavior

**Why Not Update M_NOTIFICATIONS.STATUS for Broadcasts**:
- Broadcast notifications have `TO_USER_ID='BROADCAST'` (shared record)
- Updating STATUS would mark as read for ALL users globally
- Per-user read tracking requires separate table

**Storage Impact**:
- Average broadcast read by 1000 users = 1000 rows (~100KB)
- 100 broadcasts × 1000 users = 10MB total (minimal impact)

**Performance Considerations**:
- Queries use `NOT EXISTS` subquery for broadcast read check
- Indexes on (USER_ID, NOTIFICATION_ID) optimize lookup
- Expected overhead: <50ms per query (acceptable)

### Architecture Decision

**Rejected Alternatives**:
1. **Keep localStorage**: No persistence, no cross-device sync
2. **Mark broadcast as read for everyone**: Wrong semantics
3. **Duplicate broadcast per user**: Storage explosion
4. **Redis cache**: Needs persistence, adds complexity

**Selected Solution**: Database-backed per-user read status
- Persistent across sessions and devices
- Correct semantics (per-user tracking)
- Minimal storage overhead
- Leverages existing database infrastructure

---

## Notification Click Behavior Fix (Critical)

**Fix Date**: 2026-02-12
**Severity**: Critical - Read status was not persisting to database

### Issue Summary

When users clicked notifications in dropdown or history page, the **read status was only updated locally** (Redux state) and **did not persist to the database**. This caused:
- Notifications reappearing as unread after page refresh
- Broadcast notifications not being recorded in `M_NOTIFICATION_READ_STATUS` table
- Read status not syncing across devices

### Root Cause

Both `NotificationDropdown.js` and `NotificationHistory.js` used the synchronous `markAsRead()` action instead of the async thunk `markNotificationAsReadApi()`:

```javascript
// BROKEN:
dispatch(markAsRead(notificationId)); // ❌ Local state only, no API call

// FIXED:
dispatch(markNotificationAsReadApi(notificationId)); // ✅ API call + persistence
```

### Files Requiring Changes

1. **NotificationDropdown.js:379** - Replace `markAsRead` with `markNotificationAsReadApi`
2. **NotificationHistory.js:399** - Replace `markAsRead` with `markNotificationAsReadApi`

### Expected Behavior After Fix

1. User clicks notification → API call to `PATCH /v1/api/notification/:id/read`
2. Backend updates database:
   - **Broadcast**: Creates entry in `M_NOTIFICATION_READ_STATUS` (per-user)
   - **Direct**: Updates `STATUS='read'` in `M_NOTIFICATIONS`
3. Redux state updates locally
4. Read status persists across sessions and devices
5. Broadcast notifications stay marked as read after logout/login

### See Also

Detailed implementation plan and testing checklist: `/docs/NOTIFICATION_CLICK_BEHAVIOR_FIX.md`

---

**Document Version**: 1.2
**Last Updated**: 2026-02-12
**Review Schedule**: Quarterly or after major system changes
