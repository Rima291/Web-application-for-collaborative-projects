import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../Admin/dashboardAdmin';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Select, MenuItem, Typography, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export function Role() {
  const [usersWithoutRoles, setUsersWithoutRoles] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/users/allUsers')
      .then(response => {
        const usersWithUserRole = response.data.filter(user => user.role === 'user');
        setUsersWithoutRoles(usersWithUserRole);
      })
      .catch(err => {
        setError(err.message || 'Une erreur s\'est produite lors du chargement des utilisateurs.');
      });
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setSelectedUser(userId);
    setNewRole(newRole);
    setOpenConfirmation(true);
  };

  const confirmRoleChange = () => {
    axios.put(`http://localhost:5000/users/updateRole/${selectedUser}`, { role: newRole })
      .then(response => {
        setSuccessMessage('Le rôle de l\'utilisateur a été mis à jour avec succès.');
        setUsersWithoutRoles(prevUsers => prevUsers.filter(user => user._id !== selectedUser));
        setOpenConfirmation(false);
      })
      .catch(err => {
        setError(err.message || 'Une erreur s\'est produite lors de la mise à jour du rôle de l\'utilisateur.');
        setOpenConfirmation(false);
      });
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage('');
  };

  const columns = [
    { field: 'picture', headerName: 'Image', width: 100, renderCell: (params) => <img src={params.value} style={{ width: 30, height: 30, objectFit: "cover", borderRadius: "50%" }} alt="" /> },
    { field: 'name', headerName: 'Nom', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Adresse', width: 200 },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { field: 'domaine', headerName: 'Domaine', width: 150 },
    {
      field: 'role', headerName: 'Rôle', width: 150,
      renderCell: (params) => (
        <Select
          value={params.value || ""}
          onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
          style={{ minWidth: '100px' }}
        >
          <MenuItem value="" disabled>Choisir un rôle</MenuItem>
          <MenuItem value="admin">Administrateur</MenuItem>
          <MenuItem value="developpeur">Développeur</MenuItem>
          <MenuItem value="responsable">Responsable</MenuItem>
          <MenuItem value="rh">RH</MenuItem>
        </Select>
      )
    }
  ];

  return (
    <>
      <Dashboard />
      <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft:'600px' }}>
        Liste des Employées sans Roles
      </Typography>
      <div className='role-container' style={{ width: '100%', height: 600 }}>
        <Grid container justifyContent="center">
          <div style={{ width: '100%', maxWidth: 1110 , marginLeft:'200px' }}>
            <DataGrid
              rows={usersWithoutRoles}
              columns={columns}
              pageSize={5}
              autoHeight
              disableSelectionOnClick
              getRowId={(row) => row._id}
            />
          </div>
        </Grid>
      </div>
      <Snackbar open={error || successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {error || successMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir mettre à jour le rôle de cet utilisateur en "{newRole}" ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmRoleChange} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
