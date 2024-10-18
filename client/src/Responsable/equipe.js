import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import DashboardResponsable from './dashboardResponsable';

// Utilisez un composant dédié pour les styles pour éviter de dupliquer le code
const StyledPaper = (props) => (
  <Paper elevation={3} style={{ padding: '20px', ...props.style }}>
    {props.children}
  </Paper>
);

const StyledTypography = (props) => (
  <Typography style={{ fontWeight: 'bold', ...props.style }}>
    {props.children}
  </Typography>
);

export function Equipe() {
  const [namedeveloppeur, setNamedeveloppeur] = useState([]);
  const [namedprojet, setNamedprojet] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);

  // Charger les données depuis localStorage lors du montage du composant
  useEffect(() => {
    const savedDevelopers = JSON.parse(localStorage.getItem('namedeveloppeur'));
    const savedProject = localStorage.getItem('namedprojet');

    if (savedDevelopers) {
      setNamedeveloppeur(savedDevelopers);
    }

    if (savedProject) {
      setNamedprojet(savedProject);
    }

    axios.get("http://localhost:5000/users/allUsers")
      .then((response) => {
        const developerUsers = response.data.filter((user) => user.role === 'developpeur');
        setDevelopers(developerUsers);
      })
      .catch((err) => console.error(err));

    axios.get("http://localhost:5000/projet/allProjets")
      .then((response) => {
        setProjects(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Sauvegarder les développeurs sélectionnés dans localStorage
  useEffect(() => {
    localStorage.setItem('namedeveloppeur', JSON.stringify(namedeveloppeur));
  }, [namedeveloppeur]); // Observe les changements sur namedeveloppeur

  // Sauvegarder le projet sélectionné dans localStorage
  useEffect(() => {
    localStorage.setItem('namedprojet', namedprojet);
  }, [namedprojet]); // Observe les changements sur namedprojet

  const handleDeveloperChange = (event) => {
    const selectedDevelopers = event.target.value;
    setNamedeveloppeur(selectedDevelopers);
  };

  return (
    <>
      <DashboardResponsable />
      <Container maxWidth="md" style={{ marginTop: '40px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <FormControl fullWidth>
                <InputLabel id="select-project-label">Projet</InputLabel>
                <Select
                  labelId="select-project-label"
                  id="select-project"
                  value={namedprojet}
                  onChange={(e) => setNamedprojet(e.target.value)}
                >
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project.name}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <FormControl fullWidth>
                <InputLabel id="select-developer-label">Développeur</InputLabel>
                <Select
                  labelId="select-developer-label"
                  id="select-developer"
                  multiple
                  value={namedeveloppeur}
                  onChange={handleDeveloperChange}
                >
                  {developers.map((developer) => (
                    <MenuItem key={developer._id} value={developer.name}>
                      {developer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </StyledPaper>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h6">Projet sélectionné :</StyledTypography>
              <StyledTypography variant="body1">{namedprojet}</StyledTypography>
          </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h6">Développeurs sélectionnés :</StyledTypography>
              <StyledTypography variant="body1">{namedeveloppeur.join(', ')}</StyledTypography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
