import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./widget1.css";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Featured from './featured';
import Dashboard from '../Admin/dashboardAdmin';

const WidgetAdmin = () => {
  const [usersWithRoles, setUsersWithRoles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users/allUsers')
      .then((response) => {
        const filteredUsers = response.data.filter((user) => user.role !== 'user');
        setUsersWithRoles(filteredUsers);
      })
      .catch((error) => console.error(error));
  }, []);

  // Filtrer les utilisateurs par rôle
  const responsableUsers = usersWithRoles.filter(user => user.role === 'responsable');
  const developpeurUsers = usersWithRoles.filter(user => user.role === 'developpeur');
  const rhUsers = usersWithRoles.filter(user => user.role === 'rh'); // Filtrer les utilisateurs avec le rôle "RH"

  return (
    <div>
        <Dashboard />
    <div style={{ display: 'flex', justifyContent: 'center', marginTop:'30px' }}>
      <div style={{ display: 'flex' }}>
        <div className="widget" style={{ width: '250px', marginRight: '20px' , marginLeft:'220px' }}>
          <div className="left">
            <p style={{color:'white ', fontSize:'14px', fontWeight:'bold'}}>Utilisateurs Responsables</p>
            <span className="counter" style={{
                color: "white",
                
              }}>{responsableUsers.length}</span>
          </div>
          <div className="right">
            <div className="percentage positive">
              {/* You can add percentage display here if needed */}
            </div>
            <PersonOutlinedIcon
              className="icon"
              style={{
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                color: "white",
              }}
            />
          </div>
        </div>
        <div className="widget" style={{ width: '250px', marginRight: '20px' }}>
          <div className="left">
            <p style={{color:'white ', fontSize:'14px', fontWeight:'bold'}}>Utilisateurs Développeurs</p>
            <span className="counter" style={{
                color: "white",
                
              }}>{developpeurUsers.length}</span>
          </div>
          <div className="right">
            <div className="percentage positive">
              {/* You can add percentage display here if needed */}
            </div>
            <PersonOutlinedIcon
              className="icon"
              style={{
                color: "white",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              }}
            />
          </div>
        </div>
        <div className="widget" style={{ width: '250px' }}>
          <div className="left">
            <p style={{color:'white ', fontSize:'14px', fontWeight:'bold'}}>Utilisateurs RH</p>
            <span className="counter" style={{
                color: "white",
                
              }}>{rhUsers.length}</span>
          </div>
          <div className="right">
            <div className="percentage positive">
              {/* You can add percentage display here if needed */}
            </div>
            <PersonOutlinedIcon
              className="icon"
              style={{
                color: "white",
                backgroundColor: "rgba(30, 144, 255, 0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <Featured />
    </div>
  );
};

export default WidgetAdmin;