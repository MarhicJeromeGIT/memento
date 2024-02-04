// NotesList.js
import React, { useEffect, useState, useMemo } from 'react';
import { Doc } from '../interfaces/doc_interface';
import '../assets/docs-list.css';

const ipcRenderer = window.electron.ipcRenderer;

const DocsList = ({ onDocSelect }) => {
  const [docs, setDocs] = useState<Doc[]>([]);

  const handleAddNote = () => {
    // adds a new note to the docs list
    // and sends a message to the main process to create a new file
    // with the given filename
    const newNote = { type: 'note', filename: 'new_note.json' };
    setDocs([...docs, newNote]);
  };

  const handleAddCanvas = () => {
    // Implement the logic to add a new canvas
    // Similar to handleAddNote
    const newNote = { type: 'canvas', filename: 'new_canvas.json' };
    setDocs([...docs, newNote]);
  };

  useEffect(() => {
    ipcRenderer.send('list-docs');

    ipcRenderer.on('list-docs-response', (event, files) => {
      const notes = files['notes'].map(filename => ({ type: 'note', filename }));
      const canvases = files['canvases'].map(filename => ({ type: 'canvas', filename }));
      setDocs([...notes, ...canvases]); // Combine notes and canvases into one array
    });

    return () => {
      ipcRenderer.removeAllListeners('list-docs-response');
    };
  }, []);

  const notesList = useMemo(() => docs.filter(doc => doc.type === 'note'), [docs]);
  const canvasesList = useMemo(() => docs.filter(doc => doc.type === 'canvas'), [docs]);

  return (
    <div className="docs-list">
      <div className="docs-list-section">
        <h2>Notes</h2>
        <button onClick={handleAddNote}>+ Add</button>
        <ul>
          {notesList.map((note, index) => (
            <li key={index} onClick={() => onDocSelect(note)}>
              {note.filename}
            </li>
          ))}
        </ul>
      </div>

      <div className="docs-list-section">
        <h2>Canvases</h2>
        <button onClick={handleAddCanvas}>+ Add</button>
        <ul>
          {canvasesList.map((canvas, index) => (
            <li key={index} onClick={() => onDocSelect(canvas)}>
              {canvas.filename}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocsList;