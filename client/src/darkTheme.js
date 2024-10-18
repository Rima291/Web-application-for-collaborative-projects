import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Active le mode sombre
        primary: {
            main: '#90caf9', // Couleur principale
        },
        secondary: {
            main: '#f48fb1', // Couleur secondaire
        },
        background: {
            default: '#121212', // Couleur de fond par défaut
            paper: '#212121', // Couleur de fond des surfaces (papiers, cartes, etc.)
        },
        text: {
            primary: '#ffffff', // Couleur du texte principal
            secondary: '#aaaaaa', // Couleur du texte secondaire
        },
    },
    // Autres propriétés du thème...
});

export default darkTheme;
