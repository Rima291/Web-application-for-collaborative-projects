import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
function Navigate() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchNotifications();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            localStorage.setItem('picture', response.data.picture);
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
            navigate('/auth');
        }
    };

    const fetchNotifications = () => {
        const fakeNotifications = [
            { id: 1, text: 'Nouvelle tâche créée pour vous.' },
            { id: 2, text: 'Une mise à jour importante est disponible.' }
        ];
        setNotifications(fakeNotifications);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const logout = () => {
        cookies.remove('token');

        cookies.remove('userId');
        cookies.remove('name');
        cookies.remove('email');
        cookies.remove('picture');
        cookies.remove('hashedPassword');
        cookies.remove('phone');
        cookies.remove('address');
        cookies.remove('domaine');
        cookies.remove('role');
        navigate('/auth');

        window.location.reload();
    };

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: 'white', height: '55px' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: '0 50px' }}>
                    <IconButton color="inherit" aria-label="contact" onClick={handleToggleNotifications} style={{ color: '#3C91E6' , marginLeft:'910px',marginTop:'-4px'}}>
                        <ContactMailIcon />
                    </IconButton>
              
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit" style={{ color: '#3C91E6', display: 'flex', alignItems: 'center', marginRight: '35px' }}>
                        {userData.picture && <img src={userData.picture} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '15px' }} />}
                        {userData.name || 'Profile'}
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem key="profile" onClick={handleClose} style={{ color: '#3C91E6' }}>
                            <Link to={'/profile'}>Mon compte</Link>
                        </MenuItem>
                        <MenuItem key="logout" onClick={logout} style={{ color: '#3C91E6' }}>
                            Déconnexion
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <div style={{
                position: 'absolute',
                top: '55px',
                right: '100px',
                backgroundColor: '#84a7ff',
                padding: '10px',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                display: showNotifications ? 'block' : 'none',
                color: 'white',
            }}>
                {showNotifications && (
                    <div>
                       <p>Email: ceo@hortensia-agency.com</p>
                      <p>Téléphone:  20091092</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Navigate;
