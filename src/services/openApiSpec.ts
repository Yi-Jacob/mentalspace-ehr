// OpenAPI 3.0 specification for MentalSpace API
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MentalSpace API',
    version: '1.0.0',
    description: 'Healthcare practice management API for mental health providers',
    contact: {
      name: 'MentalSpace Support',
      email: 'support@mentalspace.com'
    },
    license: {
      name: 'Proprietary'
    }
  },
  servers: [
    {
      url: 'https://wjaccopklttdvnutdmtu.supabase.co/rest/v1',
      description: 'Production server'
    }
  ],
  paths: {
    '/clients': {
      get: {
        summary: 'Get clients',
        description: 'Retrieve a list of clients with optional filtering and pagination',
        tags: ['Clients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'select',
            in: 'query',
            schema: { type: 'string' },
            description: 'Columns to select (PostgREST syntax)',
            example: 'id,first_name,last_name,email'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 1000 },
            description: 'Maximum number of records to return',
            example: 20
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0 },
            description: 'Number of records to skip',
            example: 0
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string' },
            description: 'Sort order (PostgREST syntax)',
            example: 'last_name.asc,first_name.asc'
          }
        ],
        responses: {
          200: {
            description: 'Successful response',
            headers: {
              'X-RateLimit-Limit': {
                schema: { type: 'integer' },
                description: 'Request limit per window'
              },
              'X-RateLimit-Remaining': {
                schema: { type: 'integer' },
                description: 'Remaining requests in window'
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Client' }
                }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' },
          500: { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        summary: 'Create client',
        description: 'Create a new client record',
        tags: ['Clients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClientInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Client created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/clients/{id}': {
      get: {
        summary: 'Get client by ID',
        description: 'Retrieve a specific client by their ID',
        tags: ['Clients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Client ID'
          }
        ],
        responses: {
          200: {
            description: 'Client found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' }
        }
      }
    },
    '/clinical_notes': {
      get: {
        summary: 'Get clinical notes',
        description: 'Retrieve clinical notes with filtering and pagination',
        tags: ['Clinical Notes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'client_id',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by client ID'
          },
          {
            name: 'provider_id',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by provider ID'
          },
          {
            name: 'note_type',
            in: 'query',
            schema: { 
              type: 'string',
              enum: ['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note']
            },
            description: 'Filter by note type'
          },
          {
            name: 'status',
            in: 'query',
            schema: { 
              type: 'string',
              enum: ['draft', 'submitted_for_review', 'signed', 'locked']
            },
            description: 'Filter by note status'
          }
        ],
        responses: {
          200: {
            description: 'Clinical notes retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ClinicalNote' }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' }
        }
      },
      post: {
        summary: 'Create clinical note',
        description: 'Create a new clinical note',
        tags: ['Clinical Notes'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClinicalNoteInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Clinical note created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ClinicalNote' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' }
        }
      }
    },
    '/appointments': {
      get: {
        summary: 'Get appointments',
        description: 'Retrieve appointments with filtering and pagination',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'client_id',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by client ID'
          },
          {
            name: 'provider_id',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by provider ID'
          },
          {
            name: 'start_time',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter appointments starting after this time'
          },
          {
            name: 'end_time',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter appointments ending before this time'
          }
        ],
        responses: {
          200: {
            description: 'Appointments retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Appointment' }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          429: { $ref: '#/components/responses/RateLimited' }
        }
      }
    }
  },
  components: {
    schemas: {
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Unique client identifier' },
          first_name: { type: 'string', maxLength: 50, description: 'Client first name' },
          last_name: { type: 'string', maxLength: 50, description: 'Client last name' },
          email: { type: 'string', format: 'email', description: 'Client email address' },
          date_of_birth: { type: 'string', format: 'date', description: 'Client date of birth' },
          assigned_clinician_id: { type: 'string', format: 'uuid', description: 'Assigned clinician ID' },
          is_active: { type: 'boolean', description: 'Whether client is active' },
          created_at: { type: 'string', format: 'date-time', description: 'Record creation timestamp' },
          updated_at: { type: 'string', format: 'date-time', description: 'Record last update timestamp' }
        },
        required: ['id', 'first_name', 'last_name', 'is_active', 'created_at']
      },
      ClientInput: {
        type: 'object',
        properties: {
          first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Client first name' },
          last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Client last name' },
          email: { type: 'string', format: 'email', description: 'Client email address' },
          date_of_birth: { type: 'string', format: 'date', description: 'Client date of birth' },
          assigned_clinician_id: { type: 'string', format: 'uuid', description: 'Assigned clinician ID' }
        },
        required: ['first_name', 'last_name']
      },
      ClinicalNote: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Unique note identifier' },
          title: { type: 'string', maxLength: 200, description: 'Note title' },
          content: { type: 'object', description: 'Note content (structured data)' },
          client_id: { type: 'string', format: 'uuid', description: 'Associated client ID' },
          provider_id: { type: 'string', format: 'uuid', description: 'Note author provider ID' },
          note_type: { 
            type: 'string',
            enum: ['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note'],
            description: 'Type of clinical note'
          },
          status: { 
            type: 'string',
            enum: ['draft', 'submitted_for_review', 'signed', 'locked'],
            description: 'Note status'
          },
          created_at: { type: 'string', format: 'date-time', description: 'Note creation timestamp' },
          signed_at: { type: 'string', format: 'date-time', description: 'Note signature timestamp' }
        },
        required: ['id', 'title', 'content', 'client_id', 'note_type', 'status']
      },
      ClinicalNoteInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200, description: 'Note title' },
          content: { type: 'object', description: 'Note content (structured data)' },
          client_id: { type: 'string', format: 'uuid', description: 'Associated client ID' },
          note_type: { 
            type: 'string',
            enum: ['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note'],
            description: 'Type of clinical note'
          },
          status: { 
            type: 'string',
            enum: ['draft', 'submitted_for_review', 'signed', 'locked'],
            description: 'Note status',
            default: 'draft'
          }
        },
        required: ['title', 'content', 'client_id', 'note_type']
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Unique appointment identifier' },
          client_id: { type: 'string', format: 'uuid', description: 'Associated client ID' },
          provider_id: { type: 'string', format: 'uuid', description: 'Scheduled provider ID' },
          start_time: { type: 'string', format: 'date-time', description: 'Appointment start time' },
          end_time: { type: 'string', format: 'date-time', description: 'Appointment end time' },
          appointment_type: { 
            type: 'string',
            enum: ['Initial Consultation', 'Follow-up', 'Therapy Session', 'Assessment', 'Group Session'],
            description: 'Type of appointment'
          },
          status: { 
            type: 'string',
            enum: ['scheduled', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'],
            description: 'Appointment status'
          },
          title: { type: 'string', maxLength: 100, description: 'Appointment title' },
          notes: { type: 'string', maxLength: 500, description: 'Appointment notes' },
          location: { type: 'string', maxLength: 100, description: 'Appointment location' }
        },
        required: ['id', 'client_id', 'provider_id', 'start_time', 'end_time', 'appointment_type', 'status']
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Error message' },
          details: { type: 'object', description: 'Additional error details' },
          code: { type: 'string', description: 'Error code' },
          timestamp: { type: 'string', format: 'date-time', description: 'Error timestamp' }
        },
        required: ['error']
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad request - validation errors',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized - invalid or missing authentication',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Forbidden: {
        description: 'Forbidden - insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      RateLimited: {
        description: 'Rate limit exceeded',
        headers: {
          'Retry-After': {
            schema: { type: 'integer' },
            description: 'Seconds to wait before retrying'
          },
          'X-RateLimit-Limit': {
            schema: { type: 'integer' },
            description: 'Request limit per window'
          },
          'X-RateLimit-Remaining': {
            schema: { type: 'integer' },
            description: 'Remaining requests in window'
          },
          'X-RateLimit-Reset': {
            schema: { type: 'string', format: 'date-time' },
            description: 'Window reset time'
          }
        },
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authentication token obtained from Supabase Auth'
      }
    }
  },
  tags: [
    {
      name: 'Clients',
      description: 'Client management operations'
    },
    {
      name: 'Clinical Notes',
      description: 'Clinical documentation operations'
    },
    {
      name: 'Appointments',
      description: 'Appointment scheduling operations'
    }
  ]
};

// Generate OpenAPI documentation as JSON
export const generateOpenApiDoc = (): string => {
  return JSON.stringify(openApiSpec, null, 2);
};

// Generate OpenAPI documentation as YAML (simplified)
export const generateOpenApiYaml = (): string => {
  // Basic YAML conversion - in production, use a proper YAML library
  return `# MentalSpace API Documentation
# OpenAPI 3.0 Specification
# Generated automatically - do not edit manually

openapi: 3.0.0
info:
  title: MentalSpace API
  version: 1.0.0
  description: Healthcare practice management API for mental health providers

# For full specification, please refer to the JSON version
# or use the interactive documentation at /api/docs
`;
};