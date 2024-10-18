const express = require('express');
const router = express.Router();
const Conge = require('../models/Conge');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rymahammami42@gmail.com',
    pass: 'iqme wwtc abmg sbqm'
  }
});

const sendAcceptanceEmail = async (email) => {
  if (!email) {
    console.error('Aucune adresse email spécifiée.');
    return;
  }

  const mailOptions = {
    from: 'rymahammami42@gmail.com',
    to: email,
    subject: 'Demande de congé acceptée',
    text: 'Votre demande de congé a été acceptée. Merci!'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
};




router.get('/allConges', (req, res) =>{
  Conge.find()
  .then(Conge => res.json(Conge))
  .catch(err => res.json(err))
});

router.post("/createconge" ,async (req, res) => {
  const { name, email,dated, datef, description } = req.body;

  
  try {
    // Créer le congé après avoir vérifié l'existence de l'email
    const newConge = new Conge({ name, email, dated, datef, description });
    const conge = await newConge.save();
    res.status(201).json(conge);
  } catch (err) {
    console.error('Erreur lors de la création du congé:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



router.put('/updateAcceptation/:congeId', async (req, res) => {
  const { congeId } = req.params;
  const { acceptation } = req.body;

  try {
    const updatedConge = await Conge.findByIdAndUpdate(congeId, { acceptation }, { new: true });
    // Send acceptance email
    sendAcceptanceEmail(updatedConge.email);
    res.json(updatedConge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating conge acceptation.' });
  }
});

router.get('/CongesWithoutAcceptations', async (req, res) => {
  try {
    const congeWithoutAcceptations = await Conge.find({ acceptation: null });
    res.json(congeWithoutAcceptations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving conge without acceptation.' });
  }
});

router.get('/congesWithAcceptation', async (req, res) => {
  try {
    const congesWithAcceptation = await Conge.find({ acceptation: { $exists: true, $ne: null } });
    res.json(congesWithAcceptation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving conges with acceptation.' });
  }
});

router.delete('/delete/:id', (req,res) => {
  const id = req.params.id;
  Conge.findByIdAndDelete({_id: id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
});

module.exports = router;
