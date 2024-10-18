import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DashboardRh from './dashboardRh';
import { DataGrid } from '@mui/x-data-grid';
import { Search, GetApp } from '@mui/icons-material';
import { TextField } from '@mui/material';

export default function ListesConges() {
  const [congesWithAcceptation, setCongesWithAcceptation] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [congeToDelete, setCongeToDelete] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/conge/allConges')
      .then(conges => {
        const congesWithAcceptation = conges.data.filter(conge => conge.acceptation);
        setCongesWithAcceptation(congesWithAcceptation);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDeleteClick = (id) => {
    setCongeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (congeToDelete) {
      axios.delete(`http://localhost:5000/conge/delete/${congeToDelete}`)
        .then(res => {
          console.log(res.data.message);
          if (res.data.success) {
            setCongesWithAcceptation(prevConges => prevConges.filter(conge => conge._id !== congeToDelete));
          } else {
            console.error('Error deleting congé:', res.data.message);
          }
        })
        .catch(err => {
          console.error('Server error while deleting congé:', err);
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setCongeToDelete(null);
        });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des congés", 10, 10);

    const tableData = congesWithAcceptation.map(conge => [
      conge.name,
      conge.email,
      conge.dated,
      conge.datef,
      conge.description,
      conge.acceptation
    ]);

    const headers = ["Name", "Email", "Date de debut", "Date de fin", "Description", "Acceptation"];

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20
    });

    doc.save('liste_conges.pdf');
  };

  const filteredConges = congesWithAcceptation.filter(conge =>
    conge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conge.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conge.dated.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conge.datef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conge.acceptation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <DashboardRh />
      <div style={{  marginBottom: '290px', width: '900px', marginLeft: '300px' }}>
        <Typography variant="h4" style={{ marginBottom: '60px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '390px' }}>
          Liste des Conges
        </Typography>
        <div>
          <IconButton onClick={downloadPDF} style={{ marginLeft: '90px', marginTop: '-20px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}>
            <GetAppIcon style={{ color: '#3C91E6' }} />
          </IconButton>
          <IconButton onClick={() => setSearchQuery('')} style={{ marginLeft: '800px', marginTop: '-50px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}>
            <Search />
          </IconButton>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '250px', marginTop: '-50px', marginLeft: '860px' }}
          />
        </div>
        <div style={{ height: 400, width: '115%', marginLeft: '80px', marginTop: '-30px', marginBottom:'100px' }}>
          <style>
            {`
              .even-row {
                background-color: #A7B5FE; /* Couleur de fond pour les lignes paires */
              }

              .odd-row {
                background-color: #ffffff; /* Couleur de fond pour les lignes impaires */
              }
            `}
          </style>
          <DataGrid
            rows={filteredConges}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'email', headerName: 'Email', flex: 1 },
              { field: 'dated', headerName: 'Date de debut', flex: 1 },
              { field: 'datef', headerName: 'Date de fin', flex: 1 },
              { field: 'description', headerName: 'Description', flex: 1 },
              { field: 'acceptation', headerName: 'Acceptation', flex: 1 },
              {
                field: 'actions',
                headerName: 'Action',
                flex: 1,
                renderCell: (params) => (
                  <IconButton variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)}>
                    <DeleteIcon />
                  </IconButton>
                ),
              },
            ]}
            getRowId={(row) => row._id}
          />
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer ce congé ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} style={{color:'red'}}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
