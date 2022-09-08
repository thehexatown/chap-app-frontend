import "./messenger.css";
import Conversation from "../../componenets/conversations/Conversation";
import { useSelector } from "react-redux";
import Message from "../../componenets/message/Message";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import RequestUrl from "../../config/apiUrl";
import SocketContext from "../../context/socketContext";

export default function Messenger() {
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.auth.user);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      getConversations();
    });

    return () => {
      socket.off("getMessage", (data) => {});
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
    if (currentChat) {
      getCurrentChatUser();
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.emit("addUser", user._id);
    socket.on("getUsers", (users) => {});

    return () => {
      socket.off("addUser");

      socket.off("getUsers", () => {});
    };
  }, []);

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          RequestUrl + "/api/messages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  useEffect(() => {
    if (search.length > 0) {
      searchPeople();
    } else {
      setPeople("");
    }
  }, [search]);
  const getConversations = async () => {
    try {
      await axios
        .get(RequestUrl + `/api/conversations/${user._id}`)
        .then((res) => {
          setConversations(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const getCurrentChatUser = async () => {
    const friendId = currentChat?.members.find((m) => m !== user._id);

    try {
      await axios(`http://localhost:5000/api/auth/${friendId}`)
        .then((res) => {
          setCurrentChatUser(res.data);
        })
        .catch((error) => {
          console.log(console.log(error));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (friend) => {
    try {
      await axios
        .get(
          `http://localhost:5000/api/conversations/find/${user._id}/${friend._id}`
        )
        .then(({ data }) => {
          if (data) {
            setCurrentChat(data);
          } else {
            const data = {
              senderId: user._id,
              receiverId: friend._id,
            };
            axios
              .post(`http://localhost:5000/api/conversations/create`, data)
              .then(({ data }) => {
                setCurrentChat(data);
              })
              .then(() => {
                axios
                  .get(`http://localhost:5000/api/conversations/${user._id}`)
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
          if (people[i]._id === user._id) {
            people.splice(i, 1);
          }
        }

        setPeople(people);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="Messages">
          <p>Messages</p>
          <img src={"/ion_create.svg"} />
        </div>
        <div className="chatMenuWrapper">
          <div className="conversationContainer">
            <div className="search">
              <input
                type="search"
                className="searchInput"
                placeholder="Search for Friends"
                onChange={(e) => setSearch(e.target.value)}
              />
              {!search && <img className="searchicon" src={"search.svg"} />}
            </div>
            <div className="peopleContainer">
              {people ? (
                <>
                  <div className="peopleBorder">People</div>
                  {people.length > 0 ? (
                    people.map((friend) => {
                      return (
                        <>
                          <div
                            className="conversation"
                            onClick={() => handleClick(friend)}
                          >
                            <div className="conversationLeft">
                              <img
                                className="conversationImg"
                                src={"Ellipse 1.svg"}
                                alt=""
                              />
                              <div className="conversationDetails">
                                <p className="conversationName">
                                  {friend.name}
                                </p>
                                {/* <p className="conversationTyping">Typing..</p> */}
                              </div>
                            </div>
                            <div className="conversationRight">
                              {/* <p>12:30 pm</p> */}
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <div className="peopleNotFound">No people Found</div>
                  )}
                </>
              ) : (
                <>
                  {conversations.map((c) => {
                    return (
                      <Conversation
                        people={people}
                        setConversations={setConversations}
                        currentId={user._id}
                        setCurrentChat={setCurrentChat}
                        conversation={c}
                        currentUser={user}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
          {currentChat ? (
            <div className="chatBox">
              <div className="chatBoxTop">
                <div className="chatTopLeft">
                  <img
                    className="conversationImg"
                    src={"Ellipse 1.svg"}
                    alt=""
                  />
                  <div className="conversationDetails">
                    <p className="conversationName">{currentChatUser?.name}</p>
                  </div>
                </div>
                <div className="chatTopRight">
                  <img src={"./phone.svg"} />
                </div>
              </div>
              <div className="chatbody">
                {messages.map((m) => (
                  <div ref={scrollRef}>
                    <Message
                      message={m}
                      own={m.sender === user._id}
                      currentChat={currentChat}
                      currentUser={user._id}
                    />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <input
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />
                <div className="chatBoxBottomIcons">
                  <img src="/bi_mic.svg" />
                  <img src="/bi_camera.svg" />
                  <img src="/link.svg" />
                  <img src="/Line 2.svg" />
                  <img src="/bi_send-fill.svg" onClick={handleSubmit} />
                </div>
              </div>
            </div>
          ) : (
            <div className="openChat">
              <p>Open Conversation to message</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
