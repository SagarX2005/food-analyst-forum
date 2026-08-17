-- Seed Data: supabase/seed.sql
-- Description: Realistic production-grade seed data for Food Analyst Forum (FAF).

--------------------------------------------------------------------------------
-- 1. SEED ROLES
--------------------------------------------------------------------------------
INSERT INTO public.roles (id, name, description)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Guest', 'Anonymous user with read-only public access'),
    ('a0000000-0000-0000-0000-000000000002', 'User', 'Standard registered analyst community member'),
    ('a0000000-0000-0000-0000-000000000003', 'Recruiter', 'Corporate recruiter managing job postings'),
    ('a0000000-0000-0000-0000-000000000004', 'Trainer', 'Certified instructor creating lab & analysis courses'),
    ('a0000000-0000-0000-0000-000000000005', 'Moderator', 'Community moderator managing posts and news'),
    ('a0000000-0000-0000-0000-000000000006', 'Admin', 'Platform administrator managing operations'),
    ('a0000000-0000-0000-0000-000000000007', 'Super Admin', 'Full system access bypassing RLS')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

--------------------------------------------------------------------------------
-- 2. SEED ORGANIZATIONS
--------------------------------------------------------------------------------
INSERT INTO public.organizations (id, name, type, logo_url, website, email, phone, address, city, state, country, verified)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Eurofins Food Testing Lab', 'Laboratories', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=150', 'https://eurofins.com', 'contact@eurofins-food.com', '+1-800-555-0199', '100 BioTech Way', 'Boston', 'MA', 'USA', true),
    ('b0000000-0000-0000-0000-000000000002', 'Nestlé Quality Assurance Center', 'Companies', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150', 'https://nestle.com', 'qa@nestle.com', '+41-21-924-1111', 'Avenue Nestlé 55', 'Vevey', 'Vaud', 'Switzerland', true),
    ('b0000000-0000-0000-0000-000000000003', 'Institute of Food Technologists (IFT)', 'Institutes', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150', 'https://ift.org', 'info@ift.org', '+1-312-782-8424', '225 W Washington St', 'Chicago', 'IL', 'USA', true),
    ('b0000000-0000-0000-0000-000000000004', 'Global Food Safety Training Academy', 'Training Centers', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150', 'https://gfstacademy.com', 'enroll@gfstacademy.com', '+44-20-7946-0912', '12 Innovation Square', 'London', 'Greater London', 'UK', true)
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------------------------------
-- 3. SEED AUTH USERS & PROFILES
--------------------------------------------------------------------------------
-- Note: In Supabase production, auth.users is populated by Supabase Auth service.
-- We seed auth.users for local development test environments.

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'superadmin@foodanalyst.org', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "Dr. Sarah Jenkins"}', 'authenticated', 'authenticated', now(), now()),
    ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'admin@foodanalyst.org', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "Marcus Vance"}', 'authenticated', 'authenticated', now(), now()),
    ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'moderator@foodanalyst.org', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "Elena Rostova"}', 'authenticated', 'authenticated', now(), now()),
    ('c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'recruiter@eurofins.com', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "David Sterling"}', 'authenticated', 'authenticated', now(), now()),
    ('c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'trainer@gfstacademy.com', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "Prof. Alan Turing"}', 'authenticated', 'authenticated', now(), now()),
    ('c0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'analyst@foodlab.com', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEF', now(), '{"full_name": "Priya Sharma"}', 'authenticated', 'authenticated', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, avatar_url, headline, bio, role_id, organization_id)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'superadmin@foodanalyst.org', 'Dr. Sarah Jenkins', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Chief Food Safety Scientist & Super Admin', '20+ years of experience in food microbiology and global regulatory standards.', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000002', 'admin@foodanalyst.org', 'Marcus Vance', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Operations Lead & System Admin', 'Managing lab verification and enterprise partner integrations.', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000003', 'moderator@foodanalyst.org', 'Elena Rostova', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Senior Quality Assurance Specialist', 'Community manager passionate about ISO 17025 compliance.', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000004', 'recruiter@eurofins.com', 'David Sterling', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Talent Acquisition Manager at Eurofins', 'Connecting food analysts with leading laboratory careers.', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000005', 'trainer@gfstacademy.com', 'Prof. Alan Turing', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Principal Analytical Chemist & Lead Instructor', 'Specializing in HPLC-MS/MS pesticide residue analysis.', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000006', 'analyst@foodlab.com', 'Priya Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Food Microbiology Analyst', 'Conducting pathogen testing and shelf-life studies in accredited laboratories.', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    headline = EXCLUDED.headline,
    bio = EXCLUDED.bio,
    role_id = EXCLUDED.role_id,
    organization_id = EXCLUDED.organization_id;

