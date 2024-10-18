import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Avatar, Typography, CircularProgress, Divider } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: theme.spacing(4),
    borderRadius: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: 'auto',
  },
  content: {
    textAlign: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const ProfileDeveloppeur = () => {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:5000/users/profile', config);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          loading ? (
            <CircularProgress />
          ) : (
            <Avatar className={classes.avatar} src={user?.picture} alt="Profile" />
          )
        }
        title="User Profile"
      />
      <Divider />
      <CardContent className={classes.content}>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body1">
              <PersonIcon className={classes.icon} />
              {user?.username}
            </Typography>
            <Typography variant="body1">
              <EmailIcon className={classes.icon} />
              {user?.email}
            </Typography>
            <Typography variant="body1">
              <LocationOnIcon className={classes.icon} />
              {user?.address}
            </Typography>
            <Typography variant="body1">
              <PhoneIcon className={classes.icon} />
              {user?.phone}
            </Typography>
            <Typography variant="body1">
              <WorkIcon className={classes.icon} />
              {user?.domaine}
            </Typography>
            <Typography variant="body1">
              <AssignmentIndIcon className={classes.icon} />
              {user?.role}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDeveloppeur;
