import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './resetPass.css';


export function ResetPass() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/users/reset-password/${id}/${token}`, { password });

      if (res.data.Status === "Success") {
        alert('Votre mot de passe a été changé avec succès.');
        
        navigate('/auth');
      } else {
        setError('Échec de la réinitialisation du mot de passe. Veuillez réessayer.');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  return (
      <div className="row justify-content-center" style={{width:'1600px', marginLeft:'20px', marginTop:'200px'}}> 
        <div className="col-md-6">
          <div className="form-container">
          {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <h2>Réinitialiser le mot de passe</h2>
              <p>Veuillez entrer votre nouveau mot de passe</p>
              
              
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
