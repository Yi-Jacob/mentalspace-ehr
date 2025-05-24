export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_emergency_contacts: {
        Row: {
          client_id: string | null
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone_number: string | null
          relationship: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone_number?: string | null
          relationship?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone_number?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_emergency_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_insurance: {
        Row: {
          client_id: string | null
          copay_amount: number | null
          created_at: string | null
          deductible_amount: number | null
          effective_date: string | null
          group_number: string | null
          id: string
          insurance_company: string | null
          insurance_type: string | null
          is_active: boolean | null
          policy_number: string | null
          subscriber_dob: string | null
          subscriber_name: string | null
          subscriber_relationship: string | null
          termination_date: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          copay_amount?: number | null
          created_at?: string | null
          deductible_amount?: number | null
          effective_date?: string | null
          group_number?: string | null
          id?: string
          insurance_company?: string | null
          insurance_type?: string | null
          is_active?: boolean | null
          policy_number?: string | null
          subscriber_dob?: string | null
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          copay_amount?: number | null
          created_at?: string | null
          deductible_amount?: number | null
          effective_date?: string | null
          group_number?: string | null
          id?: string
          insurance_company?: string | null
          insurance_type?: string | null
          is_active?: boolean | null
          policy_number?: string | null
          subscriber_dob?: string | null
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_insurance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_phone_numbers: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          message_preference:
            | Database["public"]["Enums"]["message_preference"]
            | null
          phone_number: string
          phone_type: Database["public"]["Enums"]["phone_type"]
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          message_preference?:
            | Database["public"]["Enums"]["message_preference"]
            | null
          phone_number: string
          phone_type: Database["public"]["Enums"]["phone_type"]
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          message_preference?:
            | Database["public"]["Enums"]["message_preference"]
            | null
          phone_number?: string
          phone_type?: Database["public"]["Enums"]["phone_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_phone_numbers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_primary_care_providers: {
        Row: {
          address: string | null
          client_id: string | null
          created_at: string | null
          id: string
          phone_number: string | null
          practice_name: string | null
          provider_name: string | null
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          phone_number?: string | null
          practice_name?: string | null
          provider_name?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          phone_number?: string | null
          practice_name?: string | null
          provider_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_primary_care_providers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_1: string | null
          address_2: string | null
          administrative_sex:
            | Database["public"]["Enums"]["administrative_sex"]
            | null
          appointment_reminders:
            | Database["public"]["Enums"]["reminder_preference"]
            | null
          assigned_clinician_id: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          ethnicity: string | null
          first_name: string
          gender_identity: Database["public"]["Enums"]["gender_identity"] | null
          hipaa_signed: boolean | null
          id: string
          is_active: boolean | null
          languages: string | null
          last_name: string
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          middle_name: string | null
          patient_comments: string | null
          pcp_release: Database["public"]["Enums"]["pcp_release_status"] | null
          preferred_name: string | null
          pronouns: string | null
          race: string | null
          religious_affiliation: string | null
          sexual_orientation:
            | Database["public"]["Enums"]["sexual_orientation"]
            | null
          smoking_status: Database["public"]["Enums"]["smoking_status"] | null
          state: Database["public"]["Enums"]["us_state"] | null
          suffix: string | null
          timezone: Database["public"]["Enums"]["timezone_type"] | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          administrative_sex?:
            | Database["public"]["Enums"]["administrative_sex"]
            | null
          appointment_reminders?:
            | Database["public"]["Enums"]["reminder_preference"]
            | null
          assigned_clinician_id?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          ethnicity?: string | null
          first_name: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          hipaa_signed?: boolean | null
          id?: string
          is_active?: boolean | null
          languages?: string | null
          last_name: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          middle_name?: string | null
          patient_comments?: string | null
          pcp_release?: Database["public"]["Enums"]["pcp_release_status"] | null
          preferred_name?: string | null
          pronouns?: string | null
          race?: string | null
          religious_affiliation?: string | null
          sexual_orientation?:
            | Database["public"]["Enums"]["sexual_orientation"]
            | null
          smoking_status?: Database["public"]["Enums"]["smoking_status"] | null
          state?: Database["public"]["Enums"]["us_state"] | null
          suffix?: string | null
          timezone?: Database["public"]["Enums"]["timezone_type"] | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          administrative_sex?:
            | Database["public"]["Enums"]["administrative_sex"]
            | null
          appointment_reminders?:
            | Database["public"]["Enums"]["reminder_preference"]
            | null
          assigned_clinician_id?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          ethnicity?: string | null
          first_name?: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          hipaa_signed?: boolean | null
          id?: string
          is_active?: boolean | null
          languages?: string | null
          last_name?: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          middle_name?: string | null
          patient_comments?: string | null
          pcp_release?: Database["public"]["Enums"]["pcp_release_status"] | null
          preferred_name?: string | null
          pronouns?: string | null
          race?: string | null
          religious_affiliation?: string | null
          sexual_orientation?:
            | Database["public"]["Enums"]["sexual_orientation"]
            | null
          smoking_status?: Database["public"]["Enums"]["smoking_status"] | null
          state?: Database["public"]["Enums"]["us_state"] | null
          suffix?: string | null
          timezone?: Database["public"]["Enums"]["timezone_type"] | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_clinician_id_fkey"
            columns: ["assigned_clinician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      administrative_sex: "Male" | "Female" | "Unknown"
      employment_status:
        | "Full-time employed"
        | "Part-time employed"
        | "Self-employed"
        | "Contract, per diem"
        | "Full-time student"
        | "Part-time student"
        | "On active military duty"
        | "Retired"
        | "Leave of absence"
        | "Temporarily unemployed"
        | "Unemployed"
        | "Something else"
      gender_identity:
        | "Female"
        | "Male"
        | "Trans Woman"
        | "Trans Man"
        | "Non-binary"
        | "Something else"
        | "Unknown"
        | "Choose not to disclose"
      marital_status:
        | "Unmarried"
        | "Married"
        | "Domestic Partner"
        | "Divorced"
        | "Widowed"
        | "Legally Separated"
        | "Interlocutory Decree"
        | "Annulled"
        | "Something else"
        | "Choose not to disclose"
      message_preference:
        | "No messages"
        | "Voice messages OK"
        | "Text messages OK"
        | "Voice/Text messages OK"
      pcp_release_status:
        | "Not set"
        | "Patient consented to release information"
        | "Patient declined to release information"
        | "Not applicable"
      phone_type: "Mobile" | "Home" | "Work" | "Other"
      reminder_preference:
        | "Default Practice Setting"
        | "No reminders"
        | "Email only"
        | "Text (SMS) only"
        | "Text (SMS) and Email"
        | "Text or Call, and Email"
      sexual_orientation:
        | "Asexual"
        | "Bisexual"
        | "Lesbian or Gay"
        | "Straight"
        | "Something else"
        | "Unknown"
        | "Choose not to disclose"
      smoking_status:
        | "Current smoker: Every day"
        | "Current smoker: Some days"
        | "Former smoker"
        | "Never smoker"
        | "Chose not to disclose"
      timezone_type:
        | "Not Set"
        | "HAST"
        | "HAT"
        | "MART"
        | "AKT"
        | "GAMT"
        | "PT"
        | "PST"
        | "MT"
        | "ART"
        | "CT"
        | "CST"
        | "ET"
        | "EST"
        | "AT"
        | "AST"
        | "NT"
        | "EGT/EGST"
        | "CVT"
      us_state:
        | "AL"
        | "AK"
        | "AZ"
        | "AR"
        | "CA"
        | "CO"
        | "CT"
        | "DE"
        | "DC"
        | "FL"
        | "GA"
        | "HI"
        | "ID"
        | "IL"
        | "IN"
        | "IA"
        | "KS"
        | "KY"
        | "LA"
        | "ME"
        | "MD"
        | "MA"
        | "MI"
        | "MN"
        | "MS"
        | "MO"
        | "MT"
        | "NE"
        | "NV"
        | "NH"
        | "NJ"
        | "NM"
        | "NY"
        | "NC"
        | "ND"
        | "OH"
        | "OK"
        | "OR"
        | "PA"
        | "RI"
        | "SC"
        | "SD"
        | "TN"
        | "TX"
        | "UT"
        | "VT"
        | "VA"
        | "WA"
        | "WV"
        | "WI"
        | "WY"
      user_role:
        | "Practice Administrator"
        | "Clinician"
        | "Intern"
        | "Assistant"
        | "Associate"
        | "Supervisor"
        | "Clinical Administrator"
        | "Practice Scheduler"
        | "Biller for Assigned Patients Only"
        | "Practice Biller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      administrative_sex: ["Male", "Female", "Unknown"],
      employment_status: [
        "Full-time employed",
        "Part-time employed",
        "Self-employed",
        "Contract, per diem",
        "Full-time student",
        "Part-time student",
        "On active military duty",
        "Retired",
        "Leave of absence",
        "Temporarily unemployed",
        "Unemployed",
        "Something else",
      ],
      gender_identity: [
        "Female",
        "Male",
        "Trans Woman",
        "Trans Man",
        "Non-binary",
        "Something else",
        "Unknown",
        "Choose not to disclose",
      ],
      marital_status: [
        "Unmarried",
        "Married",
        "Domestic Partner",
        "Divorced",
        "Widowed",
        "Legally Separated",
        "Interlocutory Decree",
        "Annulled",
        "Something else",
        "Choose not to disclose",
      ],
      message_preference: [
        "No messages",
        "Voice messages OK",
        "Text messages OK",
        "Voice/Text messages OK",
      ],
      pcp_release_status: [
        "Not set",
        "Patient consented to release information",
        "Patient declined to release information",
        "Not applicable",
      ],
      phone_type: ["Mobile", "Home", "Work", "Other"],
      reminder_preference: [
        "Default Practice Setting",
        "No reminders",
        "Email only",
        "Text (SMS) only",
        "Text (SMS) and Email",
        "Text or Call, and Email",
      ],
      sexual_orientation: [
        "Asexual",
        "Bisexual",
        "Lesbian or Gay",
        "Straight",
        "Something else",
        "Unknown",
        "Choose not to disclose",
      ],
      smoking_status: [
        "Current smoker: Every day",
        "Current smoker: Some days",
        "Former smoker",
        "Never smoker",
        "Chose not to disclose",
      ],
      timezone_type: [
        "Not Set",
        "HAST",
        "HAT",
        "MART",
        "AKT",
        "GAMT",
        "PT",
        "PST",
        "MT",
        "ART",
        "CT",
        "CST",
        "ET",
        "EST",
        "AT",
        "AST",
        "NT",
        "EGT/EGST",
        "CVT",
      ],
      us_state: [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ],
      user_role: [
        "Practice Administrator",
        "Clinician",
        "Intern",
        "Assistant",
        "Associate",
        "Supervisor",
        "Clinical Administrator",
        "Practice Scheduler",
        "Biller for Assigned Patients Only",
        "Practice Biller",
      ],
    },
  },
} as const
