import React, { useState } from 'react';
// Component imports
import DocsList from './components/DocsList';
import NoteContent from './components/NoteContent';
import CanvasContent from './components/CanvasContent';

// Asset imports
import icons from './assets/icons.svg'; // Assuming you're using this somewhere not shown
import { Doc } from './interfaces/doc_interface';

function App(): JSX.Element {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  const handleDocSelect = (doc: Doc) => {
    setSelectedDoc(doc);
  };

  const renderDocContent = () => {
    if (!selectedDoc) return null;

    switch (selectedDoc.type) {
      case 'note':
        return selectedDoc.filename && <NoteContent filename={selectedDoc.filename} />;
      case 'canvas':
        return <CanvasContent filename={selectedDoc.filename} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="doc-list">
        <DocsList onDocSelect={handleDocSelect} />
      </div>
      <div className="doc-content">
        {renderDocContent()}
      </div>
    </div>
  );
}

export default App;
