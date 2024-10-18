import React, { useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import Navigate from '../navigation';
import { Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon, VideoLibrary as VideoLibraryIcon, Extension as ExtensionIcon, BarChart as BarChartIcon, Task as TaskIcon, Message as MessageIcon, EventNote as EventNoteIcon, AccountCircle as AccountCircleIcon, Note as NoteIcon, CalendarToday as CalendarTodayIcon, Settings as SettingsIcon, Help as HelpIcon } from '@mui/icons-material';

import VideocamIcon from '@mui/icons-material/Videocam';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import DuoIcon from '@mui/icons-material/Duo';

 function Dashboard() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
    <div className="dashboard-container" >

            <section id="sidebar" className={isSidebarOpen ? '' : 'closed'}>
                <Link to={'/admin'} className="brand">
                <DashboardIcon />&nbsp;
                    <span className="text" style={{marginTop:'5px'}}>Admin</span>
                </Link>
                <ul className="side-menu top" >
                    <li className="">
                        <Link to={'/admin'}>
                        <DashboardIcon />&nbsp;
                            <span className="text" >Tableau de Bord</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/role'}>
                            <WorkspacePremiumOutlinedIcon />&nbsp;
                            <span className="text">Role et Permissions</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/employee'}>
                            <GroupOutlinedIcon/>&nbsp;
                            <span className="text" >Employées</span>
                        </Link>
                    </li>
                 
               

                <li>
                    <Link to={'/messages'}>
                    <MessageIcon />&nbsp;
                        <span className="text">Messages</span>
                    </Link>
                </li>
                <li>
                        <Link to={'/homevideoAdmin'}>
                            <DuoIcon />&nbsp;
                            <span className="text">Salle de Réunion</span>
                        </Link>
                    </li>

            </ul>
            <ul className="side-menu">
               
               <li>
                   <Link to={'/calendrier'}>
                       <CalendarTodayIcon />&nbsp;
                       <span className="text">Evénements</span>
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
export default Dashboard;
