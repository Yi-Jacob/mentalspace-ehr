import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface GoogleMeetEvent {
  eventId: string;
  meetLink: string;
  hangoutLink?: string;
}

export interface CreateMeetingOptions {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
  organizerEmail: string;
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private serviceAccount: any;

  constructor(private configService: ConfigService) {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      const workspaceDomain = this.configService.get<string>('GOOGLE_WORKSPACE_DOMAIN');

      if (!workspaceDomain) {
        this.logger.error('Missing Google service account configuration');
        return;
      }

      // Load service account credentials
      const path = require('path');
      const resolvedPath = path.resolve(process.cwd(), './config/google-service-account.json');
      this.serviceAccount = require(resolvedPath);
      
      this.logger.log('Google Calendar service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Calendar service:', error);
    }
  }

  private createAuthForUser(organizerEmail: string) {
    return new JWT({
      email: this.serviceAccount.client_email,
      key: this.serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
      subject: organizerEmail, // Impersonate the staff member
    });
  }

  async createMeeting(options: CreateMeetingOptions): Promise<GoogleMeetEvent | null> {
    try {
      if (!this.serviceAccount) {
        this.logger.error('Google Calendar service not initialized');
        return null;
      }

      const auth = this.createAuthForUser(options.organizerEmail);
      const calendar = google.calendar({ version: 'v3', auth });
      const calendarId = this.configService.get<string>('GOOGLE_CALENDAR_ID') || 'primary';

      const event: calendar_v3.Schema$Event = {
        summary: options.summary,
        description: options.description || 'Telehealth appointment',
        start: {
          dateTime: options.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: options.endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: [
          {
            email: options.attendeeEmail,
            responseStatus: 'needsAction',
          },
          {
            email: options.organizerEmail,
            responseStatus: 'accepted',
          },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
      });

      const createdEvent = response.data;
      
      if (!createdEvent.id) {
        this.logger.error('Failed to create Google Calendar event - no event ID returned');
        return null;
      }

      // Extract Meet link from conference data
      const meetLink = createdEvent.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;

      if (!meetLink) {
        this.logger.error('Failed to extract Google Meet link from event');
        return null;
      }

      this.logger.log(`Google Meet created successfully: ${meetLink}`);

      return {
        eventId: createdEvent.id,
        meetLink,
        hangoutLink: createdEvent.hangoutLink,
      };
    } catch (error) {
      this.logger.error('Failed to create Google Meet:', error);
      return null;
    }
  }

  async updateMeeting(eventId: string, options: Partial<CreateMeetingOptions>): Promise<GoogleMeetEvent | null> {
    try {
      if (!this.serviceAccount || !options.organizerEmail) {
        this.logger.error('Google Calendar service not initialized or missing organizer email');
        return null;
      }

      const auth = this.createAuthForUser(options.organizerEmail);
      const calendar = google.calendar({ version: 'v3', auth });
      const calendarId = this.configService.get<string>('GOOGLE_CALENDAR_ID') || 'primary';

      const updateData: calendar_v3.Schema$Event = {};

      if (options.summary) updateData.summary = options.summary;
      if (options.description) updateData.description = options.description;
      if (options.startTime) {
        updateData.start = {
          dateTime: options.startTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (options.endTime) {
        updateData.end = {
          dateTime: options.endTime.toISOString(),
          timeZone: 'UTC',
        };
      }

      const response = await calendar.events.update({
        calendarId,
        eventId,
        requestBody: updateData,
      });

      const updatedEvent = response.data;
      const meetLink = updatedEvent.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;

      return {
        eventId: updatedEvent.id!,
        meetLink: meetLink || '',
        hangoutLink: updatedEvent.hangoutLink,
      };
    } catch (error) {
      this.logger.error('Failed to update Google Meet:', error);
      return null;
    }
  }

  async cancelMeeting(eventId: string, organizerEmail: string): Promise<boolean> {
    try {
      if (!this.serviceAccount) {
        this.logger.error('Google Calendar service not initialized');
        return false;
      }

      const auth = this.createAuthForUser(organizerEmail);
      const calendar = google.calendar({ version: 'v3', auth });
      const calendarId = this.configService.get<string>('GOOGLE_CALENDAR_ID') || 'primary';

      await calendar.events.delete({
        calendarId,
        eventId,
      });

      this.logger.log(`Google Meet cancelled successfully: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to cancel Google Meet:', error);
      return false;
    }
  }

  async getMeeting(eventId: string, organizerEmail: string): Promise<GoogleMeetEvent | null> {
    try {
      if (!this.serviceAccount) {
        this.logger.error('Google Calendar service not initialized');
        return null;
      }

      const auth = this.createAuthForUser(organizerEmail);
      const calendar = google.calendar({ version: 'v3', auth });
      const calendarId = this.configService.get<string>('GOOGLE_CALENDAR_ID') || 'primary';

      const response = await calendar.events.get({
        calendarId,
        eventId,
      });

      const event = response.data;
      const meetLink = event.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;

      return {
        eventId: event.id!,
        meetLink: meetLink || '',
        hangoutLink: event.hangoutLink,
      };
    } catch (error) {
      this.logger.error('Failed to get Google Meet:', error);
      return null;
    }
  }
}
