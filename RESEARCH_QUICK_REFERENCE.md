# Research Module - Quick Reference Guide

## File Locations

```
src/
├── pages/
│   └── Research.jsx                    # Public research page (2 tabs)
├── components/Admin/
│   └── AdminResearch.jsx               # Admin management panel
├── hooks/
│   ├── useResearch.js                  # Research operations hook
│   └── useStorage.js                   # Storage operations hook (updated)
└── supabase/
    ├── research.js                     # 10 database operations
    ├── storage.js                      # File upload/delete functions
    └── client.js                       # Supabase config (updated)

public/locales/
├── en.json                             # English translations
├── dari.json                           # Dari translations
└── pashto.json                         # Pashto translations

Root:
├── research_schema.sql                 # Database schema
├── RESEARCH_SETUP.md                   # Comprehensive setup guide
└── RESEARCH_IMPLEMENTATION_CHECKLIST.md # Implementation checklist
```

## Quick API Reference

### useResearch Hook
```javascript
import { useResearch } from '../hooks/useResearch';

const { 
  loading,           // boolean
  error,             // error string or null
  submit,            // (researchData) => Promise
  getPublished,      // () => Promise
  getAll,            // () => Promise (admin)
  getByStatus,       // (status) => Promise (admin)
  updateStatus,      // (id, status, notes) => Promise (admin)
  remove,            // (id) => Promise (admin)
  getStats           // () => Promise (admin)
} = useResearch();
```

### useStorage Hook
```javascript
import { useStorage } from '../hooks/useStorage';

const {
  upload,            // (file, bucketName, folder) => Promise
  remove,            // (path, bucketName) => Promise
  uploading,         // boolean
  error,             // error string or null
  progress           // number (0-100)
} = useStorage();

// Usage:
const result = await upload(file, 'research-files', 'submissions');
if (result.success) {
  const filePath = result.data.path;
}
```

## Component Integration Examples

### Using in Research.jsx (Public)
```javascript
import { useResearch } from '../hooks/useResearch';
import { useStorage } from '../hooks/useStorage';

const Research = () => {
  const { submit, getPublished } = useResearch();
  const { upload } = useStorage();

  const handleSubmit = async (formData) => {
    // Upload file
    const uploadResult = await upload(
      formData.file, 
      'research-files', 
      'submissions'
    );
    
    if (uploadResult.success) {
      // Submit research with file path
      const result = await submit({
        ...formData,
        filePath: uploadResult.data.path
      });
    }
  };
};
```

### Using in AdminResearch.jsx (Admin)
```javascript
import { useResearch } from '../hooks/useResearch';

const AdminResearch = () => {
  const { 
    getAll,           // Get all submissions
    updateStatus,     // Approve/reject
    remove            // Delete
  } = useResearch();

  const handleApprove = async (id, notes) => {
    const result = await updateStatus(id, 'approved', notes);
  };

  const handleReject = async (id, reason) => {
    const result = await updateStatus(id, 'rejected', reason);
  };
};
```

## Database Operations

### Submit Research
```javascript
const result = await submitResearch({
  title: string,
  author: string,
  email: string,
  topic: string (optional),
  abstract: string,
  keywords: string (optional, comma-separated),
  message: string (optional),
  filePath: string,
  fileName: string
});
```

### Get Published Research
```javascript
const result = await getPublishedResearch();
// Returns: { success: true, data: [...] }
```

### Get All Submissions (Admin)
```javascript
const result = await getAllResearchSubmissions();
// Returns all submissions regardless of status
```

### Get by Status (Admin)
```javascript
const result = await getResearchByStatus('pending_review');
// status: 'pending_review' | 'approved' | 'rejected'
```

### Update Status (Admin)
```javascript
const result = await updateResearchStatus(id, 'approved', 'Looks good!');
const result = await updateResearchStatus(id, 'rejected', 'Needs revision');
```

### Get Statistics (Admin)
```javascript
const result = await getResearchStats();
// Returns: {
//   success: true,
//   data: {
//     total_submissions: number,
//     pending_review: number,
//     approved: number,
//     published: number
//   }
// }
```

## Routes

### Public Routes
```
GET /research              → Research page (published research + submit form)
```

