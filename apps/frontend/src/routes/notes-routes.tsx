import React from 'react';
import { RouteObject } from 'react-router-dom';
import AllNotes from '@/pages/notes/AllNotesPage';
import CreateNotePage from '@/pages/notes/CreateNotePage/index';
import NoteViewPage from '@/pages/notes/NoteViewPage';
import NoteEditPage from '@/pages/notes/NoteEditPage';
import NoteHistory from '@/pages/notes/NoteHistoryPage';
import NoteHistoryView from '@/pages/notes/NoteHistoryViewPage';

const notesRoutes: RouteObject[] = [
  {
    index: true,
    element: <AllNotes />
  },
  {
    path: 'all-notes',
    element: <AllNotes />
  },
  {
    path: 'create-note',
    element: <CreateNotePage />
  },
  // Consolidated view route
  {
    path: 'view/:noteId',
    element: <NoteViewPage />,
  },
  // Consolidated edit route
  {
    path: 'edit/:noteId',
    element: <NoteEditPage />,
  },
  // Note History
  {
    path: ':noteId/history',
    element: <NoteHistory />,
  },
  {
    path: ':noteId/history/:versionId',
    element: <NoteHistoryView />,
  }
];

export default notesRoutes; 