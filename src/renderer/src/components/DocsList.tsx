// NotesList.js
import React, { useEffect, useState, useMemo } from 'react';
import { Doc } from '../interfaces/doc_interface';

const ipcRenderer = window.electron.ipcRenderer;

const DocsList = ({ onDocSelect }) => {
  const [docs, setDocs] = useState<Doc[]>([]);

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
      <h2>Your Notes</h2>
      <ul>
        {notesList.map((note, index) => (
          <li key={index} onClick={() => onDocSelect(note)}>
            {note.filename}
          </li>
        ))}
      </ul>

      <h2>Your Canvases</h2>
      <ul>
        {canvasesList.map((canvas, index) => (
          <li key={index} onClick={() => onDocSelect(canvas)}>
            {canvas.filename}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocsList;