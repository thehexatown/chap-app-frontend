import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SocketContext from "../../context/socketContext";
import "./chatOnline.css";

export default function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentChat,
  setConversations,
}) {
  const socket = useContext(SocketContext);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (onlineUsers.length) {
      const getFriends = async () => {
        await axios
          .post("http://localhost:5000/api/auth/", { onlineUsers: onlineUsers })
          .then((res) => {
            let users = res.data;
            for (var i = 0; i < users.length; i++) {
              if (users[i]._id == currentId) {
                users.splice(i, 1);
              }
            }

            setOnlineFriends(users);
          })
          .catch((error) => {
            console.log(error.details);
          });
      };

      getFriends();
    }
  }, [onlineUsers]);

  // const createNewConversation = (data) => {
  //   socket.emit("newConversation", data=>{

  //   });
  // };

  const handleClick = async (user) => {
    try {
      await axios
        .get(
          `http://localhost:5000/api/conversations/find/${currentId}/${user._id}`
        )
        .then(({ data }) => {
          if (data) {
            setCurrentChat(data);
          } else {
            const data = {
              senderId: currentId,
              receiverId: user._id,
            };
            axios
              .post(`http://localhost:5000/api/conversations`, data)
              .then(({ data }) => {
                setCurrentChat(data);
              })
              .then(() => {
                axios
                  .get(`http://localhost:5000/api/conversations/${currentId}`)
                  .then((res) => {
                    setConversations(res.data);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((user) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(user)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                user?.profilePicture
                  ? PF + user.profilePicture
                  : "Ellipse 1.svg"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{user?.name}</span>
        </div>
      ))}
    </div>
  );
}
