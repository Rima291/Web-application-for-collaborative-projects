import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from './components';
import Messages from './message/message';
import Dashboard from './Admin/dashboardAdmin';
import Employee from './Admin/employee';
import { Role } from './Admin/role';
import Calendrier from './Admin/calendrier';
import DashboardResponsable from './Responsable/dashboardResponsable';
import { Createproject } from './Responsable/createprojet';
import Projets from './Responsable/listeProjet';
import { Updateprojet } from './Responsable/updateProjet';
import Taches from './Responsable/listeTache';
import  CreateTache  from './Responsable/createTache';
import { UpdateTache } from './Responsable/updateTache';
import HomeVideo from './Responsable/VideoHome';
import RoomPage from './Responsable/Room';

import CalendrierRes from './Responsable/calendrier';
import { Equipe } from './Responsable/equipe';
import HomeGoogle from './Responsable/Google/HomeGoogle';
import Conges from './RH/demandes';
import NotesRh from './RH/noteRh';
import CalendrierRh from './RH/calendrier';
import HomeVideoRh from './RH/VideoHome';
import RoomPageRh from './RH/Room';
import ListesConges from './RH/listesConges';
import DashboardRh from './RH/dashboardRh';


import { Demande } from './Responsable/demandeResponsable';
import DashboardDev from './Developpeur/dashboardDeveloppeur';
import { DemandeDev } from './Developpeur/demandeDeveloppeur';
import Calendrierdev from './Developpeur/calendrier';
import RoomPagedev from './Developpeur/Room';
import HomeVideodev from './Developpeur/VideoHome';
import Navigate from './navigation';
import {Tasks}   from './Developpeur/tasks';
import Update from './Admin/update';
import Diagramme from './Responsable/diagrammes';
import Widget from './Widgets/widgetRh';
import WidgetAdmin from './Widgets/widgetadmin';
import ListesRh from './RH/liste';
import Projet from './Developpeur/projet';
import { ForgotPassword } from './Admin/forgot';
import { ResetPass } from './Admin/resetPass';
import ProfileAdmin from './Admin/profile';
import DiagrammeDev from './Developpeur/diagrammes';
import {Home} from './Home/Home';
import { Demander } from './RH/demander';
import HomeVideoAdmin from './Admin/VideoHome';
import RoomPageAdmin from './Admin/Room';
import ProtectedRoute from './ProtectedRoute';



function App() {
  return (
    <div >
        <Router>

            <Routes> 
      
            <Route path='/' element={<Home />}/>
            <Route path='/auth' element={<Auth />}/>
            <Route path='/messages' element={<Messages />}/>
            <Route path='/forgot' element={<ForgotPassword/>}/>  
            <Route path='/resetPass/:id/:token' element={<ResetPass/>}/>  
            <Route path='/profile' element={<ProfileAdmin />}/>
            <Route path='/navbar' element={<Navigate />}/>

            <Route path='/homevideoAdmin' element={<HomeVideoAdmin/>}/>
            <Route path='/roomAdmin/:roomId' element={<RoomPageAdmin/>}/>   
                
                <Route element={<ProtectedRoute role='admin' />}>
                <Route path="/dashboardAdmin" element={<Dashboard />}/>
                <Route path="/employee" element={<Employee />}/>
                <Route path="/role" element={<Role />}/>
                <Route path="/calendrier" element={<Calendrier/>}/>
                <Route path="/update/:id" element={<Update/>}/>
                <Route path="/admin" element={<WidgetAdmin/>}/>
         
                </Route>
                <Route path='/HomevideoResponsable' element={<HomeVideo/>}/>
                <Route path='/roomResponsable/:roomId' element={<RoomPage/>}/>

                <Route element={<ProtectedRoute role='responsable' />}>
                <Route path="/responsable" element={<DashboardResponsable/>}/>
                <Route path="/createProjet" element={<Createproject/>}/>
                <Route path="/listeProjet" element={<Projets/>}/>
                <Route path="/dashResponsable" element={<Diagramme/>}/>

                <Route path='/updateprojet/:id' element={<Updateprojet/>}/>
                <Route path="/listeTache" element={<Taches />}/>
                <Route path="/createTache" element={<CreateTache />}/>
                <Route path='/updateTache/:id' element={<UpdateTache/>}/>
             
                <Route path="/demande" element={< Demande/>}/>
                <Route path="/calendrierres" element={<CalendrierRes />}/>
                <Route path="/equipe" element={<Equipe />}/>
                </Route>
                <Route path="/homegoogle" element={<HomeGoogle />}/>

                
                
                <Route path='/HomevideoRh' element={<HomeVideoRh/>}/>
                <Route path='/roomRh/:roomId' element={<RoomPageRh/>}/>
                <Route element={<ProtectedRoute role='rh' />}>
                <Route path='/ressourcehumaine' element={<Widget/>}/>
                <Route path="/rh" element={<DashboardRh />}/>
                <Route path="/demandes" element={<Conges/>}/>
                <Route path="/noteRh" element={<NotesRh/>}/>
                <Route path="/calendrierRh" element={<CalendrierRh/>}/>
               
                <Route path="/listeConge" element={<ListesConges/>}/>
                <Route path="/liste" element={<ListesRh/>}/>
                <Route path="/demander" element={<Demander/>}/>
                </Route>
                <Route path='/roomDeveloppeur/:roomId' element={<RoomPagedev/>}/>
                <Route path='/Homevideodev' element={<HomeVideodev/>}/>
                <Route element={<ProtectedRoute role='developpeur' />}>
                <Route path="/developpeur" element={<DashboardDev />}/>
                <Route path="/demandedev" element={<DemandeDev/>}/>
                <Route path="/calendrierdev" element={<Calendrierdev/>}/>
                
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/projet" element={<Projet />} />
                <Route path="/dashboardDev" element={<DiagrammeDev/>}/>

                </Route>

            </Routes>
        </Router>
    </div>
  )
}

export default App ;