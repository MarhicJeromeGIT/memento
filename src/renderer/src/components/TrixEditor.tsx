import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
import 'trix';

const TrixEditor = (props) => {
  const trixEditorRef = useRef(null);

  useEffect(() => {
    const trixEditor = trixEditorRef.current;
    trixEditor.addEventListener('trix-change', (event) => {
      if (props.onChange) {
        props.onChange(event.target.innerHTML, event.target.innerText);
      }
    });
    trixEditor.addEventListener('trix-initialize', (event) => {
      console.log("trix is initializerd, sending to parent")
      if (props.onEditorReady) {
        console.log("props is set")
        props.onEditorReady(trixEditor);
      }
    });
  }, []);

  return (
    <trix-editor ref={trixEditorRef} input="trix-input" placeholder="tododidou"></trix-editor>
  );
};

export default TrixEditor;
