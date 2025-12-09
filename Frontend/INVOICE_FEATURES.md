# Invoice Management Platform - Feature Documentation

A comprehensive Revenue Cycle Management (RCM) system for healthcare billing.

---

## Quick Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| [Claims List](#1-claims-list) | 📋 | View, search, filter invoices |
| [Invoice Detail](#2-invoice-detail) | 📄 | Full claim details, submit 837P |
| [Create Invoice](#3-create-invoice) | ➕ | Generate new invoices/claims |
| [Payment Posting](#4-payment-posting) | 💳 | Manual payments + ERA import |
| [Patient Statements](#5-patient-statements) | 📝 | Generate patient bills |
| [Denial Management](#6-denial-management) | ❌ | Track/appeal denied claims |
| [AR Dashboard](#7-ar-dashboard) | 📊 | Analytics & aging reports |

---

## 1. Claims List

**Purpose:** Central hub for viewing and managing all invoices/claims.

### Features:
- **Search:** Find by invoice #, patient name, or payer
- **Filter by Status:** Draft, Pending, Submitted, Paid, Partial, Denied, Appealed
- **Filter by Type:** Medical, Dental, Vision claims
- **Date Range:** Filter by service date
- **Clickable Rows:** Click any invoice to view details

### Stats Cards:
| Card | Description |
|------|-------------|
| Total Invoices | Count of all claims |
| Outstanding | Total unpaid balance |
| Overdue | Past due date with balance |
| Paid This Month | Collections for current month |

---

## 2. Invoice Detail

**Purpose:** View complete claim information and submit to payers.

### Sections:
- **Patient Info:** Name, ID
- **Payer Info:** Insurance name, claim type
- **Dates:** Service date, due date, created date
- **Financials:** Total amount, paid, balance

### Service Codes:
- **CPT/HCPCS:** Procedure codes (e.g., 99213, 99214)
- **ICD-10:** Diagnosis codes (e.g., J06.9, I10)

### Actions:
| Button | Function |
|--------|----------|
| ✏️ Edit | Modify claim details |
| 🚀 Submit Claim | Open 837P submission modal |

### 837P Claim Submission:
1. Preview claim summary
2. View EDI 837P format
3. Download EDI file
4. Submit to clearinghouse (simulated)

---

## 3. Create Invoice

**Purpose:** Generate new patient invoices or insurance claims.

### Form Fields:

**Patient & Payer:**
- Patient selection (dropdown)
- Insurance/Payer selection

**Service Details:**
- Service date (defaults to today)
- Due date (auto-calculates 30 days)
- Claim type: Medical, Dental, Vision

**Billing:**
- Amount ($)
- CPT/HCPCS codes (comma-separated)
- ICD-10 codes (comma-separated)
- Description

### Workflow:
1. Select patient → Select payer
2. Enter service details
3. Add billing info and codes
4. Click "Create Invoice" → Status: Draft

---

## 4. Payment Posting

**Purpose:** Record payments from payers or patients.

### Manual Payment Posting:
1. Select invoice with outstanding balance
2. Enter payment amount
3. Select payment date & method
4. Add reference/check number
5. Click "Post Payment"

**Payment Methods:** Check, EFT/ACH, Credit Card, Cash, Other

### ERA/835 Import (Automated):

**What is ERA?** Electronic Remittance Advice - payer's explanation of payment & adjustments.

**How it works:**
1. Paste 835 EDI data or load sample
2. Click "Parse & Match Payments"
3. Review matched payments with:
   - Charged vs Allowed amounts
   - Paid amount
   - Adjustments & reason codes
   - Patient responsibility
4. Click "Post Payments" → Auto-updates invoices

---

## 5. Patient Statements

**Purpose:** Generate billing statements for patient responsibility.

### Outstanding Balances List:
- Patients with unpaid invoices
- Total balance per patient
- Number of open invoices

### Statement Preview:
Generates print-ready statement with:
- Clinic letterhead
- Patient billing address
- Statement date & account #
- Service details table
- Payment options
- Amount due

### Batch Actions:
| Action | Description |
|--------|-------------|
| 📧 Send All via Email | Bulk email statements |
| 🖨️ Print All | Bulk print statements |

---

## 6. Denial Management

**Purpose:** Track denied claims and manage appeals.

### Denied Claims List:
- Invoice #, Patient, Payer
- Denied amount
- Status: Denied or Appealed

### Denial Review:
When you click "Review" on a denied claim:
- **Claim Info:** Patient, payer, service date, amount
- **Denial Reason:** CARC code (e.g., CO-16, CO-45)
- **CPT Codes:** What was billed

### Appeal Workflow:
1. Click "File Appeal"
2. Select appeal reason:
   - Additional Documentation
   - Coding Correction
   - Medical Necessity
   - Timely Filing Proof
3. Add supporting information
4. Submit corrected codes if needed
5. Click "Submit Appeal"

### Appeal Status Timeline:
- ✓ Denial Received
- ✓ Appeal Submitted
- ⏳ Under Review
- ○ Decision (pending)

### Denial Analytics:
| Metric | Description |
|--------|-------------|
| Denied Claims | Count of denials |
| Denied Amount | Total $ denied |
| Under Appeal | Claims being appealed |
| Appeal Rate | % of denials appealed |
| By Payer | Denials grouped by insurance |

---

## 7. AR Dashboard

**Purpose:** Accounts Receivable analytics and aging reports.

### Summary Cards:
| Metric | Description |
|--------|-------------|
| 💰 Total A/R | All outstanding balances |
| 📋 Total Claims | Count of all invoices |
| ⚠️ Overdue | Past-due claims count |
| ✅ Collected | Payments this month |

### Aging Buckets:
| Period | Meaning |
|--------|---------|
| Current | Not yet due |
| 1-30 Days | 1-30 days past due |
| 31-60 Days | 31-60 days past due |
| 61-90 Days | 61-90 days past due |
| 90+ Days | Over 90 days past due |

### Status Distribution:
Bar chart showing % of claims by status (Draft, Pending, Submitted, etc.)

### Top Payers:
Ranked list of payers by total claims volume.

---

## Invoice Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| Draft | Gray | Created, not submitted |
| Pending | Yellow | Ready to submit |
| Submitted | Blue | Sent to payer |
| Paid | Green | Fully paid |
| Partial | Purple | Partially paid |
| Denied | Red | Rejected by payer |
| Appealed | Pink | Appeal in progress |

---

## Technical Details

### Backend API Endpoints:
```
GET    /invoices          - List all (with filters)
GET    /invoices/stats    - Summary statistics
GET    /invoices/:id      - Single invoice
POST   /invoices          - Create new
PUT    /invoices/:id      - Update
DELETE /invoices/:id      - Delete
```

### Data Model:
- `invoiceNumber` - Unique identifier (INV-2024-XXX)
- `patientId`, `patientName` - Patient reference
- `payerId`, `payerName` - Insurance reference
- `serviceDate`, `dueDate`, `createdAt` - Dates
- `amount`, `paidAmount`, `balance` - Financials
- `status` - Workflow state
- `claimType` - Medical/Dental/Vision
- `cptCodes[]`, `icdCodes[]` - Billing codes
- `description` - Service description
