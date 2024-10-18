import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper 
} from '@material-ui/core';
import DashboardResponsable from './dashboardResponsable';

// Fonction utilitaire pour formater la date
const formatDate = (dateStr) => {
  if (!dateStr) return ''; // Retourne une chaîne vide si la date n'est pas définie
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // Formate au format `YYYY-MM-DD`
};

export function UpdateTache()  {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [namedeveloppeur, setNamedeveloppeur] = useState('');
  const [date, setDate] = useState('');
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const fetchTache = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/tache/getTache/${id}`);
        setName(result.data.name);
        setDescription(result.data.description);
        setNamedeveloppeur(result.data.namedeveloppeur);
        
        // Formater la date si elle est définie
        const tacheDate = result.data.date;
        setDate(formatDate(tacheDate)); // Utilise `formatDate` pour formater la date
      } catch (error) {
        console.error('Erreur lors de la récupération de la tâche:', error.message);
      }
    };

    const fetchDevelopers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/allUsers");
        const filteredDevelopers = response.data.filter(
          (user) => user.role === 'developpeur'
        );
        setDevelopers(filteredDevelopers);
      } catch (error) {
        console.error('Erreur lors de la récupération des développeurs:', error.message);
      }
    };

    fetchTache();
    fetchDevelopers();
  }, [id]);

  const updateTache = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/tache/update/${id}`, { name, description, namedeveloppeur, date })
      .then((result) => {
        console.log(result);
        alert('Taches Modifiée')

        navigate('/listeTache'); // Redirection après la mise à jour réussie
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <DashboardResponsable />
      <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft:'740px' }}>Modifier la tâche</Typography>
      <Container maxWidth="md" style={{ marginTop: '50px' , marginLeft:'400px' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper elevation={3} style={{ padding: '20px' }}>
            
              <form onSubmit={updateTache}>
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Développeur</InputLabel>
                  <Select
                    value={namedeveloppeur}
                    onChange={(e) => setNamedeveloppeur(e.target.value)}
                    label="Développeur"
                  >
                    <MenuItem value="">Sélectionner un développeur</MenuItem>
                    {developers.map((developer) => (
                      <MenuItem key={developer._id} value={developer.name}>
                        {developer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  style={{backgroundColor:'#3C91E6', color:'white'}}
                >
                  Modifier 
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default UpdateTache;

