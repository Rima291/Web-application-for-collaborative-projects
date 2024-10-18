import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Dashboard from '../Admin/dashboardAdmin';
import DashboardResponsable from './dashboardResponsable';

function NotesRes() {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const saveNote = () => {
    if (editingIndex !== null) {
      // Mettre à jour une note existante
      const updatedNotes = [...notes];
      updatedNotes[editingIndex].text = noteText;
      setNotes(updatedNotes);
      setEditingIndex(null);
    } else {
      // Ajouter une nouvelle note
      setNotes([...notes, { text: noteText }]);
    }

    setNoteText(''); // Efface le texte après la sauvegarde
  };

  const editNote = (index) => {
    setNoteText(notes[index].text); // Charger le texte dans l'éditeur
    setEditingIndex(index);
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div>
        <DashboardResponsable />
      <div className="notes-container" style={{width:'700px', marginLeft:'400px', height:'300px'}}>
        <Typography variant="h4" gutterBottom>Bloc-Notes</Typography>
        
        <div className="editor-section" >
          <TextField
            label="Écrivez votre note ici..."
            multiline
            fullWidth
            value={noteText}
            onChange={handleNoteChange}
          />
          <Button variant="contained" onClick={saveNote} style={{marginTop:'20px'}}>
            {editingIndex !== null ? 'Modifier' : 'Sauvegarder'}
          </Button>
        </div>

        <div className="notes-list">
          {notes.map((note, index) => (
            <Card key={index} className="note-card">
              <CardContent>
                <Typography variant="h6" component="h2">Note {index + 1}</Typography>
                <Typography>{note.text}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => editNote(index)}>Modifier</Button>
                <Button onClick={() => deleteNote(index)}>Supprimer</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotesRes;
