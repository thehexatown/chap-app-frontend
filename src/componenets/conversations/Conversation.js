import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SocketContext from "../../context/socketContext";
import { conversationMock } from "../../mock/conversation";
import "./conversation.css";

export default function Conversation({
  conversation,
  people,
  currentUser,
  onlineUsers,
  currentId,
  setCurrentChat,
  setConversations,
}) {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState(null);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation?.members.find((m) => m !== currentUser._id);
    // socket.emit("allConversations", friendId);
    const getUser = async () => {
      // for (let i=0; i<conversation)

      try {
        await axios(`http://localhost:5000/api/auth/${friendId}`)
          .then((res) => {
            setUser(res.data);
          })
          .catch((error) => {
            console.log(console.log(error));
          });
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  useEffect(() => {});

  return (
    <>
      <div
        className="conversation"
        onClick={() => setCurrentChat(conversation)}
      >
        <div className="conversationLeft">
          <img
            className="conversationImg"
            src={
              user?.profilePicture ? PF + user.profilePicture : "Ellipse 1.svg"
            }
            alt=""
          />
          <div className="conversationDetails">
            <p className="conversationName">{user?.name}</p>
            <p className="conversationTyping">Typing..</p>
          </div>
        </div>
        <div className="conversationRight">
          <p></p>
        </div>
      </div>
    </>
  );
}
