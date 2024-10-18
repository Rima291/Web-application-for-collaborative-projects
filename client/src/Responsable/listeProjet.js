import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Container,
  Typography,
  Grid,
  IconButton,
  Collapse,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore,
  ExpandLess,
  FiberManualRecord as FiberManualRecordIcon,
} from '@material-ui/icons';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import SearchIcon from '@material-ui/icons/Search';

import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DashboardResponsable from './dashboardResponsable';

// Couleurs pour les segments du pie chart
const COLORS = ['#008000', '#FFA500', '#FF0000'];

// Fonction pour obtenir la couleur selon le statut des tâches
const getStatusColor = (progress) => {
  if (progress === 100) return '#008000'; // Terminé
  if (progress > 0 && progress < 100) return '#FFA500'; // En cours
  if (progress === 0) return '#FF0000'; // Non commencé
  return 'black';
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    marginLeft: '300px',
    width: '1200px',
  },
  table: {
    minWidth: 650,
  },
  button: {
    marginBottom: theme.spacing(2),
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  collapseContent: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  projectTitle: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  searchContainer: {
    marginBottom: theme.spacing(3),
    width: '300px',
    marginLeft: '850px',
  },
  userImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  },
}));

export default function Projets() {
  const classes = useStyles();
  const [projets, setProjets] = useState([]);
  const [users, setUsers] = useState([]); // Nouvel état pour les utilisateurs
  const [expandedProject, setExpandedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const projectsPerPage = 10;
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetsResponse = await axios.get('http://localhost:5000/projet/allProjets');
        const tachesResponse = await axios.get('http://localhost:5000/tache/allTaches');
        const usersResponse = await axios.get('http://localhost:5000/users/allUsers'); // Nouvelle requête pour les utilisateurs

        setProjectTasks(tachesResponse.data);
        setProjets(projetsResponse.data);
        setUsers(usersResponse.data); // Stocker les utilisateurs dans l'état
      } catch (err) {
        console.error('Erreur lors du chargement des projets, des tâches et des utilisateurs:', err);
      }
    };

    fetchData();
  }, []);

  const filteredProjets = projets.filter((projet) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      projet.name.toLowerCase().includes(searchLower) ||
      projet.nameclient.toLowerCase().includes(searchLower) ||
      projet.namerespensable.toLowerCase().includes(searchLower)
    );
  });

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getProjectTasks = (projectName) => {
    return projectTasks.filter((task) => task.nameprojet === projectName);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/projet/delete/${id}`)
      .then(() => {
        setProjets((prevProjets) => prevProjets.filter((projet) => projet._id !== id));
      })
      .catch((err) => console.error('Erreur lors de la suppression du projet:', err));
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDeleteClick = (projectId) => {
    setDeletingProjectId(projectId);
  };

  const handleConfirmDelete = () => {
    if (deletingProjectId) {
      handleDelete(deletingProjectId);
      setDeletingProjectId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingProjectId(null);
  };

  const generateChartData = (projet) => {
    const tasks = getProjectTasks(projet.name);

    const completed = tasks.filter((task) => task.progress === 100).length;
    const inProgress = tasks.filter((task) => task.progress > 0 && task.progress < 100).length;
    const notStarted = tasks.filter((task) => task.progress === 0).length;

    return [
      { name: 'Terminé', value: completed },
      { name: 'En cours', value: inProgress },
      { name: 'Non commencé', value: notStarted },
    ];
  };

  const getProjectProgress = (projectName) => {
    const tasks = getProjectTasks(projectName);
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  const getProjectStatus = (projectName) => {
    const progress = getProjectProgress(projectName);
    if (progress === 100) return 'Terminé';
    if (progress > 0 && progress < 100) return 'En cours';
    return 'Non commencé';
  };

  return (
    <>
      <DashboardResponsable />

      <div style={{ marginLeft: '-10px', marginTop: '4px' }}>
        <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '700px' }}>
          Liste des Projets
        </Typography>
        <Container className={classes.container} maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center" className={classes.searchContainer}>
            <TextField
              variant="outlined"
              label="Rechercher des projets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid container justifyContent="space-between" alignItems="center">
            <Button
              component={Link}
              to="/createprojet"
              variant="contained"
              startIcon={<AddIcon />}
              className={classes.button}
              style={{ backgroundColor: '#3C91E6', color: 'white' }}
            >
              Ajouter Projet
            </Button>
          </Grid>

          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Projet</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell>Équipe</TableCell>
                  <TableCell>Date Limite</TableCell>
                  <TableCell>Etat Projet</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjets.slice((page - 1) * projectsPerPage, page * projectsPerPage).map((projet, index) => (
                  <React.Fragment key={projet._id}>
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className={classes.projectTitle} onClick={() => toggleProject(projet._id)}>
                        {projet.name}
                        {expandedProject === projet._id ? <ExpandLess /> : <ExpandMore />}
                      </TableCell>
                      <TableCell>{projet.nameclient}</TableCell>
                      <TableCell>
                        {(() => {
                          const responsable = users.find(user => user.name === projet.namerespensable);
                          return responsable ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img src={responsable.picture} alt={responsable.name} className={classes.userImage} />
                              <span style={{ marginLeft: '10px' }}>{responsable.name}</span>
                            </div>
                          ) : projet.namerespensable;
                        })()}
                      </TableCell>
                      <TableCell>
                      <ul>
                          {projet.namedeveloppeur?.map((devName, devIndex) => {
                            const user = users.find(user => user.name === devName);
                            return (
                              <li key={devIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                {user && <img src={user.picture} alt={user.name} className={classes.userImage} />}
                                <span style={{ marginLeft: '10px' }}>{devName}</span>
                              </li>
                            );
                          }) || 'Aucun développeur'}
                        </ul>
                      </TableCell>
                      <TableCell>{projet.date}</TableCell>
                      <TableCell>
                        <FiberManualRecordIcon style={{ color: getStatusColor(getProjectProgress(projet.name)) }} />
                        {getProjectStatus(projet.name)}
                      </TableCell>
                      <TableCell>
                        <>
                          <IconButton
                            component={Link}
                            to={`/updateprojet/${projet._id}`}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDeleteClick(projet._id)}
                            className={classes.iconButton}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Collapse in={expandedProject === projet._id}>
                          <Box className={classes.collapseContent}>
                            <Typography variant="h6">Tâches associées à {projet.name}</Typography>
                            <PieChart width={300} height={300}>
                              <Pie
                                data={generateChartData(projet)}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                              >
                                {generateChartData(projet).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <Tooltip />
                            </PieChart>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Développeur</TableCell>
                                  <TableCell>Tâche</TableCell>
                                  <TableCell>Date Limite</TableCell>
                                  <TableCell>État</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {getProjectTasks(projet.name).map((task, taskIndex) => (
                                  <TableRow key={taskIndex}>
                                    <TableCell>{task.namedeveloppeur}</TableCell>
                                    <TableCell>{task.name}</TableCell>
                                    <TableCell>{task.date}</TableCell>
                                    <TableCell>
                                      <FiberManualRecordIcon
                                        style={{ color: getStatusColor(task.progress) }}
                                      />
                                      {task.progress === 100 ? 'Terminé' : task.progress > 0 ? 'En cours' : 'Non commencé'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <Button onClick={handlePrevPage} disabled={page === 1} variant="outlined">
              Précédent
            </Button>
            <Typography variant="body1" style={{ marginLeft: '10px', marginRight: '10px' }}>{page}</Typography>
            <Button onClick={handleNextPage} variant="outlined">
              Suivant
            </Button>
          </Grid>

          <Dialog
            open={Boolean(deletingProjectId)}
            onClose={handleCancelDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation de suppression"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Êtes-vous sûr de vouloir supprimer ce projet ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="secondary">
                Annuler
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                Confirmer
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </>
  );
}
