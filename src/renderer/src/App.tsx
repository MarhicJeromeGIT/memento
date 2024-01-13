import Versions from './components/Versions'
import icons from './assets/icons.svg'
import Counter from './components/Counter'
import DocsList from './components/DocsList'
import NoteContent from './components/NoteContent';
import CanvasContent from './components/CanvasContent';
import React, { useState } from 'react';
import { Doc } from './interfaces/doc_interface';

function App(): JSX.Element {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  const handleDocSelect = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <div className="container">      
      <h2 className="hero-text">Note list</h2>
      <div className="app-container">
        <DocsList onDocSelect={handleDocSelect} />
        {selectedDoc && selectedDoc.type === 'note' && (
          <NoteContent selectedNote={selectedDoc.filename} />
        )}
        {selectedDoc && selectedDoc.type === 'canvas' && (
          <CanvasContent filename={selectedDoc.filename} />
        )}
      </div>

      <Versions></Versions>
    </div>
  )
}

export default App
