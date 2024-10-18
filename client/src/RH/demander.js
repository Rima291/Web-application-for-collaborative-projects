import React, { useState } from 'react';
import { TextField, Button, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import DashboardRh from './dashboardRh';

export function Demander() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dated, setDated] = useState('');
  const [datef, setDatef] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(datef) <= new Date(dated)) {
      alert("La date de fin doit être postérieure à la date de début." );
      return;
    }

    axios.post("http://localhost:5000/conge/createconge", { name, email, dated, datef, description })
      .then((result) => {
        console.log(result);
        alert('Creation successful!');
        navigate('/ressourcehumaine');
      })
      .catch((err) => {
        console.error(err);
        alert('La période de congé précédente n\'a pas encore pris fin.')
        navigate('/ressourcehumaine');

      });
  };

  return (
    <>
      <DashboardRh />
      <Container maxWidth="sm" style={{ width: '700px' }}>
        <div className="row">
          <div className="col-md-12 offset-md-1 form-container sign-up">
            <form onSubmit={handleSubmit}>
              <Typography variant='h4' style={{ color: '#3C91E6', marginTop: '20px', marginLeft: '150px' }}>Demande un congé</Typography>

              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
             
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              
              />
<TextField
                label="Date de début de congé"
                variant="outlined"
                type="date"
                fullWidth
                margin="normal"
                value={dated}
                onChange={(e) => setDated(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                required
                error={!!errors.dated}
                helperText={errors.dated}
              />
<TextField
                label="Date de début de congé"
                variant="outlined"
                type="date"
                fullWidth
                margin="normal"
                value={datef}
                onChange={(e) => setDatef(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                required
                error={!!errors.dated}
                helperText={errors.dated}
              />

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              
              />

              <Button style={{ color: 'white', backgroundColor: '#3C91E6', marginTop: '30px' }} type="submit" variant="contained" fullWidth>
                Demander
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
