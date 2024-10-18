const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');
const User = require('../models/User'); // Modèle d'utilisateur
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID ;




router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, address, domaine, password, picture } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      address,
      domaine,
      password: hashedPassword,
      picture,
    });

    await user.save();
    const userId = crypto.randomBytes(16).toString('hex');

    const serverClient = connect(api_key, api_secret, app_id); // Assurez-vous que api_key, api_secret et app_id sont définis
    const streamToken = serverClient.createUserToken(userId);

    const token = jwt.sign({ _id: user._id, email: user.email, name: user.name, role: user.role }, 'DFGHJKLMQSDF');

  

    res.status(200).json({ mytoken: token, streamToken, name, email, phone, userId, hashedPassword, domaine, address, phone });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});


router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      
      const user = await User.findByCredentials(email, password);
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      const serverClient = connect(api_key, api_secret, app_id);
      const client = StreamChat.getInstance(api_key, api_secret);

      const { users } = await client.queryUsers({ email: email });

      if (!users.length) return res.status(400).json({ message: 'User not found' });

      const success = await bcrypt.compare(password, users[0].hashedPassword);
      
      if (success) {
          const streamToken = serverClient.createUserToken(users[0].id);
          const token = jwt.sign({ _id: user._id, email: user.email, name: user.name, role: user.role }, 'DFGHJKLMQSDF');
          res.status(200).json({ mytoken:token, streamToken, name: users[0].name, email, userId: users[0].id, role: user.role,_id: user._id });
      } else {
          res.status(400).json({ message: 'Incorrect password' });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
  }
});



router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({ status: "error", message: "Utilisateur n'existe pas" });
      } 
      
      const token = jwt.sign({ id: user._id }, 'DFGHJKLMQSDF', { expiresIn: "1d" });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rymahammami42@gmail.com',
          pass: 'iqme wwtc abmg sbqm'
        }
      });

      var mailOptions = {
        from: 'rymahammami42@gmail.com',
        to: email,
        subject: 'Réinitialisation de mot de passe',
        text: `Voici votre lien de réinitialisation de mot de passe :http://localhost:3000/resetPass/${user._id}/${token}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return res.status(500).send({ status: "error", message: "Erreur lors de l'envoi de l'e-mail" });
        } else {
          return res.send({ status: "success", message: "E-mail de réinitialisation envoyé avec succès" });
        }
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send({ status: "error", message: "Erreur interne du serveur" });
    });
});

  
router.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token, "DFGHJKLMQSDF", (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              User.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
      }
  })
});





router.get('/allUsers', (req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(500).json({ message: err.message }));
  });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rymahammami42@gmail.com',
      pass: 'iqme wwtc abmg sbqm'
    }
  });
  
  const sendEmail = (email) => {
    const mailOptions = {
      from: 'rymahammami42@gmail.com',
      to: email,
      subject: 'Mise à jour de votre rôle',
      text:  `Bonjour ,

      Nous avons le plaisir de vous informer que votre rôle au sein de notre organisation a été mis à jour. En conséquence, vous avez maintenant accès à notre site pour vous connecter et utiliser les fonctionnalités qui vous sont attribuées.
      
      Vous pouvez vous connecter en utilisant le lien suivant : http://localhost:3000/auth.
      
      Si vous avez des questions ou des difficultés à vous connecter, n'hésitez pas à nous contacter.
      
      Merci, et au plaisir de vous voir sur le site.
      
      Cordialement,
      
      Administrateur
      WorkUnity Pro`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
//update role
router.put('/updateRole/:userId', async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

    // Envoyer un e-mail pour informer le changement de rôle
    const subject = 'Mise à jour de votre rôle';
    const text = `Bonjour ${updatedUser.name}, votre rôle a été mis à jour à ${role}.`;

    await sendEmail(updatedUser.email, subject, text); // Envoyer l'e-mail

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle.' });
  }
});





  router.get('/usersWithoutRoles', async (req, res) => {
    try {
      const usersWithoutRoles = await User.find({ role: 'user' });
      res.json(usersWithoutRoles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving users without roles.' });
    }
  });


  router.get('/usersWithRoles', async (req, res) => {
    try {
      // Recherche tous les utilisateurs avec un rôle défini et différent de 'user'
      const usersWithRoles = await User.find({ role: { $exists: true, $ne: 'user' } });
      res.json(usersWithRoles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving users with roles.' });
    }
  });

  
router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    User.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });



  router.get('/profile', validateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé.');
      }
      res.json(user);
    } catch (error) {
      res.status(500).send('Erreur du serveur.');
    }
  });
  

 // Route pour mettre à jour le profil utilisateur
router.put('/updateprofile', validateToken, async (req, res) => {
  const { name, email, address, phone, domaine, role, picture } = req.body;

  // Construction de l'objet userFields
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (address) userFields.address = address;
  if (phone) userFields.phone = phone;
  if (domaine) userFields.domaine = domaine;
  if (role) userFields.role = role;
  if (picture) userFields.picture = picture;

  try {
    let user = await User.findById(req.user._id);

    if (user) {
      // Mise à jour
      user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: userFields },
        { new: true }
      );

      return res.json(user);
    }

    res.status(400).json({ msg: 'Utilisateur non trouvé' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur du serveur.');
  }
});






  
router.get('/getUser/:id',(req, res) => {
  const id = req.params.id;
  User.findById({_id: id})
      .then(user => {
          if (!user) {
              return res.status(404).json({ error: 'utilisateur n\'existe pas' });
          }
          res.json(user);
      })
      .catch(err => res.status(500).json({ error: err.message }));
});



router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  User.findByIdAndUpdate(id, { role: role }, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


    
module.exports = router;