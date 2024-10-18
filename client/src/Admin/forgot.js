import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Veuillez fournir une adresse e-mail @gmail.com.');
      return;
    }

    axios.post('http://localhost:5000/users/forgot-password', { email })
      .then(res => {
        if (res.data.status === "error") {
          setError('L\'email n\'existe pas dans l\'application.');
        } else {
          setMessage('Veuillez vérifier votre e-mail pour le lien de réinitialisation du mot de passe.');
          setTimeout(() => navigate('/auth'), 3000); // Redirection après 3 secondes
        }
      })
      .catch(err => {
        setError('L\'email n\'existe pas dans l\'application.');
        console.log(err);
      });
  };

  return (
    <div className="row justify-content-center" style={{ width: '1500px', marginLeft: '10px', marginTop: '200px' }}> 
      <div className="col-md-6">
        <div className="form-container">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <h2>Mot de passe oublié</h2>
            <br />
            <span>Entrez votre adresse e-mail</span>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Envoyer un e-mail
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
