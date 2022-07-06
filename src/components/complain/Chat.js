import React from "react";
import { Button } from "react-bootstrap";

import default_profile from '../../assets/img/notfound.jpg'
import sendchat from "../../assets/img/send.svg"
import nomessage from "../../assets/img/nomessage.png"
import ellipse from "../../assets/img/Ellipse.svg"
import ScrollableFeed from "react-scrollable-feed";

export default function Chat({ contact, user, messages, sendMessage }) {
return (
    <>
    {contact ? (
        <>
        <div className="chat-header-chat d-flex">
            <div className="image-oke">
                <img src={contact?.profile?.image  || default_profile} className='image-chat rounded-circle'/>
            </div>
            <div className="info-oke">
                <p className="text-chat" style={{marginTop:"20px"}}>{contact?.name}</p>
                <div className="d-flex">
                    <img src={ellipse} style={{marginTop:"-30px", marginLeft:"11px"}}/>
                    <p className="text-chat-name" style={{marginLeft:"10px", marginTop:"-15px"}}>Online</p>
                </div>
            </div>
        </div>
        <div id="chat-messages" style={{ height: "355px"}} className="overflow-auto px-3">
        <ScrollableFeed>

        {messages.map((item, index) => (
            <div key={index}>
                <div className={`d-flex py-1 ${item.idSender === user.user.id ? "justify-content-end": "justify-content-start"}`}>
                <div
                    className={ item.idSender === user.user.id ? "chat-me" : "chat-other"}
                >
                    {item.message}
                </div>
                </div>
            </div>
            ))}
        </ScrollableFeed>
        </div>
        <div className="d-flex">
            <div style={{ height: '6vh'}}className="px-3">
                <input 
                placeholder="Send Message" 
                className="input-message px-4" 
                onKeyPress={sendMessage} />
            </div>
            <div>
                <Button 
                style={{
                    width:" 67px",
                    height: "44px",
                    background:" #8AD0D0",
                    borderRadius: "10px",
                    border:"none"
                }}
                onClick={sendMessage}>
                    <img src={sendchat}/>
                </Button>
            </div>
        </div>

        </>
    ) : (
        <div
        style={{ height: "60vh" }}
        className="d-flex justify-content-center align-items-center"
        >
        <img src={nomessage} style={{
            width:"400px",
            height:"280px"
        }}/>
        </div>
    )}
    </>
);
}
