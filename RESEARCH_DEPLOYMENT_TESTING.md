# Research Module - Deployment & Testing Guide

## 🚀 Pre-Deployment Checklist

### Code Quality
- [x] No console errors
- [x] All imports resolved
- [x] No TypeScript errors
- [x] Consistent code style
- [x] Comments added where needed
- [x] Error handling implemented
- [x] Loading states in place
- [x] Form validation working

### Feature Completeness
- [x] Public research page functional
- [x] Admin research dashboard functional
- [x] File upload working
- [x] Form validation working
- [x] Statistics calculation working
- [x] Search and filter working
- [x] Approve/reject functionality
- [x] Multi-language support

### Security
- [x] RLS policies defined
- [x] File type validation
- [x] File size validation
- [x] Authentication required for admin
- [x] No sensitive data in client
- [x] Error messages don't leak info

---

## 📋 Database Deployment

### Step 1: Verify Supabase Connection

```javascript
// In browser console, run:
import { supabase } from './src/supabase/client.js';
console.log(supabase); // Should show client object
```

### Step 2: Execute SQL Schema

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your AFGHANIUM project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Execute Schema**
   - Copy entire contents of `research_schema.sql`
   - Paste into SQL editor
   - Click "Run"
   - Should execute without errors

4. **Verify Table Created**
   ```sql
   SELECT * FROM research_submissions LIMIT 1;
   ```
   - Should show table structure (might be empty)

### Step 3: Create Storage Bucket

1. **Navigate to Storage**
   - Click "Storage" in Supabase sidebar

2. **Create New Bucket**
   - Click "New bucket"
   - Name: `research-files`
   - Public: Toggle ON (public)
   - Click "Create bucket"

3. **Verify Bucket**
   - Should appear in bucket list
   - Should be labeled as "Public"

### Step 4: Verify Environment Variables

**In `.env` file:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these from:**
- Supabase Dashboard → Settings → API
- Copy `Project URL` and `anon` key

---

## 🧪 Testing Guide

### Test 1: Public Research Submission

**Objective:** Verify users can submit research

**Steps:**
1. Navigate to http://localhost:5173/research
2. Click "Submit Research" tab
3. Fill form:
   - Title: "Test Paper"
   - Author: "Test Author"
   - Email: "test@example.com"
   - Topic: "Test Topic"
   - Abstract: "Test abstract content"
   - Keywords: "test, paper, research"
   - File: Upload a test PDF or Word doc
4. Click "Submit Research"

**Expected Results:**
- ✅ Success message displays
- ✅ Form resets
- ✅ Message disappears after 5 seconds
- ✅ No console errors

**Verify in Supabase:**
```sql
SELECT * FROM research_submissions WHERE title = 'Test Paper';
```
- Should show 1 record with `status = 'pending_review'`
- File should exist in research-files bucket

---

### Test 2: Admin Dashboard Access

**Objective:** Verify admin can access research management

**Steps:**
1. Navigate to http://localhost:5173/admin
2. Login with admin credentials
3. Click "Research" in sidebar
4. Should see dashboard with statistics

**Expected Results:**
- ✅ Redirects to admin dashboard
- ✅ Research menu item visible
- ✅ Statistics panel shows counts
- ✅ Submission table loads
- ✅ Can see test submission in table

---

### Test 3: Filter & Search

**Objective:** Verify filtering and searching works

**Steps:**
1. On /admin/research dashboard
2. Try filtering:
   - Click "Pending Review" filter
   - Should show only pending submissions
   - Click "All" to reset

3. Try searching:
   - Type "Test" in search box
   - Should filter results
   - Clear search to reset

**Expected Results:**
- ✅ Filter buttons work
- ✅ Table updates in real-time
- ✅ Search results accurate
- ✅ No console errors

---

### Test 4: Approve Submission

**Objective:** Verify admin can approve research

**Steps:**
1. On /admin/research dashboard
2. Click "View" on pending submission
3. Modal opens
4. Add admin notes (optional): "Looks good!"
5. Click "Approve" button

**Expected Results:**
- ✅ Modal stays open
- ✅ Success message appears
- ✅ Modal closes
- ✅ Submission status changes to "Approved"
- ✅ No console errors

**Verify in Supabase:**
```sql
SELECT status, admin_notes FROM research_submissions WHERE id = 1;
```
- Should show `status = 'approved'`
- Should show admin notes

---

