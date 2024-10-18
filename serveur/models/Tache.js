const mongoose = require('mongoose');

const TacheSchema = new mongoose.Schema({
    nameprojet: {
        type: String,
        required: true, 
      
    },
     name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
      
    },
    namedeveloppeur: {
        type: String,
        required: true,
        
    },

    date: {
        type: Date,
        required: true, 
    },
    progress: {
        type: Number, // Représente la progression
        default: 0, // Initialement 0
        min: 0, // La progression ne peut pas être inférieure à 0
        max: 100, // La progression ne peut pas dépasser 100
      },
   
    
});

const Tache = mongoose.model('Tache', TacheSchema);

module.exports = Tache;
