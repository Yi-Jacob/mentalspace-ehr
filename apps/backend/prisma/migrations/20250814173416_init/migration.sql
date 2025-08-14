-- CreateTable
CREATE TABLE "report_cache" (
    "id" TEXT NOT NULL,
    "cache_key" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "details" JSONB,
    "severity" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limits" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "request_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_classifications" (
    "id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "column_name" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "encryption_required" BOOLEAN,
    "retention_period_days" INTEGER,
    "anonymization_rules" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnosis_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth_user_id" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" TEXT NOT NULL,
    "is_active" BOOLEAN,
    "last_name" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "middle_name" TEXT,
    "suffix" TEXT,
    "user_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payer_type" TEXT NOT NULL,
    "electronic_payer_id" TEXT,
    "address_line_1" TEXT,
    "address_line_2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "phone_number" TEXT,
    "fax_number" TEXT,
    "contact_person" TEXT,
    "contact_email" TEXT,
    "website" TEXT,
    "requires_authorization" BOOLEAN,
    "is_active" BOOLEAN,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payer_contracts" (
    "id" TEXT NOT NULL,
    "payer_id" TEXT NOT NULL,
    "contract_name" TEXT NOT NULL,
    "contract_number" TEXT,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3),
    "status" TEXT,
    "reimbursement_rate" DOUBLE PRECISION,
    "contract_terms" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payer_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpt_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cpt_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payer_fee_schedules" (
    "id" TEXT NOT NULL,
    "payer_id" TEXT NOT NULL,
    "cpt_code" TEXT NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3),
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payer_fee_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "training_title" TEXT NOT NULL,
    "training_type" TEXT NOT NULL,
    "provider_organization" TEXT,
    "completion_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "hoursCompleted" DOUBLE PRECISION,
    "certificate_number" TEXT,
    "status" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "metric_type" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "target_value" DOUBLE PRECISION,
    "measurement_period" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_calculations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pay_period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pay_period_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_hours" DOUBLE PRECISION,
    "total_amount" DOUBLE PRECISION,
    "gross_amount" DOUBLE PRECISION,
    "status" TEXT,
    "processed_by" TEXT,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "preferred_name" TEXT,
    "pronouns" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "administrative_sex" TEXT,
    "gender_identity" TEXT,
    "sexual_orientation" TEXT,
    "email" TEXT,
    "address_1" TEXT,
    "address_2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "timezone" TEXT,
    "race" TEXT,
    "ethnicity" TEXT,
    "languages" TEXT,
    "marital_status" TEXT,
    "employment_status" TEXT,
    "religious_affiliation" TEXT,
    "smoking_status" TEXT,
    "appointment_reminders" TEXT,
    "hipaa_signed" BOOLEAN,
    "pcp_release" TEXT,
    "patient_comments" TEXT,
    "assigned_clinician_id" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_medications" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "prescribing_doctor" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "appointment_type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "room_number" TEXT,
    "recurring_rule_id" TEXT,
    "created_by" TEXT,
    "cancelled_by" TEXT,
    "cancelled_date" TIMESTAMP(3),
    "cancelled_reason" TEXT,
    "client_approved_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_rules" (
    "id" TEXT NOT NULL,
    "recurring_pattern" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "time_slots" JSONB NOT NULL,
    "is_business_day_only" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recurring_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_primary_care_providers" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_name" TEXT,
    "practice_name" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_primary_care_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hipaa_access_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "access_type" TEXT NOT NULL,
    "data_accessed" TEXT,
    "purpose" TEXT,
    "authorized" BOOLEAN,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hipaa_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "payer_id" TEXT,
    "service_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submission_date" TIMESTAMP(3),
    "status" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "paid_amount" DOUBLE PRECISION,
    "patient_responsibility" DOUBLE PRECISION,
    "authorization_number" TEXT,
    "diagnosis_codes" TEXT[],
    "procedure_codes" TEXT[],
    "place_of_service" TEXT,
    "claim_frequency" TEXT,
    "batch_id" TEXT,
    "clearinghouse_id" TEXT,
    "submission_method" TEXT,
    "rejection_reason" TEXT,
    "denial_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_deadlines" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "deadline_type" TEXT NOT NULL,
    "deadline_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_met" BOOLEAN,
    "notes_pending" INTEGER,
    "notes_completed" INTEGER,
    "reminder_sent_24h" BOOLEAN,
    "reminder_sent_48h" BOOLEAN,
    "reminder_sent_72h" BOOLEAN,
    "supervisor_notified" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_substance_history" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "substance_type" TEXT NOT NULL,
    "frequency" TEXT,
    "amount" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_substance_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_conflicts" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "conflicting_appointment_id" TEXT NOT NULL,
    "conflict_type" TEXT NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_configurations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "report_name" TEXT NOT NULL,
    "filters" JSONB,
    "date_range" JSONB,
    "is_shared" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "npi_number" TEXT,
    "license_number" TEXT,
    "license_state" TEXT,
    "license_expiry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" TEXT,
    "job_title" TEXT,
    "hire_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termination_date" TIMESTAMP(3),
    "phone_number" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "supervisor_id" TEXT,
    "billing_rate" DOUBLE PRECISION,
    "can_bill_insurance" BOOLEAN,
    "status" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address_1" TEXT,
    "address_2" TEXT,
    "can_receive_text" BOOLEAN,
    "city" TEXT,
    "clinician_type" TEXT,
    "formal_name" TEXT,
    "home_phone" TEXT,
    "mobile_phone" TEXT,
    "state" TEXT,
    "supervision_type" TEXT,
    "user_comments" TEXT,
    "work_phone" TEXT,
    "zip_code" TEXT,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_templates" (
    "id" TEXT NOT NULL,
    "template_name" TEXT NOT NULL,
    "description" TEXT,
    "default_hours_per_week" DOUBLE PRECISION,
    "max_consecutive_days" INTEGER,
    "min_hours_between_shifts" INTEGER,
    "preferred_shift_patterns" JSONB,
    "is_active" BOOLEAN,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quick_actions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER,
    "due_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quick_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productivity_goals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "goal_type" TEXT NOT NULL,
    "target_value" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentValue" INTEGER,

    CONSTRAINT "productivity_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_treatment_history" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "treatment_type" TEXT NOT NULL,
    "providerName" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "effectiveness_rating" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_treatment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_phone_numbers" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "phone_type" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message_preference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_access_permissions" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "granted_by" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "revoked_by" TEXT,
    "access_type" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN,

    CONSTRAINT "patient_access_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_number" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "claim_id" TEXT,
    "payer_id" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" TEXT NOT NULL,
    "payment_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "reference_number" TEXT,
    "credit_card_last_four" TEXT,
    "payment_processor" TEXT,
    "processing_fee" DOUBLE PRECISION,
    "net_amount" DOUBLE PRECISION,
    "notes" TEXT,
    "processed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_schedules" (
    "id" TEXT NOT NULL,
    "report_config_id" TEXT NOT NULL,
    "schedule_type" TEXT NOT NULL,
    "schedule_time" TEXT NOT NULL,
    "schedule_days" INTEGER[],
    "is_active" BOOLEAN,
    "last_run_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_run_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipients" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "certification_name" TEXT NOT NULL,
    "certification_number" TEXT,
    "issuing_organization" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewal_period_months" INTEGER,
    "status" TEXT,
    "reminder_sent_30_days" BOOLEAN,
    "reminder_sent_60_days" BOOLEAN,
    "reminder_sent_90_days" BOOLEAN,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_reminders" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "reminder_type" TEXT NOT NULL,
    "send_before_minutes" INTEGER NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_sent" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_diagnoses" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "diagnosis_code" TEXT NOT NULL,
    "diagnosis_description" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "diagnosed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "notes" TEXT,
    "provider_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_emergency_contacts" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "is_primary" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clock_in_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clock_out_time" TIMESTAMP(3),
    "break_start_time" TIMESTAMP(3),
    "break_end_time" TIMESTAMP(3),
    "total_hours" DOUBLE PRECISION,
    "regular_hours" DOUBLE PRECISION,
    "overtime_hours" DOUBLE PRECISION,
    "is_approved" BOOLEAN,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_exceptions" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "exception_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_time" TEXT,
    "end_time" TEXT,
    "is_unavailable" BOOLEAN,
    "reason" TEXT,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_notes" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "note_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" TEXT,
    "signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signed_by" TEXT,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" TEXT,
    "co_signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "co_signed_by" TEXT,
    "locked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinical_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_compensation_config" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "compensation_type" TEXT NOT NULL,
    "base_session_rate" DOUBLE PRECISION,
    "base_hourly_rate" DOUBLE PRECISION,
    "experience_tier" INTEGER,
    "is_overtime_eligible" BOOLEAN,
    "evening_differential" DOUBLE PRECISION,
    "weekend_differential" DOUBLE PRECISION,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3),
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "provider_compensation_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_insurance" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "insurance_type" TEXT,
    "insurance_company" TEXT,
    "policy_number" TEXT,
    "group_number" TEXT,
    "subscriber_name" TEXT,
    "subscriber_dob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriber_relationship" TEXT,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termination_date" TIMESTAMP(3),
    "copay_amount" DOUBLE PRECISION,
    "deductible_amount" DOUBLE PRECISION,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_periods" (
    "id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "total_hours" DOUBLE PRECISION,
    "total_amount" DOUBLE PRECISION,
    "processed_by" TEXT,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_rate_multipliers" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "session_type" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_rate_multipliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "client_id" TEXT,
    "therapist_id" TEXT,
    "category" TEXT,
    "priority" TEXT,
    "status" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_statements" (
    "id" TEXT NOT NULL,
    "statement_number" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "statement_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "previous_balance" DOUBLE PRECISION,
    "payments_received" DOUBLE PRECISION,
    "adjustments" DOUBLE PRECISION,
    "current_balance" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "delivery_method" TEXT,
    "email_sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_link" TEXT,
    "notes" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_line_items" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpt_code" TEXT NOT NULL,
    "modifier_1" TEXT,
    "modifier_2" TEXT,
    "modifier_3" TEXT,
    "modifier_4" TEXT,
    "diagnosis_pointer" INTEGER,
    "units" INTEGER,
    "charge_amount" DOUBLE PRECISION NOT NULL,
    "allowed_amount" DOUBLE PRECISION,
    "paid_amount" DOUBLE PRECISION,
    "adjustment_amount" DOUBLE PRECISION,
    "patient_responsibility" DOUBLE PRECISION,
    "line_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_waitlist" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "preferred_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferred_time_start" TEXT,
    "preferred_time_end" TEXT,
    "appointment_type" TEXT NOT NULL,
    "notes" TEXT,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_fulfilled" BOOLEAN,
    "fulfilled_appointment_id" TEXT,

    CONSTRAINT "appointment_waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "claim_line_item_id" TEXT NOT NULL,
    "allocated_amount" DOUBLE PRECISION NOT NULL,
    "allocation_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervision_relationships" (
    "id" TEXT NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "supervisee_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "termination_notes" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supervision_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_goals" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "treatment_plan_id" TEXT,
    "goal_text" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "achieved_date" TIMESTAMP(3),
    "is_achieved" BOOLEAN,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "treatment_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_verifications" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "insurance_id" TEXT NOT NULL,
    "verification_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_by" TEXT,
    "status" TEXT,
    "benefits_verified" BOOLEAN,
    "copay_amount" DOUBLE PRECISION,
    "deductible_amount" DOUBLE PRECISION,
    "deductible_met" DOUBLE PRECISION,
    "out_of_pocket_max" DOUBLE PRECISION,
    "out_of_pocket_met" DOUBLE PRECISION,
    "authorization_required" BOOLEAN,
    "authorization_number" TEXT,
    "authorization_expiry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "covered_services" TEXT[],
    "excluded_services" TEXT[],
    "notes" TEXT,
    "next_verification_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" TEXT,
    "priority" TEXT,
    "is_read" BOOLEAN,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practice_name" TEXT,
    "practice_address" JSONB,
    "practice_contact" JSONB,
    "business_hours" JSONB,
    "security_settings" JSONB,
    "portal_settings" JSONB,
    "scheduling_settings" JSONB,
    "documentation_settings" JSONB,
    "billing_settings" JSONB,

    CONSTRAINT "practice_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aggregated_metrics" (
    "id" TEXT NOT NULL,
    "metric_type" TEXT NOT NULL,
    "period_type" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" TEXT,
    "client_id" TEXT,
    "metrics" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aggregated_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_objectives" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "objective_text" TEXT NOT NULL,
    "is_completed" BOOLEAN,
    "completed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "break_duration_minutes" INTEGER,
    "total_hours" DOUBLE PRECISION,
    "activity_type" TEXT NOT NULL,
    "description" TEXT,
    "is_billable" BOOLEAN,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_recipients" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "is_read" BOOLEAN,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_line_items" (
    "id" TEXT NOT NULL,
    "statement_id" TEXT NOT NULL,
    "claim_id" TEXT,
    "service_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "cpt_code" TEXT,
    "charge_amount" DOUBLE PRECISION NOT NULL,
    "insurance_payment" DOUBLE PRECISION,
    "adjustment_amount" DOUBLE PRECISION,
    "patient_responsibility" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statement_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_completion_tracking" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_spent_minutes" INTEGER,
    "completion_percentage" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_completion_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_reminders" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "reminder_type" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_dismissed" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_completions" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "session_type" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note_id" TEXT,
    "is_note_signed" BOOLEAN,
    "note_signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_locked" BOOLEAN,
    "locked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculated_amount" DOUBLE PRECISION,
    "pay_period_week" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_paid" BOOLEAN,
    "supervisor_override_by" TEXT,
    "supervisor_override_reason" TEXT,
    "supervisor_override_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deadline_exception_requests" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "session_completion_id" TEXT NOT NULL,
    "requested_extension_until" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "status" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deadline_exception_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_schedules" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_available" BOOLEAN,
    "break_start_time" TEXT,
    "break_end_time" TEXT,
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_until" TIMESTAMP(3),
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "license_type" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_expiration_date" TIMESTAMP(3) NOT NULL,
    "license_status" TEXT NOT NULL,
    "license_state" TEXT NOT NULL,
    "issued_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "note_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "title" TEXT,
    "updated_content" BOOLEAN DEFAULT false,
    "updated_status" BOOLEAN DEFAULT false,
    "updated_title" BOOLEAN DEFAULT false,

    CONSTRAINT "note_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "practice_settings_user_id_key" ON "practice_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_note_history_note_id" ON "note_history"("note_id");

-- CreateIndex
CREATE INDEX "idx_note_history_version" ON "note_history"("version");
