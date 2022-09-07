import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SocketContext from "../../context/socketContext";
import { conversationMock } from "../../mock/conversation";
import "./conversation.css";

export default function Conversation({
  conversation,
  currentUser,
  onlineUsers,
  currentId,
  setCurrentChat,
  setConversations,
}) {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState(null);
  const [people, setPeople] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   // const friendId = conversation?.members.find((m) => m !== currentUser._id);
  //   // socket.emit("allConversations", friendId);
  //   const getUser = async () => {
  //     // for (let i=0; i<conversation)

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

  useEffect(() => {
    console.log("conversation", conversation);
  });
  useEffect(() => {
    if (search.length > 0) {
      searchPeople();
    }
  }, [search]);

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
              .post(`http://localhost:5000/api/conversations/create`, data)
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

  const searchPeople = async () => {
    await axios
      .get(`http://localhost:5000/api/users/search?search=${search}`)
      .then((res) => {
        let people = res.data;
        for (let i = 0; i < people.length; i++) {
          if (people[i]._id === currentId) {
            people.splice(i, 1);
          }
        }
        setPeople(people);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container">
        <div className="search">
          <input
            type="text"
            className="searchInput"
            placeholder="Search for Friends"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <img className="searchicon" src={"search.svg"} />

        {people?.length > 0 ? (
          <>
            <div className="peopleBorder">People</div>
            {people.map((friend) => {
              return (
                <>
                  <div
                    className="conversation"
                    onClick={() => handleClick(friend)}
                  >
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
                        <p className="conversationName">{friend.name}</p>
                        <p className="conversationTyping">Typing..</p>
                      </div>
                    </div>
                    <div className="conversationRight">
                      <p>12:30 pm</p>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="conversationBorder">conversations</div>
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
                  <p className="conversationName">husnain</p>
                  <p className="conversationTyping">Typing..</p>
                </div>
              </div>
              <div className="conversationRight">
                <p>12:30 pm</p>
              </div>
            </div>
          </>
        ) : (
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
                <p className="conversationName">huisnain</p>
                <p className="conversationTyping">Typing..</p>
              </div>
            </div>
            <div className="conversationRight">
              <p>12:30 pm</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
