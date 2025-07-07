export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aggregated_metrics: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          metric_type: string
          metrics: Json
          period_end: string
          period_start: string
          period_type: string
          provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          metric_type: string
          metrics: Json
          period_end: string
          period_start: string
          period_type: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          metric_type?: string
          metrics?: Json
          period_end?: string
          period_start?: string
          period_type?: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aggregated_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregated_metrics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          method: string
          request_body: Json | null
          response_body: Json | null
          response_time_ms: number | null
          status_code: number
          url: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          method: string
          request_body?: Json | null
          response_body?: Json | null
          response_time_ms?: number | null
          status_code: number
          url: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          method?: string
          request_body?: Json | null
          response_body?: Json | null
          response_time_ms?: number | null
          status_code?: number
          url?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointment_conflicts: {
        Row: {
          appointment_id: string | null
          conflict_type: string
          conflicting_appointment_id: string | null
          created_at: string | null
          detected_at: string | null
          id: string
          resolved_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          conflict_type: string
          conflicting_appointment_id?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          resolved_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          conflict_type?: string
          conflicting_appointment_id?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_conflicts_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_conflicts_conflicting_appointment_id_fkey"
            columns: ["conflicting_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          is_sent: boolean | null
          reminder_type: string
          send_before_minutes: number
          sent_at: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          reminder_type: string
          send_before_minutes: number
          sent_at?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          reminder_type?: string
          send_before_minutes?: number
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_waitlist: {
        Row: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          client_id: string
          created_at: string | null
          fulfilled_appointment_id: string | null
          id: string
          is_fulfilled: boolean | null
          notes: string | null
          notified_at: string | null
          preferred_date: string | null
          preferred_time_end: string | null
          preferred_time_start: string | null
          priority: number | null
          provider_id: string | null
        }
        Insert: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          client_id: string
          created_at?: string | null
          fulfilled_appointment_id?: string | null
          id?: string
          is_fulfilled?: boolean | null
          notes?: string | null
          notified_at?: string | null
          preferred_date?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number | null
          provider_id?: string | null
        }
        Update: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          client_id?: string
          created_at?: string | null
          fulfilled_appointment_id?: string | null
          id?: string
          is_fulfilled?: boolean | null
          notes?: string | null
          notified_at?: string | null
          preferred_date?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number | null
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_waitlist_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_waitlist_fulfilled_appointment_id_fkey"
            columns: ["fulfilled_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_waitlist_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          checked_in_at: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean | null
          location: string | null
          no_show_reason: string | null
          notes: string | null
          provider_id: string | null
          recurring_series_id: string | null
          room_number: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          checked_in_at?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          no_show_reason?: string | null
          notes?: string | null
          provider_id?: string | null
          recurring_series_id?: string | null
          room_number?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          checked_in_at?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          no_show_reason?: string | null
          notes?: string | null
          provider_id?: string | null
          recurring_series_id?: string | null
          room_number?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recurring_series"
            columns: ["recurring_series_id"]
            isOneToOne: false
            referencedRelation: "recurring_series"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certification_name: string
          certification_number: string | null
          created_at: string | null
          expiry_date: string
          id: string
          issue_date: string | null
          issuing_organization: string
          notes: string | null
          reminder_sent_30_days: boolean | null
          reminder_sent_60_days: boolean | null
          reminder_sent_90_days: boolean | null
          renewal_period_months: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certification_name: string
          certification_number?: string | null
          created_at?: string | null
          expiry_date: string
          id?: string
          issue_date?: string | null
          issuing_organization: string
          notes?: string | null
          reminder_sent_30_days?: boolean | null
          reminder_sent_60_days?: boolean | null
          reminder_sent_90_days?: boolean | null
          renewal_period_months?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certification_name?: string
          certification_number?: string | null
          created_at?: string | null
          expiry_date?: string
          id?: string
          issue_date?: string | null
          issuing_organization?: string
          notes?: string | null
          reminder_sent_30_days?: boolean | null
          reminder_sent_60_days?: boolean | null
          reminder_sent_90_days?: boolean | null
          renewal_period_months?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_line_items: {
        Row: {
          adjustment_amount: number | null
          allowed_amount: number | null
          charge_amount: number
          claim_id: string | null
          cpt_code: string
          created_at: string | null
          diagnosis_pointer: number | null
          id: string
          line_note: string | null
          modifier_1: string | null
          modifier_2: string | null
          modifier_3: string | null
          modifier_4: string | null
          paid_amount: number | null
          patient_responsibility: number | null
          service_date: string
          units: number | null
        }
        Insert: {
          adjustment_amount?: number | null
          allowed_amount?: number | null
          charge_amount: number
          claim_id?: string | null
          cpt_code: string
          created_at?: string | null
          diagnosis_pointer?: number | null
          id?: string
          line_note?: string | null
          modifier_1?: string | null
          modifier_2?: string | null
          modifier_3?: string | null
          modifier_4?: string | null
          paid_amount?: number | null
          patient_responsibility?: number | null
          service_date: string
          units?: number | null
        }
        Update: {
          adjustment_amount?: number | null
          allowed_amount?: number | null
          charge_amount?: number
          claim_id?: string | null
          cpt_code?: string
          created_at?: string | null
          diagnosis_pointer?: number | null
          id?: string
          line_note?: string | null
          modifier_1?: string | null
          modifier_2?: string | null
          modifier_3?: string | null
          modifier_4?: string | null
          paid_amount?: number | null
          patient_responsibility?: number | null
          service_date?: string
          units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_line_items_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          authorization_number: string | null
          batch_id: string | null
          claim_frequency: string | null
          claim_number: string
          clearinghouse_id: string | null
          client_id: string | null
          created_at: string | null
          denial_reason: string | null
          diagnosis_codes: string[] | null
          id: string
          notes: string | null
          paid_amount: number | null
          patient_responsibility: number | null
          payer_id: string | null
          place_of_service: string | null
          procedure_codes: string[] | null
          provider_id: string | null
          rejection_reason: string | null
          service_date: string
          status: Database["public"]["Enums"]["claim_status"] | null
          submission_date: string | null
          submission_method: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          authorization_number?: string | null
          batch_id?: string | null
          claim_frequency?: string | null
          claim_number: string
          clearinghouse_id?: string | null
          client_id?: string | null
          created_at?: string | null
          denial_reason?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          patient_responsibility?: number | null
          payer_id?: string | null
          place_of_service?: string | null
          procedure_codes?: string[] | null
          provider_id?: string | null
          rejection_reason?: string | null
          service_date: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          submission_date?: string | null
          submission_method?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          authorization_number?: string | null
          batch_id?: string | null
          claim_frequency?: string | null
          claim_number?: string
          clearinghouse_id?: string | null
          client_id?: string | null
          created_at?: string | null
          denial_reason?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          patient_responsibility?: number | null
          payer_id?: string | null
          place_of_service?: string | null
          procedure_codes?: string[] | null
          provider_id?: string | null
          rejection_reason?: string | null
          service_date?: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          submission_date?: string | null
          submission_method?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "payers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_diagnoses: {
        Row: {
          client_id: string | null
          created_at: string
          diagnosed_date: string | null
          diagnosis_code: string
          diagnosis_description: string
          id: string
          is_primary: boolean
          notes: string | null
          provider_name: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          diagnosed_date?: string | null
          diagnosis_code: string
          diagnosis_description: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          provider_name?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          diagnosed_date?: string | null
          diagnosis_code?: string
          diagnosis_description?: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          provider_name?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_diagnoses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
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
      client_medications: {
        Row: {
          client_id: string | null
          created_at: string | null
          dosage: string | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          medication_name: string
          prescribing_doctor: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          medication_name: string
          prescribing_doctor?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          medication_name?: string
          prescribing_doctor?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_medications_client_id_fkey"
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
      client_substance_history: {
        Row: {
          amount: string | null
          client_id: string | null
          created_at: string | null
          end_date: string | null
          frequency: string | null
          id: string
          is_current: boolean | null
          notes: string | null
          start_date: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
        }
        Insert: {
          amount?: string | null
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_current?: boolean | null
          notes?: string | null
          start_date?: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
        }
        Update: {
          amount?: string | null
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_current?: boolean | null
          notes?: string | null
          start_date?: string | null
          substance_type?: Database["public"]["Enums"]["substance_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_substance_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_treatment_history: {
        Row: {
          client_id: string | null
          created_at: string | null
          effectiveness_rating: number | null
          end_date: string | null
          id: string
          notes: string | null
          provider_name: string | null
          start_date: string | null
          treatment_type: Database["public"]["Enums"]["treatment_type"]
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          effectiveness_rating?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          provider_name?: string | null
          start_date?: string | null
          treatment_type: Database["public"]["Enums"]["treatment_type"]
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          effectiveness_rating?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          provider_name?: string | null
          start_date?: string | null
          treatment_type?: Database["public"]["Enums"]["treatment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_treatment_history_client_id_fkey"
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
      clinical_notes: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_id: string | null
          co_signed_at: string | null
          co_signed_by: string | null
          content: Json
          created_at: string | null
          id: string
          locked_at: string | null
          note_type: Database["public"]["Enums"]["note_type"]
          provider_id: string | null
          signed_at: string | null
          signed_by: string | null
          status: Database["public"]["Enums"]["note_status"] | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          co_signed_at?: string | null
          co_signed_by?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          locked_at?: string | null
          note_type: Database["public"]["Enums"]["note_type"]
          provider_id?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["note_status"] | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          co_signed_at?: string | null
          co_signed_by?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          locked_at?: string | null
          note_type?: Database["public"]["Enums"]["note_type"]
          provider_id?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["note_status"] | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_co_signed_by_fkey"
            columns: ["co_signed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_deadlines: {
        Row: {
          created_at: string | null
          deadline_date: string
          deadline_type: string
          id: string
          is_met: boolean | null
          notes_completed: number | null
          notes_pending: number | null
          provider_id: string
          reminder_sent_24h: boolean | null
          reminder_sent_48h: boolean | null
          reminder_sent_72h: boolean | null
          supervisor_notified: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline_date: string
          deadline_type?: string
          id?: string
          is_met?: boolean | null
          notes_completed?: number | null
          notes_pending?: number | null
          provider_id: string
          reminder_sent_24h?: boolean | null
          reminder_sent_48h?: boolean | null
          reminder_sent_72h?: boolean | null
          supervisor_notified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline_date?: string
          deadline_type?: string
          id?: string
          is_met?: boolean | null
          notes_completed?: number | null
          notes_pending?: number | null
          provider_id?: string
          reminder_sent_24h?: boolean | null
          reminder_sent_48h?: boolean | null
          reminder_sent_72h?: boolean | null
          supervisor_notified?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_deadlines_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          category: string | null
          client_id: string
          created_at: string | null
          created_by: string
          id: string
          last_message_at: string | null
          priority: string | null
          status: string | null
          therapist_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          client_id: string
          created_at?: string | null
          created_by: string
          id?: string
          last_message_at?: string | null
          priority?: string | null
          status?: string | null
          therapist_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          last_message_at?: string | null
          priority?: string | null
          status?: string | null
          therapist_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cpt_codes: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description: string
          id: string
          is_active: boolean
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      deadline_exception_requests: {
        Row: {
          created_at: string | null
          id: string
          provider_id: string
          reason: string
          requested_extension_until: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          session_completion_id: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_id: string
          reason: string
          requested_extension_until: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_completion_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_id?: string
          reason?: string
          requested_extension_until?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_completion_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadline_exception_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadline_exception_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadline_exception_requests_session_completion_id_fkey"
            columns: ["session_completion_id"]
            isOneToOne: false
            referencedRelation: "session_completions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_codes: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description: string
          id: string
          is_active: boolean
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      goal_objectives: {
        Row: {
          completed_date: string | null
          created_at: string | null
          goal_id: string | null
          id: string
          is_completed: boolean | null
          objective_text: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          objective_text: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          objective_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_objectives_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "treatment_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_verifications: {
        Row: {
          authorization_expiry: string | null
          authorization_number: string | null
          authorization_required: boolean | null
          benefits_verified: boolean | null
          client_id: string | null
          copay_amount: number | null
          covered_services: string[] | null
          created_at: string | null
          deductible_amount: number | null
          deductible_met: number | null
          excluded_services: string[] | null
          id: string
          insurance_id: string | null
          next_verification_date: string | null
          notes: string | null
          out_of_pocket_max: number | null
          out_of_pocket_met: number | null
          status: Database["public"]["Enums"]["verification_status"] | null
          updated_at: string | null
          verification_date: string
          verified_by: string | null
        }
        Insert: {
          authorization_expiry?: string | null
          authorization_number?: string | null
          authorization_required?: boolean | null
          benefits_verified?: boolean | null
          client_id?: string | null
          copay_amount?: number | null
          covered_services?: string[] | null
          created_at?: string | null
          deductible_amount?: number | null
          deductible_met?: number | null
          excluded_services?: string[] | null
          id?: string
          insurance_id?: string | null
          next_verification_date?: string | null
          notes?: string | null
          out_of_pocket_max?: number | null
          out_of_pocket_met?: number | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string | null
          verification_date: string
          verified_by?: string | null
        }
        Update: {
          authorization_expiry?: string | null
          authorization_number?: string | null
          authorization_required?: boolean | null
          benefits_verified?: boolean | null
          client_id?: string | null
          copay_amount?: number | null
          covered_services?: string[] | null
          created_at?: string | null
          deductible_amount?: number | null
          deductible_met?: number | null
          excluded_services?: string[] | null
          id?: string
          insurance_id?: string | null
          next_verification_date?: string | null
          notes?: string | null
          out_of_pocket_max?: number | null
          out_of_pocket_met?: number | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string | null
          verification_date?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_verifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_verifications_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "client_insurance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_id: string
          read_at: string | null
          recipient_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id: string
          read_at?: string | null
          recipient_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string
          read_at?: string | null
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          priority: string | null
          read_at: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      note_completion_tracking: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          note_id: string
          started_at: string | null
          time_spent_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          note_id: string
          started_at?: string | null
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          note_id?: string
          started_at?: string | null
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_completion_tracking_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_reminders: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          is_dismissed: boolean | null
          note_id: string | null
          provider_id: string | null
          reminder_type: string
          sent_at: string | null
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          is_dismissed?: boolean | null
          note_id?: string | null
          provider_id?: string | null
          reminder_type: string
          sent_at?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          is_dismissed?: boolean | null
          note_id?: string | null
          provider_id?: string | null
          reminder_type?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_reminders_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_reminders_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      note_versions: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          note_id: string | null
          version: number
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_id?: string | null
          version: number
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "note_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_versions_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_access_permissions: {
        Row: {
          access_type: string | null
          client_id: string
          granted_at: string | null
          granted_by: string
          id: string
          is_active: boolean | null
          notes: string | null
          revoked_at: string | null
          revoked_by: string | null
          user_id: string
        }
        Insert: {
          access_type?: string | null
          client_id: string
          granted_at?: string | null
          granted_by: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          user_id: string
        }
        Update: {
          access_type?: string | null
          client_id?: string
          granted_at?: string | null
          granted_by?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_access_permissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_access_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_access_permissions_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_access_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_statements: {
        Row: {
          adjustments: number | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          current_balance: number
          delivery_method: string | null
          due_date: string | null
          email_opened_at: string | null
          email_sent_at: string | null
          id: string
          notes: string | null
          payment_link: string | null
          payments_received: number | null
          previous_balance: number | null
          statement_date: string
          statement_number: string
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          adjustments?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_balance: number
          delivery_method?: string | null
          due_date?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          id?: string
          notes?: string | null
          payment_link?: string | null
          payments_received?: number | null
          previous_balance?: number | null
          statement_date: string
          statement_number: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          adjustments?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_balance?: number
          delivery_method?: string | null
          due_date?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          id?: string
          notes?: string | null
          payment_link?: string | null
          payments_received?: number | null
          previous_balance?: number | null
          statement_date?: string
          statement_number?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_statements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_statements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payer_contracts: {
        Row: {
          contract_name: string
          contract_number: string | null
          contract_terms: string | null
          created_at: string | null
          effective_date: string
          expiration_date: string | null
          id: string
          payer_id: string | null
          reimbursement_rate: number | null
          status: Database["public"]["Enums"]["contract_status"] | null
          updated_at: string | null
        }
        Insert: {
          contract_name: string
          contract_number?: string | null
          contract_terms?: string | null
          created_at?: string | null
          effective_date: string
          expiration_date?: string | null
          id?: string
          payer_id?: string | null
          reimbursement_rate?: number | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
        }
        Update: {
          contract_name?: string
          contract_number?: string | null
          contract_terms?: string | null
          created_at?: string | null
          effective_date?: string
          expiration_date?: string | null
          id?: string
          payer_id?: string | null
          reimbursement_rate?: number | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payer_contracts_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "payers"
            referencedColumns: ["id"]
          },
        ]
      }
      payer_fee_schedules: {
        Row: {
          cpt_code: string
          created_at: string | null
          effective_date: string
          expiration_date: string | null
          fee_amount: number
          id: string
          is_active: boolean | null
          payer_id: string | null
          updated_at: string | null
        }
        Insert: {
          cpt_code: string
          created_at?: string | null
          effective_date: string
          expiration_date?: string | null
          fee_amount: number
          id?: string
          is_active?: boolean | null
          payer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cpt_code?: string
          created_at?: string | null
          effective_date?: string
          expiration_date?: string | null
          fee_amount?: number
          id?: string
          is_active?: boolean | null
          payer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payer_fee_schedules_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "payers"
            referencedColumns: ["id"]
          },
        ]
      }
      payers: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          contact_email: string | null
          contact_person: string | null
          created_at: string | null
          electronic_payer_id: string | null
          fax_number: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payer_type: Database["public"]["Enums"]["payer_type"]
          phone_number: string | null
          requires_authorization: boolean | null
          state: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          electronic_payer_id?: string | null
          fax_number?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payer_type?: Database["public"]["Enums"]["payer_type"]
          phone_number?: string | null
          requires_authorization?: boolean | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          electronic_payer_id?: string | null
          fax_number?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payer_type?: Database["public"]["Enums"]["payer_type"]
          phone_number?: string | null
          requires_authorization?: boolean | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          allocated_amount: number
          allocation_type: string | null
          claim_line_item_id: string | null
          created_at: string | null
          id: string
          payment_id: string | null
        }
        Insert: {
          allocated_amount: number
          allocation_type?: string | null
          claim_line_item_id?: string | null
          created_at?: string | null
          id?: string
          payment_id?: string | null
        }
        Update: {
          allocated_amount?: number
          allocation_type?: string | null
          claim_line_item_id?: string | null
          created_at?: string | null
          id?: string
          payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_claim_line_item_id_fkey"
            columns: ["claim_line_item_id"]
            isOneToOne: false
            referencedRelation: "claim_line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_calculations: {
        Row: {
          calculation_details: Json | null
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at: string | null
          deductions: number | null
          gross_amount: number
          id: string
          net_amount: number
          overtime_hours: number | null
          pay_period_end: string
          pay_period_start: string
          processed_at: string | null
          processed_by: string | null
          regular_hours: number | null
          status: Database["public"]["Enums"]["payment_status"] | null
          total_hours: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calculation_details?: Json | null
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          deductions?: number | null
          gross_amount: number
          id?: string
          net_amount: number
          overtime_hours?: number | null
          pay_period_end: string
          pay_period_start: string
          processed_at?: string | null
          processed_by?: string | null
          regular_hours?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_hours?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calculation_details?: Json | null
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          deductions?: number | null
          gross_amount?: number
          id?: string
          net_amount?: number
          overtime_hours?: number | null
          pay_period_end?: string
          pay_period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          regular_hours?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_hours?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_calculations_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          claim_id: string | null
          client_id: string | null
          created_at: string | null
          credit_card_last_four: string | null
          id: string
          net_amount: number | null
          notes: string | null
          payer_id: string | null
          payment_amount: number
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string
          payment_processor: string | null
          processed_by: string | null
          processing_fee: number | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          claim_id?: string | null
          client_id?: string | null
          created_at?: string | null
          credit_card_last_four?: string | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          payer_id?: string | null
          payment_amount: number
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string
          payment_processor?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          claim_id?: string | null
          client_id?: string | null
          created_at?: string | null
          credit_card_last_four?: string | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          payer_id?: string | null
          payment_amount?: number
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_number?: string
          payment_processor?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "payers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          total_amount: number | null
          total_hours: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          total_amount?: number | null
          total_hours?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          total_amount?: number | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          measurement_period: string
          metric_type: string
          metric_value: number
          notes: string | null
          period_end: string
          period_start: string
          reviewed_at: string | null
          reviewed_by: string | null
          target_value: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_period?: string
          metric_type: string
          metric_value: number
          notes?: string | null
          period_end: string
          period_start: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          target_value?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_period?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          period_end?: string
          period_start?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          target_value?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_settings: {
        Row: {
          billing_settings: Json | null
          business_hours: Json | null
          created_at: string | null
          documentation_settings: Json | null
          id: string
          portal_settings: Json | null
          practice_address: Json | null
          practice_contact: Json | null
          practice_name: string | null
          scheduling_settings: Json | null
          security_settings: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_settings?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          documentation_settings?: Json | null
          id?: string
          portal_settings?: Json | null
          practice_address?: Json | null
          practice_contact?: Json | null
          practice_name?: string | null
          scheduling_settings?: Json | null
          security_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_settings?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          documentation_settings?: Json | null
          id?: string
          portal_settings?: Json | null
          practice_address?: Json | null
          practice_contact?: Json | null
          practice_name?: string | null
          scheduling_settings?: Json | null
          security_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          date: string
          goal_type: string
          id: string
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          date?: string
          goal_type: string
          id?: string
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          date?: string
          goal_type?: string
          id?: string
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      provider_compensation_config: {
        Row: {
          base_hourly_rate: number | null
          base_session_rate: number | null
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at: string | null
          created_by: string | null
          effective_date: string
          evening_differential: number | null
          experience_tier: number | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          is_overtime_eligible: boolean | null
          provider_id: string
          updated_at: string | null
          weekend_differential: number | null
        }
        Insert: {
          base_hourly_rate?: number | null
          base_session_rate?: number | null
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          evening_differential?: number | null
          experience_tier?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          is_overtime_eligible?: boolean | null
          provider_id: string
          updated_at?: string | null
          weekend_differential?: number | null
        }
        Update: {
          base_hourly_rate?: number | null
          base_session_rate?: number | null
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          evening_differential?: number | null
          experience_tier?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          is_overtime_eligible?: boolean | null
          provider_id?: string
          updated_at?: string | null
          weekend_differential?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_config_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_compensation_config_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_schedules: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          effective_from: string
          effective_until: string | null
          end_time: string
          id: string
          is_available: boolean | null
          provider_id: string
          start_time: string
          status: Database["public"]["Enums"]["schedule_status"] | null
          updated_at: string | null
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          effective_from: string
          effective_until?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          provider_id: string
          start_time: string
          status?: Database["public"]["Enums"]["schedule_status"] | null
          updated_at?: string | null
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          effective_from?: string
          effective_until?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          provider_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["schedule_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_schedules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_actions: {
        Row: {
          action_type: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          title: string
          user_id: string
        }
        Insert: {
          action_type: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          title: string
          user_id: string
        }
        Update: {
          action_type?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          id: string
          identifier: string
          request_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier: string
          request_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string
          request_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_series: {
        Row: {
          created_at: string | null
          days_of_week: Database["public"]["Enums"]["day_of_week"][] | null
          end_date: string | null
          id: string
          interval_value: number
          max_occurrences: number | null
          pattern: Database["public"]["Enums"]["recurrence_pattern"]
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_of_week?: Database["public"]["Enums"]["day_of_week"][] | null
          end_date?: string | null
          id?: string
          interval_value?: number
          max_occurrences?: number | null
          pattern: Database["public"]["Enums"]["recurrence_pattern"]
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_of_week?: Database["public"]["Enums"]["day_of_week"][] | null
          end_date?: string | null
          id?: string
          interval_value?: number
          max_occurrences?: number | null
          pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      report_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          execution_time_ms: number | null
          filters: Json | null
          id: string
          report_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          execution_time_ms?: number | null
          filters?: Json | null
          id?: string
          report_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          execution_time_ms?: number | null
          filters?: Json | null
          id?: string
          report_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          data: Json
          expires_at: string
          id: string
          report_type: string
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          data: Json
          expires_at: string
          id?: string
          report_type: string
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          data?: Json
          expires_at?: string
          id?: string
          report_type?: string
        }
        Relationships: []
      }
      report_configurations: {
        Row: {
          created_at: string | null
          date_range: Json | null
          filters: Json | null
          id: string
          is_shared: boolean | null
          report_name: string
          report_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_range?: Json | null
          filters?: Json | null
          id?: string
          is_shared?: boolean | null
          report_name: string
          report_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_range?: Json | null
          filters?: Json | null
          id?: string
          is_shared?: boolean | null
          report_name?: string
          report_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_schedules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          next_run_at: string | null
          recipients: string[] | null
          report_config_id: string
          schedule_days: number[] | null
          schedule_time: string
          schedule_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          recipients?: string[] | null
          report_config_id: string
          schedule_days?: number[] | null
          schedule_time: string
          schedule_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          recipients?: string[] | null
          report_config_id?: string
          schedule_days?: number[] | null
          schedule_time?: string
          schedule_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_report_config_id_fkey"
            columns: ["report_config_id"]
            isOneToOne: false
            referencedRelation: "report_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_action: string
          permission_category: string
          resource_scope: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_action: string
          permission_category: string
          resource_scope?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_action?: string
          permission_category?: string
          resource_scope?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      schedule_exceptions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          end_time: string | null
          exception_date: string
          id: string
          is_unavailable: boolean | null
          provider_id: string
          reason: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_time?: string | null
          exception_date: string
          id?: string
          is_unavailable?: boolean | null
          provider_id: string
          reason?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_time?: string | null
          exception_date?: string
          id?: string
          is_unavailable?: boolean | null
          provider_id?: string
          reason?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_exceptions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_hours_per_week: number | null
          description: string | null
          id: string
          is_active: boolean | null
          max_consecutive_days: number | null
          min_hours_between_shifts: number | null
          preferred_shift_patterns: Json | null
          template_name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_hours_per_week?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_consecutive_days?: number | null
          min_hours_between_shifts?: number | null
          preferred_shift_patterns?: Json | null
          template_name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_hours_per_week?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_consecutive_days?: number | null
          min_hours_between_shifts?: number | null
          preferred_shift_patterns?: Json | null
          template_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_completions: {
        Row: {
          appointment_id: string
          calculated_amount: number | null
          client_id: string
          created_at: string | null
          duration_minutes: number
          id: string
          is_locked: boolean | null
          is_note_signed: boolean | null
          is_paid: boolean | null
          locked_at: string | null
          note_id: string | null
          note_signed_at: string | null
          pay_period_week: string | null
          provider_id: string
          session_date: string
          session_type: Database["public"]["Enums"]["session_type"]
          supervisor_override_at: string | null
          supervisor_override_by: string | null
          supervisor_override_reason: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id: string
          calculated_amount?: number | null
          client_id: string
          created_at?: string | null
          duration_minutes: number
          id?: string
          is_locked?: boolean | null
          is_note_signed?: boolean | null
          is_paid?: boolean | null
          locked_at?: string | null
          note_id?: string | null
          note_signed_at?: string | null
          pay_period_week?: string | null
          provider_id: string
          session_date: string
          session_type: Database["public"]["Enums"]["session_type"]
          supervisor_override_at?: string | null
          supervisor_override_by?: string | null
          supervisor_override_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string
          calculated_amount?: number | null
          client_id?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_locked?: boolean | null
          is_note_signed?: boolean | null
          is_paid?: boolean | null
          locked_at?: string | null
          note_id?: string | null
          note_signed_at?: string | null
          pay_period_week?: string | null
          provider_id?: string
          session_date?: string
          session_type?: Database["public"]["Enums"]["session_type"]
          supervisor_override_at?: string | null
          supervisor_override_by?: string | null
          supervisor_override_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_completions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_completions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_completions_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_completions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_completions_supervisor_override_by_fkey"
            columns: ["supervisor_override_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_rate_multipliers: {
        Row: {
          created_at: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          multiplier: number
          provider_id: string
          session_type: Database["public"]["Enums"]["session_type"]
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          multiplier?: number
          provider_id: string
          session_type: Database["public"]["Enums"]["session_type"]
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          multiplier?: number
          provider_id?: string
          session_type?: Database["public"]["Enums"]["session_type"]
        }
        Relationships: [
          {
            foreignKeyName: "session_rate_multipliers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          billing_rate: number | null
          can_bill_insurance: boolean | null
          created_at: string | null
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          hire_date: string | null
          id: string
          job_title: string | null
          license_expiry_date: string | null
          license_number: string | null
          license_state: string | null
          notes: string | null
          npi_number: string | null
          phone_number: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          supervisor_id: string | null
          termination_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_rate?: number | null
          can_bill_insurance?: boolean | null
          created_at?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          job_title?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          npi_number?: string | null
          phone_number?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          supervisor_id?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_rate?: number | null
          can_bill_insurance?: boolean | null
          created_at?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          job_title?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          npi_number?: string | null
          phone_number?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          supervisor_id?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_profiles_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      statement_line_items: {
        Row: {
          adjustment_amount: number | null
          charge_amount: number
          claim_id: string | null
          cpt_code: string | null
          created_at: string | null
          description: string
          id: string
          insurance_payment: number | null
          patient_responsibility: number
          service_date: string
          statement_id: string | null
        }
        Insert: {
          adjustment_amount?: number | null
          charge_amount: number
          claim_id?: string | null
          cpt_code?: string | null
          created_at?: string | null
          description: string
          id?: string
          insurance_payment?: number | null
          patient_responsibility: number
          service_date: string
          statement_id?: string | null
        }
        Update: {
          adjustment_amount?: number | null
          charge_amount?: number
          claim_id?: string | null
          cpt_code?: string | null
          created_at?: string | null
          description?: string
          id?: string
          insurance_payment?: number | null
          patient_responsibility?: number
          service_date?: string
          statement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "statement_line_items_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "statement_line_items_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "patient_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      supervision_relationships: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          start_date: string
          supervisee_id: string
          supervision_type:
            | Database["public"]["Enums"]["supervision_requirement_type"]
            | null
          supervisor_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date: string
          supervisee_id: string
          supervision_type?:
            | Database["public"]["Enums"]["supervision_requirement_type"]
            | null
          supervisor_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string
          supervisee_id?: string
          supervision_type?:
            | Database["public"]["Enums"]["supervision_requirement_type"]
            | null
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supervision_relationships_supervisee_id_fkey"
            columns: ["supervisee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supervision_relationships_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          break_end_time: string | null
          break_start_time: string | null
          clock_in_time: string | null
          clock_out_time: string | null
          created_at: string | null
          entry_date: string
          id: string
          is_approved: boolean | null
          notes: string | null
          overtime_hours: number | null
          regular_hours: number | null
          total_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          break_end_time?: string | null
          break_start_time?: string | null
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          entry_date: string
          id?: string
          is_approved?: boolean | null
          notes?: string | null
          overtime_hours?: number | null
          regular_hours?: number | null
          total_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          break_end_time?: string | null
          break_start_time?: string | null
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          entry_date?: string
          id?: string
          is_approved?: boolean | null
          notes?: string | null
          overtime_hours?: number | null
          regular_hours?: number | null
          total_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_tracking: {
        Row: {
          activity_type: string
          break_duration_minutes: number | null
          client_id: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          is_billable: boolean | null
          start_time: string
          status: string | null
          total_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type?: string
          break_duration_minutes?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          start_time: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          break_duration_minutes?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          start_time?: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_tracking_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      training_records: {
        Row: {
          certificate_number: string | null
          completion_date: string | null
          created_at: string | null
          expiry_date: string | null
          hours_completed: number | null
          id: string
          notes: string | null
          provider_organization: string | null
          status: string | null
          training_title: string
          training_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_number?: string | null
          completion_date?: string | null
          created_at?: string | null
          expiry_date?: string | null
          hours_completed?: number | null
          id?: string
          notes?: string | null
          provider_organization?: string | null
          status?: string | null
          training_title: string
          training_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string | null
          completion_date?: string | null
          created_at?: string | null
          expiry_date?: string | null
          hours_completed?: number | null
          id?: string
          notes?: string | null
          provider_organization?: string | null
          status?: string | null
          training_title?: string
          training_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_goals: {
        Row: {
          achieved_date: string | null
          client_id: string | null
          created_at: string | null
          goal_text: string
          id: string
          is_achieved: boolean | null
          priority: number | null
          target_date: string | null
          treatment_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          achieved_date?: string | null
          client_id?: string | null
          created_at?: string | null
          goal_text: string
          id?: string
          is_achieved?: boolean | null
          priority?: number | null
          target_date?: string | null
          treatment_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          achieved_date?: string | null
          client_id?: string | null
          created_at?: string | null
          goal_text?: string
          id?: string
          is_achieved?: boolean | null
          priority?: number | null
          target_date?: string | null
          treatment_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_goals_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
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
      cache_report_data: {
        Args: {
          p_cache_key: string
          p_report_type: string
          p_data: Json
          p_ttl_minutes?: number
        }
        Returns: undefined
      }
      calculate_compliance_metrics: {
        Args: { user_uuid: string }
        Returns: {
          completion_rate: number
          overdue_rate: number
          avg_completion_time: number
        }[]
      }
      calculate_session_payment: {
        Args: {
          _provider_id: string
          _session_type: Database["public"]["Enums"]["session_type"]
          _duration_minutes: number
        }
        Returns: number
      }
      can_access_patient: {
        Args: { _user_id: string; _client_id: string }
        Returns: boolean
      }
      can_access_patient_enhanced: {
        Args: { _user_id: string; _client_id: string; _access_type?: string }
        Returns: boolean
      }
      create_staff_member: {
        Args:
          | {
              p_first_name: string
              p_last_name: string
              p_email: string
              p_roles: Database["public"]["Enums"]["user_role"][]
              p_employee_id?: string
              p_job_title?: string
              p_department?: string
              p_phone_number?: string
              p_npi_number?: string
              p_license_number?: string
              p_license_state?: string
              p_license_expiry_date?: string
              p_hire_date?: string
              p_billing_rate?: number
              p_can_bill_insurance?: boolean
              p_status?: Database["public"]["Enums"]["user_status"]
              p_notes?: string
            }
          | {
              p_first_name: string
              p_last_name: string
              p_email: string
              p_roles: Database["public"]["Enums"]["user_role"][]
              p_employee_id?: string
              p_job_title?: string
              p_department?: string
              p_phone_number?: string
              p_npi_number?: string
              p_license_number?: string
              p_license_state?: string
              p_license_expiry_date?: string
              p_hire_date?: string
              p_billing_rate?: number
              p_can_bill_insurance?: boolean
              p_status?: Database["public"]["Enums"]["user_status"]
              p_notes?: string
              p_supervision_type?: Database["public"]["Enums"]["supervision_requirement_type"]
              p_supervisor_id?: string
            }
        Returns: string
      }
      current_user_has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      get_cached_report_data: {
        Args: { p_cache_key: string }
        Returns: Json
      }
      get_clinical_reports_data: {
        Args: {
          start_date?: string
          end_date?: string
          provider_filter?: string
        }
        Returns: {
          total_notes: number
          notes_completed: number
          notes_overdue: number
          avg_completion_time: number
          compliance_rate: number
          notes_by_type: Json
          provider_productivity: Json
          diagnosis_distribution: Json
        }[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          first_name: string
          last_name: string
        }[]
      }
      get_current_user_internal_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      get_executive_dashboard_metrics: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          total_revenue: number
          revenue_change: number
          total_patients: number
          patients_change: number
          appointments_completed: number
          appointments_change: number
          notes_completed: number
          notes_change: number
          revenue_trend: Json
          patient_demographics: Json
          provider_utilization: Json
        }[]
      }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          category: string
          action: string
          scope: string
        }[]
      }
      get_user_role_safe: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["user_role"][]
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          _user_id: string
          _category: string
          _action: string
          _scope?: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      increment_rate_limit: {
        Args: { p_identifier: string; p_window_ms: number }
        Returns: number
      }
      is_current_user_practice_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_practice_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_report_usage: {
        Args: {
          p_user_id: string
          p_report_type: string
          p_action: string
          p_filters?: Json
          p_execution_time_ms?: number
        }
        Returns: undefined
      }
      update_certification_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      administrative_sex: "Male" | "Female" | "Unknown"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
      appointment_type:
        | "initial_consultation"
        | "follow_up"
        | "therapy_session"
        | "group_therapy"
        | "assessment"
        | "medication_management"
        | "crisis_intervention"
        | "other"
      approval_status: "pending" | "approved" | "rejected"
      claim_status:
        | "draft"
        | "submitted"
        | "paid"
        | "denied"
        | "pending"
        | "partial"
        | "rejected"
      compensation_type: "session_based" | "hourly"
      contract_status: "active" | "inactive" | "pending" | "expired"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
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
      note_status:
        | "draft"
        | "signed"
        | "submitted_for_review"
        | "approved"
        | "rejected"
        | "locked"
      note_type:
        | "intake"
        | "progress_note"
        | "treatment_plan"
        | "cancellation_note"
        | "contact_note"
        | "consultation_note"
        | "miscellaneous_note"
      pay_period_type: "weekly" | "biweekly" | "monthly"
      payer_type: "in_network" | "out_of_network" | "government" | "self_pay"
      payment_method:
        | "insurance"
        | "credit_card"
        | "check"
        | "cash"
        | "bank_transfer"
        | "payment_plan"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      pcp_release_status:
        | "Not set"
        | "Patient consented to release information"
        | "Patient declined to release information"
        | "Not applicable"
      phone_type: "Mobile" | "Home" | "Work" | "Other"
      presenting_problem:
        | "Anxiety"
        | "Depression"
        | "Trauma / PTSD"
        | "Stress Management"
        | "Relationship Issues"
        | "Grief / Loss"
        | "Anger Management"
        | "Substance Use / Addiction"
        | "Behavioral Issues"
        | "Bipolar Symptoms"
        | "Psychosis / Schizophrenia"
        | "Eating Disorder Concerns"
        | "Personality Disorder Concerns"
        | "Sexual / Gender Identity Concerns"
        | "Other"
      progress_note_format: "SOAP" | "DAP"
      recurrence_pattern: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
      reminder_preference:
        | "Default Practice Setting"
        | "No reminders"
        | "Email only"
        | "Text (SMS) only"
        | "Text (SMS) and Email"
        | "Text or Call, and Email"
      schedule_status: "active" | "pending_approval" | "approved" | "rejected"
      session_type:
        | "intake"
        | "individual"
        | "group"
        | "consultation"
        | "assessment"
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
      substance_type:
        | "Alcohol"
        | "Tobacco/Nicotine"
        | "Cannabis"
        | "Stimulants (cocaine, methamphetamine, etc.)"
        | "Opioids (heroin, prescription pain medications, etc.)"
        | "Sedatives/Hypnotics (benzodiazepines, sleep medications, etc.)"
        | "Other Substances"
      supervision_requirement_type:
        | "Not Supervised"
        | "Access patient notes and co-sign notes for selected payers"
        | "Must review and approve all notes"
        | "Must review and co-sign all notes"
      symptom_onset:
        | "Recent (Less than 1 month)"
        | "Acute (1-3 months)"
        | "Subacute (3-6 months)"
        | "Chronic (6+ months)"
        | "Episodic (Comes and goes)"
        | "Longstanding (Years)"
        | "Since childhood"
        | "Unknown / Not specified"
      symptom_severity:
        | "Mild"
        | "Moderate"
        | "Severe"
        | "Extreme"
        | "Fluctuating"
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
      treatment_type:
        | "Individual Therapy"
        | "Group Therapy"
        | "Family Therapy"
        | "Couples Therapy"
        | "Psychiatric Medication"
        | "Substance Abuse Treatment"
        | "Inpatient Hospitalization"
        | "Partial Hospitalization (PHP)"
        | "Intensive Outpatient Program (IOP)"
        | "Support Group"
        | "Other"
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
      user_status: "active" | "inactive" | "suspended" | "pending"
      verification_status:
        | "pending"
        | "verified"
        | "denied"
        | "expired"
        | "needs_update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      administrative_sex: ["Male", "Female", "Unknown"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
      ],
      appointment_type: [
        "initial_consultation",
        "follow_up",
        "therapy_session",
        "group_therapy",
        "assessment",
        "medication_management",
        "crisis_intervention",
        "other",
      ],
      approval_status: ["pending", "approved", "rejected"],
      claim_status: [
        "draft",
        "submitted",
        "paid",
        "denied",
        "pending",
        "partial",
        "rejected",
      ],
      compensation_type: ["session_based", "hourly"],
      contract_status: ["active", "inactive", "pending", "expired"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
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
      note_status: [
        "draft",
        "signed",
        "submitted_for_review",
        "approved",
        "rejected",
        "locked",
      ],
      note_type: [
        "intake",
        "progress_note",
        "treatment_plan",
        "cancellation_note",
        "contact_note",
        "consultation_note",
        "miscellaneous_note",
      ],
      pay_period_type: ["weekly", "biweekly", "monthly"],
      payer_type: ["in_network", "out_of_network", "government", "self_pay"],
      payment_method: [
        "insurance",
        "credit_card",
        "check",
        "cash",
        "bank_transfer",
        "payment_plan",
      ],
      payment_status: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      pcp_release_status: [
        "Not set",
        "Patient consented to release information",
        "Patient declined to release information",
        "Not applicable",
      ],
      phone_type: ["Mobile", "Home", "Work", "Other"],
      presenting_problem: [
        "Anxiety",
        "Depression",
        "Trauma / PTSD",
        "Stress Management",
        "Relationship Issues",
        "Grief / Loss",
        "Anger Management",
        "Substance Use / Addiction",
        "Behavioral Issues",
        "Bipolar Symptoms",
        "Psychosis / Schizophrenia",
        "Eating Disorder Concerns",
        "Personality Disorder Concerns",
        "Sexual / Gender Identity Concerns",
        "Other",
      ],
      progress_note_format: ["SOAP", "DAP"],
      recurrence_pattern: ["daily", "weekly", "biweekly", "monthly", "yearly"],
      reminder_preference: [
        "Default Practice Setting",
        "No reminders",
        "Email only",
        "Text (SMS) only",
        "Text (SMS) and Email",
        "Text or Call, and Email",
      ],
      schedule_status: ["active", "pending_approval", "approved", "rejected"],
      session_type: [
        "intake",
        "individual",
        "group",
        "consultation",
        "assessment",
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
      substance_type: [
        "Alcohol",
        "Tobacco/Nicotine",
        "Cannabis",
        "Stimulants (cocaine, methamphetamine, etc.)",
        "Opioids (heroin, prescription pain medications, etc.)",
        "Sedatives/Hypnotics (benzodiazepines, sleep medications, etc.)",
        "Other Substances",
      ],
      supervision_requirement_type: [
        "Not Supervised",
        "Access patient notes and co-sign notes for selected payers",
        "Must review and approve all notes",
        "Must review and co-sign all notes",
      ],
      symptom_onset: [
        "Recent (Less than 1 month)",
        "Acute (1-3 months)",
        "Subacute (3-6 months)",
        "Chronic (6+ months)",
        "Episodic (Comes and goes)",
        "Longstanding (Years)",
        "Since childhood",
        "Unknown / Not specified",
      ],
      symptom_severity: [
        "Mild",
        "Moderate",
        "Severe",
        "Extreme",
        "Fluctuating",
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
      treatment_type: [
        "Individual Therapy",
        "Group Therapy",
        "Family Therapy",
        "Couples Therapy",
        "Psychiatric Medication",
        "Substance Abuse Treatment",
        "Inpatient Hospitalization",
        "Partial Hospitalization (PHP)",
        "Intensive Outpatient Program (IOP)",
        "Support Group",
        "Other",
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
      user_status: ["active", "inactive", "suspended", "pending"],
      verification_status: [
        "pending",
        "verified",
        "denied",
        "expired",
        "needs_update",
      ],
    },
  },
} as const
