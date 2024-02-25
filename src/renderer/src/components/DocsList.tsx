import React, { useEffect, useState } from 'react';
import { Doc } from '../interfaces/doc_interface';
import '../assets/docs-list.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Paper from '@mui/material/Paper';

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
    <Box className="docs-list">
      <List dense={true}>
      <ListItemButton onClick={() => addDoc('note')}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="+ Add Note" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => addDoc('canvas')}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="+ Add Canvas" />
        </ListItemButton>
        <Divider />
        <ListSubheader>Notes</ListSubheader>

        {docs.filter(doc => doc.type === 'note').map((doc, index) => (
          <ListItem key={index} onClick={() => onDocSelect(doc)}>
            <ListItemText primary={doc.filename} secondary={'1 Jan 2024'} />
          </ListItem>
        ))}

      <ListSubheader>Canvases</ListSubheader>

        {docs.filter(doc => doc.type === 'canvas').map((doc, index) => (
          <ListItem key={index} onClick={() => onDocSelect(doc)}>
            <ListItemText primary={doc.filename} secondary={'???'} />
          </ListItem>
        ))}
      </List>      
    </Box>
  );
};

export default DocsList;
