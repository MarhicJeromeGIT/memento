import Versions from './components/Versions'
import icons from './assets/icons.svg'
import Counter from './components/Counter'
import DocsList from './components/DocsList'
import NoteContent from './components/NoteContent';
import CanvasContent from './components/CanvasContent';
import React, { useState } from 'react';
import { Doc } from './interfaces/doc_interface';

function App(): JSX.Element {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>({
    type: 'note',
    filename: null
  });

  const handleDocSelect = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <div className="container">      
      <div className="app-container">
        <div className="doc-list">
          <DocsList onDocSelect={handleDocSelect} />
        </div>
        <div className="doc-content">
          {selectedDoc && selectedDoc.filename != null && selectedDoc.type === 'note' && (
            <NoteContent filename={selectedDoc.filename} />
          )}
          {selectedDoc && selectedDoc.type === 'canvas' && (
            <CanvasContent filename={selectedDoc.filename} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
