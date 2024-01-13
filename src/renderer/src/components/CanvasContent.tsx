// NoteContent.js
import React, { useEffect, useState } from 'react';
import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

const ipcRenderer = window.electron.ipcRenderer;

const CanvasContent = ({ filename }) => {

  useEffect(() => {
    console.log("loading tldraw for ", filename)
  }, [filename]); // Run this effect when selectedNote changes

  return (
    <div style={{ width: '500px', height: '500px' }}>
      <Tldraw />
    </div>
  );
};

export default CanvasContent;