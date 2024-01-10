import React, { useEffect, useState } from 'react';
const ipcRenderer = window.electron.ipcRenderer;

const NotesList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        ipcRenderer.send('list-notes');

        ipcRenderer.on('list-notes-response', (event, files) => {
            setNotes(files);
        });

        return () => {
            // Clean up the listener
            ipcRenderer.removeAllListeners('list-notes-response');
        };
    }, []);

    return (
        <div>
            <h2>Your Notes</h2>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotesList;
