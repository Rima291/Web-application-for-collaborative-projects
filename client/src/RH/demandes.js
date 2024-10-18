import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Select, MenuItem } from '@mui/material';  // Updated to @mui/material
import DashboardRh from './dashboardRh';

export default function Conges() {
  const [congeWithoutAcceptations, setCongeWithoutAcceptations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/conge/allConges')
      .then(conges => {
        const congeWithoutAcceptations = conges.data.filter(conge => !conge.acceptation);
        setCongeWithoutAcceptations(congeWithoutAcceptations);
      })
      .catch(err => console.log(err));
  }, []);

  const handleRoleChange = (congeId, newAcceptation) => {
    axios.put(`http://localhost:5000/conge/updateAcceptation/${congeId}`, { acceptation: newAcceptation })
      .then(response => {
        console.log(response);
        setCongeWithoutAcceptations(prevConge => prevConge.filter(conge => conge._id !== congeId));
      })
      .catch(err => console.error(err));
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'dated', headerName: 'Date de debut', width: 150 },
    { field: 'datef', headerName: 'Date de fin', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'acceptation', headerName: 'Acceptation', width: 150,
      renderCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value="Oui">Accepter</MenuItem>
        </Select>
      )
    }
  ];

  return (
    <div>
      <DashboardRh />
      <div style={{ marginTop: '40px', marginBottom: '40px', width: '900px', marginLeft: '400px' }}>
        <Typography align="center" variant="h4" style={{ marginBottom: '50px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6' }}>
          Les Demandes de Congé en Attente
        </Typography>
        <div style={{ height: 400, width: 1050 }}>
          <DataGrid
            rows={congeWithoutAcceptations}
            columns={columns}
            pageSize={5}
            autoHeight
            disableSelectionOnClick
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
}
