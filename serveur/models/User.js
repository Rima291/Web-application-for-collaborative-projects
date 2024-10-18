const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
  },
  password: {
    type: String,
    required: [true, "Can't be blank"]
  },
  phone: String,
  domaine: String,
  address: String,
  picture: String,
  role: {
    type: String,
    enum: ['admin', 'responsable', 'developpeur', 'rh', 'user'],
    default: 'user' // Définir une valeur par défaut appropriée
  },


}, { minimize: false });



UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }); // Utiliser `this` pour faire référence au modèle actuel
  if (!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('invalid email or password');
  return user;
};



const User = mongoose.model('User', UserSchema);

module.exports = User;