### Test 5: Reject Submission

**Objective:** Verify admin can reject research

**Steps:**
1. Submit another test research
2. On /admin/research, click "View"
3. Add rejection reason: "Needs more citations"
4. Click "Reject" button

**Expected Results:**
- ✅ Success message
- ✅ Status changes to "Rejected"
- ✅ Notes saved as rejection reason
- ✅ Modal closes

---

### Test 6: Publish & View Public

**Objective:** Verify published research appears publicly

**Steps:**
1. Approve a research submission
2. In admin modal, submit again for test
3. Approve new submission
4. Navigate to /research page
5. Click "Published Research" tab

**Expected Results:**
- ✅ Approved research appears in published list
- ✅ Title, author visible
- ✅ Download button available
- ✅ Click download → file downloads successfully

---

### Test 7: File Upload Validation

**Objective:** Verify file validation works

**Steps:**
1. On /research "Submit Research" tab
2. Try uploading invalid file:
   - Upload image (PNG/JPG)
   - Should show error: "Please upload a PDF or Word document"
3. Try uploading large file (>10MB)
   - Should show error: "File size must be less than 10MB"

**Expected Results:**
- ✅ File type validation works
- ✅ File size validation works
- ✅ Appropriate error messages
- ✅ Form not submitted with invalid file

---

### Test 8: Multi-Language Support

**Objective:** Verify translations work in all 3 languages

**Steps:**
1. Check browser for language selector
2. Switch to Dari
3. Navigate to /research
4. Verify all text translated
5. Switch to Pashto
6. Verify all text translated
7. Switch back to English

**Expected Results:**
- ✅ All UI text translates
- ✅ Form labels translated
- ✅ Buttons translated
- ✅ Messages translated
- ✅ No untranslated strings

---

### Test 9: Form Validation

**Objective:** Verify form validation prevents invalid submissions

**Steps:**
1. On /research "Submit Research" tab
2. Try submitting with blank fields:
   - Leave Title blank
   - Should show error requiring title
3. Try submitting without file
   - Should show error requiring file
4. Try submitting with invalid email
   - Should show validation error

**Expected Results:**
- ✅ Form prevents submission
- ✅ Clear error messages
- ✅ User can fix and retry
- ✅ No console errors

---

### Test 10: Delete Submission (Admin)

**Objective:** Verify admin can delete submissions

**Steps:**
1. On /admin/research, find a submission
2. (Note: Delete not in modal, may need additional feature)
3. Verify deletion removes from table

**Expected Results:**
- ✅ Submission removed
- ✅ Table updates
- ✅ Statistics decrease
- ✅ No console errors

---

## 🔍 Edge Cases Testing

### Test 11: Special Characters in Text

```
Submit research with:
- Title: "Research: Testing "Special" Characters & Symbols"
- Abstract: "Lorem ipsum... with émojis 🔬 and special chars: <>&"

Expected: All characters save and display correctly
```

### Test 12: Long Content

```
Submit research with:
- Very long title (500 characters)
- Very long abstract (5000+ characters)
- Many keywords (50+)

Expected: All content saves, displays correctly, no truncation unless UI specified
```

### Test 13: Rapid Submissions

```
Submit multiple research papers in quick succession (< 1 second apart)

Expected: All submissions process successfully, no race conditions
```

### Test 14: File Upload Interruption

```
Start file upload, pause/resume multiple times

Expected: Upload completes successfully OR shows clear error
```

### Test 15: Offline & Online Transitions

```
Disconnect internet during submission
Reconnect before timeout

Expected: Appropriate error message, user can retry
```

---

## 📊 Performance Testing

### Test 16: Large Result Sets

```sql
-- Insert 100+ research submissions
INSERT INTO research_submissions (title, author, email, abstract, status, created_at)
SELECT 
  'Test Paper ' || i,
  'Author ' || i,
  'test' || i || '@example.com',
  'Abstract text ' || i,
  CASE WHEN i % 3 = 0 THEN 'approved' ELSE 'pending_review' END,
  NOW() - INTERVAL '1 day' * i
FROM generate_series(1, 100) AS t(i);
```

**Test On /admin/research:**
- Dashboard should load in < 2 seconds
- Searching should be responsive
- Filtering should be fast
- No UI lag

---

### Test 17: Concurrent Admin Users

```
Open two browser windows with admin logged in
Make changes in one window
Verify other window reflects changes

Expected: Real-time updates (or refresh shows latest)
```

