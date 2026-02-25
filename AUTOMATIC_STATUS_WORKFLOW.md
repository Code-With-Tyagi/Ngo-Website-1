# Automatic Contact Status Update Workflow

## 🎯 AUTOMATIC STATUS FLOW

Instead of admin manually selecting status, the system automatically updates it:

```
Step 1: User Submits Form
        ↓
STATUS: "New" ✅ (Automatic)
        ↓
        
Step 2: Admin Views Contact
        ↓
STATUS: "Viewed" ✅ (Automatic - when modal opens)
        ↓
        
Step 3: Admin Clicks "Send Reply"
        ↓
STATUS: "Resolved" ✅ (Automatic - when reply sent)
        ↓
        
Step 4: After 7 Days of No Action
        ↓
STATUS: "Closed" ✅ (Automatic - scheduled job)
```

---

## 📋 DETAILED AUTOMATIC STATUS WORKFLOW

### **Event 1: Contact Form Submitted**
```
TRIGGER: POST /api/contact (user submits)

WHAT HAPPENS:
├─ Status set to: "New" (automatically)
├─ createdAt: timestamp
├─ viewedAt: null
├─ repliedAt: null
└─ Email sent to user: "We got your message"

DATABASE STATE:
{
  _id: "123",
  name: "John",
  email: "john@ex.com",
  subject: "Donation Query",
  message: "...",
  status: "New",              ← Automatic
  viewed: false,
  viewedAt: null,
  adminReply: null,
  repliedAt: null,
  createdAt: "2024-02-24T10:00:00Z"
}
```

---

### **Event 2: Admin Clicks "View" (Opens Modal)**
```
TRIGGER: GET /api/contact/:id (admin opens detail modal)

WHAT HAPPENS:
├─ Status changes to: "Viewed" (only if status was "New")
├─ viewedAt: timestamp
├─ viewedBy: admin's name
└─ Admin sees full message with reply box

DATABASE STATE BEFORE:
{
  status: "New",
  viewed: false,
  viewedAt: null
}

DATABASE STATE AFTER:
{
  status: "Viewed",           ← Automatic
  viewed: true,               ← Automatic
  viewedAt: "2024-02-24T10:30:00Z",  ← Automatic
  viewedBy: "Admin Name"      ← Automatic
}

TIMELINE:
New Status    [Created] → [Viewed after 30 mins]
```

---

### **Event 3: Admin Types & Sends Reply**
```
TRIGGER: POST /api/contact/:id/reply (admin submits reply)

WHAT HAPPENS:
├─ Status changes to: "Replied" (automatically)
├─ adminReply: saves message
├─ repliedAt: timestamp
├─ repliedBy: admin's name
└─ Email sent to user: "Re: Your Message - [Reply]"

DATABASE STATE BEFORE:
{
  status: "Viewed",
  adminReply: null,
  repliedAt: null,
  repliedBy: null
}

DATABASE STATE AFTER:
{
  status: "Replied",          ← Automatic
  adminReply: "Thank you...",
  repliedAt: "2024-02-24T11:00:00Z",  ← Automatic
  repliedBy: "Admin Name",    ← Automatic
  lastModifiedAt: "2024-02-24T11:00:00Z"
}

TIMELINE:
New → Viewed (30 mins) → Replied (1 hour after creation)
```

---

### **Event 4: Auto-Close After 7 Days (Optional)**
```
TRIGGER: Scheduled Job (runs daily at 2 AM)

WHAT HAPPENS:
├─ Find all contacts where:
│  ├─ Status = "New" (never viewed)
│  ├─ createdAt < 7 days ago
│  └─ Email reminder sent? No
├─ For each old contact:
│  ├─ Send reminder email to admin
│  └─ Status stays "New" (waiting for response)
├─ If Status = "Viewed" for 7 days:
│  ├─ Status changes to: "Pending Response"
│  └─ Send reminder: "You started replying 7 days ago"
├─ If Status = "New" for 30 days:
│  ├─ Status changes to: "Closed"
│  └─ Send email to user: "We're closing this due to inactivity"

EXAMPLE:
Contact Created: Feb 24
├─ Feb 24: Status = "New" (just created)
├─ Feb 28: Reminder email sent to admin (still "New")
├─ Mar 3: Status auto-changes to "Closed" (30 days passed)
└─ Mar 3: Email sent to user: "Inquiry closed due to inactivity"
```

---

## 🔄 COMPLETE STATUS LIFECYCLE

```
┌─────────────────────────────────────────────────────────┐
│                CONTACT LIFECYCLE                         │
└─────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   "New"     │ ← User submits form
                    └──────┬──────┘
                           │ (Admin views detail)
                           ↓
                    ┌─────────────┐
                    │  "Viewed"   │ ← Auto-updated
                    └──────┬──────┘
                           │ (Admin sends reply)
                           ↓
                    ┌─────────────┐
                    │  "Replied"  │ ← Auto-updated
                    └──────┬──────┘
                           │ (User receives reply)
                           ↓
                    ┌─────────────┐
                    │  "Resolved" │ ← Can be manually marked
                    └─────────────┘

ALTERNATE PATHS:
────────────────
"New" → (7 days) → "Closed" (auto-close)
"New" → "Spam" (admin manually marks)
"Viewed" → (admin forgets) → "Pending Response" (after 7 days)
```

