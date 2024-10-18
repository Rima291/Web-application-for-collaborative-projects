import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from '../components';

import 'stream-chat-react/dist/css/index.css';
import './message.css';


const cookies = new Cookies();

const apiKey = '8a97qeyw9cba';
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if(authToken) {
    client.connectUser({
       id: cookies.get('userId'),  
        name: cookies.get('name'),
        email: cookies.get('email'),
        token: cookies.get('token'),
        picture: cookies.get('picture'),
        hashedPassword: cookies.get('hashedPassword'),
        phone: cookies.get('phone'),
        address: cookies.get('address'),
        domaine: cookies.get('domaine'),
        
    }, authToken)
}


const Messages = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);



    if(!authToken) return <Auth />

    return (
        <div className="app__wrapper" style={{height:'695px'}}>
            <Chat client={client} theme="team light">
                <ChannelListContainer 
                   isCreating={isCreating}
                   setIsCreating={setIsCreating}
                   setCreateType={setCreateType}
                   setIsEditing={setIsEditing}
                   
                />
                <ChannelContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing} 
                    createType={createType}
                />
            </Chat>
        </div>
    );
}

export default Messages;