# Supabase Storage Setup & Security — Food Analyst Forum (FAF)

This document describes the Supabase Storage bucket configurations, access permissions, and RLS policies on `storage.objects` for **Food Analyst Forum (FAF)**.

---

## 🪣 Storage Buckets Configuration

| Bucket Name        |  Public Access   | Max File Size | Allowed MIME Types                                                                          | Intended Use                                                         |
| :----------------- | :--------------: | :-----------: | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------- |
| `avatars`          |     **Yes**      |     5 MB      | `image/jpeg`, `image/png`, `image/webp`, `image/gif`                                        | User profile avatars                                                 |
| `resources`        |     **Yes**      |     50 MB     | Any format                                                                                  | Public/Authenticated downloadable SOPs, templates, and lab protocols |
| `course-materials` | **No** (Private) |     50 MB     | Any format                                                                                  | Course files reserved for enrolled students and trainers             |
| `news-images`      |     **Yes**      |     10 MB     | `image/jpeg`, `image/png`, `image/webp`, `image/gif`                                        | News article cover images & graphics                                 |
| `company-logos`    |     **Yes**      |     5 MB      | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`                                    | Verified organization logos                                          |
| `resumes`          | **No** (Private) |     10 MB     | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument...` | Confidential applicant resumes                                       |

---

## 📁 Storage Folder Conventions

- **Avatars**: `avatars/<user_id>/avatar.png`
- **Resources**: `resources/<category_slug>/<file_name>`
- **Course Materials**: `course-materials/<course_id>/<file_name>`
- **News Images**: `news-images/<year>/<slug>/cover.jpg`
- **Company Logos**: `company-logos/<org_id>/logo.png`
- **Resumes**: `resumes/<applicant_id>/<job_id>_resume.pdf`

---

## 🔒 Storage Security Policies (`storage.objects`)

### 1. `avatars`

- **Read**: Public (`USING (bucket_id = 'avatars')`).
- **Write/Update/Delete**: Authenticated users restricted to their own folder path (`(storage.foldername(name))[1] = auth.uid()::text`).

### 2. `resumes`

- **Read**: Restricted to applicant (`(storage.foldername(name))[1] = auth.uid()::text`), verified Recruiters, or Admins.
- **Insert**: Authenticated applicants uploading to their own user ID folder (`(storage.foldername(name))[1] = auth.uid()::text`).

### 3. `course-materials`

- **Read**: Authenticated users enrolled in the course or trainers/admins.
- **Write**: Trainers and Admins only.
