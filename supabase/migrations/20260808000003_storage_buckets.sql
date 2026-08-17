-- Migration: 20260808000003_storage_buckets.sql
-- Description: Storage Buckets Creation and Storage RLS Policies.

--------------------------------------------------------------------------------
-- CREATE STORAGE BUCKETS
--------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('resources', 'resources', true, 52428800, NULL),
    ('course-materials', 'course-materials', false, 52428800, NULL),
    ('news-images', 'news-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

--------------------------------------------------------------------------------
-- STORAGE RLS POLICIES (storage.objects)
--------------------------------------------------------------------------------

-- 1. AVATARS
CREATE POLICY "Public avatars viewable by all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users upload avatars to own folder"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users update own avatars"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users delete own avatars"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 2. RESOURCES
CREATE POLICY "Public resources viewable by all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users upload resources"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Uploaders and admins delete resources"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'resources' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            public.is_admin(auth.uid())
        )
    );

-- 3. COURSE MATERIALS
CREATE POLICY "Authenticated users view course materials"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'course-materials');

CREATE POLICY "Trainers and admins upload course materials"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'course-materials' AND (
            public.has_role(auth.uid(), 'Trainer') OR
            public.is_admin(auth.uid())
        )
    );

-- 4. NEWS IMAGES
CREATE POLICY "Public view news images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'news-images');

CREATE POLICY "Moderators and admins upload news images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'news-images' AND (
            public.has_role(auth.uid(), 'Moderator') OR
            public.is_admin(auth.uid())
        )
    );

-- 5. COMPANY LOGOS
CREATE POLICY "Public view company logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'company-logos');

CREATE POLICY "Recruiters and admins upload company logos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'company-logos' AND (
            public.has_role(auth.uid(), 'Recruiter') OR
            public.is_admin(auth.uid())
        )
    );

-- 6. RESUMES
CREATE POLICY "Applicants and recruiters view resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'resumes' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            public.has_role(auth.uid(), 'Recruiter') OR
            public.is_admin(auth.uid())
        )
    );

CREATE POLICY "Applicants upload resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'resumes' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