--------------------------------------------------------------------------------
-- 4. SEED FORUM CATEGORIES
--------------------------------------------------------------------------------
INSERT INTO public.forum_categories (id, name, slug, description, icon, display_order)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Food Safety & Microbiology', 'food-safety-microbiology', 'Discussions on Salmonella, Listeria, PCR testing, and hygiene standards', 'ShieldCheck', 1),
    ('d0000000-0000-0000-0000-000000000002', 'Analytical Chemistry', 'analytical-chemistry', 'HPLC, GC-MS, LC-MS, heavy metals, and nutritional assay methodologies', 'FlaskConical', 2),
    ('d0000000-0000-0000-0000-000000000003', 'Regulatory Compliance & ISO', 'regulatory-compliance-iso', 'ISO/IEC 17025, FSSAI, US FDA, EFSA regulations and lab audits', 'FileCheck', 3),
    ('d0000000-0000-0000-0000-000000000004', 'Quality Assurance & HACCP', 'quality-assurance-haccp', 'HACCP plans, critical control points, and GMP compliance', 'CheckCircle2', 4),
    ('d0000000-0000-0000-0000-000000000005', 'Career & Industry Insights', 'career-industry-insights', 'Job market, certification guidance, salary reports, and lab leadership', 'Briefcase', 5)
ON CONFLICT (slug) DO NOTHING;

--------------------------------------------------------------------------------
-- 5. SEED FORUM POSTS, COMMENTS, LIKES
--------------------------------------------------------------------------------
INSERT INTO public.forum_posts (id, author_id, category_id, title, slug, content, status, views_count)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'Best Practices for LC-MS/MS Pesticide Screening in Fresh Produce', 'best-practices-lc-ms-ms-pesticide-screening', 'When analyzing multi-pesticide residues in leafy greens, sample preparation matrix effects often suppress ion signals. What matrix cleanup methods (e.g. QuEChERS vs SPE) give you the best recovery rates for polar pesticides?', 'published', 142),
    ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Validation of Rapid PCR Methods for Listeria monocytogenes in Ready-To-Eat Foods', 'validation-rapid-pcr-listeria-monocytogenes', 'Rapid PCR assays offer 24-hour turnaround compared to 5-day culture methods. How are your labs handling ISO 16140 validation when replacing traditional culture methods?', 'published', 89)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.forum_comments (id, post_id, author_id, content)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'We switched to dSPE with d-PSA and C18 sorbents for QuEChERS, which dramatically improved recovery for organophosphates without co-extracting chlorophyll.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.forum_likes (post_id, user_id)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005'),
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

--------------------------------------------------------------------------------
-- 6. SEED RESOURCE CATEGORIES & RESOURCES
--------------------------------------------------------------------------------
INSERT INTO public.resource_categories (id, name, slug, description)
VALUES
    ('70000000-0000-0000-0000-000000000001', 'Standard Operating Procedures (SOPs)', 'sops', 'Standardized laboratory workflow manuals and guidelines'),
    ('70000000-0000-0000-0000-000000000002', 'ISO Guidelines & Templates', 'iso-guidelines', 'ISO 17025 audit checklists, uncertainty estimation templates'),
    ('70000000-0000-0000-0000-000000000003', 'Methodology Testing Manuals', 'methodology-manuals', 'Validation protocols for HPLC, AAS, GC-FID, and microbiological assays')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.resources (id, uploader_id, category_id, title, description, file_url, file_type, file_size_bytes, access_level, downloads_count)
