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
      calculate_compliance_metrics: {
        Args: { user_uuid: string }
        Returns: {
          completion_rate: number
          overdue_rate: number
          avg_completion_time: number
        }[]
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
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          category: string
          action: string
          scope: string
        }[]
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
    },
  },
} as const
