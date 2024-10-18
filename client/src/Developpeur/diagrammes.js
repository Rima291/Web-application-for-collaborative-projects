import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DashboardDev from './dashboardDeveloppeur';

// Couleurs spécifiques pour les états des tâches
const COLORS = ['#E83737', '#FEB737', '#008000']; // Rouge, Orange, Vert

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    marginLeft: '400px',
    marginRight: 'auto',
    maxWidth: 900,
  },
  title: {
    marginBottom: theme.spacing(2),
    color: '#4d7cbf'
  },
}));

// Fonction pour créer les données du graphique à barres empilées
const generateBarChartData = (projets, projectTasks) => {
  return projets.map((projet) => {
    const tasks = projectTasks.filter((task) => task.nameprojet === projet.name);
    const completed = tasks.filter((task) => task.progress === 100).length;
    const inProgress = tasks.filter((task) => task.progress > 0 && task.progress < 100).length;
    const notStarted = tasks.filter((task) => task.progress === 0).length;

    return {
      name: projet.name,
      'Non commencé': notStarted,
      'En cours': inProgress,
      'Terminé': completed,
    };
  });
};

export default function DiagrammeDev() {
  const classes = useStyles();
  const [projets, setProjets] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [usersWithRoles, setUsersWithRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer tous les projets
        const projetsResponse = await axios.get('http://localhost:5000/projet/allProjets');
        setProjets(projetsResponse.data);

        // Récupérer toutes les tâches
        const tachesResponse = await axios.get('http://localhost:5000/tache/allTaches');
        setProjectTasks(tachesResponse.data);

        // Récupérer tous les utilisateurs
        const usersResponse = await axios.get('http://localhost:5000/users/allUsers');
        const filteredUsers = usersResponse.data.filter((user) => user.role !== 'user');
        setUsersWithRoles(filteredUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      }
    };

    fetchData();
  }, []);

  // Génération des données pour le graphique à barres empilées
  const barChartData = generateBarChartData(projets, projectTasks);


  return (
    <>
      <DashboardDev />
      <div style={{marginTop: '5px', display: 'flex', justifyContent: 'center', width:'700px', marginLeft:'550px' }}>
        <div className="widget" style={{ width: '200px', margin: '0 10px' }}>
          <div className="left">
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Projets</p>
            <span className="counter">{projets.length}</span>
          </div>
          <div className="right">
            <div className="percentage positive">
              {/* You can add percentage display here if needed */}
            </div>
            <PersonOutlinedIcon
              className="icon"
              style={{
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                color: "white",
              }}
            />
          </div>
        </div>
     
        <div className="widget" style={{ width: '250px', margin: '0 10px' }}>
          <div className="left">
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Taches</p>
            <span className="counter">{projectTasks.length}</span>
          </div>
          <div className="right">
            <div className="percentage positive">
              {/* You can add percentage display here if needed */}
            </div>
            <PersonOutlinedIcon
              className="icon"
              style={{
                color: "white",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              }}
            />
          
        </div>
      </div>
      </div>
      <br/>
      <Container className={classes.container}>
        <Typography variant="h5" className={classes.title}>Diagramme des Projets avec Avancements</Typography>
        <Paper style={{ padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
             <BarChart
            width={900}
            height={300}
            data={barChartData}
            margin={{ top: 20, right: 190, left: 50, bottom: 5 }}
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Non commencé" stackId="a" fill={COLORS[0]} barSize={30}/>
              <Bar dataKey="En cours" stackId="a" fill={COLORS[1]} barSize={30}/>
              <Bar dataKey="Terminé" stackId="a" fill={COLORS[2]} barSize={30}/>
            </BarChart>
          </motion.div>
        </Paper>
      </Container>
    
    </>
  );
}

