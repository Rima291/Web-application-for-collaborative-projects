import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@material-ui/core';
import DashboardResponsable from './dashboardResponsable';

const CreateTache = () => {
  const [nameprojet, setNameprojet] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [namedeveloppeur, setNamedeveloppeur] = useState('');
  const [date, setDate] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [, setError] = useState('');
  const [alertVisible, setAlertVisible] = useState(false); // Nouvelle variable d'état pour l'alerte

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/users/allUsers')
      .then(response => {
        const filteredDevelopers = response.data.filter(user => user.role === 'developpeur');
        setDevelopers(filteredDevelopers);
      })
      .catch(err => console.error("Erreur lors de la récupération des développeurs:", err));

    axios.get('http://localhost:5000/projet/allProjets')
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => console.error("Erreur lors de la récupération des projets:", err));
  }, []);
  useEffect(() => {
    // Vérifier si la date limite est antérieure à la date actuelle
    const currentDate = new Date();
    const projectDate = new Date(date);
    if (projectDate < currentDate) {
      setAlertVisible(true);
    } else {
      setAlertVisible(false);
    }
  }, [date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alertVisible) {
      alert('La date de la tâche ne peut pas être antérieure à la date actuelle.');
      return;
    }

    // Vérification de la date de la tâche par rapport à la date limite du projet
    const project = projects.find(project => project.name === nameprojet);
    if (new Date(date) > new Date(project.date)) {
      alert('La date de la tâche ne peut pas être postérieure à la date limite du projet.');
      return;
    }

    if (!nameprojet || !name || !description || !namedeveloppeur || !date) {
      setError('Tous les champs doivent être remplis.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert("Vous devez être connecté pour créer une tâche.");
      navigate('/');
      return;
    }

    axios.post(
      'http://localhost:5000/tache/create',
      { nameprojet, name, description, namedeveloppeur, date },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(result => {
      console.log('Tâche créée avec succès:', result.data);
      alert('Création réussie!');
      navigate('/listeTache');
    })
    .catch(err => {
      console.error("Erreur lors de la création de la tâche:", err);
      alert("Erreur lors de la création de la tâche. Veuillez réessayer.");
    });
  };

  return (
    <>
      <DashboardResponsable />
      <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft:'600px' }}>Créer une Nouvelle Tache</Typography>
      <Container maxWidth="md" style={{ marginTop: '2px', marginLeft:'350px' }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <Paper elevation={3} style={{ padding: '20px' }}>
             
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="projet">Projet</InputLabel>
                  <Select
                    value={nameprojet}
                    onChange={(e) => setNameprojet(e.target.value)}
                    inputProps={{ name: 'projet', id: 'projet' }}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project.name}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Tâche"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  required
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="developpeur">Développeur</InputLabel>
                  <Select
                    value={namedeveloppeur}
                    onChange={(e) => setNamedeveloppeur(e.target.value)}
                    inputProps={{ name: 'developpeur', id: 'developpeur' }}
                  >
                    {developers.map((developer) => (
                      <MenuItem key={developer._id} value={developer.name}>
                        {developer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  margin="normal"
                  required
                />
                          {alertVisible && ( // Afficher l'alerte si alertVisible est vrai
        <Typography variant="body1" style={{ color: 'red', textAlign: 'center', margin: '10px auto', marginLeft:'230px' }}>
          La date limite est antérieure à la date actuelle !
        </Typography>
         )}

                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Link to="/listeTache" style={{ textDecoration: 'none' }}>
                      <Button variant="outlined">Retour à la liste</Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained" style={{backgroundColor:'#3C91E6', color:'white'}}>Créer</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CreateTache;
