import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
import 'trix';

const TrixEditor = (props) => {
  const trixEditorRef = useRef(null);

  useEffect(() => {
    const trixEditor = trixEditorRef.current;
    trixEditor.addEventListener('trix-change', (event) => {
      if (props.onChange) {
        props.onChange(event.target.innerHTML);
      }
    });
    trixEditor.addEventListener('trix-initialize', (event) => {
      if (props.onEditorReady) {
        props.handleEditorReady(event.target.innerHTML);
      }
    });
  }, []);

  return (
    <trix-editor ref={trixEditorRef} input="trix-input" placeholder="tododidou"></trix-editor>
  );
};

export default TrixEditor;
