// NoteContent.js
import React, { useEffect, useState, useRef } from 'react';
import TrixEditor from './TrixEditor';
import debounce from 'lodash/debounce';
import { fetchAutocomplete } from '../services/TextGeneration'; // Adjust the path as necessary
const ipcRenderer = window.electron.ipcRenderer;

const NoteContent = ({ filename }) => {
  const [noteContent, setNoteContent] = useState('');
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const saveNote = async () => {
    console.log("attempting to save to ", filename)
    if (!filename) {
      console.error("No filename specified for saving.");
      return;
    }
  
    try {
      const content = JSON.stringify(editorRef.current.editor.getDocument()); // Assuming you want to save in JSON format
      console.log("saving content : ")
      console.log(content)
      await ipcRenderer.invoke('save-note', filename, content);
      console.log("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

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

  const handleEditorReady = (trix_editor) => {
    editorRef.current = trix_editor; // Store the editor instance in the ref
    console.log('Editor is ready:', editorRef.current);
  };

  const insertAutocompleteSuggestion = (suggestion) => {
    console.log("inserting suggestion")
    console.log(editorRef.current)
    if (!editorRef.current) return;
    
    const editorElement = editorRef.current.editor;
    console.log("autocomplete on", editorElement)
    editorElement.insertString(suggestion);
  };

  const handleChangeDebounced = debounce(async (text) => {
    try {
      const data = await fetchAutocomplete(text);
      let completion = data['response']
      console.log(completion);
      // Process and use the data as needed

      insertAutocompleteSuggestion(completion)
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    }
  }, 300); // Adjust debounce time as necessary

  const handleChange = (_html: string, text: string) => {
    // console.log("text changed to text ", text);
    // handleChangeDebounced(text);
  };

  return (
    <div className="note-content">
      <h2>Note Content</h2>
      <button onClick={saveNote} className="save-button">SAVE</button>
      <div>
         <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} />
      </div>
    </div>
  );
};

export default NoteContent;