import React, { useState } from "react";
import './sidebar.css';

import { BiMenu } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import HelpIcon from "../../assets/help_icon.png"

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    

    const handleNewChatClick = () => {
        // Recharge la page
        window.location.reload();
    };

    const handleQuestionMarkClick = () => {
        // Redirige vers l'interface d'aide de Google Gemini
        window.open('https://support.google.com/gemini/', '_blank');
    };

    return (
        <div className="sidebar">
            <div className="top">
                <BiMenu onClick={() => setExtended(prev => !prev)} className="menu" />
                <div className="new-chat">
                    <BiPlus style={{ fontSize: '20px'  }} />
                    {extended ? <p onClick={handleNewChatClick} style={{marginTop:'14px'}}>New chat</p> : null}
                </div>
                <div >
            <img src={HelpIcon} alt="" onClick={handleQuestionMarkClick} style={{ height:'20px' , marginBottom:'-860px', marginTop:'300px' }} />
            {extended ? <p style={{marginLeft:'30px' , marginTop:'560px'}}>Aide</p> : null}
            
                </div>
           
            </div>
           
        </div>
        
        
    );
}

export default Sidebar;
