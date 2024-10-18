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
import Dashboard from '../Admin/dashboardAdmin';
import jsPDF from 'jspdf';
import { DataGrid } from '@mui/x-data-grid';
import 'jspdf-autotable';

function Employee() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUser, setActiveUser] = useState(null);
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

  const handleOpenDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      axios
        .delete(`http://localhost:5000/users/delete/${userToDelete}`)
        .then(() => {
          console.log('Utilisateur supprimé avec succès');
          setDeleteDialogOpen(false);
          setUserToDelete(null);
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
        })
        .catch((error) => console.error(error));
    }
  };



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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des employés", 10, 10);

    const tableData = filteredUsers.map(user => [
      {
        content: user.picture ? { image: user.picture, fit: [30, 30] } : '',
        styles: { valign: 'middle', halign: 'center' }
      },
      user.name,
      user.email,
      user.address,
      user.phone,
      user.domaine,
      user.role
    ]);

    const headers = ["Image", "Nom", "Email", "Adresse", "Numéro", "Domaine", "Rôle"];

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20
    });

    doc.save('liste_employes.pdf');
  };

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
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
      <div>
  <Link to={`/update/${params.row._id}`}>
    <IconButton color="primary"> {/* Utilisez la couleur primaire pour l'édition */}
      <Edit />
    </IconButton>
  </Link>
  <IconButton
    onClick={() => handleOpenDeleteDialog(params.row._id)}
    style={{color:'#D81B60'}}/* Utilisez la couleur secondaire pour la suppression */
  >
    <Delete />
  </IconButton>
</div>
      ),
      width: 100,
    },
  ];

  const rows = filteredUsers.map((user, index) => ({
    id: index,
    ...user,
  }));

  return (
    <div>
      <Dashboard />
      <Container style={{ padding: '20px', marginBottom: '890px', width: '1390px', marginRight: '10px' }}>
        <Typography variant="h4" style={{ marginBottom: '1px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '390px' }}>
          Liste des Employées
        </Typography>

        <div >
          <IconButton onClick={downloadPDF} style={{ marginRight: '820px', marginBottom: '10px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}>
            <GetApp style={{ color: '#3C91E6'}} />
          </IconButton>

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
     
  


      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cet utilisateur ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}

export default Employee;
