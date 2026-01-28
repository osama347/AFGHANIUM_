# 🔬 Research Module - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        AFGHANIUM RESEARCH                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────── PUBLIC INTERFACE ─────────────────────────┐
│                                                                   │
│  /research                                                        │
│  ├─ Published Research Tab                                       │
│  │  ├─ Display approved papers                                   │
│  │  ├─ Author & abstract                                         │
│  │  └─ Download PDF/Word                                         │
│  │                                                               │
│  └─ Submit Research Tab                                          │
│     ├─ Form with 8 fields                                        │
│     ├─ File upload (PDF/DOC/DOCX)                               │
│     ├─ Validation (type & size)                                 │
│     └─ Success feedback                                          │
│                                                                   │
└─────────────────────── ADMIN INTERFACE ────────────────────────────┘
│                                                                   │
│  /admin/research                                                 │
│  ├─ Statistics Panel (5 metrics)                                │
│  ├─ Filter & Search                                             │
│  ├─ Submissions Table                                           │
│  │  ├─ Title, Author, Status, Date                            │
│  │  └─ View Action                                             │
│  │                                                              │
│  └─ Details Modal                                              │
│     ├─ Full submission info                                    │
│     ├─ Admin notes                                             │
│     ├─ File download                                           │
│     └─ Approve/Reject buttons                                  │
│                                                                │
└──────────────────────────────────────────────────────────────────┘

┌────────────────── BACKEND PROCESSING ──────────────────────────┐
│                                                                 │
│  React Hooks                                                   │
│  ├─ useResearch()        → 11 research operations             │
│  ├─ useStorage()         → File upload/delete (3 buckets)    │
│  └─ useAdminAuth()       → Admin authentication               │
│                                                               │
│  Supabase Functions                                          │
│  ├─ research.js          → 10 database operations            │
│  ├─ storage.js           → Generic file operations           │
│  ├─ client.js            → Config (RESEARCH, RESEARCH_FILES) │
│  └─ content.js           → Existing operations               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌────────────────── SUPABASE INFRASTRUCTURE ──────────────────┐
│                                                             │
│  Database Tables                                          │
│  └─ research_submissions (17 columns)                    │
│     ├─ id, title, author, email                         │
│     ├─ topic, abstract, keywords, notes                 │
│     ├─ file_name, file_path                             │
│     ├─ status (pending_review, approved, rejected)      │
│     ├─ is_published (boolean)                           │
│     ├─ admin_notes                                      │
│     └─ timestamps (submission, published, created, updated) │
│                                                          │
│  Storage Buckets                                         │
│  ├─ research-files (PDF, DOC, DOCX uploads)            │
│  │  └─ submissions/ folder (user files)                │
│  ├─ impact-photos (existing)                           │
│  └─ testimonials (existing)                            │
│                                                         │
│  Indexes (5)                                           │
│  ├─ idx_research_status                               │
│  ├─ idx_research_is_published                         │
│  ├─ idx_research_email                                │
│  ├─ idx_research_created_at                           │
│  └─ idx_research_submission_date                      │
│                                                        │
│  Row-Level Security (RLS)                            │
│  ├─ Public can read published research               │
│  ├─ Public can insert submissions                    │
│  ├─ Admins can read all                              │
│  └─ Admins can update status                         │
│                                                       │
└───────────────────────────────────────────────────────┘

┌──────────────── INTERNATIONALIZATION ──────────────────┐
│                                                        │
│  Languages                                           │
│  ├─ English (en)      → Western languages           │
│  ├─ Dari (fa)         → RTL, Afghanistan            │
│  └─ Pashto (ps)       → RTL, Afghanistan/Pakistan   │
│                                                      │
│  Translation Strings                                │
│  ├─ UI labels & buttons                            │
│  ├─ Form fields & placeholders                     │
│  ├─ Success/error messages                         │
│  └─ Admin interface                                │
│                                                     │
└────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER SUBMISSION FLOW
─────────────────────────────────────────────

User Visits /research
        ↓
  [Renders Research.jsx]
        ↓
[Published Research Tab] OR [Submit Research Tab]
        ↓
┌─ PUBLISHED TAB ──────────────────────────────┐
│ useResearch.getPublished()                   │
│        ↓                                      │
│ Fetch from DB (is_published=true, status=approved) │
│        ↓                                      │
│ Display with Download Links                  │
│        ↓                                      │
│ User Downloads PDF/Word from research-files  │
└──────────────────────────────────────────────┘

