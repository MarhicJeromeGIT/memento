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
    <div className="canvas-content">
      <h2>Canvas</h2>
      <div className="canvas-content-tldraw">
        <Tldraw />
      </div>
    </div>
  );
};

export default CanvasContent;