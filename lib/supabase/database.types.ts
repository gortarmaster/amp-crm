export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          website: string | null
          industry: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          website?: string | null
          industry?: string | null
          notes?: string | null
        }
        Update: {
          name?: string
          website?: string | null
          industry?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          title: string | null
          company_id: string | null
          notes: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          title?: string | null
          company_id?: string | null
          notes?: string | null
          tags?: string[]
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          title?: string | null
          company_id?: string | null
          notes?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          status: string
          company_id: string | null
          deal_value: number | null
          internal_notes: string | null
          shoot_date: string | null
          delivery_date: string | null
          slug: string
          description: string | null
          location: string | null
          category: string | null
          year: number | null
          portfolio_visible: boolean
          client_gallery_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          status?: string
          company_id?: string | null
          deal_value?: number | null
          internal_notes?: string | null
          shoot_date?: string | null
          delivery_date?: string | null
          slug: string
          description?: string | null
          location?: string | null
          category?: string | null
          year?: number | null
          portfolio_visible?: boolean
          client_gallery_enabled?: boolean
        }
        Update: {
          title?: string
          status?: string
          company_id?: string | null
          deal_value?: number | null
          internal_notes?: string | null
          shoot_date?: string | null
          delivery_date?: string | null
          description?: string | null
          location?: string | null
          category?: string | null
          year?: number | null
          portfolio_visible?: boolean
          client_gallery_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      project_contacts: {
        Row: {
          project_id: string
          contact_id: string
          role: string | null
          added_at: string
        }
        Insert: {
          project_id: string
          contact_id: string
          role?: string | null
        }
        Update: {
          role?: string | null
        }
        Relationships: []
      }
      project_sources: {
        Row: {
          id: string
          project_id: string
          label: string
          url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          label: string
          url?: string | null
        }
        Update: {
          label?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

// Contact with joined company
export type ContactWithCompany = Contact & {
  companies: Pick<Company, 'id' | 'name'> | null
}

// Projects
export type ProjectStatus = 'lead' | 'booked' | 'shooting' | 'editing' | 'delivered' | 'archived'

export type Project = {
  id: string
  user_id: string
  title: string
  status: ProjectStatus
  company_id: string | null
  deal_value: number | null
  internal_notes: string | null
  shoot_date: string | null
  delivery_date: string | null
  slug: string
  description: string | null
  location: string | null
  category: string | null
  year: number | null
  portfolio_visible: boolean
  client_gallery_enabled: boolean
  created_at: string
  updated_at: string
}

export type ProjectInsert = {
  user_id: string
  title: string
  status?: ProjectStatus
  company_id?: string | null
  deal_value?: number | null
  internal_notes?: string | null
  shoot_date?: string | null
  delivery_date?: string | null
  slug: string
  description?: string | null
  location?: string | null
  category?: string | null
  year?: number | null
  portfolio_visible?: boolean
  client_gallery_enabled?: boolean
}

export type ProjectUpdate = {
  title?: string
  status?: ProjectStatus
  company_id?: string | null
  deal_value?: number | null
  internal_notes?: string | null
  shoot_date?: string | null
  delivery_date?: string | null
  description?: string | null
  location?: string | null
  category?: string | null
  year?: number | null
  portfolio_visible?: boolean
  client_gallery_enabled?: boolean
  updated_at?: string
}

export type ProjectContact = {
  project_id: string
  contact_id: string
  role: string | null
  added_at: string
}

export type ProjectWithCompany = Project & {
  companies: { id: string; name: string } | null
}

export type ProjectSource = {
  id: string
  project_id: string
  label: string
  url: string | null
  created_at: string
}

export type ProjectWithDetails = Project & {
  companies: { id: string; name: string } | null
  project_contacts: Array<{
    contact_id: string
    role: string | null
    contacts: { id: string; first_name: string; last_name: string; email: string | null }
  }>
  project_sources: ProjectSource[]
}
