// OpenAPI Specification for Mental Health EHR API
// This file contains the API specification for documentation and client generation

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Mental Health EHR API',
    description: 'API for Mental Health Electronic Health Records System',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@mentalspace-ehr.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Development server'
    },
    {
      url: 'https://api.mentalspace-ehr.com',
      description: 'Production server'
    }
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'User login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                    refresh_token: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/clients': {
      get: {
        summary: 'Get all clients',
        tags: ['Clients'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'List of clients',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Client' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create new client',
        tags: ['Clients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateClientRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Client created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          }
        }
      }
    },
    '/clients/{id}': {
      get: {
        summary: 'Get client by ID',
        tags: ['Clients'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': {
            description: 'Client details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update client',
        tags: ['Clients'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateClientRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Client updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete client',
        tags: ['Clients'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '204': { description: 'Client deleted successfully' }
        }
      }
    },
    '/notes': {
      get: {
        summary: 'Get all notes',
        tags: ['Notes'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'clientId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'noteType', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'List of notes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Note' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create new note',
        tags: ['Notes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateNoteRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Note created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Note' }
              }
            }
          }
        }
      }
    },
    '/appointments': {
      get: {
        summary: 'Get all appointments',
        tags: ['Appointments'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'clientId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'providerId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' } }
        ],
        responses: {
          '200': {
            description: 'List of appointments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Appointment' }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'provider', 'staff', 'viewer'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          date_of_birth: { type: 'string', format: 'date' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      CreateClientRequest: {
        type: 'object',
        properties: {
          first_name: { type: 'string', minLength: 1, maxLength: 50 },
          last_name: { type: 'string', minLength: 1, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          date_of_birth: { type: 'string', format: 'date' }
        },
        required: ['first_name', 'last_name']
      },
      UpdateClientRequest: {
        type: 'object',
        properties: {
          first_name: { type: 'string', minLength: 1, maxLength: 50 },
          last_name: { type: 'string', minLength: 1, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          date_of_birth: { type: 'string', format: 'date' }
        }
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'object' },
          client_id: { type: 'string', format: 'uuid' },
          note_type: { type: 'string', enum: ['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note'] },
          status: { type: 'string', enum: ['draft', 'submitted_for_review', 'signed', 'locked'] },
          created_by: { type: 'string', format: 'uuid' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          submitted_at: { type: 'string', format: 'date-time' },
          signed_at: { type: 'string', format: 'date-time' },
          signed_by: { type: 'string', format: 'uuid' }
        }
      },
      CreateNoteRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          content: { type: 'object' },
          client_id: { type: 'string', format: 'uuid' },
          note_type: { type: 'string', enum: ['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note'] },
          status: { type: 'string', enum: ['draft', 'submitted_for_review', 'signed', 'locked'] }
        },
        required: ['title', 'content', 'client_id', 'note_type']
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          client_id: { type: 'string', format: 'uuid' },
          provider_id: { type: 'string', format: 'uuid' },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' },
          appointment_type: { type: 'string', enum: ['Initial Consultation', 'Follow-up', 'Therapy Session', 'Assessment', 'Group Session'] },
          title: { type: 'string' },
          notes: { type: 'string' },
          location: { type: 'string' },
          status: { type: 'string', enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    { bearerAuth: [] }
  ]
}; 