// Hand-written to match supabase/migrations/*.sql.
// Once your Supabase project is live, regenerate this file with:
//   npx supabase gen types typescript --project-id <your-project-ref> > types/database.ts
// and re-check it against the shape below (structure should match;
// this file exists so Phase 2/3 code typechecks before that's run).

export type ProjectStatus = "draft" | "published";
export type BlogStatus = "draft" | "published";
export type ContactStatus = "new" | "read" | "replied" | "archived";
export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "tool";

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: TechnologyCategory;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category?: TechnologyCategory;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["technologies"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          status: ProjectStatus;
          featured: boolean;
          github_url: string | null;
          live_url: string | null;
          cover_image: string | null;
          features: string[];
          challenges: string | null;
          solutions: string | null;
          lessons_learned: string | null;
          start_date: string | null;
          completion_date: string | null;
          display_order: number;
          seo_title: string | null;
          seo_description: string | null;
          og_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          full_description?: string | null;
          status?: ProjectStatus;
          featured?: boolean;
          github_url?: string | null;
          live_url?: string | null;
          cover_image?: string | null;
          features?: string[];
          challenges?: string | null;
          solutions?: string | null;
          lessons_learned?: string | null;
          start_date?: string | null;
          completion_date?: string | null;
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_technologies: {
        Row: { project_id: string; technology_id: string };
        Insert: { project_id: string; technology_id: string };
        Update: { project_id?: string; technology_id?: string };
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          path: string;
          alt: string;
          sort_order: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          path: string;
          alt?: string;
          sort_order?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["project_images"]["Insert"]
        >;
      };
      experience: {
        Row: {
          id: string;
          company: string;
          position: string;
          start_date: string;
          end_date: string | null;
          description: string | null;
          responsibilities: string[];
          technologies: string[];
          achievements: string[];
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          responsibilities?: string[];
          technologies?: string[];
          achievements?: string[];
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["experience"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          status: BlogStatus;
          published_at: string | null;
          category: string | null;
          seo_title: string | null;
          seo_description: string | null;
          og_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          status?: BlogStatus;
          published_at?: string | null;
          category?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      tags: {
        Row: { id: string; name: string; slug: string };
        Insert: { id?: string; name: string; slug: string };
        Update: { id?: string; name?: string; slug?: string };
      };
      blog_post_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: { post_id?: string; tag_id?: string };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          status: ContactStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          status?: ContactStatus;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_messages"]["Insert"]
        >;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
