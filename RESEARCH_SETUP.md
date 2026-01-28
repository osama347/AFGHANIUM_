# Research Module Setup Guide

## Overview

The Research module enables AFGHANIUM to collect, manage, and publish academic research papers and publications. The system supports a two-part workflow:

1. **Public Research Submission**: Researchers can submit papers for review
2. **Admin Management**: Administrators can review, approve, reject, and publish research

## Database Setup

### 1. Create the Research Table

Run the SQL from `research_schema.sql` in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.research_submissions (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT,
    abstract TEXT NOT NULL,
    keywords TEXT,
    additional_notes TEXT,
    file_name TEXT,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review',
    is_published BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    published_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Create Storage Bucket

In Supabase Dashboard > Storage:
- Create a new bucket named `research-files`
- Set visibility to **Public**
- This bucket stores uploaded PDF and Word documents

### 3. Enable RLS Policies

The schema includes RLS (Row Level Security) policies:
- Public can **view** published research (is_published = true AND status = 'approved')
- Public can **insert** new research submissions
- Authenticated users (admins) can **view and modify** all submissions

## File Structure

### Frontend Components

#### `src/pages/Research.jsx`
- Public-facing research page
- Two tabs: "Published Research" and "Submit Research"
- **Published Tab**: Displays approved and published research with download links
- **Submit Tab**: Form for submitting new research with file upload
- Features:
  - File validation (PDF/DOC/DOCX only, max 10MB)
  - Form validation
  - Success/error feedback
  - Auto-reset after submission

#### `src/components/Admin/AdminResearch.jsx`
- Admin panel for research management
- Features:
  - View all submissions in a table
  - Filter by status (All, Pending Review, Approved, Rejected)
  - Search by title, author, or email
  - View submission details
  - Approve/Reject submissions with notes
  - Delete submissions
  - Statistics dashboard (total, pending, approved, rejected, published)

### Supabase Functions

#### `src/supabase/research.js`
Database operations for research:
- `submitResearch(researchData)` - Submit new research
- `getPublishedResearch()` - Get published papers
- `getAllResearchSubmissions()` - Get all submissions (admin)
- `getResearchByStatus(status)` - Filter by status
- `getResearchById(id)` - Get single submission
- `updateResearchStatus(id, status, adminNotes)` - Update status and notes
- `publishResearch(id)` - Publish approved research
- `rejectResearch(id, rejectionReason)` - Reject submission
- `deleteResearch(id)` - Delete submission
- `getResearchStats()` - Get statistics

### Custom Hooks

#### `src/hooks/useResearch.js`
React hook for research operations with state management:
```javascript
const { 
  loading,
  error,
  submit,
  getPublished,
  getAll,
  updateStatus,
  remove,
  getStats
} = useResearch();
```

#### `src/hooks/useStorage.js` (Updated)
Enhanced to support multiple buckets:
```javascript
const { upload, remove } = useStorage();

// Upload to research-files bucket
await upload(file, 'research-files', 'submissions');

// Upload to impact-photos bucket
await upload(file, 'impact-photos', 'general');
```

### Storage Functions

#### `src/supabase/storage.js` (Updated)
Generic file operations:
- `uploadFile(file, bucketName, folder)` - Upload any file type
- `deleteFile(path, bucketName)` - Delete from any bucket
- `uploadImage(file, folder)` - Upload images (for backward compatibility)
- `deleteImage(path)` - Delete images (for backward compatibility)

## Routes

### Public Routes
- `/research` - Public research page (view published research, submit papers)

### Admin Routes
- `/admin/research` - Research management dashboard
  - Navigation menu item in admin sidebar
  - Requires admin authentication

## Usage

### For Users (Public Research Submission)

1. Navigate to `/research`
2. Click "Submit Research" tab
3. Fill out the form:
   - Title (required)
   - Author Name (required)
   - Email (required)
   - Topic (optional)
   - Abstract (required)
   - Keywords (optional, comma-separated)
   - Additional Notes (optional)
   - Upload PDF/Word document (required, max 10MB)
4. Click "Submit Research"
5. Success message displays, form resets

### For Admins (Research Management)

1. Navigate to `/admin/research`
2. View statistics:
   - Total submissions
   - Pending review count
   - Approved count
   - Rejected count
   - Published count
3. Filter submissions:
   - All
   - Pending Review
   - Approved
   - Rejected
4. Search by title, author, or email
5. Click "View" to see details
6. For pending submissions:
   - Add admin notes
   - Click "Approve" to accept
   - Click "Reject" to decline (requires notes)
7. Published research is visible to public

## Workflow States

```
Submitted
    ↓
Pending Review (awaiting admin)
    ├→ Approved → Published (visible to public)
    └→ Rejected (not visible to public)
```

## Form Fields

### Submission Form

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| Title | Text | Yes | Unlimited | Research paper title |
| Author | Text | Yes | Unlimited | Author's full name |
| Email | Email | Yes | 255 | Contact email |
| Topic | Text | No | Unlimited | Research topic/area |
| Abstract | Textarea | Yes | Unlimited | Paper abstract |
| Keywords | Text | No | Unlimited | Comma-separated keywords |
| Notes | Textarea | No | Unlimited | Additional information |
| File | File | Yes | 10MB | PDF, DOC, or DOCX |

## File Upload Constraints

- **Allowed Types**: PDF (.pdf), Word (.doc, .docx)
- **Max Size**: 10MB
- **Storage Path**: `submissions/[timestamp]_[filename]`
- **Bucket**: `research-files`

## Admin Notes

Admin notes can be added to:
- Pending submissions before approval/rejection
- Rejected submissions (explains rejection reason)
- Used to provide feedback to researchers

## Statistics

The admin dashboard displays:
- **Total Submissions**: All research ever submitted
- **Pending Review**: Awaiting admin decision
- **Approved**: Admin approved (may or may not be published)
- **Rejected**: Admin rejected (not visible to public)
- **Published**: Visible to public on research page

## Security Considerations

1. **File Upload Validation**:
   - Client-side: Type and size checks
   - Server-side: RLS policies prevent unauthorized access

2. **Row Level Security (RLS)**:
   - Public users can only see published, approved research
   - Public can insert submissions (creates pending records)
   - Only authenticated admins can see all submissions and modify status

3. **Email Verification** (Optional Enhancement):
   - Currently stores email with submission
   - Could be enhanced to send confirmation emails

## Internationalization (i18n)

The research module supports 3 languages:
- English (en)
- Dari (fa)
- Pashto (ps)

Translation keys are in `public/locales/{language}.json`:
```json
"research": {
  "title": "Research",
  "subtitle": "Published Research & Academic Papers",
  "tabs": {
    "published": "Published Research",
    "submit": "Submit Research"
  }
}
```

## Email Integration (Optional)

For future enhancement, you can add email notifications:
- Notify admins when new research is submitted
- Notify researchers when their submission is reviewed
- Notify researchers when research is published

Use Supabase Edge Functions or a third-party service like Sendgrid.

## Troubleshooting

### File Upload Fails
- Check file type (must be PDF/DOC/DOCX)
- Check file size (max 10MB)
- Verify `research-files` bucket exists and is public
- Check browser console for error messages

### Admin Can't See Submissions
- Verify admin is logged in
- Check Supabase RLS policies are enabled
- Verify user has admin role

### Published Research Not Visible
- Confirm `is_published = true` and `status = 'approved'`
- Check RLS policies allow public read
- Try refreshing the page

### Storage Bucket Errors
- Create bucket in Supabase Storage console
- Set bucket to public
- Verify bucket name is `research-files`

## Testing

To test the research module:

1. **Public Submission**:
   - Go to `/research`
   - Fill form and submit
   - Check Supabase table for new record with `status = 'pending_review'`

2. **Admin Approval**:
   - Login to admin panel
   - Navigate to Research
   - Click "View" on pending submission
   - Click "Approve"
   - Check status changed to "approved"

3. **Public Visibility**:
   - After approval, submission should appear in "Published Research" tab if `is_published = true`
   - Regular users on `/research` page should see it

## API Reference

### submitResearch
```javascript
const result = await submitResearch({
  title: "Paper Title",
  author: "Author Name",
  email: "author@example.com",
  topic: "AI Research",
  abstract: "Paper abstract...",
  keywords: "AI, ML, Neural Networks",
  message: "Additional notes...",
  filePath: "submissions/1234567_paper.pdf",
  fileName: "paper.pdf"
});
// Returns: { success: true, data: {...} } or { success: false, error: "message" }
```

### getPublishedResearch
```javascript
const result = await getPublishedResearch();
// Returns array of published research papers
```

### updateResearchStatus
```javascript
const result = await updateResearchStatus(id, 'approved', 'Looks good!');
// Or for rejection:
const result = await updateResearchStatus(id, 'rejected', 'Need revisions');
```

## Future Enhancements

- [ ] Email notifications to researchers
- [ ] Email notifications to admins
- [ ] PDF preview in admin panel
- [ ] Batch operations (approve multiple)
- [ ] Research categories/tags
- [ ] Citation counter
- [ ] Research comments section
- [ ] Download analytics
- [ ] Automated spam detection
- [ ] Author profile page