┌─ SUBMIT TAB ─────────────────────────────────┐
│ User Fills Form (8 fields)                   │
│        ↓                                      │
│ Select File (PDF/DOC/DOCX)                   │
│        ↓                                      │
│ Validation (Type & Size <10MB)               │
│        ↓                                      │
│ useStorage.upload()                          │
│        ↓                                      │
│ File → research-files bucket                 │
│        ↓                                      │
│ Get publicUrl & path                         │
│        ↓                                      │
│ useResearch.submit(data + filePath)          │
│        ↓                                      │
│ Insert to DB (status=pending_review)         │
│        ↓                                      │
│ Success Message ✓                            │
│        ↓                                      │
│ Form Resets Auto                             │
└──────────────────────────────────────────────┘


ADMIN MANAGEMENT FLOW
─────────────────────────────────────────────

Admin Visits /admin/research
        ↓
[Requires Auth - useAdminAuth()]
        ↓
Load Dashboard [AdminResearch.jsx]
        ↓
useResearch.getAll() + useResearch.getStats()
        ↓
Display Statistics (5 panels)
        ↓
┌─ View Submission ────────────────────────┐
│ Click "View" on table row                │
│        ↓                                  │
│ Modal opens with details                │
│        ↓                                  │
│ Show file download link                 │
│        ↓                                  │
│ Add admin notes                         │
│        ↓                                  │
│ ┌─ APPROVE ──────┐   ┌─ REJECT ──────┐ │
│ │ useResearch    │   │ useResearch   │ │
│ │.updateStatus   │   │.updateStatus  │ │
│ │  (id,'approved')│   │  (id,'reject')│ │
│ └────────────────┘   └───────────────┘ │
│        ↓                   ↓             │
│ Status=approved      Status=rejected    │
│ is_published=false   Admin notes        │
│ (or true later)      Feedback sent      │
└─────────────────────────────────────────┘
```

## Component Tree

```
App.jsx (Router)
│
├─ /research
│  └─ Research.jsx (482 lines)
│     ├─ useResearch() → getPublished, submit
│     ├─ useStorage() → upload
│     └─ Renders:
│        ├─ Hero Component
│        ├─ Tab 1: Published Research List
│        │  ├─ Maps research array
│        │  └─ Download buttons
│        └─ Tab 2: Submit Form
│           ├─ Input fields (8)
│           ├─ File input with validation
│           └─ Submit button
│
└─ /admin/research
   └─ AdminDashboard (parent route)
      └─ AdminResearch.jsx (548 lines)
         ├─ useResearch() → getAll, updateStatus, remove, getStats
         ├─ useAdminAuth() → authentication
         └─ Renders:
            ├─ Statistics Panel (5 cards)
            ├─ Filter Buttons (4)
            ├─ Search Input
            ├─ Submissions Table
            └─ Details Modal
               ├─ Full submission info
               ├─ Download button
               ├─ Admin notes textarea
               └─ Approve/Reject buttons
```

## State Management Flow

```
RESEARCH.JSX (Public)
═════════════════════

State:
  ├─ activeTab: 'published' | 'submit'
  ├─ publishedResearch: []
  ├─ submitLoading: boolean
  ├─ fileUploading: boolean
  ├─ submitStatus: { success, error, message }
  └─ formData: { title, author, email, ... }

Hooks:
  ├─ useResearch() → { submit, getPublished, loading }
  ├─ useStorage() → { upload, uploading }
  └─ useLanguage() → { t }


ADMINRESEARCH.JSX (Admin)
═════════════════════════

State:
  ├─ submissions: []
  ├─ stats: { total, pending, approved, rejected, published }
  ├─ loading: boolean
  ├─ filter: 'all' | 'pending_review' | 'approved' | 'rejected'
  ├─ searchTerm: string
  ├─ selectedResearch: null | object
  ├─ adminNotes: string
  ├─ processing: boolean
  └─ toast: null | { type, message }

Hooks:
  ├─ useResearch() → { getAll, updateStatus, remove, getStats }
  └─ useAdminAuth() → { isAuthenticated, user }
```

## File Size & Complexity

```
FILES CREATED/MODIFIED
══════════════════════

NEW FILES:
┌─────────────────────────────────────────┐
│ src/components/Admin/AdminResearch.jsx  │
│ Size: 548 lines                         │
│ Complexity: Medium-High                 │
└─────────────────────────────────────────┘

MODIFIED FILES:
┌─────────────────────────────────────────┐
│ src/pages/Research.jsx                  │
│ Size: 482 lines (created)               │
│ Complexity: Medium                      │
│                                         │
│ src/supabase/research.js                │
│ Size: 261 lines (created)               │
│ Complexity: Low (CRUD operations)       │
│                                         │
│ src/hooks/useResearch.js                │
│ Size: 167 lines (created)               │
│ Complexity: Low (wrapper)               │
│                                         │
│ src/hooks/useStorage.js                 │
│ Size: 70 lines (updated)                │
│ Complexity: Low                         │
│                                         │
│ src/supabase/storage.js                 │
│ Size: +65 lines (updated)               │
│ Complexity: Low (file operations)       │
│                                         │
│ src/supabase/client.js                  │
│ Size: +2 lines (updated)                │
│ Complexity: None                        │
│                                         │
│ src/App.jsx                             │
│ Size: +2 lines (updated)                │
│ Complexity: None                        │
│                                         │
│ src/components/Admin/AdminDashboard.jsx │
│ Size: +2 lines (updated)                │
│ Complexity: None                        │
└─────────────────────────────────────────┘

