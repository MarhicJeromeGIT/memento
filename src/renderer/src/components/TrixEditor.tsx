import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
import 'trix';

const TrixEditor = (props) => {
  const trixEditorRef = useRef(null);

  useEffect(() => {
    const trixEditor = trixEditorRef.current;

    const handleChange = (event) => {
      if (props.onChange) {
        props.onChange(event.target.innerHTML, event.target.innerText);
      }
    };

    const handleInitialize = (event) => {
      if (props.onEditorReady) {
        props.onEditorReady(trixEditor);
      }
    };

    trixEditor.addEventListener('trix-change', handleChange);
    trixEditor.addEventListener('trix-initialize', handleInitialize);

    // Cleanup function
    return () => {
      trixEditor.removeEventListener('trix-change', handleChange);
      trixEditor.removeEventListener('trix-initialize', handleInitialize);
    };
  }, []); // Props aren't in dependency array; add them if props change dynamically

  return (
    <trix-editor ref={trixEditorRef} input="trix-input" placeholder="Enter text here..."></trix-editor>
  );
};

export default TrixEditor;
