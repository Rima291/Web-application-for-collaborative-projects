import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import {
  FiberManualRecord as FiberManualRecordIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DashboardResponsable from './dashboardResponsable';

// Fonction pour obtenir la couleur selon le progrès
const getStatusColor = (progress) => {
  if (progress === 0) return 'red';
  if (progress > 0 && progress < 100) return 'orange';
  if (progress === 100) return 'green';
  return 'black';
};

// Fonction pour formater les dates
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// Styles personnalisés
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    marginLeft: '300px',
    width: '1200px',
  },
  projectTitle: {
    padding: theme.spacing(2),
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  listItem: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    height:'50px'
  },
  statusIcon: {
    marginRight: theme.spacing(2),
  },
  searchContainer: {
    marginBottom: theme.spacing(3),
    width:'300px',
    marginLeft:'850px'
  },
}));

const ProjetTaches = () => {
  const classes = useStyles();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Page actuelle
  const projectsPerPage = 10; // Projets par page
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tacheToDelete, setTacheToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetsResponse = await axios.get(
          'http://localhost:5000/projet/allProjets'
        );
        const tachesResponse = await axios.get(
          'http://localhost:5000/tache/allTaches'
        );

        // Appliquer le filtre de recherche avant la pagination
        const filteredProjets = projetsResponse.data.filter((projet) =>
          projet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Appliquer la pagination après le filtre
        const startIndex = (page - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;

        setProjets(filteredProjets.slice(startIndex, endIndex));
        setTaches(tachesResponse.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, searchTerm]); // Recharger lors du changement de page ou de recherche

  const toggleProjectDetails = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const handleOpenDeleteDialog = (tacheId) => {
    setTacheToDelete(tacheId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (tacheToDelete) {
      try {
        await axios.delete(`http://localhost:5000/tache/delete/${tacheToDelete}`);
        setTaches((prevTaches) => prevTaches.filter((tache) => tache._id !== tacheToDelete));
        setDeleteDialogOpen(false);
        setTacheToDelete(null);
      } catch (err) {
        console.error('Erreur lors de la suppression de la tâche:', err);
      }
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (isLoading) {
    return <Typography variant="h6">Chargement...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Erreur : {error.message}
      </Typography>
    );
  }

  return (
    <>
      <DashboardResponsable />
      <Container className={classes.container}>
        <Typography variant='h4' style={{color: '#3C91E6'}}>Liste des Taches</Typography>
      <Grid container justifyContent="space-between" alignItems="center" className={classes.searchContainer}>
        <TextField
          variant="outlined"
          label="Rechercher "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le terme de recherche
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon /> {/* Icône de recherche à droite */}
              </InputAdornment>
            ),
          }}
        />
      </Grid>

        <Grid container spacing={3}>
          {projets.map((projet) => (
            <Grid item xs={12} key={projet._id}>
              <Typography
                variant="h6"
                className={classes.projectTitle}
                onClick={() => toggleProjectDetails(projet._id)}
              >
                {projet.name}
              </Typography>
              {expandedProjectId === projet._id && (
                <>
                <br/>
                  <Button
                    component={Link}
                    to={`/createTache?projet=${projet.name}`}
                    variant="contained"
                    style={{backgroundColor:'#3C91E6', color:'white'}}
                    startIcon={<AddIcon />}
                  >
                  </Button>
                  <List>
                    {taches
                      .filter((tache) => tache.nameprojet === projet.name)
                      .map((tache) => (
                        <ListItem
                          key={tache._id}
                          className={classes.listItem}
                        >
                          <ListItemIcon>
                            <FiberManualRecordIcon
                              style={{ color: getStatusColor(tache.progress) }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Tâche : ${tache.name}`}
                            secondary={`Developpeur : ${tache.namedeveloppeur} | Description : ${tache.description} | Progrès : ${tache.progress}% | Date limite : ${formatDate(tache.date)}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              component={Link}
                              to={`/updateTache/${tache._id}`}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              onClick={() => handleOpenDeleteDialog(tache._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </>
              )}
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button onClick={handlePrevPage} disabled={page === 1} variant="outlined">
            Précédent
          </Button>
          <Typography variant="body1" style={{ marginLeft: '10px', marginRight: '10px' }}>
            {page}
          </Typography>
          <Button onClick={handleNextPage} variant="outlined">
            Suivant
          </Button>
        </Grid>
      </Container>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cette tâche ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjetTaches;

