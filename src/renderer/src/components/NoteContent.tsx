import React, { useEffect, useRef, useState } from 'react';
import TrixEditor from './TrixEditor';
import debounce from 'lodash/debounce';
import { fetchAutocomplete } from '../services/TextGeneration';
const { ipcRenderer } = window.electron;

import '../assets/docs-list.css';

const NoteContent = ({ filename }) => {
  const editorRef = useRef(null);
  const [suggestion, setSuggestion] = useState('');

  const saveNote = async () => {
    if (!filename) {
      console.error("No filename specified for saving.");
      return;
    }

    try {
      // Assuming the Trix editor's content is directly accessible as innerHTML
      // Adjust this based on how you can best extract content from Trix in your setup
      const content = editorRef.current ? JSON.stringify(editorRef.current.editor) : '';
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

  // Function to fetch autocomplete suggestion
  const fetchSuggestion = async (text) => {
    try {
      const data = await fetchAutocomplete(text);
      console.log('Autocomplete response:', data.response);
      setSuggestion(data.response); // Set the suggestion in state
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    }
  };

  // Debounced fetch suggestion
  const handleChange = debounce((html, text) => {
    fetchSuggestion(text);
  }, 300);

  // Effect for handling the Tab key to insert the suggestion
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab' && suggestion && editorRef.current) {
        event.preventDefault(); // Prevent default tab behavior
        console.log('Inserting suggestion:', suggestion);
        editorRef.current.editor.insertString(suggestion);
        setSuggestion(''); // Clear the suggestion
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [suggestion]);

  return (
    <div className="note-content">
      <h2>Note Content ({filename})</h2>
      <button onClick={saveNote} className="save-button">Save</button>
      <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} />
      {/* Render the suggestion in the editor */}
      {suggestion && (
        <div className="autocomplete-suggestion">
          {suggestion}
        </div>
      )}
    </div>
  );
};

export default NoteContent;
