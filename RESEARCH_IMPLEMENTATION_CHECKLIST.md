# Research Module - Implementation Checklist

## ✅ Completed Implementation

### Frontend Components
- [x] `src/pages/Research.jsx` - Public research page with submission and published research tabs
- [x] `src/components/Admin/AdminResearch.jsx` - Admin management panel for research submissions
- [x] Updated `src/components/Admin/AdminDashboard.jsx` - Added research menu item with BookOpen icon

### Backend Functions
- [x] `src/supabase/research.js` - 10 database operations:
  - submitResearch()
  - getPublishedResearch()
  - getAllResearchSubmissions()
  - getResearchByStatus()
  - getResearchById()
  - updateResearchStatus()
  - publishResearch()
  - rejectResearch()
  - deleteResearch()
  - getResearchStats()

### Custom Hooks
- [x] `src/hooks/useResearch.js` - React hook for research operations
- [x] `src/hooks/useStorage.js` - Updated to support multiple buckets

### Storage Integration
- [x] `src/supabase/storage.js` - Updated with:
  - uploadFile(file, bucketName, folder) - Generic file upload
  - deleteFile(path, bucketName) - Generic file deletion

### Configuration
- [x] `src/supabase/client.js` - Added:
  - TABLES.RESEARCH: 'research_submissions'
  - BUCKETS.RESEARCH_FILES: 'research-files'
- [x] `src/App.jsx` - Added:
  - Import for AdminResearch component
  - Route: /admin/research

### Routing
- [x] Public route: `/research`
- [x] Admin route: `/admin/research`

### Database Schema
- [x] `research_schema.sql` - Complete table definition with:
  - 17 columns (id, title, author, email, topic, abstract, keywords, additional_notes, file_name, file_path, status, is_published, admin_notes, submission_date, published_date, created_at, updated_at)
  - 5 indexes (status, is_published, email, created_at, submission_date)
  - RLS policies for public read and authenticated full access

### Documentation
- [x] `RESEARCH_SETUP.md` - Comprehensive setup and usage guide

### Internationalization
- [x] Translation strings in public/locales/en.json
- [x] Translation strings in public/locales/dari.json
- [x] Translation strings in public/locales/pashto.json

## 📋 Remaining Setup Tasks

### Database Setup (Manual - Required)
1. **Copy and execute research_schema.sql in Supabase SQL Editor**:
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Copy contents of `research_schema.sql`
   - Execute to create table, indexes, and RLS policies

2. **Create 'research-files' Storage Bucket**:
   - Go to Supabase Dashboard > Storage
   - Click "New bucket"
   - Name: `research-files`
   - Make Public: YES
   - Click "Create bucket"

### Testing (Optional but Recommended)
- [ ] Test public research submission on `/research` page
- [ ] Verify file upload works (PDF/DOC/DOCX)
- [ ] Login to admin and navigate to `/admin/research`
- [ ] Approve a pending submission
- [ ] Verify approved research appears on public `/research` page

## 🔧 Configuration Verification

### Environment Variables
Ensure these are in your `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Dependencies
All required packages should be in `package.json`:
- react ≥ 19.0
- react-router-dom ≥ 7.9
- lucide-react (for icons)
- @supabase/supabase-js
- i18next & react-i18next

## 📱 Features Enabled

### Public Features
1. **View Published Research**
   - Display all approved and published research
   - Download research files
   - View author, abstract, keywords

2. **Submit Research**
   - Title, author, email (required)
   - Topic, abstract, keywords (required/optional mix)
   - PDF/Word document upload (max 10MB)
   - Form validation
   - Success feedback

### Admin Features
1. **Research Dashboard**
   - Statistics (total, pending, approved, rejected, published)
   - Filter by status
   - Search by title/author/email
   - View submission details
   - Approve with optional notes
   - Reject with required reason
   - Delete submissions

2. **Publication Workflow**
   - Pending Review → Approve → Publish
   - Admin notes at each stage
   - Researcher feedback on rejection

## 🔐 Security Features

1. **RLS Policies**
   - Public can only view published research
   - Public can submit (creates pending records)
   - Only admins can view all and modify status

2. **File Upload Validation**
   - Client-side: Type and size checks
   - Allowed types: PDF, DOC, DOCX
   - Max size: 10MB

3. **Authentication**
   - Public submission doesn't require login
   - Admin features require admin login
   - Admin authentication via useAdminAuth hook

## 🌐 Multi-Language Support

Supported languages:
- English (en)
- Dari (fa)
- Pashto (ps)

All UI text is translatable via i18next.

## 📊 Database Schema Reference

### research_submissions Table

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | BIGSERIAL | Yes (auto) | Primary key |
| title | TEXT | Yes | Paper title |
| author | TEXT | Yes | Author name |
| email | TEXT | Yes | Contact email |
| topic | TEXT | No | Research topic |
| abstract | TEXT | Yes | Paper abstract |
| keywords | TEXT | No | Comma-separated |
| additional_notes | TEXT | No | Extra info |
| file_name | TEXT | No | Original filename |
| file_path | TEXT | No | Storage path |
| status | TEXT | Yes | pending_review, approved, rejected |
| is_published | BOOLEAN | No | Public visibility |
| admin_notes | TEXT | No | Admin feedback |
| submission_date | TIMESTAMPTZ | No | When submitted |
| published_date | TIMESTAMPTZ | No | When published |
| created_at | TIMESTAMPTZ | No | Record created |
| updated_at | TIMESTAMPTZ | No | Last modified |

## 🚀 Deployment Checklist

- [ ] Database schema deployed
- [ ] Storage bucket created
- [ ] Environment variables configured
- [ ] All imports verified (no missing files)
- [ ] No console errors in development
- [ ] Build successfully (`npm run build`)
- [ ] Test public submission flow
- [ ] Test admin approval flow
- [ ] Verify translations display correctly
- [ ] Test on mobile (responsive design)

## 📞 Support

For issues or questions:
1. Check `RESEARCH_SETUP.md` troubleshooting section
2. Verify Supabase credentials in `.env`
3. Check browser console for error messages
4. Verify database table and storage bucket exist
5. Check RLS policies are enabled

## 🔄 Workflow Summary

```
User visits /research
    ↓
Views published research (approved + published)
    ↓
Clicks "Submit Research"
    ↓
Fills form + uploads file
    ↓
Submits (status = pending_review)
    ↓
Email notification to admin (optional feature)
    ↓
Admin reviews at /admin/research
    ↓
Admin approves and publishes
    ↓
Research visible on /research page
    ↓
Users can download PDF
```

## Notes

- File uploads to `submissions/` folder in research-files bucket
- All timestamps stored as TIMESTAMPTZ (timezone aware)
- RLS policies prevent unauthorized access
- Statistics updated in real-time
- No email notifications yet (future enhancement)