TOTAL: ~2,000+ lines of code
```

## Database Design

```
research_submissions TABLE
═════════════════════════════════════════════

COLUMNS (17):
┌──────────────────────────────────────────┐
│ CORE FIELDS                              │
├──────────────────────────────────────────┤
│ id          │ BIGSERIAL PRIMARY KEY      │
│ title       │ TEXT NOT NULL              │
│ author      │ TEXT NOT NULL              │
│ email       │ TEXT NOT NULL              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ CONTENT FIELDS                           │
├──────────────────────────────────────────┤
│ topic              │ TEXT                │
│ abstract           │ TEXT NOT NULL       │
│ keywords           │ TEXT                │
│ additional_notes   │ TEXT                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ FILE FIELDS                              │
├──────────────────────────────────────────┤
│ file_name  │ TEXT                        │
│ file_path  │ TEXT                        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ STATUS FIELDS                            │
├──────────────────────────────────────────┤
│ status     │ TEXT DEFAULT 'pending_review'│
│            │ CHECK (status IN (...))     │
│ is_published│ BOOLEAN DEFAULT FALSE      │
│ admin_notes│ TEXT                        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ TIMESTAMP FIELDS                         │
├──────────────────────────────────────────┤
│ submission_date │ TIMESTAMPTZ DEFAULT NOW()
│ published_date  │ TIMESTAMPTZ             │
│ created_at      │ TIMESTAMPTZ DEFAULT NOW()
│ updated_at      │ TIMESTAMPTZ DEFAULT NOW()
└──────────────────────────────────────────┘

INDEXES (5):
  1. idx_research_status
  2. idx_research_is_published
  3. idx_research_email
  4. idx_research_created_at
  5. idx_research_submission_date

RLS POLICIES (3):
  1. Public read (published + approved)
  2. Public insert (new submissions)
  3. Authenticated (admin) read/write
```

## Performance Metrics

```
QUERY PERFORMANCE
═════════════════════════

Operation              │ Time   │ Indexed │ Notes
─────────────────────────────────────────────────────
Get published          │ O(1)   │ Yes     │ Count: is_published=true
Get all (admin)        │ O(n)   │ No      │ Full table scan
Filter by status       │ O(1)   │ Yes     │ Indexed on status
Search by email        │ O(1)   │ Yes     │ Indexed on email
Get statistics         │ O(1)   │ Yes     │ Count aggregates
Update status          │ O(1)   │ Primary │ Single row update
Insert submission      │ O(1)   │ Primary │ Single insert
Delete submission      │ O(1)   │ Primary │ Single delete

FILE UPLOAD
═════════════════════════

Max Size: 10 MB
Type: PDF, DOC, DOCX
Bucket: research-files (public)
Path: submissions/[timestamp]_[filename]
Upload Time: ~1-5 seconds (depends on internet)

STATISTICS
═════════════════════════

Concurrent Queries: ~5 (4 status counts + 1 total)
Time: ~500ms combined
Cached: No (real-time updates)
```

## Security Model

```
ROW LEVEL SECURITY (RLS)
════════════════════════

POLICY 1: Public Read Published
┌─────────────────────────────────┐
│ WHEN: SELECT                    │
│ WHO: Public (anon)              │
│ CONDITION:                      │
│  is_published = true AND        │
│  status = 'approved'            │
│ RESULT: ✓ Can read published   │
└─────────────────────────────────┘

POLICY 2: Public Insert
┌─────────────────────────────────┐
│ WHEN: INSERT                    │
│ WHO: Public (anon)              │
│ CONDITION: TRUE (no restriction)│
│ RESULT: ✓ Can submit research  │
└─────────────────────────────────┘

POLICY 3: Admin Access
┌─────────────────────────────────┐
│ WHEN: SELECT, UPDATE, DELETE    │
│ WHO: Authenticated (admin)      │
│ CONDITION:                      │
│ auth.role() = 'authenticated'   │
│ RESULT: ✓ Full access          │
└─────────────────────────────────┘

FILE UPLOAD VALIDATION
══════════════════════

CLIENT SIDE:
  ✓ Type check: PDF|DOC|DOCX
  ✓ Size check: < 10MB
  ✓ Prevent non-document uploads

SERVER SIDE:
  ✓ Bucket is public (but RLS protects db)
  ✓ Storage policies can restrict access
  ✓ File path immutable after upload
```

---

This complete visual architecture shows how all components, data flows, and security measures work together to provide a secure, scalable research management system.
