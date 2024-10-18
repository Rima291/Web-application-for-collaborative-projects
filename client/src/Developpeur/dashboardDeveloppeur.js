import React, { useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import Navigate from '../navigation';
import { Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon, VideoLibrary as VideoLibraryIcon, Extension as ExtensionIcon, BarChart as BarChartIcon, Task as TaskIcon, Message as MessageIcon, EventNote as EventNoteIcon, AccountCircle as AccountCircleIcon, Note as NoteIcon, CalendarToday as CalendarTodayIcon, Settings as SettingsIcon, Help as HelpIcon } from '@mui/icons-material';
import DuoIcon from '@mui/icons-material/Duo';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

function DashboardDev() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <section id="sidebar" className={isSidebarOpen ? '' : 'closed'} >
                <Link to={'/'} className="brand">
                    <DashboardIcon />&nbsp;
                    <span className="text">Développeur</span>
                </Link>
                <ul className="side-menu top" >
                    <li>
                        <Link to={'/dashboardDev'}>
                            <DashboardIcon />&nbsp;
                            <span className="text">Tableau de bord</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/tasks'}>
                            <TaskIcon />&nbsp;
                            <span className="text">Mes Tâches</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/projet'}>
                            <BarChartIcon />&nbsp;
                            <span className="text">Projets</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/Homevideodev'}>
                            <DuoIcon />&nbsp;
                            <span className="text">Salle de Réunion</span>
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
                        <Link to={'/demandedev'}>
                            <EventNoteIcon />&nbsp;
                            <span className="text">Demandes de Congé</span>
                        </Link>
                    </li>
                  
                </ul>
                <ul className="side-menu">
               
                    <li>
                        <Link to={'/calendrierdev'}>
                            <CalendarTodayIcon />&nbsp;
                            <span className="text">Evénements </span>
                        </Link>
                    </li>
                
                </ul>
            </section>
            <div id="content" className={isSidebarOpen ? '' : 'expanded'}>
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

export default DashboardDev;
