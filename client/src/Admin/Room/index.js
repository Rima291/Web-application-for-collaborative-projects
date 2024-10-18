import React from "react";
import { useParams } from "react-router";
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

const RoomPageAdmin =()=>{
    const{roomId} = useParams();

    const myMeting = async(element) => {
        const appID = 74077817 ;
        const serverSecret ="145061cd5a624afcaa6af30ad3a1c0e5";
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

export default RoomPageAdmin; 