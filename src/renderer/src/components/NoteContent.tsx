// NoteContent.js
import React, { useEffect, useState } from 'react';
import "trix/dist/trix.umd";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
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

  let mergeTags = [{
    trigger: "@",
    tags: [
      {name: "Dominic St-Pierre", tag: "@dominic"},
      {name: "John Doe", tag: "@john"}
    ]
  }, {
    trigger: "{",
    tags: [
      {name: "First name", tag: "{{ .FirstName }}"},
      {name: "Last name", tag: "{{ .LastName }}"}
    ]
  }]

  const handleEditorReady = (editor) => {
    console.log("editor is ready")
    editor.insertString("editor is ready");
  };

  const handleChange = (html, text) => {
    console.log("html", html);
    console.log("text", text);
  };

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
      <h3>Editor</h3>
      <p>Editor is ready</p>
      <div style={{width: 500, height: 500}}>
        <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} mergeTags={mergeTags}  />
      </div>
    </div>
  );
};

export default NoteContent;