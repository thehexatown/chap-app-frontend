import "./messenger.css";
import Conversation from "../../componenets/conversations/Conversation";
import { useSelector } from "react-redux";
import Message from "../../componenets/message/Message";
import ChatOnline from "../../componenets/chatOnline/ChatOnline";
import { messageMock } from "../../mock/message";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import SocketContext from "../../context/socketContext";

export default function Messenger() {
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.auth.user);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const scrollRef = useRef();
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("message", data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.off("getMessage", (data) => {});
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.emit("addUser", user._id);
    socket.on("getUsers", (users) => {
      console.log("users", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("addUser");

      socket.off("getUsers", () => {});
    };
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/conversations/${user._id}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

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
        {/* <div className="chatMenu"> */}
        <div className="Messages">
          <p>Messages</p>
          <img src={"/ion_create.svg"} />
        </div>
        <div className="chatMenuWrapper">
          <div>
            {/* {conversations.map((c) => ( */}
            {/* onClick={() => setCurrentChat(c)} */}
            {/* conversation={c} currentUser={user} */}
            {/* <div> */}
            <Conversation />
            {/* </div> */}
            {/* ))} */}
            {/* </div> */}
          </div>
          <div className="chatBox">
            {/* <div className="chatBoxWrapper"> */}
            {/* {currentChat ? ( */}
            <>
              <div className="chatBoxTop">
                <div className="chatTopLeft">
                  <img
                    className="conversationImg"
                    src={"Ellipse 1.svg"}
                    alt=""
                  />
                  <div className="conversationDetails">
                    <p className="conversationName">Mohsin Ali</p>
                    <p className="conversationTyping">Typing...</p>
                  </div>
                </div>
                <div className="chatTopRight">
                  <img src={"./phone.svg"} />
                </div>
              </div>
              <div className="chatbody">
                {messageMock.map((m) => (
                  <div ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <div className="chatBoxBottomIcons">
                  <img src="/bi_mic.svg" />
                  <img src="/bi_camera.svg" />
                  <img src="/link.svg" />
                  <img src="/Line 2.svg" />
                  <img src="/bi_send-fill.svg" />
                </div>
              </div>
            </>
            {/* ) : ( */}
            {/* <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )} */}
            {/* </div> */}
            {/* </div> */}
            {/* <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              setConversations={setConversations}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}
