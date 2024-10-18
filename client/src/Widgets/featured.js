import React, { useEffect, useState } from 'react';
import "./Featured.css";
import axios from 'axios';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  const [totalUsers, setTotalUsers] = useState(0); // État pour stocker le nombre total d'utilisateurs
  const [usersWithoutRole, setUsersWithoutRole] = useState([]); // État pour stocker les utilisateurs sans rôle important

  useEffect(() => {
    // Récupération des données des utilisateurs
    axios.get('http://localhost:5000/users/allUsers')
      .then((response) => {
        // Mise à jour de l'état avec le nombre total d'utilisateurs
        setTotalUsers(response.data.length);

        // Filtrage des utilisateurs sans rôle important
        const usersWithoutImportantRole = response.data.filter(user => user.role !== 'responsable' && user.role !== 'rh'   && user.role !== 'developpeur'  && user.role !== 'admin');
        setUsersWithoutRole(usersWithoutImportantRole);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className="featured1" style={{marginRight:'100px'}}>
        <div className="tope">
          <h1 className="titlee">Totalité des Utilisateurs</h1>
          
        </div>
        <div className="bottome">
          <div className="featuredChart" style={{color:'white'}} >
            <CircularProgressbar style={{color:'white'}} value={totalUsers} text={`${totalUsers}`} strokeWidth={5}  />
          </div>
          <p className="titlee">Utilisateurs sur la plateforme</p>
          <p className="amounte">{totalUsers}</p>
          <p className="desce">
          Nombre d'utilisateurs sur la plateforme.
          </p>
          <div className="summary">
            {/* Vous pouvez ajouter d'autres éléments de résumé ici si nécessaire */}
          </div>
        </div>
      </div>
      <div className="featured">
        <div className="tope">
          <h1 className="titlee">Utilisateurs sans Roles</h1>
         
        </div>
        <div className="bottome" >
          <div className="featuredChart" >
            <CircularProgressbar value={usersWithoutRole.length} text={`${usersWithoutRole.length}`} strokeWidth={5} />
          </div>
          <p className="titlee">Utilisateurs sans Roles</p>
          <p className="amounte" >{usersWithoutRole.length}</p>
          <p className="desce">
            Nombre des Utilisateurs sans Roles.
          </p>
          <div className="summary">
            {/* Vous pouvez ajouter d'autres éléments de résumé ici si nécessaire */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;