### Admin Routes
```
GET /admin/research        → Research management dashboard
                             • View all submissions
                             • Filter by status
                             • Search submissions
                             • Approve/Reject submissions
                             • Delete submissions
                             • View statistics
```

## Translation Keys

### English (en.json)
```json
{
  "research": {
    "title": "Research",
    "subtitle": "Published Research & Academic Papers",
    "description": "...",
    "tabs": {
      "published": "Published Research",
      "submit": "Submit Research"
    },
    "publishedSection": {
      "title": "...",
      "subtitle": "..."
    },
    "submitSection": {
      "title": "...",
      "form": {
        "title": "...",
        "author": "...",
        // ... more fields
        "success": "...",
        "error": "..."
      }
    }
  }
}
```

Similar structure for dari.json and pashto.json.

## Status Workflow

```
PENDING_REVIEW
  ↓
  ├→ APPROVED (can be published or remain unpublished)
  │   ├→ PUBLISHED (visible to public)
  │   └→ UNPUBLISHED (only visible to admins)
  │
  └→ REJECTED (never visible to public)
```

## File Upload Rules

- **Allowed Types**: `.pdf`, `.doc`, `.docx`
- **Max Size**: 10MB (10,485,760 bytes)
- **Storage Path**: `submissions/[timestamp]_[filename]`
- **Bucket**: `research-files`
- **Visibility**: Public

Example path:
```
submissions/1704067200000_paper.pdf
```

## Error Handling

All functions return:
```javascript
{
  success: boolean,
  data?: T,
  error?: string
}
```

Always check `success` before accessing data:
```javascript
const result = await submit(formData);
if (result.success) {
  // Use result.data
} else {
  // Handle error: result.error
}
```

## Common Tasks

### Load published research for public page
```javascript
const { getPublished } = useResearch();
const result = await getPublished();
const papers = result.data;
```

### Admin: Get pending submissions
```javascript
const { getByStatus } = useResearch();
const result = await getByStatus('pending_review');
```

### Admin: Approve submission
```javascript
const { updateStatus } = useResearch();
await updateStatus(submissionId, 'approved', 'Approved!');
```

### Admin: Get statistics
```javascript
const { getStats } = useResearch();
const result = await getStats();
const { total_submissions, pending_review, approved, published } = result.data;
```

### Upload file
```javascript
const { upload } = useStorage();
const result = await upload(file, 'research-files', 'submissions');
if (result.success) {
  const path = result.data.path;
  const url = result.data.publicUrl;
}
```

## Debugging

### Check if table exists
```sql
SELECT * FROM research_submissions LIMIT 1;
```

### Check RLS policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'research_submissions';
```

### Check bucket exists
```javascript
// In browser console:
const buckets = await supabase.storage.listBuckets();
console.log(buckets);
```

### Clear browser cache
If research page doesn't update after database changes:
```javascript
// Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## Performance Tips

1. **Research listings**: Data is ordered by `submission_date DESC`
2. **Indexes**: Queries on `status`, `is_published`, `email`, `created_at` are optimized
3. **Pagination**: Consider implementing for large result sets
4. **Caching**: Admin panel refreshes on navigation changes
5. **File uploads**: Max 10MB prevents large uploads; consider progress indicator for better UX

## Security Reminders

1. ✅ RLS policies protect sensitive submissions
2. ✅ File uploads validated client-side and via bucket policies
3. ✅ Admin operations require authentication
4. ✅ Public can only see approved + published research
5. ⚠️ Consider CSRF protection for forms in production
6. ⚠️ Implement email verification for researcher notifications (future)

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| File upload fails | Check file type (PDF/DOC/DOCX) and size (<10MB) |
| Admin can't see submissions | Verify admin login, check RLS policies |
| Published research not visible | Confirm `is_published = true` AND `status = 'approved'` |
| Empty statistics | Check research_submissions table exists |
| 404 on research page | Verify route in App.jsx |
| Translations missing | Check public/locales/{lang}.json files |

## Next Steps

1. Execute `research_schema.sql` in Supabase
2. Create `research-files` storage bucket
3. Test public submission
4. Test admin approval
5. Verify published research appears on public page
6. (Optional) Add email notifications
7. (Optional) Add PDF preview in admin panel
