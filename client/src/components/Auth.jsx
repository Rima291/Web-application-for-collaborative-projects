import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import signinImage from '../assets/signup.webp'
import userImg from '../assets/user.jpg';
import './auth.css'
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';


const cookies = new Cookies();

const initialState ={
    name: '',
    email: '',
    address: '',
    picture: null,
    phone: '',
    domaine: '',
    password: '',

    
}

const Auth = () => {
     const [form, setForm] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false);
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    
    
    const  handleChange = (e) =>{
       setForm({ ...form, [e.target.name]: e.target.value})
    console.log(form);
    
    }

    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
    };

    function validateImg(e) {
      const file = e.target.files[0];
      if (file.size >= 1048576) {
        return alert("Max file size is 1mb")
      } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file))
      }
    }
  
    async function uploadImage() {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'ilaj8umd');
      try {
        setUploadingImg(true);
        let res = await fetch('https://api.cloudinary.com/v1_1/duynzjvcb/image/upload', {
          method: 'post',
          body: data
        })
        const urlData = await res.json();
        setUploadingImg(false);
        return urlData.url
      } catch (error) {
        setUploadingImg(false);
        console.log(error);
      }
    }

    
    const handleSubmit = async (e) => {
      e.preventDefault();
         
      try {
        
        const {  email, phone, picture, address, domaine, password } = form;
        if (isSignup) {
          if (password.length < 6) {
            return alert('Le mot de passe doit contenir au moins 6 caractères.');
          }
    
          if (password !== confirmPassword) {
            return alert('La confirmation du mot de passe ne correspond pas au mot de passe.');
          }
    
          if (!email.toLowerCase().includes('@gmail.com')) {
            return alert('Veuillez fournir une adresse e-mail Gmail.');
          }
    
          if (phone.length !== 8) {
            return alert('Le numéro de téléphone doit contenir 8 chiffres.');
          }
        }
        const URL = 'http://localhost:5000/users';
        const url = await uploadImage(image);
        const response = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
          name: form.name,
          email,
          phone,
          picture: url,
          address,
          domaine,
          password,
        });
   
        const { mytoken: token, streamToken, userId, hashedPassword, name, role } = response.data;


        cookies.set("token", streamToken);
        localStorage.setItem('token', token);

        cookies.set("email", email);
        cookies.set("name", name);
        cookies.set("userId", userId);
        cookies.set("role", role);
   



   

        
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'responsable':
            navigate('/dashResponsable');
            break;
          case 'developpeur':
            navigate('/dashboardDev');
            break;
          case 'rh':
            navigate('/ressourcehumaine');
            break;
          default:
            if (!isSignup) {
              alert('Rôle non reconnu. Contactez l\'administrateur');

            }           
           navigate('/auth');
        }
          
        if (isSignup) {
          if (!image) return alert("Veuillez télécharger votre photo de profil");
          const url = await uploadImage(image);
          console.log(url);
          cookies.set('name', name);
          cookies.set('email', email);
          cookies.set('address', address);
          cookies.set('phone', phone);
          cookies.set('domaine', domaine);
          cookies.set('picture',  picture);
          cookies.set('hashedPassword', hashedPassword);


          
          alert("Votre inscription a bien été enregistrée. Vous recevrez bientôt un e-mail de confirmation pour accéder à la plateforme.");
          navigate('/auth');                
          setForm(initialState);
          setImage(null); 
          setImagePreview(null); 
        }
        
        window.location.reload();
        
      } catch (error) {
        if (isSignup && error.response && error.response.status === 400 && error.response.data.message === 'User already exists') {
          alert('Un compte avec cet email existe déjà.');
        }
         else if(!isSignup && error.response && error.response.status === 400 && error.response.data.message === 'invalid email or password') {
          alert('Le mot de passe est incorrect. Veuillez réessayer.');
        } 
       
        else {
          alert('Le mot de passe ou l\'email est incorrect. Veuillez réessayer.');
        }

        console.error("Erreur Axios:", error);
      }
    };
    



    const  switchMode = () =>{
        setIsSignup((prevIsSignup) => !prevIsSignup)
         
    }
  return (
    <div className='auth__form-container'>
        <div className='auth__form-container_fields'>
         <div className='auth__form-container_fields-content'  style={{marginLeft:'480px', width:'600px',}}>
          <p>{isSignup ? 'S\'inscrire' : 'Se Connecter' }</p>

           <form onSubmit={handleSubmit}>
           {isSignup && (
              <div className='signup-profile-pic__container'>
              <img src={imagePreview || userImg} className='signup-profile-pic' alt='' />
              <label htmlFor='image-upload' className='image-upload-label'>
                <i className='fas fa-plus-circle add-picture-icon'></i>
              </label>
              <input  name='picture' type='file' id='image-upload' hidden accept='image/png, image/jpeg' onChange={validateImg} />
            </div>
             )}
             {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='name'>Nom</label>
                    <input
                    name='name'
                    type='text'
                    placeholder='Nom'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
               <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='email'>Email</label>
                    <input
                    
                    name='email'
                    type='email'
                    placeholder='exemple@gmail.com'
                    onChange={handleChange}
                    required
                    />
                </div>
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='phone'>Telephone</label>
                    <input
                    name='phone'
                    type='number'
                   
                    placeholder='Telephone'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='address'>Adresse</label>
                    <input
                    name='address'
                    type='text'
                    placeholder='Adresse'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
             {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='domaine'>Domaine De Travail</label>
                    <input
                    name='domaine'
                    type='text'
                    placeholder='Responsable equipe, Developpeur, Ressource Humaine, Adminstrateur'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
             
                
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='password'>Mot de passe</label>
                    <input
                    name='password'
                    type='password'
                    placeholder='Mot de passe'
                    onChange={handleChange}
                    required
                    />
                </div>
             
            
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='confirmPassword'>Confirmation du Mot de passe</label>
                    <input
                    name='confirmPassword'
                    type='password'
                    placeholder='Confirmer votre mot de passe '
                    onChange={handleConfirmPasswordChange}
                    required
                    />
                </div>
             )}
              {!isSignup && (
               <Link to={'/forgot'} style={{ marginLeft: '310px', marginBottom: '40px', color:'white'}}>
                   Mot de passe oublié ?
                </Link>
              )}

             <div className='auth__form-container_fields-content_button'>
                <button >{isSignup ? "Inscription" : "Connecter"}</button>
             </div>
           </form>
           <div className='auth__form-container_fields-account'>
            <p>
                {isSignup
                ? "Vous avez déjà un compte ?"
                : "Vous n'avez pas de compte ?"
                }
                <span onClick={switchMode}>
                {isSignup ? 'Se Connecter' : 'S\'inscrire'}
                </span>
            </p>
           </div>
         </div>
        </div>
      
    </div>
  );
}

export default Auth