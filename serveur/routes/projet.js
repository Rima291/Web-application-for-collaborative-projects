const express = require('express');
const router = express.Router();
const Projet = require ('../models/Projet');

//all projects

router.get('/allProjets', (req, res) =>{
    Projet.find()
    .then(projets => res.json(projets))
    .catch(err => res.json(err))
});

  //create Projet
  router.post("/createprojet", (req, res) => {
    const { name, namedeveloppeur, namerespensable, nameclient, date } = req.body;
    // Assurez-vous que namedeveloppeur est un tableau
    const namedeveloppeurs = Array.isArray(namedeveloppeur) ? namedeveloppeur : [namedeveloppeur];
    Projet.create({
        name,
        namedeveloppeur: namedeveloppeurs,
        namerespensable,
        nameclient,
        date
    })
    .then(projets => res.json(projets))
    .catch(err => res.status(400).json({ message: err.message }));
});


  router.get('/getProjet/:id', (req, res) => {
    const id = req.params.id;
    Projet.findById(id) // Suppression de l'objet de requête inutile
        .then(projet => res.json(projet)) // Vérifiez ici le champ 'date'
        .catch(err => res.status(500).json(err)); // Ajout du code d'erreur
});

  //update
  router.put('/updateprojet/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProjet = await Projet.findByIdAndUpdate(
            { _id: id },
            {
                name: req.body.name,
                namedeveloppeur: req.body.namedeveloppeur,
                namerespensable: req.body.namerespensable,
                nameclient: req.body.nameclient,
                date: req.body.date,
            },
            { new: true }
        );
        res.json(updatedProjet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


  //delete

router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    Projet.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });
  module.exports = router;