---

## 📊 STATUS ENUM VALUES

```javascript
enum Status {
  "New",                 // Just submitted, not viewed yet
  "Viewed",              // Admin opened the detail view
  "In Progress",         // Admin manually marks as working on it
  "Replied",             // Admin sent a reply
  "Resolved",            // Marked as complete
  "Spam",                // Admin marked as spam
  "Closed",              // Auto-closed after 30 days
  "Pending Response"     // Viewed but admin hasn't replied for 7 days
}
```

---

## 🛠️ BACKEND IMPLEMENTATION

### **Step 1: Update Contact Model**

```javascript
// models/contact.model.js

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  privacyAccepted: Boolean,
  
  // AUTOMATIC STATUS FIELDS
  status: {
    type: String,
    enum: ['New', 'Viewed', 'In Progress', 'Replied', 'Resolved', 'Spam', 'Closed', 'Pending Response'],
    default: 'New'
  },
  
  // Track when each action happened
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewedAt: {
    type: Date,
    default: null
  },
  viewedBy: {
    type: String,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  },
  repliedBy: {
    type: String,
    default: null
  },
  adminReply: {
    type: String,
    default: null
  },
  lastModifiedAt: {
    type: Date,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  reminderSentAt: {
    type: Date,
    default: null
  }
});
```

---

### **Step 2: API Endpoints with Auto-Status**

#### **A. When User Submits Contact (No changes needed)**
```javascript
// POST /api/contact
// Status automatically set to "New"

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      privacyAccepted: req.body.privacyAccepted,
      status: "New"  // ← Automatic
    });
    
    // Send confirmation email...
    
    return res.status(201).json({
      success: true,
      message: "Message saved. Status: New"
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
```

---

#### **B. When Admin Views Contact Details**
```javascript
// GET /api/contact/:id
// Status automatically changes to "Viewed"

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminName = req.user?.name || "Admin";
    
    // Find contact before update
    const contact = await Contact.findById(id);
    
    // AUTO-UPDATE: If status is "New", change to "Viewed"
    if (contact.status === "New") {
      contact.status = "Viewed";           // ← Automatic
      contact.viewedAt = new Date();       // ← Automatic
      contact.viewedBy = adminName;        // ← Automatic
      contact.lastModifiedAt = new Date();
      await contact.save();
    }
    
    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
```

---

#### **C. When Admin Sends Reply**
```javascript
// POST /api/contact/:id/reply
// Status automatically changes to "Replied"

export const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const adminName = req.user?.name || "Admin";
    const adminEmail = req.user?.email;
    
    const contact = await Contact.findById(id);
    
    // AUTO-UPDATE: Save reply and change status to "Replied"
    contact.adminReply = reply;
    contact.status = "Replied";              // ← Automatic
    contact.repliedAt = new Date();          // ← Automatic
    contact.repliedBy = adminName;           // ← Automatic
    contact.lastModifiedAt = new Date();
    await contact.save();
    
    // Send reply email to user
    await sendAdminReplyEmail({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      reply: reply
    });
    
    return res.status(200).json({
      success: true,
      message: "Reply sent. Contact status: Replied",
      contact: {
        id: contact._id,
        status: contact.status,  // "Replied"
        repliedAt: contact.repliedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
```

---

### **Step 3: Scheduled Job for Auto-Close**

```javascript
// services/contactAutoClose.js
import Contact from "../models/contact.model.js";
import { sendAutoCloseEmail } from "./mail.service.js";

const DAYS_BEFORE_CLOSE = 30;
const DAYS_REMINDER = 7;

export const runContactAutoCloseJob = async () => {
  try {
    console.log("Running contact auto-close job...");
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - DAYS_BEFORE_CLOSE * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - DAYS_REMINDER * 24 * 60 * 60 * 1000);
    
    // 1. AUTO-CLOSE old contacts that were never replied to
    const closeResult = await Contact.updateMany(
      {
        status: "New",
        createdAt: { $lt: thirtyDaysAgo },
        adminReply: null
      },
      {
        status: "Closed",              // ← Automatic
        closedAt: now,
        lastModifiedAt: now
      }
    );
    
    console.log(`Auto-closed ${closeResult.modifiedCount} old contacts`);
    
    // 2. Send reminder for contacts viewed but not replied for 7 days
    const remindResult = await Contact.updateMany(
      {
        status: "Viewed",
        viewedAt: { $lt: sevenDaysAgo },
        adminReply: null,
        reminderSentAt: null
      },
      {
        status: "Pending Response",   // ← Automatic
        reminderSentAt: now,
        lastModifiedAt: now
      }
    );
    
    console.log(`Updated ${remindResult.modifiedCount} pending contacts`);
    
    // 3. Send emails to users for closed contacts
    const closedContacts = await Contact.find({
      status: "Closed",
      closedAt: { $gte: new Date(now.getTime() - 1 * 60 * 1000) } // Closed in last minute
    });
    
    for (const contact of closedContacts) {
      await sendAutoCloseEmail({
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      });
    }
    
    console.log(`Auto-close job completed successfully`);
  } catch (error) {
    console.error("Auto-close job error:", error);
  }
};
```

