import React from "react";
import { useParams } from "react-router";
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

const RoomPage =()=>{
    const{roomId} = useParams();

    const myMeting = async(element) => {
        const appID = 2116117010 ;
        const serverSecret ="a6c69766e1da231ce7906cec0b795eeb";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            "your name"
        );
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container: element,
             sharedLinks: [{
                name:" Copy Link",
                url:`http://localhost:3000/room/${roomId}`,
             }],

            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
showScreenSharingButton: true,
        });
    }
    return(
        <><div style={{marginTop:'180px'}}>
            <div ref={myMeting} />
        </div></>
    )
};

export default RoomPage; 