VALUES
    ('80000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002', 'ISO/IEC 17025:2017 Internal Audit Checklist Template', 'Comprehensive checklist covering Clause 4 to Clause 8 for food testing laboratory accreditation.', 'https://storage.foodanalyst.org/resources/iso-17025-audit-checklist.pdf', 'application/pdf', 1048576, 'public', 342),
    ('80000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000003', 'HPLC Method Validation Protocol (ICH & AOAC Compliant)', 'Complete Excel template calculating accuracy, precision (RSD), LOD, LOQ, and linearity.', 'https://storage.foodanalyst.org/resources/hplc-validation-template.xlsx', 'application/vnd.ms-excel', 524288, 'authenticated', 189)
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------------------------------
-- 7. SEED JOBS & APPLICATIONS
--------------------------------------------------------------------------------
INSERT INTO public.jobs (id, organization_id, recruiter_id, title, slug, description, location, job_type, experience_level, salary_range, status)
VALUES
    ('90000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Senior Analytical Chemist (HPLC/LC-MS)', 'senior-analytical-chemist-hplc-lcms', 'Eurofins is seeking an experienced Analytical Chemist to lead pesticide and contaminant testing. Must have 5+ years experience in ISO 17025 environment.', 'Boston, MA (On-site)', 'full_time', 'Senior Level', '$85,000 - $110,000', 'active'),
    ('90000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'Food Safety & Hygiene Auditor', 'food-safety-hygiene-auditor', 'Conduct supplier audit inspections, HACCP verifications, and pathogen risk assessments across regional supply chains.', 'Chicago, IL (Hybrid)', 'full_time', 'Mid Level', '$75,000 - $90,000', 'active')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.job_applications (id, job_id, applicant_id, resume_url, cover_letter, status)
VALUES
    ('a1000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'https://storage.foodanalyst.org/resumes/priya-sharma-resume.pdf', 'I have over 4 years of hands-on experience in LC-MS pesticide quantification and ISO accredited routine testing.', 'reviewing')
ON CONFLICT (job_id, applicant_id) DO NOTHING;

--------------------------------------------------------------------------------
-- 8. SEED COURSES & ENROLLMENTS
--------------------------------------------------------------------------------
INSERT INTO public.courses (id, organization_id, trainer_id, title, slug, description, cover_image_url, level, duration_hours, price, status)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005', 'Masterclass in HPLC Method Development for Food Contaminants', 'masterclass-hplc-method-development', 'Learn mobile phase optimization, column selection, sample extraction, and method validation according to AOAC standards.', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600', 'intermediate', 16.50, 199.00, 'published'),
    ('b1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005', 'ISO/IEC 17025 Lead Auditor Certification Course', 'iso-17025-lead-auditor-certification', 'Comprehensive guide to quality management systems, measurement uncertainty, proficiency testing, and internal audits.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 'advanced', 24.00, 349.00, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.course_enrollments (id, course_id, student_id, status, progress_percent)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'active', 45)
ON CONFLICT (course_id, student_id) DO NOTHING;

--------------------------------------------------------------------------------
-- 9. SEED NEWS
--------------------------------------------------------------------------------
INSERT INTO public.news (id, author_id, title, slug, summary, content, image_url, status)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'FSSAI Updates Maximum Residue Limits (MRLs) for Spices and Culinary Herbs', 'fssai-updates-mrls-spices-herbs', 'Regulatory authority releases revised guidelines for ethylene oxide and pesticide limits in exported spices.', 'The Food Safety and Standards Authority of India (FSSAI) has published updated regulations tightening MRL standards for spices. Testing laboratories are advised to update their screening suites immediately.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', 'published')
ON CONFLICT (slug) DO NOTHING;

--------------------------------------------------------------------------------
-- 10. SEED CONTACT MESSAGES, NOTIFICATIONS & AUDIT LOGS
--------------------------------------------------------------------------------
INSERT INTO public.contact_messages (id, name, email, subject, message, status)
VALUES
    ('e1000000-0000-0000-0000-000000000001', 'Robert Chen', 'robert.chen@labtech.com', 'Enterprise Laboratory Verification Request', 'We would like to register our laboratory on Food Analyst Forum and verify our accreditation details.', 'new')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notifications (id, user_id, type, title, message, link)
VALUES
    ('f1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'SYSTEM', 'Welcome to Food Analyst Forum', 'Your analyst profile is ready. Explore forums, resources, and job opportunities.', '/profile')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (id, user_id, action, entity_type, entity_id, details)
VALUES
    ('f2000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'SEED_INITIALIZED', 'system', NULL, '{"version": "1.0.0", "environment": "development"}')
ON CONFLICT (id) DO NOTHING;
