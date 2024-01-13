// NoteContent.js
import React, { useEffect, useState } from 'react';
import "trix/dist/trix.umd";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";

const ipcRenderer = window.electron.ipcRenderer;

const NoteContent = ({ filename }) => {
  const [noteContent, setNoteContent] = useState('');
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    console.log("selected note changed")
    const fetchNoteContent = async () => {
      if (filename) {
        try {
          const content = await ipcRenderer.invoke('read-note', filename);
          setNoteContent(content);

          if(editor) {
            editor.loadJSON(JSON.parse(content))
          }
        } catch (error) {
          console.error('Error reading note:', error);
          setNoteContent('Error loading note content');
        }
      } else {
        console.log("new note")
        // This is a new note, so clear the content
        setNoteContent('');

        if(editor) {
          editor.loadHTML("")
        }
      }
    };

    fetchNoteContent();
  }, [filename]); // Run this effect when selectedNote changes

  useEffect(() => {
    console.log("trix editor changed")
    console.log("setting content to")
    console.log(noteContent)

    if (editor && noteContent) {
      editor.loadJSON(JSON.parse(noteContent))
    }
  }, [editor]); // Run this effect when editor changes

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

  const handleEditorReady = (trix_editor) => {
    console.log("editor is ready")
    setEditor(trix_editor);
  };

  const handleChange = (html, text) => {
    console.log(JSON.stringify(editor));
  };

  return (
    <div className="note-content">
      <h2>Note Content</h2>
      <div>
        <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} mergeTags={mergeTags} placeholder="tododidou" />
      </div>
    </div>
  );
};

export default NoteContent;