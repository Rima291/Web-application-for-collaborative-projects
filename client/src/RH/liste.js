import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Typography,
  Grid,
} from '@mui/material';
import { MoreVert, Edit, Search, Delete, GetApp } from '@mui/icons-material';
import DashboardRh from './dashboardRh';
import jsPDF from 'jspdf';
import { DataGrid } from '@mui/x-data-grid';
import 'jspdf-autotable';

function Employee() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  const [page, setPage] = useState(1);


  useEffect(() => {
    axios
      .get('http://localhost:5000/users/allUsers')
      .then((response) => {
        const nonAdminUsers = response.data.filter(user => user.role !== 'admin' && user.role !== 'user');
        setUsers(nonAdminUsers);
      })
      .catch((error) => console.error(error));
  }, []);



 



  const filteredUsers = users.filter((user) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery) ||
      user.address.toLowerCase().includes(lowerCaseQuery) ||
      user.phone.toLowerCase().includes(lowerCaseQuery) ||
      user.domaine.toLowerCase().includes(lowerCaseQuery) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

 

  const columns = [
    {
      field: 'picture',
      headerName: 'Image',
      renderCell: (params) => (
        <img
          src={params.value}
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
          alt={params.row.name}
        />
      ),
      width: 100,
    },
    { field: 'name', headerName: 'Nom', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Adresse', width: 200 },
    { field: 'phone', headerName: 'Numéro', width: 150 },
    { field: 'domaine', headerName: 'Domaine', width: 150 },
    { field: 'role', headerName: 'Rôle', width: 100 },
    
  ];

  const rows = filteredUsers.map((user, index) => ({
    id: index,
    ...user,
  }));

  return (
    <div>
      <DashboardRh/>
      <Container style={{ padding: '20px', marginBottom: '890px', width: '1390px', marginRight: '10px' }}>
        <Typography variant="h4" style={{ marginBottom: '1px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '390px' }}>
          Liste des Employés
        </Typography>

        <div >
        

          <IconButton onClick={() => setSearchQuery('')} style={{ marginLeft: '800px', marginTop: '-20px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}>
            <Search />
          </IconButton>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '270px', marginTop: '-40px', marginLeft: '860px' }}
          />
        </div>
        <div style={{ height: 400, width: '100%', marginLeft: '-25px' }}>
          <style>
            {`
              .even-row {
                background-color: #A7B5FE; /* Couleur de fond pour les lignes paires */
              }
            `}
          </style>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowClassName={(params) => {
              return params.index % 2 === 0 ? 'even-row' : 'odd-row';
            }}
          />
        </div>
      </Container>
     
  



      </div>
  );
}

export default Employee;
