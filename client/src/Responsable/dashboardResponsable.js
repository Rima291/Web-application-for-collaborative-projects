import React, { useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import Navigate from '../navigation';
import { Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon, VideoLibrary as VideoLibraryIcon, Extension as ExtensionIcon, BarChart as BarChartIcon, Task as TaskIcon, Message as MessageIcon, EventNote as EventNoteIcon, AccountCircle as AccountCircleIcon, Note as NoteIcon, CalendarToday as CalendarTodayIcon, Settings as SettingsIcon, Help as HelpIcon } from '@mui/icons-material';
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DuoIcon from '@mui/icons-material/Duo';

 function DashboardResponsable() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            {/* Votre JSX pour le composant Dashboard */}
            <section  id="sidebar" className={isSidebarOpen ? '' : 'closed'} >
                <Link to={'/dashResponsable'} className="brand">
                <DashboardIcon />&nbsp;
                    <span className="text" style={{marginTop:'5x', }}>Responsable</span>
                </Link>
                <ul className="side-menu top">
                    <li className="">
                        <Link to={'/dashResponsable'}>
                        <DashboardIcon />&nbsp;
                            <span className="text">Tableau de Bord</span>
                        </Link>
                    </li>
             
                    <li>
                        <Link to={'/listeProjet'}>
                        <BarChartIcon />&nbsp;
                            <span className="text">Projets</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/listeTache'}>
                        <TaskIcon />&nbsp;
                            <span className="text">Taches</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/HomevideoResponsable'}>
                        <DuoIcon />&nbsp;
                            <span className="text">Salle de Reunion</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/homegoogle'}>
                        <SmartToyOutlinedIcon />&nbsp;
                            <span className="text">Gemini IA</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/messages'}>
                        <MessageIcon />&nbsp;
                            <span className="text">Messages</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/demande'}>
                        <EventNoteIcon />&nbsp;

                            <span className="text">Demande Conge</span>
                        </Link>
                    </li>
                  
                  
                </ul>
                <ul className="side-menu">
                
                    <li>
                        <Link to={'/calendrierres'}>
                        <CalendarTodayIcon />&nbsp;
                            <span className="text">Planification</span>
                        </Link>
                    </li>
                 
                </ul>
            </section>
             

            
            <div id="content" className={isSidebarOpen ? '' : 'expanded'} >
                <Navigate />
                <button onClick={toggleSidebar} className="toggle-btn" >
                    {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
                <main >
                   
                </main>
            </div>

                
        </div>
    );
}
export default DashboardResponsable;
