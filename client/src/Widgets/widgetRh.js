import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashboardRh from '../RH/dashboardRh';

const Widget = () => {
  const [congeWithoutAcceptations, setCongeWithoutAcceptations] = useState([]);
  const [congesWithAcceptation, setCongesWithAcceptation] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0); // Nouvel état pour stocker le nombre total d'utilisateurs

  useEffect(() => {
    axios.get('http://localhost:5000/conge/allConges')
      .then(conges => {
        const congeWithoutAcceptations = conges.data.filter(conge => !conge.acceptation);
        setCongeWithoutAcceptations(congeWithoutAcceptations);

        const congesWithAcceptation = conges.data.filter(conge => conge.acceptation);
        setCongesWithAcceptation(congesWithAcceptation);

        // Calculer le nombre total d'utilisateurs
        setTotalUsers(congeWithoutAcceptations.length + congesWithAcceptation.length);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
  <DashboardRh />
    <div style={{marginTop: '5px', display: 'flex', justifyContent: 'center', width:'700px', marginLeft:'550px' }}>
      <div className="widget" style={{ width: '200px', margin: '0 10px' }}>
        <div className="left">
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Conges sans acceptation</p>
          <span className="counter"  style={{ color: 'white'}}>{congeWithoutAcceptations.length}</span>
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
     
      <div className="widget" style={{ width: '200px', margin: '0 10px' }}>
        <div className="left">
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Conges avec acceptation</p>
          <span className="counter" style={{ color: 'white'}} >{congesWithAcceptation.length}</span>
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
      
    </div>
    <div className="featured1" style={{marginLeft:'600px', marginTop:'70px', height:'370px'}}>
        <div className="tope">
          <h1 className="titlee">Totalité des Congés</h1>
          
        </div>
        <div className="bottome">
          <div className="featuredChart" >
            <CircularProgressbar value={totalUsers} text={`${totalUsers}`} strokeWidth={5} />
          </div>
          <p className="titlee">Totalité des Congés</p>
          <p className="amounte">{totalUsers}</p>
          <p className="desce">
           Nombres des Congés
          </p>
          <div className="summary">
            {/* Vous pouvez ajouter d'autres éléments de résumé ici si nécessaire */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Widget;
