import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@material-ui/core';
import DashboardResponsable from './dashboardResponsable';
import Cookies from 'universal-cookie';

export function Createproject() {
  const [name, setName] = useState('');
  const [namedeveloppeur, setNamedeveloppeur] = useState([]);
  const [namerespensable, setNamerespensable] = useState('');
  const [nameclient, setNameclient] = useState('');
  const [date, setDate] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false); // Nouvelle variable d'état pour l'alerte
  const navigate = useNavigate();
  const cookies = new Cookies();
  const responsableName = cookies.get('name');

  useEffect(() => {
    axios.get("http://localhost:5000/users/allUsers")
      .then(response => {
        const allUsers = response.data;
        const filteredDevelopers = allUsers.filter(user => user.role === 'developpeur');
        const filteredResponsables = allUsers.filter(user => user.role === 'responsable');

        setDevelopers(filteredDevelopers);
        setResponsables(filteredResponsables);
        setNamerespensable(responsableName); // Définir le responsable connecté comme responsable du projet
      })
      .catch(err => console.log(err));
  }, [responsableName]);

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
    axios.post("http://localhost:5000/projet/createprojet", {
      name,
      namedeveloppeur,
      namerespensable,
      nameclient,
      date,
    })
      .then(result => {
        console.log(result);
        alert('Création réussie !');
        navigate('/listeProjet');
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <DashboardResponsable />
      
      <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft:'700px' }}>Créer un Nouveau Projet</Typography>
      <Container maxWidth="md" style={{ marginTop: '5px' , marginLeft:'450px' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper elevation={3} style={{ padding: '20px' }}>
             
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Nom du Projet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Client"
                  value={nameclient}
                  onChange={(e) => setNameclient(e.target.value)}
                  required
                />

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Responsable Projet</InputLabel>
                  <Select
                    value={namerespensable}
                    onChange={(e) => setNamerespensable(e.target.value)}
                    label="Responsable Projet"
                    required
                  >
                    {responsables.map(responsable => (
                      <MenuItem key={responsable._id} value={responsable.name}>
                        {responsable.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Equipe Projet</InputLabel>
                  <Select
                    value={namedeveloppeur}
                    onChange={(e) => setNamedeveloppeur(e.target.value)}
                    label="Equipe Projet"
                    multiple
                    required
                  >
                    {developers.map(developer => (
                      <MenuItem key={developer._id} value={developer.name}>
                        {developer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                {alertVisible && ( // Afficher l'alerte si alertVisible est vrai
        <Typography variant="body1" style={{ color: 'red', textAlign: 'center', margin: '10px auto', marginLeft:'230px' }}>
          La date limite est antérieure à la date actuelle !
        </Typography>
      )}

                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Link to="/listeProjet" style={{ textDecoration: 'none' }}>
                      <Button variant="outlined">Retour à la liste</Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained"  style={{backgroundColor:'#3C91E6', color:'white'}}>Créer</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
