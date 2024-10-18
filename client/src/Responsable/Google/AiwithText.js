import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from "../../helpers/imageHelper";
import geminiIcon from '../../assets/gemini_icon.jpg';
import './AiwithImage.css';
import './AiwithText.css';
import UserIcon from '../../assets/user_icon.png';
import { BiSend } from 'react-icons/bi';
import { BiImage } from 'react-icons/bi';
import CompassIcon from '../../assets/compass_icon.png';
import BulbIcon from '../../assets/bulb_icon.png';
import MessageIcon from '../../assets/message_icon.png';
import CodeIcon from '../../assets/code_icon.png';

const phrases = [
    " Une approche de recherche sémantique pour des résultats plus précis.",
    "Système de recherche analysant le sens et le contexte des requêtes",
    "Propose une indexation plus intelligente pour une découverte web plus fluide",
    "Optimise les résultats de recherche en fonction de l'intention de l'utilisateur", 
    "Intègre le traitement du langage naturel pour une compréhension plus fine des requêtes",
    "Améliore l'expérience de recherche en offrant une exploration plus efficace et satisfaisante sur le web",
    "Promet une expérience de recherche plus intuitive et personnalisée pour les utilisateurs.",
    "Vise à réduire les ambiguïtés et à fournir des réponses plus pertinentes aux questions complexes"
];

const iconMap = {
    0: CompassIcon,
    1: BulbIcon,
    2: MessageIcon,
    3: CodeIcon
};

const AiwithImageAndText = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyC1It4cDJmjelTu94Kt9c5kI5wX7DtqDqI');
    const [search, setSearch] = useState('');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [randomIndex, setRandomIndex] = useState(null);

    const responseContainerRef = useRef(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (responseContainerRef.current) {
            responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }
    }, [responses]);

    useEffect(() => {
        // Générer un index aléatoire à chaque rafraîchissement de la page
        const randomIndex = Math.floor(Math.random() * phrases.length);
        setRandomIndex(randomIndex);
    }, []);

    async function aiRun() {
        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `${search}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            setResponses(prevResponses => [...prevResponses, { text, image: null }]);
        } catch (error) {
            alert("Une erreur s'est produite lors de la génération du contenu. Veuillez réessayer plus tard.");
        }
        setLoading(false);
        setSearched(true);
    }

    async function aiImageRun() {
        if (!isOnline) {
            alert("Vous êtes hors ligne. Veuillez vous connecter à Internet pour effectuer cette action.");
            return;
        }

        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            const result = await model.generateContent(["what's in this photo?", imageInlineData]);
            const response = await result.response;
            const text = await response.text();
            setResponses(prevResponses => [...prevResponses, { text, image: image }]);
        } catch (error) {
            console.error("Erreur lors de la requête à l'API Google Generative Language:", error);
            alert("Une erreur s'est produite lors de la récupération des données. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
            setSearched(true);
        }
    }

    const handleChangeSearch = (e) => {
        const inputValue = e.target.value;
        setSearch(inputValue);

        if (inputValue.trim() === '') {
            setImage('');
            setImageLoaded(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Vérifier si un fichier a été sélectionné
        if (!file) {
            return; // Sortir de la fonction si aucun fichier n'est sélectionné
        }

        const fileName = file.name;
        setSearch(fileName);
        getBase64(file)
            .then((result) => {
                setImage(result);
            })
            .catch(e => console.log(e));
        fileToGenerativePart(file).then((image) => {
            setImageInlineData(image);
            setImageLoaded(true);
        });
    };

    async function fileToGenerativePart(file) {
        const Base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await Base64EncodedDataPromise, mimeType: file.type },
        };
    }

    const handleSearch = () => {
        if (imageLoaded) {
            aiImageRun();
        } else if (search.trim() !== '') {
            aiRun();
        } else {
            alert("Veuillez entrer du texte ou sélectionner une image avant de rechercher.");
        }
    };

    return (
        <div className="main" >
            <div className="nav">
                <p style={{marginLeft:'20px' , marginTop:'-20px'}}>Gemini</p>
                <img src={UserIcon} alt="" style={{ marginTop: '-50px', marginLeft: '1050px' }} />
            </div>
            <div className="main-container">
                {!searched && (
                    <div className="greet">
                        <p><span>Bonjour, </span></p>
                        <p>De quoi avez-vous besoin aujourd'hui</p>
                    </div>
                )}
                {!searched && (
                  <div className="cards">
                  {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="card">
                          <p>{phrases[Math.floor(Math.random() * phrases.length)]}</p>
                          <img src={iconMap[index]} alt="" />
                      </div>
                  ))}
              </div>
              
                )}
                <div className="inputContainer" >
                    <div style={{ display: 'flex', width: '1000px' , color: 'black'}}>
                        <input
                        
                            type='text'
                            placeholder="Entrez  ici"
                            value={search}
                            onChange={(e) => handleChangeSearch(e)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            style={{ width: '350px', height: '50px', marginRight: '10px'}}
                        />
                        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <h2><BiImage /></h2>
                        </label>
                        <input id="fileInput" type='file' onChange={(e) => handleImageChange(e)} style={{ width: '350px', height: '50px', display: 'none' }} />
                    </div>
                    <h2><BiSend onClick={() => handleSearch()} /></h2>
                    <p style={{ textAlign: 'center', marginRight: '280px', position: 'fixed', marginTop: '150px', fontSize: '12px' }}>Gemini peut afficher des informations inexactes, y compris sur des personnes. Vérifiez donc ses réponses. Confidentialité de vos données dans les applications Gemini</p>
                </div>
               
                {loading && (
                    <div className="loadingContainer" >
                        <p>  <img src={geminiIcon} alt="" className="loadingIcon" style={{ width: '30px', height: '30px', marginTop: '-30px' }} /> Loading.... </p>
                    </div>
                )}
                <div ref={responseContainerRef} style={{ overflowY: 'scroll', maxHeight: '500px', border: 'none', padding: '30px', marginTop:'-10px'  }}>
                
                {responses.map((response, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', alignItems: 'center'  }}>
                            {response.image && <img src={response.image} alt="Response Image" style={{ width: '55px', height: '55px', marginRight: '20px', marginTop:'-25px' }} />}
                            <div style={{ marginLeft: response.image ? '10px' : '0' }}>
                                <img src={geminiIcon} alt="" className="loadingIcon" style={{ width: '25px', height: '25px', marginTop: '70px', marginBottom: '-25px' , marginLeft:'-27px' }} />
                                {response.text.split('\n').map((line, index) => (
                                    <div key={index} style={{ marginBottom: '2px' , marginTop:'10px' }}>
                                        <p style={{ margin: '0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                                            {line.trim().replace(/[^\w\s]/gi, '')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default AiwithImageAndText;