---

## 🐛 Debugging Guide

### No Results Showing

**Check:**
```sql
-- Verify table exists and has data
SELECT COUNT(*) FROM research_submissions;

-- Check RLS policies allow reads
SELECT * FROM pg_policies WHERE tablename = 'research_submissions';

-- Verify authentication status
-- (Open browser console)
console.log(supabase.auth.session());
```

### Upload Fails

**Check:**
1. Bucket exists: `research-files` ✓
2. Bucket is public ✓
3. File type is allowed ✓
4. File size < 10MB ✓
5. Network connection ✓
6. Browser console for errors ✓

### Filter Not Working

**Check:**
```javascript
// Verify filter state in React DevTools
// Check if useResearch is returning correct data
// Verify filter logic in AdminResearch.jsx
```

---

## 📱 Cross-Browser Testing

Test on:
- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari
- [x] Edge
- [x] Mobile (iPhone Safari)
- [x] Mobile (Android Chrome)

**Key Areas:**
- File upload input
- Modal dialog
- Form styling
- Button clicks
- Table rendering
- Responsive design

---

## ♿ Accessibility Testing

- [ ] Keyboard navigation (Tab through form)
- [ ] Screen reader text (alt text on images)
- [ ] Color contrast (buttons, text)
- [ ] Form labels associated with inputs
- [ ] Error messages clear and visible
- [ ] Modal has focus trap
- [ ] Close button accessible

---

## 📱 Mobile Testing

### iPhone (Safari)
- [ ] Responsive layout
- [ ] File picker works
- [ ] Touch targets large enough
- [ ] No horizontal scroll
- [ ] Modal usable on small screen

### Android (Chrome)
- [ ] Same checks as iPhone
- [ ] Back button behavior
- [ ] Keyboard doesn't hide important content
- [ ] Upload from camera works

---

## 🚀 Production Deployment Steps

### 1. Pre-Flight Check
```bash
# Build the project
npm run build

# Check for errors
npm run lint

# Run tests if available
npm run test
```

### 2. Database Migration
1. Backup current database
2. Execute research_schema.sql
3. Create research-files bucket
4. Verify tables and indexes

### 3. Environment Setup
1. Update production .env variables
2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
3. Test Supabase connection

### 4. Deploy Code
1. Push code to production branch
2. Deploy via your platform (Vercel, Netlify, etc.)
3. Run smoke tests on production

### 5. Post-Deployment
1. Verify /research page loads
2. Test public submission
3. Verify admin access
4. Check error logs

---

## 🔄 Rollback Procedure

If something goes wrong:

### Code Rollback
```bash
# Revert to previous commit
git revert <commit-hash>
git push production main
```

### Database Rollback
```bash
# Drop the research_submissions table
DROP TABLE IF EXISTS public.research_submissions CASCADE;

# Or restore from backup
-- Restore from Supabase backup
```

---

## 📈 Monitoring & Maintenance

### Weekly Checks
- [ ] Check for submission errors in logs
- [ ] Review pending submissions
- [ ] Verify upload success rate
- [ ] Check for failed approvals

### Monthly Checks
- [ ] Database size and growth
- [ ] Storage bucket usage
- [ ] User submissions trends
- [ ] Performance metrics

### Error Monitoring
Set up alerts for:
- Failed submissions
- Upload errors
- Database connection issues
- RLS policy violations

---

## 🎉 Sign-Off Checklist

Before marking as production-ready:

- [ ] All tests passing
- [ ] No console errors
- [ ] All features working
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Documentation complete
- [ ] Team reviewed code
- [ ] Backup created
- [ ] Runbook created
- [ ] Monitoring enabled

---

## 📞 Support Contacts

For issues during deployment:

1. **Supabase Issues**
   - Check Supabase status page
   - Contact Supabase support

2. **Code Issues**
   - Check browser console for errors
   - Review error logs
   - Check network requests in DevTools

3. **Database Issues**
   - Check SQL syntax
   - Verify RLS policies
   - Check table structure

---

## Success Criteria

The research module is successfully deployed when:

✅ Users can submit research on /research page
✅ Admins can view submissions on /admin/research
✅ Admins can approve/reject submissions
✅ Approved research displays publicly
✅ Users can download research files
✅ No console errors in browser
✅ All languages display correctly
✅ Responsive on mobile
✅ Performance is acceptable
✅ Database backups are working
