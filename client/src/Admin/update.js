import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Avatar, Typography,  Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import userImg from '../assets/user.jpg';
import Dashboard from '../Admin/dashboardAdmin';

export function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [domaine, setDomaine] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(userImg);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/getUser/${id}`)
      .then((response) => {
        const { name, email, address, phone, domaine, picture, role } = response.data;
        setName(name);
        setEmail(email);
        setAddress(address);
        setPhone(phone);
        setDomaine(domaine);
        setRole(role);

        if (picture) {
          setImage(picture);
          setImagePreview(picture);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const update = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/users/update/${id}`, { role })
      .then((result) => {
        console.log(result);
        alert('employé Modifié');
        navigate('/employee'); // Rediriger après la mise à jour
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Dashboard />
      <div style={{ marginTop:'-45px' }}>
        <Typography variant="h4" style={{ marginBottom: '50px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft:'680px' }}>Mettre à Jour </Typography>
        <Container maxWidth="50px" style={{ marginTop: '-30px' , marginLeft:'120px'}}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={8}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <form onSubmit={update}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                      <Grid container spacing={3} style={{ textAlign: 'center', marginLeft:'170px' }}>
                        <Grid item xs={12} style={{ textAlign: 'center', marginLeft:'170px' }}>
                          <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100 , right:'10px' }}
                            alt="Image de profil"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Nom"
                            fullWidth
                            variant="outlined"
                            required
                            disabled // Empêche la modification
                            value={name}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            required
                            variant="outlined"
                            disabled // Empêche la modification
                            value={email}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Téléphone"
                            fullWidth
                            type="number"
                            required
                            variant="outlined"
                            disabled // Empêche la modification
                            value={phone}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Adresse"
                            fullWidth
                            variant="outlined"
                            required
                            disabled // Empêche la modification
                            value={address}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Domaine"
                            fullWidth
                            variant="outlined"
                            required
                            disabled // Empêche la modification
                            value={domaine}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Rôle"
                            fullWidth
                            variant="outlined"
                            required
                            onChange={(e) => setRole(e.target.value)}
                            value={role}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                          >
                            Mettre à jour
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5} className="signup__bg"></Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}

export default Update;
