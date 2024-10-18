const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const mytoken = authHeader && authHeader.split(' ')[1];

  if (!mytoken) {
    return res.status(401).json({ message: "Token d'authentification manquant." });
  }

  jwt.verify(mytoken, 'DFGHJKLMQSDF', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré." });
    }

    req.user = decoded; // Stocker l'utilisateur décodé dans `req.user`
    next(); // Continuer au middleware suivant
  });
}

module.exports = validateToken;
