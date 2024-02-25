import React, { useState } from 'react';
// Component imports
import DocsList from './components/DocsList';
import NoteContent from './components/NoteContent';
import CanvasContent from './components/CanvasContent';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';

// Asset imports
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
    <Box className="container">
      <div className="doc-list">
        <DocsList onDocSelect={handleDocSelect} />
      </div>
      <div className="doc-content">
        {renderDocContent()}
      </div>
    </Box>
  );
}

export default App;
