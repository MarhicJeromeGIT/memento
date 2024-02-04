import React, { useEffect, useState } from 'react';
import { Doc } from '../interfaces/doc_interface';
import '../assets/docs-list.css';

// Assuming `window.electron` is correctly set up elsewhere
const { ipcRenderer } = window.electron;

interface DocsListProps {
  onDocSelect: (doc: Doc) => void;
}

const DocsList: React.FC<DocsListProps> = ({ onDocSelect }) => {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    ipcRenderer.send('list-docs');

    const handleDocsListResponse = (event, files) => {
      const notes = files.notes.map((filename) => ({ type: 'note', filename }));
      const canvases = files.canvases.map((filename) => ({ type: 'canvas', filename }));
      setDocs([...notes, ...canvases]);
    };

    ipcRenderer.on('list-docs-response', handleDocsListResponse);

    return () => {
      ipcRenderer.removeListener('list-docs-response', handleDocsListResponse);
    };
  }, []);

  const addDoc = (type: 'note' | 'canvas') => {
    const filename = `new_${type}.json`;
    const newDoc = { type, filename };
    setDocs((prevDocs) => [...prevDocs, newDoc]);
  };

  const renderDocsList = (docType: 'note' | 'canvas') => {
    return docs
      .filter((doc) => doc.type === docType)
      .map((doc, index) => (
        <li key={index} onClick={() => onDocSelect(doc)}>
          {doc.filename}
        </li>
      ));
  };

  return (
    <div className="docs-list">
      <div className="docs-list-section">
        <h2>Notes</h2>
        <button onClick={() => addDoc('note')}>+ Add Note</button>
        <ul>{renderDocsList('note')}</ul>
      </div>

      <div className="docs-list-section">
        <h2>Canvases</h2>
        <button onClick={() => addDoc('canvas')}>+ Add Canvas</button>
        <ul>{renderDocsList('canvas')}</ul>
      </div>
    </div>
  );
};

export default DocsList;
