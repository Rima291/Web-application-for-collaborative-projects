const express = require('express');
const cors =require('cors');
const socketIo = require('socket.io');

const userRoutes = require('./routes/userRoutes.js')

const projetRoute = require('./routes/projet.js')
 
const congeRoute = require('./routes/conge.js')
const { router: tacheRoute, setIoInstance } = require('./routes/tache');
const eventRoutes =require ('./routes/eventRoutes.js')


const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


app.use('/users', userRoutes)
app.use('/projet', projetRoute)
app.use('/conge' , congeRoute)
app.use('/tache', tacheRoute)
app.use('/events',eventRoutes)
app.use(express.json()); // Pour traiter le JSON dans les requêtes
app.use(express.urlencoded({ extended: true })); // Pour traiter les données d'URL encodées



const server = require('http').createServer(app);
const io = socketIo(server); // This initializes socket.io with your server

setIoInstance(io); // Passez `io` à `tacheRoute`

require('./connection.js')




app.listen(PORT, () => console.log(`server running on port ${PORT}`))