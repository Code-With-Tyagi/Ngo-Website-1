# NGO Profile Page - Detailed Development Prompt

## 1. PROJECT OVERVIEW

Create a **professional, engaging NGO profile page** that displays comprehensive details about individual NGOs. The page should showcase organization credentials, services, contact information, and build trust with potential donors and volunteers.

---

## 2. PAGE PURPOSE & GOALS

- **Primary Goal**: Display complete NGO information in an organized, visually appealing manner
- **Secondary Goals**: 
  - Build donor confidence through transparency and professionalism
  - Encourage donations and volunteer registrations
  - Showcase NGO credentials and verification status
  - Provide easy ways to contact the organization
  - Display all services and areas of work

---

## 3. KEY FEATURES & FUNCTIONALITY

### 3.1 Hero Section
- **Height**: 450px with full-width coverage
- **Content**:
  - Large NGO emoji/icon (4-5rem size) with floating animation
  - Glowing effect around the icon
  - Organization name as main heading
  - Location (City, State) as subheading
- **Animations**:
  - Icon floats up/down continuously
  - Glow pulses gently
  - Content fades in on page load
- **Styling**: Gradient background (green theme: #1e5631 to #40916c)

### 3.2 Navigation Header
- **Back Button**: Semi-transparent, sticky on top
- **Styling**: Green background with hover effects
- **Position**: Stays visible on scroll

### 3.3 Info Header Section
- **Layout**: Two-column (NGO details + Action buttons)
- **Left Side**:
  - Organization name (H1, 2.5rem, bold)
  - Badges: Verified status, Registration type
  - Green and blue badge colors with rounded corners
- **Right Side**:
  - Donate Now button (green, prominent)
  - Share button (white with green border)
  - Both with hover animations

### 3.4 Stats Cards Section
- **Layout**: 4-column responsive grid
- **Cards Display**:
  1. Established Year (with calendar icon)
  2. Location (with map pin icon)
  3. Services (with briefcase icon)
  4. Registration Type (with document icon)
- **Card Features**:
  - White background with subtle shadow
  - Icon on left (2.2rem, green color)
  - Label + value on right
  - Scale animation on load
  - Hover effect (lift up)
  - Border with green tint

### 3.5 Tab Navigation
- **Three Main Tabs**:
  1. **Overview** - General information
  2. **Contact** - Contact details and social media
  3. **Credentials** - Registration & documents
- **Tab Styling**:
  - White background container
  - Green underline for active tab
  - Smooth transitions between tabs
  - Slide animation when switching

### 3.6 OVERVIEW TAB Content

#### 3.6.1 About Section
- **Field**: Organization description/mission
- **Styling**: Large text (1.1rem), line-height 1.8
- **Layout**: Full width

#### 3.6.2 Core Information Section
- **Fields to Display**:
  - NGO Name
  - Registration Type (Trust/Society/Company)
  - Registration Number
  - Established Year
  - DARPAN ID
  - PAN Number
- **Layout**: 3-column responsive grid
- **Card Style**:
  - Gradient background (light green/white)
  - Border with green tint
  - Label (uppercase, small, gray)
  - Value (bold, large, green)
  - Hover: slight scale up

#### 3.6.3 Location & Address Section
- **Fields to Display**:
  - Full Address
  - City
  - District
  - State
  - Pincode
- **Layout**: Responsive grid (2-3 columns)
- **Styling**: Same as Core Information cards

#### 3.6.4 Services Provided Section
- **Display**: Tag-based layout
- **Service Tags**:
  - Green gradient background
  - Rounded corners (25px)
  - Hover effect: scale up, color change
  - Each service in a pill-shaped badge
- **Other Services**: Displayed if available
- **Animation**: Fade in when loaded

### 3.7 CONTACT TAB Content

#### 3.7.1 Contact Person Card
- **Styling**: Gradient background (light green)
- **Information**:
  - Contact person name (large, bold, green)
  - Job role/designation
  - Border with green tint
- **Animation**: Slide in from left

#### 3.7.2 Contact Details Grid
- **Fields as Clickable Cards**:
  1. Phone (with phone icon)
  2. WhatsApp (with phone icon, opens wa.me)
  3. Email (clickable mailto:)
  4. Website (clickable, opens in new tab)
- **Card Styling**:
  - White background
  - Icon on left (1.8rem, green)
  - Label + Value text
  - Hover: lift up, shadow increase
  - Border effect
  - Scale animation on load
- **Responsive**: 1-2 columns depending on screen size

#### 3.7.3 Social Media Section
- **Links**: Facebook and Instagram
- **Styling**:
  - Green background buttons
  - White text with icons
  - Rounded corners (25px)
  - Hover: darker green, shadow
- **Animation**: Pop in effect with slight bounce

### 3.8 CREDENTIALS TAB Content

#### 3.8.1 Verification Cards Grid
- **6 Card Grid**:
  1. Verified Status (checkmark icon, green)
  2. Registration Type (document icon)
  3. Registration Number (document icon)
  4. DARPAN ID (document icon)
  5. PAN Number (document icon)
  6. Established Year (calendar icon)
- **Card Styling**:
  - Gradient background (light green)
  - Center-aligned text
  - Icon above text (2.5rem)
  - Information below icon
  - Scale animation
  - Hover effect

#### 3.8.2 Documents Section
- **Document Links** (if available):
  - Registration Certificate
  - 12A Certificate (for tax exemption)
  - 80G Certificate (for tax benefits)
- **Link Styling**:
  - File icon with label
  - Light blue gradient background
  - Rounded corners (12px)
  - Hover: color change, lift effect
  - Opens in new tab
- **Display**: 3-column responsive grid

### 3.9 Call-to-Action (CTA) Section
- **Position**: Bottom of page before footer
- **Styling**:
  - Green gradient background (135deg)
  - White text
  - Padding: 60px 40px
  - Rounded corners (20px)
  - Box shadow for depth
- **Content**:
  - Main heading: "Want to Support This Organization?" (2.3rem, bold)
  - Subtitle: "Your donation can make a real difference in people's lives" (1.15rem)
  - Action button: "Donate Now" (white, green text)
    - Icon: Heart
    - Padding: 16px 40px
    - Rounded: 30px
    - Hover effect: shadow increase
- **Animation**: Slide up from bottom on page load

---

## 4. ANIMATIONS & INTERACTIONS

### 4.1 Page Load Animations
- **Hero Section**: Fade in (0.8s)
- **Info Header**: Slide in from left (0.6s)
- **Badges**: Pop in with bounce (0.6s, staggered 0.1s delay)
- **Stats Cards**: Scale in (0.5s, staggered)
- **Tab Navigation**: Slide up from bottom (0.6s)
- **Tab Content**: Fade in up (0.5s)
- **Sections**: Slide in from left (0.6s, staggered)

### 4.2 Hero Icon Animations
- **Float**: Icon moves up/down continuously
  - Duration: 3s
  - Keyframes: 0% (0px), 50% (-20px), 100% (0px)
- **Glow**: Surrounding effect pulses
  - Duration: 3s
  - Scale: 1 → 1.1 → 1
  - Opacity: 0.7 → 0.4 → 0.7

### 4.3 Hover Effects
- **Buttons**: Translate up 2px + shadow increase
- **Cards**: Scale up 1.02 + shadow increase
- **Links**: Translate up 2px + color change
- **Service Tags**: Scale 1.05 + color intensify
- **All**: Smooth 0.3s transitions

### 4.4 Tab Transitions
- **Tab Content**: Fade in up (0.4s)
- **Active Tab**: Green underline slides smoothly
- **No abrupt changes**: Smooth animations only

### 4.5 Loading States
- **Initial Load**: 
  - Spinner animation (rotating 3rem icon)
  - Loading text: "Loading NGO Profile..."
  - Subtext: "Fetching detailed information"
  - Centered, full height

### 4.6 Error States
- **Error Display**:
  - Large error icon (4rem, red)
  - Error heading
  - Error message from backend
  - Back to NGOs button
  - Pulse animation on error icon

---

## 5. RESPONSIVE DESIGN

### 5.1 Desktop (1200px+)
- Stats grid: 4 columns
- Contact grid: 2 columns
- All sections full width with max-width container
- Badges inline

### 5.2 Tablet (768px - 1199px)
- Stats grid: 2 columns
- Contact grid: 2 columns
- Info header: Stack if needed
- Padding: 30px

### 5.3 Mobile (< 768px)
- Stats grid: 1-2 columns
- Contact grid: 1 column
- Info header: Fully stacked
- Hero section: 350px height
- NGO name: 1.8rem
- Padding: 20px
- Button group: Stack vertically or fit as-is
- Font sizes reduced proportionally

---

## 6. COLOR SCHEME & STYLING

### 6.1 Primary Colors
- **Main Green**: #1e5631 (dark green)
- **Light Green**: #40916c (accent green)
- **Very Light Green**: #f0f7f5 (background tint)

### 6.2 Secondary Colors
- **Blue Accent**: #e7f3ff (info backgrounds)
- **Dark Gray**: #333 (text)
- **Medium Gray**: #666 (labels)
- **Light Gray**: #f8f9fa (backgrounds)
- **White**: #ffffff (card backgrounds)

### 6.3 Typography
- **Font Family**: 'Inter', 'Segoe UI', Roboto, sans-serif
- **Headings**: Font weight 800-900
- **Body Text**: Font weight 400-600
- **Labels**: Font weight 700, uppercase, letter-spacing 0.5px

### 6.4 Shadows & Depths
- **Light Shadow**: 0 2px 10px rgba(0,0,0,0.05)
- **Medium Shadow**: 0 4px 15px rgba(0,0,0,0.08)
- **Dark Shadow**: 0 4px 20px rgba(0,0,0,0.08)
- **Extra Dark Shadow**: 0 10px 40px rgba(30, 86, 49, 0.3)

### 6.5 Border Radius
- **Buttons**: 8px - 30px (depending on style)
- **Cards**: 12px - 15px (standard)
- **Badges**: 20px - 25px (rounded pills)
- **Hero Box**: 20px

---

## 7. DATA STRUCTURE (Backend Integration)

### 7.1 API Endpoint
```
GET /api/ngo/:id
```

### 7.2 Expected Response Format
```json
{
  "success": true,
  "data": {
    "_id": "mongodb_id",
    "ngoName": "Organization Name",
    "regType": "Trust/Society/Company",
    "regNumber": "ABC12345",
    "estYear": 2015,
    "darpanId": "DARPAN123",
    "panNumber": "AAABP1234K",
    "description": "Full description...",
    "city": "Delhi",
    "state": "Delhi",
    "district": "North",
    "pincode": "110001",
    "address": "123 Street, Area",
    "contactName": "John Doe",
    "contactRole": "Executive Director",
    "phone": "+91-9999999999",
    "whatsapp": "+91-9999999999",
    "email": "contact@ngo.org",
    "website": "https://www.ngo.org",
    "socialMedia": {
      "facebook": "https://facebook.com/ngo",
      "instagram": "@ngo_handle"
    },
    "services": ["Education", "Healthcare", "Community Development"],
    "otherService": "Additional services description",
    "documents": {
      "registrationCertificate": "filename.pdf",
      "certificate12A": "filename.pdf",
      "certificate80G": "filename.pdf"
    },
    "verified": true,
    "rating": 4.8,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 7.3 Error Response
```json
{
  "success": false,
  "message": "NGO not found"
}
```

---

## 8. USER EXPERIENCE REQUIREMENTS

### 8.1 User Journey
1. User lands on NGO profile from Find NGOs page
2. Hero section immediately impresses with floating animation
3. Quick scan of key stats (Est. Year, Location, Services, Type)
4. Read detailed information in tabs
5. Contact organization via multiple channels
6. Donate or volunteer through CTAs

### 8.2 Accessibility
- All text has sufficient contrast
- Icons have proper ARIA labels
- Buttons are keyboard navigable
- Tab order is logical
- Loading and error states are clear

### 8.3 Performance
- Page loads API data quickly
- Animations don't cause janky scrolling
- Debounce/throttle hover effects for performance
- Lazy load images if added in future
- Optimize CSS animations with GPU acceleration

### 8.4 Trust Building Elements
- **Verified Badge**: Prominently displayed
- **Credentials Section**: Shows registration & documents
- **Contact Info**: Multiple ways to contact (phone, email, social)
- **Location**: Clear address and mapping info
- **Services**: Transparent about what they do
- **Professional Design**: Clean, modern interface

---

## 9. INTERACTIVE FEATURES

### 9.1 Tab Switching
- Smooth transition between tabs
- Active tab highlighted
- Content changes with animation
- No page reload

### 9.2 Clickable Elements
- Phone: `tel:` link
- Email: `mailto:` link
- Website: Opens in new tab
- WhatsApp: Opens wa.me link
- Documents: Opens in new tab
- Donate Button: Navigate to donation page
- Share Button: Show share options (future enhancement)

### 9.3 Visual Feedback
- Hover states on all interactive elements
- Focus states for accessibility
- Active states for tabs
- Loading spinner for data fetch
- Error message display

---

## 10. TECHNICAL IMPLEMENTATION

### 10.1 Frontend Stack
- **React 19+** with Hooks (useState, useEffect, useParams)
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** (FA) for icons
- **Inline CSS** with styles object

### 10.2 State Management
```javascript
const [ngo, setNgo] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState("overview");
```

### 10.3 API Integration
- Fetch NGO data on component mount
- ID from URL parameters: `useParams()`
- Handle loading, success, and error states
- Console logging for debugging
- Proper error messages to user

### 10.4 CSS Animations
- Create stylesheet with 10+ keyframe animations
- All transitions use `transition: all 0.3s ease`
- Stagger animations for visual hierarchy
- GPU-accelerated transforms (translate, scale)

---

## 11. OPTIONAL ENHANCEMENTS

- **Gallery Section**: Multiple NGO photos
- **Reviews/Testimonials**: From beneficiaries
- **Impact Metrics**: Dashboard showing work impact
- **Newsletter**: Subscribe to NGO updates
- **Video**: NGO introduction video
- **Ratings & Reviews**: Star rating system
- **Share Buttons**: Social media sharing
- **Print Option**: Printable profile

---

## 12. SUCCESS CRITERIA

✅ Page loads NGO data successfully from backend
✅ All tabs function correctly with smooth transitions
✅ Animations are smooth and not laggy
✅ Responsive design works on mobile, tablet, desktop
✅ All links are clickable and functional
✅ Loading state shows while fetching data
✅ Error state displays if data fetch fails
✅ All NGO information displays correctly
✅ Professional appearance builds donor trust
✅ User can easily find and click contact information
✅ User can navigate to donation/volunteer pages
✅ Page is fully accessible with keyboard navigation

---

## 13. DEPLOYMENT CHECKLIST

- [ ] Test all tabs and transitions
- [ ] Test on mobile, tablet, desktop
- [ ] Verify all links work
- [ ] Check loading and error states
- [ ] Verify API integration
- [ ] Optimize images and assets
- [ ] Check accessibility with keyboard
- [ ] Test with actual NGO data
- [ ] Verify responsive breakpoints
- [ ] Performance testing (PageSpeed)
- [ ] Cross-browser testing
- [ ] User testing with real users

---

This prompt provides comprehensive guidance for developing a professional, engaging NGO profile page.
