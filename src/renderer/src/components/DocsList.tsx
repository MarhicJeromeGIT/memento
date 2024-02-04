import React, { useEffect, useState } from 'react';
import { Doc } from '../interfaces/doc_interface';
import '../assets/docs-list.css';

const { ipcRenderer } = window.electron;

interface DocsListProps {
  onDocSelect: (doc: Doc) => void;
}

const DocsList: React.FC<DocsListProps> = ({ onDocSelect }) => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [renamingDoc, setRenamingDoc] = useState<Doc | null>(null);
  const [newName, setNewName] = useState('');

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

  const startRenaming = (doc: Doc) => {
    setRenamingDoc(doc);
    setNewName(doc.filename || '');
  };

  const cancelRenaming = () => {
    setRenamingDoc(null);
    setNewName('');
  };

  const commitRename = () => {
    if (renamingDoc && newName.trim() !== '') {
      ipcRenderer.invoke('rename-doc', renamingDoc.type, renamingDoc.filename, newName.trim())
        .then(() => {
          setDocs(docs.map(doc => doc.filename === renamingDoc.filename ? { ...doc, filename: newName.trim() } : doc));
          cancelRenaming();
        })
        .catch(console.error);
    }
  };

  const renderDocItem = (doc: Doc) => {
    return (
      <li key={doc.filename}>
        {renamingDoc && renamingDoc.filename === doc.filename ? (
          <div>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button onClick={commitRename}>Save</button>
            <button onClick={cancelRenaming}>Cancel</button>
          </div>
        ) : (
          <div onClick={() => onDocSelect(doc)}>
            {doc.filename}
            <button onClick={() => startRenaming(doc)}>Rename</button>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="docs-list">
      <div className="docs-list-section">
        <h2>Notes</h2>
        <button onClick={() => addDoc('note')}>+ Add Note</button>
        <ul>{docs.filter(doc => doc.type === 'note').map(renderDocItem)}</ul>
      </div>
      <div className="docs-list-section">
        <h2>Canvases</h2>
        <button onClick={() => addDoc('canvas')}>+ Add Canvas</button>
        <ul>{docs.filter(doc => doc.type === 'canvas').map(renderDocItem)}</ul>
      </div>
    </div>
  );
};

export default DocsList;