---

### **Step 4: Schedule Job to Run Daily**

```javascript
// server.js or scheduleJobs.js

import cron from "node-cron";
import { runContactAutoCloseJob } from "./services/contactAutoClose.js";

// Run every day at 2 AM
cron.schedule("0 2 * * *", () => {
  console.log("Executing scheduled contact auto-close job");
  runContactAutoCloseJob();
});

console.log("Contact auto-close job scheduled for 2:00 AM daily");
```

---

## 📊 COMPARISON: MANUAL vs AUTOMATIC

### **MANUAL (Current)**
```
Admin must remember to:
❌ Click dropdown to change status
❌ Save manually
❌ Easy to forget
❌ Inconsistent tracking
❌ Unprofessional
```

### **AUTOMATIC (Recommended)**
```
System automatically:
✅ Changes status on every action
✅ Tracks timestamps
✅ Sends reminders
✅ Auto-closes old tickets
✅ Professional & consistent
✅ Zero admin effort
```

---

## 🎯 IMPLEMENTATION ORDER

### **Phase 1: Implement Auto-Status (2 hours)**
- [ ] Update Contact Model with new fields
- [ ] Update getContactById to auto-mark "Viewed"
- [ ] Update replyToContact to auto-mark "Replied"
- [ ] Test manually: Submit → View → Reply

### **Phase 2: Add Auto-Close Job (1 hour)**
- [ ] Create contactAutoClose.js service
- [ ] Add cron job to server.js
- [ ] Test in development

### **Phase 3: Admin UI Updates (1 hour)**
- [ ] Show status badge (auto-updated)
- [ ] Hide manual status dropdown
- [ ] Show timeline: New → Viewed → Replied
- [ ] Show "Automatically closed after 30 days" message

---

## 📧 AUTO-GENERATED EMAILS

### **Email 1: When Contact Created**
```
Subject: We Received Your Message ✅

Status: New (Just created)
```

### **Email 2: When Admin Views (Optional)**
```
Subject: Your Message Has Been Received

Status: Viewed (Admin is working on it)
```

### **Email 3: When Admin Replies**
```
Subject: Re: [Original Subject]

Status: Replied (Admin's response sent)

[Admin's reply message here]
```

### **Email 4: When Auto-Closed (30 days passed)**
```
Subject: Your Inquiry Has Been Closed

Status: Closed (Due to inactivity)

Your message from 30 days ago has been automatically
closed due to lack of response. If you still need help,
please submit a new inquiry.
```

---

## 🔍 ADMIN VIEW - STATUS UPDATES

### **Contact List Table**
```
Name      Email           Subject      Status          Days Ago
────────────────────────────────────────────────────────────────
John Doe  john@ex.com     Donation     🔴 New          0 (today)
Jane      jane@ex.com     Volunteer    🟡 Viewed       1 (yesterday)
Bob       bob@ex.com      Support      🟢 Replied      2 (automatic)
```

### **Contact Detail View**
```
┌──────────────────────────────────────────────────────┐
│ Contact: John Doe                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Status Timeline:                                     │
│ ├─ 🔴 New           (Created: Feb 24 at 10:00 AM)  │
│ ├─ 🟡 Viewed        (Viewed: Feb 24 at 10:30 AM)   │
│ └─ 🟢 Replied       (Replied: Feb 24 at 11:00 AM)  │
│                                                      │
│ Message: [Original message...]                      │
│                                                      │
│ Your Reply:                                          │
│ ┌──────────────────────────────────────────────┐    │
│ │ [Quick Templates ▼]                          │    │
│ │ [Text area - type your reply]                │    │
│ └──────────────────────────────────────────────┘    │
│                                                      │
│                [Send Reply] (Status auto→Replied)   │
└──────────────────────────────────────────────────────┘
```

---

## ✅ BENEFITS OF AUTOMATIC STATUS

1. **No Manual Work** - Admin just views and replies
2. **Always Accurate** - Can't forget to update
3. **Professional** - Users see their inquiry is being handled
4. **Trackable** - Know exactly when each action happened
5. **Automatic Cleanup** - Old tickets auto-close
6. **Reminders** - Admin gets notified of old tickets
7. **Easy Reporting** - See how long each inquiry took to respond

---

## 🚀 READY TO BUILD?

This automatic workflow means:

```
User Experience:
✅ Sees message received confirmation
✅ Knows admin viewed their message
✅ Gets reply from admin
✅ Automatic follow-up if no reply after 30 days

Admin Experience:
✅ Just clicks "View" - status auto-updates to "Viewed"
✅ Just clicks "Send Reply" - status auto-updates to "Replied"
✅ No manual status changes needed
✅ Old tickets auto-close

System Experience:
✅ Completely automated
✅ Professional tracking
✅ Easy to report on
✅ Scalable to 1000s of contacts
```

**Want me to implement this automatic workflow for you?** 🚀
