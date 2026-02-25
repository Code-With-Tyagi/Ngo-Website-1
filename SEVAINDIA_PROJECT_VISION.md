# 🌟 SEVAINDIA - Complete Project Vision & Implementation Plan

## Single NGO Website - Professional Implementation Guide

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Vision & Mission](#2-vision--mission)
3. [Target Audience](#3-target-audience)
4. [Website Structure](#4-website-structure)
5. [User Roles & Access](#5-user-roles--access)
6. [Feature Breakdown](#6-feature-breakdown)
7. [Technical Architecture](#7-technical-architecture)
8. [Implementation Phases](#8-implementation-phases)
9. [Database Schema](#9-database-schema)
10. [API Endpoints](#10-api-endpoints)
11. [Security & Compliance](#11-security--compliance)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. PROJECT OVERVIEW

### What is SevaIndia?

SevaIndia is a **professional NGO website** for a single charitable organization that provides various social services to communities in need. The website serves as:

- **Public face** of the NGO for awareness
- **Donation platform** for accepting contributions
- **Volunteer management system** for coordinating helpers
- **Admin dashboard** for managing operations

### Project Type: Single NGO Website

```
┌─────────────────────────────────────────────────────────────┐
│                      SEVAINDIA NGO                          │
│           "Serving Communities, Changing Lives"             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🏠 Home    📋 Services    🤝 Volunteer    💰 Donate       │
│                                                             │
│   This website represents ONE NGO organization              │
│   NOT a platform for multiple NGOs                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. VISION & MISSION

### 🎯 Vision Statement

> "To create a transparent, accessible, and impactful digital presence that connects generous hearts with those in need, making every contribution count towards building a better society."

### 🎯 Mission Statement

> "SevaIndia is committed to providing essential services to underprivileged communities including education for orphans, care for elderly, healthcare access, women empowerment, and community development through a network of dedicated volunteers and generous donors."

### Core Values

| Value | Description |
|-------|-------------|
| **Transparency** | Every donation is tracked and reported |
| **Accountability** | Regular updates on how funds are used |
| **Compassion** | Serving with love and dignity |
| **Community** | Building connections that last |
| **Impact** | Measurable change in lives |

---

## 3. TARGET AUDIENCE

### 3.1 Website Visitors (General Public)

**Who they are:**
- People learning about the NGO
- Potential donors exploring options
- Media/journalists seeking information
- Partner organizations

**What they need:**
- Clear information about NGO's work
- Trust signals (certificates, achievements)
- Easy navigation
- Contact information

---

### 3.2 Donors

**Who they are:**
- Individual philanthropists
- Corporate CSR teams
- NRI donors
- Regular monthly contributors

**What they need:**
- Multiple payment options
- Tax receipt (80G certificate)
- Transparency on fund usage
- Regular impact updates
- Donor recognition

---

### 3.3 Volunteers

**Who they are:**
- College students
- Working professionals (weekends)
- Retired individuals
- Skill-based volunteers (doctors, teachers)

**What they need:**
- Easy registration process
- Clear volunteer opportunities
- Flexible time commitments
- Certificate of volunteering
- Community connection

---

### 3.4 Admin (NGO Staff)

**Who they are:**
- NGO founder/director
- Operations manager
- Finance coordinator
- Volunteer coordinator

**What they need:**
- Dashboard for overview
- Donation management
- Volunteer management
- Content management
- Report generation

---

## 4. WEBSITE STRUCTURE

### 4.1 Site Map

```
SEVAINDIA WEBSITE
│
├── 🏠 HOME
│   ├── Hero Section (Mission statement)
│   ├── Impact Numbers (Lives touched)
│   ├── Our Services (Quick overview)
│   ├── Success Stories
│   ├── Call to Action (Donate/Volunteer)
│   └── Latest Updates
│
├── 📋 SERVICES
│   ├── Overview of all services
│   ├── Orphanage Support
│   │   ├── Education Program
│   │   ├── Meal Program
│   │   └── Healthcare
│   ├── Elderly Care
│   │   ├── Old Age Home Support
│   │   ├── Medical Assistance
│   │   └── Meal Distribution
│   ├── Women Empowerment
│   │   ├── Skill Training
│   │   ├── Widow Support
│   │   └── Kanyadan Yojana
│   ├── Healthcare
│   │   ├── Free Medical Camps
│   │   ├── Cancer Support
│   │   └── Kidney Support
│   ├── Community Development
│   │   ├── Road Safety Drives
│   │   └── Infrastructure
│   └── Each service page has:
│       ├── Description
│       ├── Impact stats
│       ├── Photos/Gallery
│       └── Donate to this cause
│
├── 💰 DONATE
│   ├── One-time Donation
│   ├── Monthly Donation
│   ├── Donate to Specific Cause
│   ├── Corporate Donations
│   ├── Payment Options
│   │   ├── UPI
│   │   ├── Card
│   │   ├── Net Banking
│   │   └── Bank Transfer
│   └── 80G Tax Benefits Info
│
├── 🤝 VOLUNTEER
│   ├── Why Volunteer?
│   ├── Current Opportunities
│   ├── Volunteer Registration Form
│   ├── Skills Needed
│   ├── Time Commitment Options
│   └── Volunteer Stories
│
├── 📰 ABOUT US
│   ├── Our Story
│   ├── Team/Leadership
│   ├── Achievements
│   ├── Certifications (80G, 12A)
│   ├── Annual Reports
│   └── Media Coverage
│
├── 📸 GALLERY
│   ├── Event Photos
│   ├── Impact Stories
│   └── Videos
│
├── 📞 CONTACT US
│   ├── Contact Form
│   ├── Office Address
│   ├── Phone/WhatsApp
│   ├── Email
│   └── Map
│
├── 👤 USER ACCOUNT (Logged In)
│   ├── My Profile
│   ├── My Donations (History)
│   ├── My Volunteer Activities
│   └── Tax Receipts
│
└── 🔐 ADMIN PANEL
    ├── Dashboard
    ├── Manage Donations
    ├── Manage Volunteers
    ├── Manage Content
    ├── Contact Messages
    ├── Reports
    └── Settings
```

---

### 4.2 Page-by-Page Breakdown

#### HOME PAGE

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR: Logo | Services | Donate | Volunteer | Contact     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          HERO SECTION (Full Width Banner)           │   │
│  │                                                     │   │
│  │     "Serving Communities, Changing Lives"           │   │
│  │                                                     │   │
│  │  We've touched 50,000+ lives across 15 districts    │   │
│  │                                                     │   │
│  │     [Donate Now]          [Join as Volunteer]       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──── IMPACT NUMBERS (Animated Counters) ────┐            │
│  │  50,000+    │  1,200+     │  15+     │  ₹2Cr+    │      │
│  │  Lives      │  Volunteers │ Districts│ Raised    │      │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  ┌──── OUR SERVICES (Card Grid) ────┐                      │
│  │ [Orphan Care] [Elder Care] [Healthcare] [Women]  │      │
│  └──────────────────────────────────┘                       │
│                                                             │
│  ┌──── SUCCESS STORIES (Carousel) ────┐                    │
│  │ "Ravi was an orphan, now he's an engineer..."     │      │
│  └────────────────────────────────────────────────┘         │
│                                                             │
│  ┌──── LATEST UPDATES/NEWS ────┐                           │
│  │ • Medical camp conducted on 20 Feb                │      │
│  │ • 500 meals distributed in flood area             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  ┌──── CALL TO ACTION BANNER ────┐                         │
│  │  "Every ₹100 feeds a child for a week"            │      │
│  │           [Donate Now]                             │      │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  FOOTER: Quick Links | Contact | Social Media | Legal      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. USER ROLES & ACCESS

### 5.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ROLES HIERARCHY                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      ┌──────────┐                           │
│                      │  ADMIN   │                           │
│                      │(Founder) │                           │
│                      └────┬─────┘                           │
│                           │                                 │
│              ┌────────────┼────────────┐                    │
│              ▼            ▼            ▼                    │
│        ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│        │ STAFF    │ │ STAFF    │ │ STAFF    │              │
│        │(Finance) │ │(Volunteer│ │(Content) │              │
│        │          │ │ Coord)   │ │          │              │
│        └──────────┘ └──────────┘ └──────────┘              │
│                                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                             │
│        ┌──────────┐           ┌──────────┐                  │
│        │  DONOR   │           │VOLUNTEER │                  │
│        │ (User)   │           │ (User)   │                  │
│        └──────────┘           └──────────┘                  │
│                                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                             │
│                      ┌──────────┐                           │
│                      │ VISITOR  │                           │
│                      │(Not logged│                          │
│                      │   in)    │                           │
│                      └──────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Access Matrix

| Feature | Visitor | Donor | Volunteer | Admin |
|---------|:-------:|:-----:|:---------:|:-----:|
| View Home/Services | ✅ | ✅ | ✅ | ✅ |
| View Gallery | ✅ | ✅ | ✅ | ✅ |
| Contact Form | ✅ | ✅ | ✅ | ✅ |
| Make Donation | ✅ | ✅ | ✅ | ✅ |
| Create Account | ✅ | ✅ | ✅ | - |
| View Donation History | ❌ | ✅ | ✅ | ✅ |
| Download Tax Receipt | ❌ | ✅ | ✅ | ✅ |
| Apply as Volunteer | ❌ | ✅ | ✅ | - |
| View Volunteer Tasks | ❌ | ❌ | ✅ | ✅ |
| Log Volunteer Hours | ❌ | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ❌ | ✅ |
| Manage Donations | ❌ | ❌ | ❌ | ✅ |
| Approve Volunteers | ❌ | ❌ | ❌ | ✅ |
| Edit Website Content | ❌ | ❌ | ❌ | ✅ |
| View Reports | ❌ | ❌ | ❌ | ✅ |

---

## 6. FEATURE BREAKDOWN

### 6.1 PUBLIC FEATURES (No Login Required)

#### A. Home Page Features
- [ ] Animated hero banner with mission
- [ ] Real-time impact counter
- [ ] Service cards with hover effects
- [ ] Success stories carousel
- [ ] Latest news/updates section
- [ ] Quick donate button
- [ ] Newsletter subscription

#### B. Services Pages
- [ ] Detailed service descriptions
- [ ] Photo galleries per service
- [ ] Impact statistics per service
- [ ] "Donate to this cause" button
- [ ] Volunteer for this service option
- [ ] Beneficiary stories

#### C. Donation Page
- [ ] Multiple amount options (₹500, ₹1000, ₹5000, Custom)
- [ ] Cause selection dropdown
- [ ] One-time vs Monthly toggle
- [ ] Guest donation (without account)
- [ ] Multiple payment methods
- [ ] 80G information display
- [ ] SSL secure payment badge

#### D. Volunteer Page
- [ ] Why volunteer section
- [ ] Current opportunities list
- [ ] Skill requirements
- [ ] Time commitment options
- [ ] Registration form
- [ ] Volunteer FAQs

#### E. About Us
- [ ] NGO story timeline
- [ ] Team profiles
- [ ] Certificates display (80G, 12A, FCRA)
- [ ] Annual reports download
- [ ] Awards and recognition
- [ ] Media coverage

#### F. Contact Page
- [ ] Contact form
- [ ] Office location map
- [ ] Multiple contact methods
- [ ] Working hours
- [ ] Social media links

---

### 6.2 USER FEATURES (Login Required)

#### A. User Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, Rahul! 👋                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ My Donations │  │ Volunteer    │  │ Tax Receipts │      │
│  │   ₹12,500    │  │   24 Hours   │  │   3 Ready    │      │
│  │   Total      │  │   Logged     │  │   Download   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  📊 My Contribution Summary                                 │
│  ──────────────────────────────────────────────────────    │
│  Jan ████████░░░░ ₹2,000                                   │
│  Feb ████████████ ₹3,500                                   │
│  Mar ██████░░░░░░ ₹1,500                                   │
│                                                             │
│  🎯 Recent Activity                                         │
│  • Donated ₹2,000 to Orphan Education (2 days ago)         │
│  • Volunteered at Food Drive (5 days ago)                  │
│  • Referred a friend who donated ₹500                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. Donation History
- [ ] List of all donations
- [ ] Filter by date/cause
- [ ] Download individual receipts
- [ ] View payment status
- [ ] Recurring donation management

#### C. Volunteer Features
- [ ] Application status tracking
- [ ] Available opportunities
- [ ] Log volunteer hours
- [ ] View assigned tasks
- [ ] Upload activity photos
- [ ] Certificate request

#### D. Profile Management
- [ ] Update personal info
- [ ] Change password
- [ ] Notification preferences
- [ ] Linked accounts (Google)
- [ ] Delete account option

---

### 6.3 ADMIN FEATURES

#### A. Admin Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Admin Dashboard                    [Notifications 🔔]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Quick Stats (Today)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  ₹15,000 │ │    5     │ │    3     │ │   12     │       │
│  │ Donations│ │New Donors│ │Volunteers│ │ Messages │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  📈 This Month's Progress                                   │
│  ──────────────────────────────────────────────────────    │
│  Donations:  ████████████████░░░░ ₹1.2L / ₹1.5L Goal       │
│  Volunteers: ████████░░░░░░░░░░░░ 45 / 100 Target          │
│                                                             │
│  ⚡ Quick Actions                                            │
│  [+ Add Update] [📧 Send Newsletter] [📊 Download Report]  │
│                                                             │
│  🔔 Pending Actions                                         │
│  • 3 volunteer applications to review                       │
│  • 5 contact messages unread                                │
│  • Monthly report due in 5 days                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. Donation Management
- [ ] View all donations
- [ ] Search/filter donations
- [ ] Mark payment status
- [ ] Generate tax receipts
- [ ] Export to Excel/CSV
- [ ] Donation analytics
- [ ] Donor communication

#### C. Volunteer Management
- [ ] View applications
- [ ] Approve/reject volunteers
- [ ] Assign tasks
- [ ] Track hours
- [ ] Generate certificates
- [ ] Send mass emails
- [ ] Volunteer analytics

#### D. Content Management
- [ ] Edit homepage content
- [ ] Manage news/updates
- [ ] Upload gallery photos
- [ ] Edit service details
- [ ] Manage team profiles
- [ ] Update contact info

#### E. Contact Management
- [ ] View all messages
- [ ] Reply via email
- [ ] Mark as resolved
- [ ] Spam filtering
- [ ] Auto-responses

#### F. Reports & Analytics
- [ ] Donation reports
- [ ] Volunteer reports
- [ ] Traffic analytics
- [ ] Export capabilities
- [ ] Custom date ranges
- [ ] Graphical charts

---

## 7. TECHNICAL ARCHITECTURE

### 7.1 Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNICAL STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRONTEND                                                   │
│  ├── React 18+ (UI Framework)                               │
│  ├── Vite (Build Tool)                                      │
│  ├── React Router (Navigation)                              │
│  ├── CSS Modules / Styled Components                        │
│  ├── Lucide React (Icons)                                   │
│  └── Chart.js (Analytics Charts)                            │
│                                                             │
│  BACKEND                                                    │
│  ├── Node.js + Express.js                                   │
│  ├── MongoDB (Database)                                     │
│  ├── Mongoose (ODM)                                         │
│  ├── JWT (Authentication)                                   │
│  ├── Nodemailer (Emails)                                    │
│  └── Multer (File Uploads)                                  │
│                                                             │
│  EXTERNAL SERVICES                                          │
│  ├── Razorpay / Stripe (Payments)                           │
│  ├── Cloudinary (Image Storage)                             │
│  ├── SendGrid / Mailgun (Emails)                            │
│  ├── Google OAuth (Social Login)                            │
│  └── Google Maps (Location)                                 │
│                                                             │
│  DEPLOYMENT                                                 │
│  ├── Vercel / Netlify (Frontend)                            │
│  ├── Render / Railway (Backend)                             │
│  └── MongoDB Atlas (Database)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Folder Structure

```
NGO/
├── Backend/
│   ├── config/
│   │   ├── db.js
│   │   └── loadEnv.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── donation.controller.js
│   │   ├── volunteer.controller.js
│   │   ├── contact.controller.js
│   │   └── admin.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── admin.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── donation.model.js
│   │   ├── volunteer.model.js
│   │   └── contact.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── donation.routes.js
│   │   ├── volunteer.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   ├── mail.service.js
│   │   └── payment.service.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── public/
    │   └── images/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── FlashMessage.jsx
    │   │   └── sections/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Services.jsx
    │   │   ├── Donate.jsx
    │   │   ├── Volunteer.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminDonations.jsx
    │   │       └── AdminVolunteers.jsx
    │   ├── routes/
    │   │   └── AppRoute.jsx
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 8. IMPLEMENTATION PHASES

### PHASE 1: FOUNDATION (Week 1-2)
**Goal: Basic website structure**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Project setup (Vite + Express) | High | 2 hrs | ✅ Done |
| Database connection | High | 1 hr | ✅ Done |
| User authentication (Login/Register) | High | 4 hrs | ✅ Done |
| Basic Navbar & Footer | High | 2 hrs | ✅ Done |
| Home page layout | High | 4 hrs | ✅ Done |
| Responsive design base | High | 3 hrs | ⏳ In Progress |

---

### PHASE 2: CORE PAGES (Week 3-4)
**Goal: All public pages functional**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Services overview page | High | 3 hrs | ✅ Done |
| Individual service pages | High | 6 hrs | ✅ Done |
| About Us page | Medium | 3 hrs | ⬜ Pending |
| Contact page + form | High | 3 hrs | ✅ Done |
| Gallery page | Medium | 3 hrs | ⬜ Pending |
| Volunteer info page | High | 3 hrs | ✅ Done |

---

### PHASE 3: DONATION SYSTEM (Week 5-6)
**Goal: Accept online donations**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Donation page UI | High | 4 hrs | ⬜ Pending |
| Payment gateway integration | Critical | 8 hrs | ⬜ Pending |
| Donation model & API | High | 4 hrs | ⬜ Pending |
| Payment confirmation page | High | 2 hrs | ⬜ Pending |
| Email receipt automation | High | 3 hrs | ⬜ Pending |
| 80G certificate generation | Medium | 4 hrs | ⬜ Pending |

---

### PHASE 4: VOLUNTEER SYSTEM (Week 7-8)
**Goal: Manage volunteers**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Volunteer registration form | High | 3 hrs | ✅ Done |
| Volunteer model & API | High | 3 hrs | ✅ Done |
| Admin: View applications | High | 3 hrs | ✅ Done |
| Admin: Approve/Reject | High | 2 hrs | ✅ Done |
| Volunteer dashboard | Medium | 4 hrs | ⬜ Pending |
| Task assignment system | Medium | 4 hrs | ⬜ Pending |
| Hour logging | Low | 3 hrs | ⬜ Pending |

---

### PHASE 5: ADMIN PANEL (Week 9-10)
**Goal: Complete admin functionality**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Admin dashboard | High | 4 hrs | ✅ Done |
| Donation management | High | 4 hrs | ⬜ Pending |
| Volunteer management | High | 3 hrs | ✅ Done |
| Contact management | High | 3 hrs | ✅ Done |
| User management | Medium | 3 hrs | ✅ Done |
| Analytics/Reports | Medium | 6 hrs | ⬜ Pending |

---

### PHASE 6: USER EXPERIENCE (Week 11-12)
**Goal: Polish and optimize**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| User profile page | High | 3 hrs | ✅ Done |
| Donation history | Medium | 3 hrs | ⬜ Pending |
| Email notifications | High | 4 hrs | ✅ Done |
| Performance optimization | High | 4 hrs | ⬜ Pending |
| Mobile responsiveness | High | 6 hrs | ⏳ In Progress |
| SEO optimization | Medium | 3 hrs | ⬜ Pending |

---

### PHASE 7: TESTING & LAUNCH (Week 13-14)
**Goal: Production ready**

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Bug fixes | Critical | 8 hrs | ⬜ Pending |
| Security audit | Critical | 4 hrs | ⬜ Pending |
| Load testing | High | 3 hrs | ⬜ Pending |
| Documentation | Medium | 4 hrs | ⬜ Pending |
| Deployment setup | Critical | 4 hrs | ⬜ Pending |
| Domain & SSL | Critical | 2 hrs | ⬜ Pending |

---

## 9. DATABASE SCHEMA

### 9.1 User Model

```javascript
User {
  _id: ObjectId
  name: String (required)
  email: String (required, unique)
  phone: String
  password: String (hashed)
  authProvider: "local" | "google"
  role: "user" | "admin"
  avatar: String (URL)
  address: String
  city: String
  state: String
  
  // Verification
  emailVerified: Boolean
  aadhaarVerified: Boolean
  panVerified: Boolean
  
  // Volunteer Info
  isVolunteer: Boolean
  volunteerStatus: "none" | "pending" | "approved" | "rejected"
  volunteerApprovedAt: Date
  volunteerSkills: [String]
  volunteerHours: Number
  
  createdAt: Date
  updatedAt: Date
}
```

### 9.2 Donation Model

```javascript
Donation {
  _id: ObjectId
  
  // Donor Info
  donorId: ObjectId (ref: User) // null for guest
  donorName: String
  donorEmail: String
  donorPhone: String
  donorPAN: String (for 80G)
  
  // Donation Details
  amount: Number (required)
  currency: "INR"
  cause: String (e.g., "Orphan Education")
  message: String
  isAnonymous: Boolean
  
  // Recurring
  isRecurring: Boolean
  frequency: "monthly" | "quarterly" | "yearly"
  
  // Payment
  paymentMethod: "upi" | "card" | "netbanking" | "bank_transfer"
  paymentGateway: "razorpay"
  transactionId: String
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  
  // Receipt
  receiptNumber: String (auto-generated)
  receipt80GUrl: String
  receiptSentAt: Date
  
  createdAt: Date
  updatedAt: Date
}
```

### 9.3 Volunteer Model

```javascript
Volunteer {
  _id: ObjectId
  userId: ObjectId (ref: User)
  
  // Personal Info
  name: String
  email: String
  phone: String
  age: Number
  gender: String
  address: String
  city: String
  state: String
  
  // Application
  skills: [String]
  experience: String
  motivation: String
  availability: "weekdays" | "weekends" | "both"
  hoursPerWeek: Number
  preferredServices: [String]
  
  // Documents
  idProof: String (URL)
  photo: String (URL)
  
  // Status
  status: "pending" | "approved" | "rejected" | "inactive"
  rejectionReason: String
  approvedAt: Date
  approvedBy: ObjectId (ref: User)
  
  // Activity
  totalHours: Number
  tasksCompleted: Number
  lastActiveAt: Date
  
  createdAt: Date
  updatedAt: Date
}
```

### 9.4 Contact Model (Existing)

```javascript
Contact {
  _id: ObjectId
  name: String
  email: String
  phone: String
  subject: String
  message: String
  status: "New" | "In Progress" | "Resolved" | "Spam"
  repliedAt: Date
  repliedBy: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

---

## 10. API ENDPOINTS

### 10.1 Authentication APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/google` | Google OAuth login | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### 10.2 Donation APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/donation/create` | Initiate donation | No |
| POST | `/api/donation/verify` | Verify payment | No |
| GET | `/api/donation/my` | User's donations | Yes |
| GET | `/api/donation/:id/receipt` | Download receipt | Yes |
| GET | `/api/admin/donations` | All donations | Admin |
| PUT | `/api/admin/donation/:id` | Update donation | Admin |
| GET | `/api/admin/donations/export` | Export CSV | Admin |

### 10.3 Volunteer APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/volunteer/apply` | Submit application | Yes |
| GET | `/api/volunteer/status` | Check status | Yes |
| GET | `/api/volunteer/my-tasks` | View tasks | Yes |
| POST | `/api/volunteer/log-hours` | Log activity | Yes |
| GET | `/api/admin/volunteers` | All applications | Admin |
| PUT | `/api/admin/volunteer/:id/approve` | Approve | Admin |
| PUT | `/api/admin/volunteer/:id/reject` | Reject | Admin |
| PUT | `/api/admin/volunteer/:id/task` | Assign task | Admin |

### 10.4 Contact APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit message | No |
| GET | `/api/contact/all` | All messages | Admin |
| PUT | `/api/contact/:id/status` | Update status | Admin |
| POST | `/api/contact/:id/reply` | Reply via email | Admin |
| DELETE | `/api/contact/:id` | Delete message | Admin |

### 10.5 Admin APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard stats | Admin |
| GET | `/api/admin/users` | All users | Admin |
| PUT | `/api/admin/user/:id` | Update user | Admin |
| DELETE | `/api/admin/user/:id` | Delete user | Admin |
| GET | `/api/admin/reports/donations` | Donation report | Admin |
| GET | `/api/admin/reports/volunteers` | Volunteer report | Admin |

---

## 11. SECURITY & COMPLIANCE

### 11.1 Security Measures

| Area | Implementation |
|------|----------------|
| **Password** | bcrypt hashing with salt |
| **JWT** | Short expiry, refresh tokens |
| **CORS** | Restricted origins |
| **Rate Limiting** | Prevent brute force |
| **Input Validation** | Sanitize all inputs |
| **SQL/NoSQL Injection** | Mongoose validation |
| **XSS** | Content Security Policy |
| **HTTPS** | SSL certificate |
| **File Upload** | Type/size restrictions |

### 11.2 NGO Compliance

| Requirement | Status |
|-------------|--------|
| 80G Registration | Display on website |
| 12A Registration | Display on website |
| FCRA (if foreign donors) | Apply when needed |
| Annual Report | Publish yearly |
| Audit Report | Maintain records |
| Donor Privacy | Data protection policy |

---

## 12. FUTURE ROADMAP

### Version 2.0 (6 months)

| Feature | Description |
|---------|-------------|
| **Mobile App** | React Native app for donors/volunteers |
| **Multi-language** | Hindi, regional languages |
| **Recurring Donations** | Automated monthly payments |
| **Event Calendar** | Public event listings |
| **Blog/News** | Content management system |
| **Live Chat** | WhatsApp/chat integration |

### Version 3.0 (1 year)

| Feature | Description |
|---------|-------------|
| **Beneficiary Portal** | Track help received |
| **Impact Dashboard** | Public transparency page |
| **Corporate Portal** | For CSR donations |
| **Volunteer App** | Task management mobile app |
| **AI Chatbot** | Automated donor queries |
| **Blockchain** | Donation tracking transparency |

### Long-term Vision

```
┌─────────────────────────────────────────────────────────────┐
│                    SEVAINDIA VISION 2030                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📍 Geographic Expansion                                    │
│     • 50+ districts covered                                 │
│     • 5 regional offices                                    │
│     • Pan-India presence                                    │
│                                                             │
│  👥 Community Growth                                        │
│     • 10,000+ active volunteers                             │
│     • 100,000+ donors                                       │
│     • 500,000+ lives impacted                               │
│                                                             │
│  💰 Financial Goals                                         │
│     • ₹10 Cr annual donations                               │
│     • Corporate partnerships                                │
│     • Government collaborations                             │
│                                                             │
│  🌐 Digital Excellence                                      │
│     • Mobile app with 50k+ downloads                        │
│     • AI-powered donor matching                             │
│     • Real-time impact tracking                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📞 QUICK REFERENCE

### Current Progress Summary

| Module | Status | Completion |
|--------|--------|------------|
| Authentication | ✅ Done | 100% |
| Home Page | ✅ Done | 95% |
| Services | ✅ Done | 90% |
| Contact | ✅ Done | 100% |
| Volunteer Form | ✅ Done | 100% |
| Admin Panel | ⏳ Partial | 70% |
| Donations | ⬜ Pending | 10% |
| User Dashboard | ⬜ Pending | 30% |
| Reports | ⬜ Pending | 0% |

### Next Immediate Steps

1. ⬜ Complete donation payment integration
2. ⬜ Build user donation history page
3. ⬜ Create 80G receipt generator
4. ⬜ Add donation analytics to admin
5. ⬜ Mobile responsiveness polish

---

**Document Version:** 1.0  
**Last Updated:** February 24, 2026  
**Author:** SevaIndia Development Team

---

> *"Technology in service of humanity"*
