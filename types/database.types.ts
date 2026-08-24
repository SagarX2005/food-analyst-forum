export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RoleName =
  "User" | "Recruiter" | "Admin" | "Super Admin";

export type OrganizationType = "Laboratories" | "Companies" | "Institutes" | "Training Centers";

export type PostStatus = "draft" | "published" | "archived";
export type AccessLevel = "public" | "authenticated" | "restricted";
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type JobStatus = "draft" | "active" | "closed" | "expired";
export type ApplicationStatus = "submitted" | "reviewing" | "shortlisted" | "rejected" | "hired";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";
export type EnrollmentStatus = "active" | "completed" | "cancelled";
export type NewsStatus = "draft" | "published" | "archived";
export type ContactMessageStatus = "new" | "in_progress" | "resolved" | "archived";

// Phase 10A — Invite System
export type AccessRequestStatus =
  "pending" | "under_review" | "approved" | "rejected" | "invitation_sent" | "accepted" | "expired";
export type InvitationStatus = "pending" | "sent" | "accepted" | "expired" | "revoked";
export type InvitationApprovalRole = "User" | "Recruiter";

export type RecruiterApplicationStatus = "pending" | "approved" | "rejected" | "more_information_required";

export interface Database {
  public: {
    Tables: {
      access_requests: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          professional_title: string;
          organization: string;
          profession: string;
          experience_years: number;
          region: string;
          reason: string;
          linkedin_url: string | null;
          website_url: string | null;
          status: AccessRequestStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          approved_role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          professional_title: string;
          organization: string;
          profession: string;
          experience_years: number;
          region: string;
          reason: string;
          linkedin_url?: string | null;
          website_url?: string | null;
          status?: AccessRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          approved_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          professional_title?: string;
          organization?: string;
          profession?: string;
          experience_years?: number;
          region?: string;
          reason?: string;
          linkedin_url?: string | null;
          website_url?: string | null;
          status?: AccessRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          approved_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "access_requests_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      recruiter_applications: {
        Row: {
          id: string;
          user_id: string;
          organization_name: string;
          organization_website: string | null;
          organization_type: string | null;
          location: string | null;
          position: string;
          evidence: string | null;
          status: RecruiterApplicationStatus;
          rejection_reason: string | null;
          more_info_request: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_name: string;
          organization_website?: string | null;
          organization_type?: string | null;
          location?: string | null;
          position: string;
          evidence?: string | null;
          status?: RecruiterApplicationStatus;
          rejection_reason?: string | null;
          more_info_request?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_name?: string;
          organization_website?: string | null;
          organization_type?: string | null;
          location?: string | null;
          position?: string;
          evidence?: string | null;
          status?: RecruiterApplicationStatus;
          rejection_reason?: string | null;
          more_info_request?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recruiter_applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recruiter_applications_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      invitations: {
        Row: {
          id: string;
          request_id: string;
          email: string;
          token_hash: string;
          assigned_role: InvitationApprovalRole;
          status: InvitationStatus;
          expires_at: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          email: string;
          token_hash: string;
          assigned_role: InvitationApprovalRole;
          status?: InvitationStatus;
          expires_at: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          email?: string;
          token_hash?: string;
          assigned_role?: InvitationApprovalRole;
          status?: InvitationStatus;
          expires_at?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: true;
            referencedRelation: "access_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      roles: {
        Row: {
          id: string;
          name: RoleName;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: RoleName;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: RoleName;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      organizations: {
        Row: {
          id: string;
          name: string;
          type: OrganizationType;
          logo_url: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type: OrganizationType;
          logo_url?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: OrganizationType;
          logo_url?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };

      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          phone: string | null;
          role_id: string | null;
          organization_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          // Extended columns added in 20260821000007_profiles_extended_columns
          username: string | null;
          location: string | null;
          website: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          cover_url: string | null;
          skills: string[];
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          role_id?: string | null;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          // Extended columns
          username?: string | null;
          location?: string | null;
          website?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          cover_url?: string | null;
          skills?: string[];
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          role_id?: string | null;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          // Extended columns
          username?: string | null;
          location?: string | null;
          website?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          cover_url?: string | null;
          skills?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };


      forum_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      forum_posts: {
        Row: {
          id: string;
          author_id: string;
          category_id: string;
          title: string;
          slug: string;
          content: string;
          status: PostStatus;
          views_count: number;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          category_id: string;
          title: string;
          slug: string;
          content: string;
          status?: PostStatus;
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          author_id?: string;
          category_id?: string;
          title?: string;
          slug?: string;
          content?: string;
          status?: PostStatus;
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "forum_posts_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "forum_categories";
            referencedColumns: ["id"];
          },
        ];
      };

      forum_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          parent_id?: string | null;
          content?: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "forum_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "forum_comments_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "forum_comments_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "forum_comments";
            referencedColumns: ["id"];
          },
        ];
      };

      forum_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "forum_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "forum_likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      resource_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      resources: {
        Row: {
          id: string;
          uploader_id: string;
          category_id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string | null;
          file_size_bytes: number | null;
          access_level: AccessLevel;
          downloads_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          uploader_id: string;
          category_id: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_type?: string | null;
          file_size_bytes?: number | null;
          access_level?: AccessLevel;
          downloads_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          uploader_id?: string;
          category_id?: string;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string | null;
          file_size_bytes?: number | null;
          access_level?: AccessLevel;
          downloads_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "resources_uploader_id_fkey";
            columns: ["uploader_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "resource_categories";
            referencedColumns: ["id"];
          },
        ];
      };

      jobs: {
        Row: {
          id: string;
          organization_id: string;
          recruiter_id: string;
          title: string;
          slug: string;
          description: string;
          location: string | null;
          job_type: JobType;
          experience_level: string | null;
          salary_range: string | null;
          status: JobStatus;
          views_count: number;
          applications_count: number;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          recruiter_id: string;
          title: string;
          slug: string;
          description: string;
          location?: string | null;
          job_type?: JobType;
          experience_level?: string | null;
          salary_range?: string | null;
          status?: JobStatus;
          views_count?: number;
          applications_count?: number;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          recruiter_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          location?: string | null;
          job_type?: JobType;
          experience_level?: string | null;
          salary_range?: string | null;
          status?: JobStatus;
          views_count?: number;
          applications_count?: number;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jobs_recruiter_id_fkey";
            columns: ["recruiter_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      job_applications: {
        Row: {
          id: string;
          job_id: string;
          applicant_id: string;
          resume_url: string;
          cover_letter: string | null;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id: string;
          resume_url: string;
          cover_letter?: string | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          applicant_id?: string;
          resume_url?: string;
          cover_letter?: string | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_applications_applicant_id_fkey";
            columns: ["applicant_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      courses: {
        Row: {
          id: string;
          organization_id: string | null;
          trainer_id: string;
          title: string;
          slug: string;
          description: string;
          cover_image_url: string | null;
          level: CourseLevel;
          duration_hours: number;
          price: number;
          status: CourseStatus;
          enrollments_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          trainer_id: string;
          title: string;
          slug: string;
          description: string;
          cover_image_url?: string | null;
          level?: CourseLevel;
          duration_hours?: number;
          price?: number;
          status?: CourseStatus;
          enrollments_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          trainer_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          cover_image_url?: string | null;
          level?: CourseLevel;
          duration_hours?: number;
          price?: number;
          status?: CourseStatus;
          enrollments_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "courses_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "courses_trainer_id_fkey";
            columns: ["trainer_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      course_enrollments: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          status: EnrollmentStatus;
          progress_percent: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          status?: EnrollmentStatus;
          progress_percent?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          status?: EnrollmentStatus;
          progress_percent?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      news: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          summary: string | null;
          content: string;
          image_url: string | null;
          status: NewsStatus;
          views_count: number;
          published_at: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          summary?: string | null;
          content: string;
          image_url?: string | null;
          status?: NewsStatus;
          views_count?: number;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          summary?: string | null;
          content?: string;
          image_url?: string | null;
          status?: NewsStatus;
          views_count?: number;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactMessageStatus;
          replied_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: ContactMessageStatus;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: ContactMessageStatus;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      approve_recruiter_application: {
        Args: { p_app_id: string };
        Returns: void;
      };
      reject_recruiter_application: {
        Args: { p_app_id: string; p_reason: string };
        Returns: void;
      };
      request_more_info_recruiter_application: {
        Args: { p_app_id: string; p_request: string };
        Returns: void;
      };
      get_user_role: {
        Args: { p_user_id?: string };
        Returns: string;
      };
      has_role: {
        Args: { p_user_id: string; p_role_name: string };
        Returns: boolean;
      };
      is_admin: {
        Args: { p_user_id?: string };
        Returns: boolean;
      };
      is_super_admin: {
        Args: { p_user_id?: string };
        Returns: boolean;
      };
      increment_views: {
        Args: { p_table_name: string; p_record_id: string };
        Returns: void;
      };
      increment_downloads: {
        Args: { p_record_id: string };
        Returns: void;
      };
      toggle_like: {
        Args: { p_post_id: string; p_user_id?: string };
        Returns: boolean;
      };
      create_notification: {
        Args: {
          p_user_id: string;
          p_type: string;
          p_title: string;
          p_message: string;
          p_link?: string | null;
        };
        Returns: string;
      };
      log_audit_event: {
        Args: {
          p_user_id: string;
          p_action: string;
          p_entity_type: string;
          p_entity_id: string;
          p_details?: Json | null;
          p_ip_address?: string | null;
        };
        Returns: string;
      };
      soft_delete: {
        Args: { p_table_name: string; p_record_id: string };
        Returns: void;
      };
      // Phase 10A — Invite System RPCs
      submit_access_request: {
        Args: {
          p_email: string;
          p_full_name: string;
          p_professional_title: string;
          p_organization: string;
          p_profession: string;
          p_experience_years: number;
          p_region: string;
          p_reason: string;
          p_linkedin_url?: string | null;
          p_website_url?: string | null;
        };
        Returns: Json;
      };
      mark_request_under_review: {
        Args: { p_request_id: string; p_reviewer_id: string };
        Returns: void;
      };
      reject_access_request: {
        Args: { p_request_id: string; p_reviewer_id: string; p_rejection_reason: string };
        Returns: void;
      };
      approve_access_request: {
        Args: {
          p_request_id: string;
          p_reviewer_id: string;
          p_role: string;
          p_token_hash: string;
          p_expires_at: string;
        };
        Returns: Json;
      };
      revoke_invitation: {
        Args: { p_invitation_id: string; p_admin_id: string };
        Returns: void;
      };
      validate_invitation_token: {
        Args: { p_token_hash: string };
        Returns: Json;
      };
      accept_invitation_token: {
        Args: { p_token_hash: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
