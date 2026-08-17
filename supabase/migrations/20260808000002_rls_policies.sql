-- Migration: 20260808000002_rls_policies.sql
-- Description: Production-Ready Row Level Security (RLS) Policies for all 17 Tables.

--------------------------------------------------------------------------------
-- ENABLE RLS ON ALL 17 TABLES
--------------------------------------------------------------------------------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 1. ROLES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Roles are viewable by everyone"
    ON public.roles FOR SELECT
    USING (true);

CREATE POLICY "Super Admins manage roles"
    ON public.roles FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 2. ORGANIZATIONS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public can view active organizations"
    ON public.organizations FOR SELECT
    USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create organizations"
    ON public.organizations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Organization managers and admins can update organizations"
    ON public.organizations FOR UPDATE
    TO authenticated
    USING (
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.organization_id = public.organizations.id
            AND public.has_role(auth.uid(), 'Recruiter')
        )
    );

CREATE POLICY "Admins can delete organizations"
    ON public.organizations FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 3. PROFILES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (deleted_at IS NULL);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 4. FORUM CATEGORIES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Forum categories viewable by everyone"
    ON public.forum_categories FOR SELECT
    USING (true);

CREATE POLICY "Admins manage forum categories"
    ON public.forum_categories FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 5. FORUM POSTS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view published posts"
    ON public.forum_posts FOR SELECT
    USING (
        (status = 'published' AND deleted_at IS NULL) OR
        (auth.uid() = author_id) OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Authenticated users create posts"
    ON public.forum_posts FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and moderators update posts"
    ON public.forum_posts FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Authors and moderators delete posts"
    ON public.forum_posts FOR DELETE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

--------------------------------------------------------------------------------
-- 6. FORUM COMMENTS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view comments"
    ON public.forum_comments FOR SELECT
    USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users create comments"
    ON public.forum_comments FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and moderators update comments"
    ON public.forum_comments FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Authors and moderators delete comments"
    ON public.forum_comments FOR DELETE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

--------------------------------------------------------------------------------
-- 7. FORUM LIKES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view forum likes"
    ON public.forum_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users insert likes"
    ON public.forum_likes FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users delete own likes"
    ON public.forum_likes FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

--------------------------------------------------------------------------------
-- 8. RESOURCE CATEGORIES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Resource categories viewable by everyone"
    ON public.resource_categories FOR SELECT
    USING (true);

CREATE POLICY "Admins manage resource categories"
    ON public.resource_categories FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 9. RESOURCES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view resources based on access level"
    ON public.resources FOR SELECT
    USING (
        deleted_at IS NULL AND (
            access_level = 'public' OR
            (access_level = 'authenticated' AND auth.uid() IS NOT NULL) OR
            uploader_id = auth.uid() OR
            public.is_admin(auth.uid())
        )
    );

CREATE POLICY "Authenticated users upload resources"
    ON public.resources FOR INSERT
    TO authenticated
    WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Uploaders and admins update resources"
    ON public.resources FOR UPDATE
    TO authenticated
    USING (uploader_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Uploaders and admins delete resources"
    ON public.resources FOR DELETE
    TO authenticated
    USING (uploader_id = auth.uid() OR public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 10. JOBS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view active jobs"
    ON public.jobs FOR SELECT
    USING (
        (status = 'active' AND deleted_at IS NULL) OR
        recruiter_id = auth.uid() OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Recruiters and Admins create jobs"
    ON public.jobs FOR INSERT
    TO authenticated
    WITH CHECK (
        recruiter_id = auth.uid() AND
        (public.has_role(auth.uid(), 'Recruiter') OR public.is_admin(auth.uid()))
    );

CREATE POLICY "Recruiters manage own jobs"
    ON public.jobs FOR UPDATE
    TO authenticated
    USING (recruiter_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Recruiters delete own jobs"
    ON public.jobs FOR DELETE
    TO authenticated
    USING (recruiter_id = auth.uid() OR public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 11. JOB APPLICATIONS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Applicants and recruiters view applications"
    ON public.job_applications FOR SELECT
    TO authenticated
    USING (
        applicant_id = auth.uid() OR
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = public.job_applications.job_id AND j.recruiter_id = auth.uid()
        )
    );

CREATE POLICY "Users apply for jobs"
    ON public.job_applications FOR INSERT
    TO authenticated
    WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Recruiters update application status"
    ON public.job_applications FOR UPDATE
    TO authenticated
    USING (
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = public.job_applications.job_id AND j.recruiter_id = auth.uid()
        )
    );

--------------------------------------------------------------------------------
-- 12. COURSES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view published courses"
    ON public.courses FOR SELECT
    USING (
        (status = 'published' AND deleted_at IS NULL) OR
        trainer_id = auth.uid() OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Trainers and Admins create courses"
    ON public.courses FOR INSERT
    TO authenticated
    WITH CHECK (
        trainer_id = auth.uid() AND
        (public.has_role(auth.uid(), 'Trainer') OR public.is_admin(auth.uid()))
    );

CREATE POLICY "Trainers manage own courses"
    ON public.courses FOR UPDATE
    TO authenticated
    USING (trainer_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Trainers delete own courses"
    ON public.courses FOR DELETE
    TO authenticated
    USING (trainer_id = auth.uid() OR public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 13. COURSE ENROLLMENTS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Students and trainers view enrollments"
    ON public.course_enrollments FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = public.course_enrollments.course_id AND c.trainer_id = auth.uid()
        )
    );

CREATE POLICY "Students enroll in courses"
    ON public.course_enrollments FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own progress / Trainers update status"
    ON public.course_enrollments FOR UPDATE
    TO authenticated
    USING (
        student_id = auth.uid() OR
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = public.course_enrollments.course_id AND c.trainer_id = auth.uid()
        )
    );

--------------------------------------------------------------------------------
-- 14. NEWS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Public view published news"
    ON public.news FOR SELECT
    USING (
        (status = 'published' AND deleted_at IS NULL) OR
        author_id = auth.uid() OR
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

CREATE POLICY "Moderators and Admins manage news"
    ON public.news FOR ALL
    TO authenticated
    USING (
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    )
    WITH CHECK (
        public.has_role(auth.uid(), 'Moderator') OR
        public.is_admin(auth.uid())
    );

--------------------------------------------------------------------------------
-- 15. CONTACT MESSAGES POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins view and manage contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 16. NOTIFICATIONS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Users view own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

--------------------------------------------------------------------------------
-- 17. AUDIT LOGS POLICIES
--------------------------------------------------------------------------------
CREATE POLICY "Admins view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));
