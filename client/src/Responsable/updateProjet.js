import React, { useEffect, useState } from 'react';
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
  Paper,
} from '@material-ui/core';
import DashboardResponsable from './dashboardResponsable';

// Fonction utilitaire pour formater la date
const formatDate = (dateStr) => {
  if (!dateStr) return ''; // Retourne une chaîne vide si la date n'est pas définie
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // Formate au format `YYYY-MM-DD`
};

export function Updateprojet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [namedeveloppeur, setNamedeveloppeur] = useState([]);
  const [namerespensable, setNameresponsable] = useState('');
  const [nameclient, setNameclient] = useState('');
  const [date, setDate] = useState('');
  const [alertVisible, setAlertVisible] = useState(false); // Nouvelle variable d'état pour l'alerte

  const [developers, setDevelopers] = useState([]);
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/projet/getProjet/${id}`);
        setName(result.data.name);
        setNameclient(result.data.nameclient);
        setNameresponsable(result.data.namerespensable); // Assurez-vous que c'est le bon champ

        // Formater la date si elle est définie
        const projectDate = result.data.date;
        setDate(formatDate(projectDate)); // Utilise `formatDate` pour formater la date
        setNamedeveloppeur(result.data.namedeveloppeur);
      } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error.message);
      }
    };

    const fetchDevelopers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/allUsers");
        const filteredDevelopers = response.data.filter(
          (developer) => developer.role === 'developpeur'
        );
        setDevelopers(filteredDevelopers);
      } catch (error) {
        console.error('Erreur lors de la récupération des développeurs:', error.message);
      }
    };

    const fetchResponsables = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/allUsers");
        const filteredResponsables = response.data.filter(
          (responsable) => responsable.role === 'responsable'
        );
        setResponsables(filteredResponsables);
      } catch (error) {
        console.error('Erreur lors de la récupération des responsables:', error.message);
      }
    };

    fetchProjet();
    fetchDevelopers(); // Récupération des développeurs
    fetchResponsables(); // Récupération des responsables
  }, [id]);
  useEffect(() => {
    const currentDate = new Date();
    const projectDate = new Date(date);
    if (projectDate < currentDate) {
      setAlertVisible(true);
    } else {
      setAlertVisible(false);
    }
  }, [date]);

  const updateProjet = async (e) => {
    e.preventDefault();
    if (alertVisible) {
      alert('La date de la tâche ne peut pas être antérieure à la date actuelle.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/projet/updateprojet/${id}`, {
        name,
        namedeveloppeur,
        namerespensable, // Assurez-vous que c'est le bon champ
        nameclient,
        date,
      });
      alert('Projet Modifié')
      navigate('/listeProjet'); // Redirection après la mise à jour réussie
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error.message);
    }
  };

  return (
    <>
      <DashboardResponsable />
      <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '700px' }}>Mettre à jour le Projet</Typography>
      <Container maxWidth="md" style={{ marginTop: '-5px', marginLeft: '400px' }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <Paper elevation={3} style={{ padding: '20px' }}>

              <form onSubmit={updateProjet}>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label="Nom du client"
                  value={nameclient}
                  onChange={(e) => setNameclient(e.target.value)}
                />

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Responsable</InputLabel>
                  <Select
                    value={namerespensable}
                    onChange={(e) => setNameresponsable(e.target.value)}
                    label="Responsable"
                    required
                  >
                    {responsables.map((responsable) => (
                      <MenuItem key={responsable._id} value={responsable.name}>
                        {responsable.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Développeurs</InputLabel>
                  <Select
                    value={namedeveloppeur}
                    onChange={(e) => setNamedeveloppeur(e.target.value)}
                    label="Développeurs"
                    multiple
                  >
                    {developers.map((developer) => (
                      <MenuItem key={developer._id} value={developer.name}>
                        {developer.name}
                      
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  fullWidth
                  type="date"
                  margin="normal"
                  value={date} // La date devrait être au format `YYYY-MM-DD`
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }} // Pour éviter que le label ne cache le champ de date
                />
                  {alertVisible && ( // Afficher l'alerte si alertVisible est vrai
        <Typography variant="body1" style={{ color: 'red', textAlign: 'center', margin: '10px auto', marginLeft:'230px' }}>
          La date limite est antérieure à la date actuelle !
        </Typography>
         )}

                <Button type="submit" variant="contained" style={{ backgroundColor: '#3C91E6', color: 'white' ,marginLeft:'160px'}}>
                  Mettre à jour le projet
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
