// NoteContent.js
import React, { useEffect, useState } from 'react';
const ipcRenderer = window.electron.ipcRenderer;

const NoteContent = ({ selectedNote }) => {
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const fetchNoteContent = async () => {
      if (selectedNote) {
        try {
          const content = await ipcRenderer.invoke('read-note', selectedNote);
          setNoteContent(content);
        } catch (error) {
          console.error('Error reading note:', error);
          setNoteContent('Error loading note content');
        }
      }
    };

    fetchNoteContent();
  }, [selectedNote]); // Run this effect when selectedNote changes

  return (
    <div className="note-content">
      <h2>Note Content</h2>
      {selectedNote ? (
        <div>
          <h3>{selectedNote}</h3>
          <pre>{noteContent}</pre>
        </div>
      ) : (
        <div>Select a note to view its content.</div>
      )}
    </div>
  );
};

export default NoteContent;