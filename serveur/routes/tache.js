const express = require('express');
const router = express.Router();
const Tache = require ('../models/Tache');
const User = require('../models/User');
const validateToken = require('../middlewares/validateToken');

const nodemailer = require('nodemailer');



let io;

const setIoInstance = (ioInstance) => {
  io = ioInstance; // Définissez `io` dans le contexte global
};


// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rymahammami42@gmail.com',
    pass: 'iqme wwtc abmg sbqm'
  }
});

router.post('/create', async (req, res) => {
  try {
    const { nameprojet, name, description, namedeveloppeur, date } = req.body;

    if (!nameprojet || !name || !description || !namedeveloppeur || !date) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const newTache = new Tache({
      nameprojet,
      name,
      description,
      namedeveloppeur,
      date,
    });

    const savedTache = await newTache.save();

    // Récupérer les détails du développeur
    const developer = await User.findOne({ name: namedeveloppeur });

    if (!developer) {
      return res.status(404).json({ message: 'Développeur non trouvé.' });
    }

    // Configuration de l'email
    const mailOptions = {
      from: 'rymahammami42@gmail.com',
      to: developer.email, // Assurez-vous que le modèle User contient un champ email
      subject: 'Nouvelle Tâche Assignée',
      text: `Bonjour ${developer.name},

      Vous avez été assigné à une nouvelle tâche :

      Projet : ${nameprojet}
      Tâche : ${name}
      Description : ${description}
      Date de fin : ${date}

      Merci,
      L'équipe WorkUnity Pro`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
      } else {
        console.log('Email envoyé: ' + info.response);

        // Notifier via WebSockets (optionnel)
        io.emit('tache_created', {
          message: `Une nouvelle tâche a été créée : ${name}`,
          tache: savedTache,
        });

        res.status(201).json({ message: 'Tâche créée avec succès.', tache: savedTache });
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la tâche.' });
  }
});


// Route pour obtenir toutes les tâches assignées à un développeur
router.get('/myTasks', validateToken,async (req, res) => {
  try {
    const userName = req.user.name; // Extrait du token
    const tasks = await Tache.find({ namedeveloppeur: userName });
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches.' });
  }
});








router.get('/allTaches', (req, res) =>{
    Tache.find()
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
});

  



  router.get('/getTache/:id', (req,res)=>{
    const id = req.params.id;
    Tache.findById({_id: id})
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
  });
// modifier l'état d'une tache
  router.patch('/updat/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
  
      // Vérifier si l'ID est valide
      if (!id || typeof progress === 'undefined') {
        return res.status(400).json({ message: 'Données invalides' });
      }
  
      const task = await Tache.findByIdAndUpdate(
        id,
        { progress },
        { new: true } // Retourne le document mis à jour
      );
  
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      res.json(task); // Renvoie la tâche mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche' });
    }
  });
  
  




  router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description, namedeveloppeur, progress, date } = req.body;
  
    try {
      // Mettre à jour la tâche
      const tache = await Tache.findByIdAndUpdate(
        id,
        {
          name,
          description,
          namedeveloppeur,
          progress,
          date,
        },
        { new: true }
      );
  
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      // Trouver le développeur à qui la tâche est assignée
      const developer = await User.findOne({ name: namedeveloppeur });
  
      if (!developer) {
        return res.status(404).json({ message: 'Développeur non trouvé' });
      }
  
      // Configuration de l'email
      const mailOptions = {
        from: 'rymahammami42@gmail.com',
        to: developer.email, // Assurez-vous que le modèle User contient un champ email
        subject: 'Tâche Mise à Jour',
        text: `Bonjour ${developer.name},
  
        La tâche suivante a été mise à jour :

        Tâche : ${name}
        Description : ${description}
        Date de fin : ${date}
  
        Merci,
        L'équipe WorkUnity Pro`
      };
  
      // Envoi de l'email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
          return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
        } else {
          console.log('Email envoyé: ' + info.response);
          res.status(200).json({ message: 'Tâche mise à jour et email envoyé avec succès.', tache });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  //delete

router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    Tache.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });


 
  
  module.exports =  {router, setIoInstance};