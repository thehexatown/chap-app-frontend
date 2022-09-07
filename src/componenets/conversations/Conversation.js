import axios from "axios";
import { useEffect, useState } from "react";
import { conversationMock } from "../../mock/conversation";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // useEffect(() => {
  //   const friendId = conversation.members.find((m) => m !== currentUser._id);
  //   const getUser = async () => {
  //     try {
  //       await axios(`http://localhost:5000/api/auth/${friendId}`)
  //         .then((res) => {
  //           console.log("fiend", res);
  //           setUser(res.data);
  //         })
  //         .catch((error) => {
  //           console.log(console.log(error));
  //         });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [currentUser, conversation]);

  return (
    <div className="container">
      <div className="search">
        <input type="text" placeholder="Search for Friends" />
      </div>
      {conversationMock.map((item, index) => {
        // {
        //   console.log("item", item);
        // }
        return (
          <>
            <div className="conversation">
              <div className="conversationLeft">
                <img
                  className="conversationImg"
                  src={
                    user?.profilePicture
                      ? PF + user.profilePicture
                      : "Ellipse 1.svg"
                  }
                  alt=""
                />
                <div className="conversationDetails">
                  <p className="conversationName">{item?.name}</p>
                  <p className="conversationTyping">{item?.typing}</p>
                </div>
              </div>
              <div className="conversationRight">
                <p>{item?.time}</p>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
