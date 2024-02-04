import React, { useEffect, useRef } from 'react';
import TrixEditor from './TrixEditor';
import debounce from 'lodash/debounce';
import { fetchAutocomplete } from '../services/TextGeneration';
const { ipcRenderer } = window.electron;

const NoteContent = ({ filename }) => {
  const editorRef = useRef(null);

  const saveNote = async () => {
    if (!filename) {
      console.error("No filename specified for saving.");
      return;
    }

    try {
      // Assuming the Trix editor's content is directly accessible as innerHTML
      // Adjust this based on how you can best extract content from Trix in your setup
      const content = editorRef.current ? editorRef.current.innerHTML : '';
      await ipcRenderer.invoke('save-note', filename, content);
      console.log("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  useEffect(() => {
    const fetchNoteContent = async () => {
      if (filename) {
        try {
          const content = await ipcRenderer.invoke('read-note', filename);
          // Directly setting the editor's content through innerHTML
          // This may need adjustment based on your specific requirements and Trix's capabilities
          if (editorRef.current) {
            editorRef.current.editor.loadJSON(JSON.parse(content))
          }
        } catch (error) {
          console.error('Error reading note:', error);
        }
      }
    };

    fetchNoteContent();
  }, [filename]);

  const handleEditorReady = (trixEditor) => {
    // This callback now correctly captures the editor reference
    // Ensure this matches how you plan to use the editor's API
    editorRef.current = trixEditor;
  };

  const insertAutocompleteSuggestion = debounce(async (text) => {
    try {
      const data = await fetchAutocomplete(text);
      if (editorRef.current && data.response) {
        // Inserting suggestion directly to the Trix editor
        // Adjust based on Trix's API for inserting text
        editorRef.current.editor.insertString(data.response);
      }
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    }
  }, 300);

  const handleChange = (_html, text) => {
    //insertAutocompleteSuggestion(text);
  };

  return (
    <div className="note-content">
      <h2>Note Content</h2>
      <button onClick={saveNote} className="save-button">Save</button>
      <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} />
    </div>
  );
};

export default NoteContent;
