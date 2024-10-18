import React, { useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import Navigate from '../navigation';
import Widget from '../Widgets/widgetRh';
import { Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon, VideoLibrary as VideoLibraryIcon, Extension as ExtensionIcon, BarChart as BarChartIcon, Task as TaskIcon, Message as MessageIcon, EventNote as EventNoteIcon, AccountCircle as AccountCircleIcon, Note as NoteIcon, CalendarToday as CalendarTodayIcon, Settings as SettingsIcon, Help as HelpIcon } from '@mui/icons-material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined';

import ChecklistIcon from '@mui/icons-material/Checklist';
 function DashboardRh() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div  className="dashboard-container">
            {/* Votre JSX pour le composant Dashboard */}
            <section id="sidebar" className={isSidebarOpen ? '' : 'closed'}>
                <Link to={'/widgetRh'} className="brand">
                <DashboardIcon />  &nbsp;
                    <span className="text" style={{marginTop:'5px'}}>RH</span>
                </Link>
                <ul className="side-menu top">
                    <li className="">
                        <Link to={'/ressourcehumaine'}>
                        <DashboardIcon />&nbsp;
                            <span className="text">Tableau de Bord</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/demandes'}>
                        <EventNoteIcon />&nbsp;
                            <span className="text">Les Demandes Conges </span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/listeConge'}>
                            <ChecklistIcon/>
                            <span className="text">Listes des Conges </span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/demander'}>
                            <EventNoteIcon/>
                            <span className="text">Demander un Congé </span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/liste'}>
                        <GroupOutlinedIcon/>&nbsp;
                            <span className="text">Les Employées</span>
                        </Link>
                    </li>
                   
                    
                   
                    <li>
                        <Link to={'/HomevideoRh'}>
                        <DuoOutlinedIcon />&nbsp;
                            <span className="text">Salle de reunion</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/messages'}>
                        <MessageIcon />&nbsp;
                            <span className="text">Messages</span>
                        </Link>
                    </li>
                 

                  
                </ul>
                <ul className="side-menu">
                   
                    <li>
                        <Link to={'/calendrierRh'}>
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
export default DashboardRh;
