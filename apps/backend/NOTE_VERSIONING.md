# Note Versioning System

## Overview

The note versioning system automatically tracks all changes made to clinical notes, providing a complete audit trail of modifications. This system ensures compliance with healthcare regulations and provides transparency in note management.

## Database Schema

### NoteHistory Table

The `note_history` table stores version history for clinical notes with the following structure:

```sql
CREATE TABLE note_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES clinical_notes(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content JSONB NOT NULL,
  status TEXT,
  title TEXT,
  updated_content BOOLEAN DEFAULT FALSE,
  updated_status BOOLEAN DEFAULT FALSE,
  updated_title BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Fields

- **id**: Unique identifier for each history entry
- **note_id**: Reference to the clinical note
- **version**: Sequential version number (1, 2, 3, etc.)
- **content**: The note content at this version
- **status**: The note status at this version
- **title**: The note title at this version
- **updated_content**: Boolean indicating if content changed in this version
- **updated_status**: Boolean indicating if status changed in this version
- **updated_title**: Boolean indicating if title changed in this version
- **created_at**: Timestamp when this version was created

## How It Works

### 1. Note Creation
When a clinical note is first created:
- A new `ClinicalNote` record is created with `version = 1`
- An initial `NoteHistory` entry is created with:
  - `version = 1`
  - All change flags set to `false` (since it's the initial version)

### 2. Note Updates
When a clinical note is updated:
- The note's version number is incremented
- A new `NoteHistory` entry is created with:
  - The new version number
  - The updated content, status, and title
  - Change flags indicating which fields were modified

### 3. Change Detection
The system automatically detects changes by comparing:
- **Content**: JSON comparison of note content
- **Status**: String comparison of note status
- **Title**: String comparison of note title

## API Endpoints

### Get Note History
```
GET /notes/:id/history
```
Returns all version history entries for a specific note, ordered by version (newest first).

### Get Specific Version
```
GET /notes/:id/history/:versionId
```
Returns a specific version of a note with full details.

## Service Layer

### NoteHistoryService

The `NoteHistoryService` provides methods for:
- Creating initial history entries
- Creating update history entries
- Retrieving history data
- Determining field changes

### Key Methods

- `createInitialHistory()`: Creates the first history entry
- `createHistoryEntry()`: Creates a new history entry for updates
- `getNoteHistory()`: Retrieves all history for a note
- `getHistoryEntry()`: Retrieves a specific history entry
- `determineFieldChanges()`: Compares old and new data to detect changes

## Usage Examples

### Creating a Note
```typescript
const note = await notesService.createNote(createNoteDto, providerId);
// Automatically creates version 1 history entry
```

### Updating a Note
```typescript
const updatedNote = await notesService.updateNote(noteId, updateNoteDto);
// Automatically creates new history entry with change tracking
```

### Viewing History
```typescript
const history = await notesService.getNoteHistory(noteId);
// Returns array of all versions with change indicators
```

## Benefits

1. **Audit Trail**: Complete history of all note modifications
2. **Compliance**: Meets healthcare documentation requirements
3. **Transparency**: Clear visibility into what changed and when
4. **Recovery**: Ability to restore previous versions if needed
5. **Change Tracking**: Automatic detection of what fields were modified

## Migration

The system includes a migration script that:
1. Renames the old `note_versions` table to `note_history`
2. Removes the `created_by` column
3. Adds new columns for enhanced change tracking
4. Sets up proper foreign key constraints
5. Creates performance indexes

## Performance Considerations

- Indexes are created on `note_id` and `version` for efficient queries
- Cascade deletion ensures history is cleaned up when notes are deleted
- JSON content is stored efficiently using PostgreSQL's JSONB type
