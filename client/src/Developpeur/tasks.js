import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  makeStyles,
  Select,
  MenuItem,
  TextField,
  Button,
  InputAdornment,
} from '@material-ui/core';

import { FiberManualRecord as FiberManualRecordIcon, Search as SearchIcon } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import DashboardDev from './dashboardDeveloppeur';

const useStyles = makeStyles(() => ({
  statusIcon: {
    fontSize: '1.2rem',
  },
  card: {
    marginBottom: '20px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterInput: {
    marginRight: '20px',
  },
  completedTask: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Couleur de fond grise pour les tâches terminées
  },
}));

const getStatusColor = (progress) => {
  if (progress === 0) return '#DC143C'; // Non commencé
  if (progress > 0 && progress < 100) return '#FF8C00'; // En cours
  if (progress === 100) return '#2E8B57'; // Terminé
  return 'gray'; // Couleur de statut par défaut
};

export function Tasks() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [token, navigate, currentPage, searchTerm]);

  const fetchTasks = () => {
    axios
      .get(`http://localhost:5000/tache/myTasks?page=${currentPage}&search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des tâches:', error);
        if (error.response && error.response.status === 403) {
          alert('Votre session a expiré. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Erreur lors de la récupération des tâches.');
        }
      });
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .patch(`http://localhost:5000/tache/updat/${id}`, { progress: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchTasks(); // Recharger les tâches après la mise à jour
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        setError('Erreur lors de la mise à jour de la tâche.');
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <DashboardDev />
      <div style={{ width: '900px', marginLeft: '400px' }}>
        <Typography variant="h4" style={{ color: '#3C91E6'}}>Mes Taches </Typography>
      
        {error && <Typography color="error">{error}</Typography>}
        {tasks && tasks.length === 0 ? (
          <Typography>Aucune tache trouvée</Typography>
        ) : (
          tasks && tasks.map((task) => (
            <Card
              key={task._id}
              className={`${classes.card} ${task.progress === 100 ? classes.completedTask : ''}`}
            >
              <CardContent>
                <Typography variant="h5" component="h4">Projet: {task.nameprojet}</Typography>
                <Typography variant="h6" component="h4">Tache: {task.name}</Typography>
                <Typography color="textSecondary" component="h4">Description: {task.description}</Typography>
                <Typography color="textSecondary">Date Limite: {task.date}</Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  <FiberManualRecordIcon
                    style={{ color: getStatusColor(task.progress) }}
                    className={classes.statusIcon}
                  />
                  <Select
                    style={{ color: getStatusColor(task.progress) }}
                    value={task.progress}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <MenuItem value={0}>Non commencé</MenuItem>
                    <MenuItem value={50}>En cours</MenuItem>
                    <MenuItem value={100}>Terminé</MenuItem>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default Tasks;
