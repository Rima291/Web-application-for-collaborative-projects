import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, CardHeader, Avatar, Typography,
  CircularProgress, Divider, TextField, Button, IconButton
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './profile.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    margin: 'auto',
    marginTop: theme.spacing(4),
    borderRadius: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  content: {
    textAlign: 'left',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  profilePicContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginRight: theme.spacing(2),
    borderRadius: '50%',
    objectFit: 'cover',
  },
  imageUploadLabel: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.7)',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  addPictureIcon: {
    fontSize: '24px',
  },
}));

const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
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
        setError('Error fetching user');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'ilaj8umd');
    try {
      setUploadingImg(true);
      const res = await fetch('https://api.cloudinary.com/v1_1/duynzjvcb/image/upload', {
        method: 'POST',
        body: data
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedUser({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      domaine: user.domaine,
      picture: user.picture,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (image) {
        const imageUrl = await uploadImage();
        editedUser.picture = imageUrl;
      }

      const response = await axios.put('http://localhost:5000/users/updateprofile', editedUser, config);
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user', error);
      setError('Error updating user');
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton className={classes.backButton} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        }
        className={classes.header}
        avatar={
          loading ? (
            <CircularProgress />
          ) : (
            <div className={classes.profilePicContainer}>
            <img src={imagePreview || user?.picture} className={classes.avatar} alt="Profile" />
            {editMode && (
              <label htmlFor="image-upload" className={classes.imageUploadLabel}>
                <i className={`fas fa-plus-circle ${classes.addPictureIcon}`}></i>
              </label>
            )}
            <input name="picture" type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={handleFileChange} />
          </div>
          )
        }
        title={
          <Typography variant="h5">
            <PersonIcon className={classes.icon} /> {user?.name}
            {!editMode && !loading && (
              <Button onClick={handleEdit} className={classes.editButton}>Modifier mon Compte</Button>
            )}
          </Typography>
        }
      />
      <Divider />
      <CardContent className={classes.content}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <div>
            <TextField
              name="name"
              label="Nom"
              value={editMode ? editedUser.name : user.name}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            /><br />
            <TextField
              name="email"
              label="Email"
              value={editMode ? editedUser.email : user.email}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            /><br />
            <TextField
              name="address"
              label="Adresse"
              value={editMode ? editedUser.address : user.address}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            /><br />
            <TextField
              name="phone"
              label="Téléphone"
              value={editMode ? editedUser.phone : user.phone}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            /><br />
            <TextField
              name="domaine"
              label="Domaine de Travail"
              value={editMode ? editedUser.domaine : user.domaine}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            /><br />
            <TextField
              name="role"
              label="Rôle"
              value={user.role}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            /><br />
            {editMode && (
              <Button className={classes.button} onClick={handleSubmit} variant="contained" color="primary">
                Enregistrer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;
