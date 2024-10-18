const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true, 
        minlength: 1, 
    },

    namedeveloppeur: [{
        type: String,
        required: true,
    }],
    namerespensable: {
        type: String,
        required: true,
    },
    nameclient: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now, 
    },
    documents: [String], // Liste des documents

});

const Projet = mongoose.model('Projet', ProjetSchema);

module.exports = Projet;