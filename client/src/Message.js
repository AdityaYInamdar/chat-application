import { Button, Card, Divider, Input, Tag } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "./Hooks/useDebounce";

export default function Message({socket, userDetails}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState();
  function handleSend() {
    socket.emit("message", {'message': message, 'name': userDetails.username});
    // {'sid': sid, 'text': message['message'], 'type': 'message', 'name': message['name']}
    setMessage("");
  }
  useEffect(() => {
    socket.on("send", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });
    socket.on("typing-status", (data) => {
      console.log(data);
      setTyping(data);
    })
    socket.on("done-typing-status", (data) => {
      setTyping();
    }
    )
    return () => {
      socket.off("send");
    };
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => socket.emit("done-typing", userDetails.username), 1000);
    return () => clearTimeout(timeoutId);
  }, [message]);
  useEffect(() => {
    const timeoutId = setTimeout(() =>  socket.emit("typing", userDetails.username), 500);
    return () => clearTimeout(timeoutId);
  }, [message]);
  return (
    <div>
      {messages?.map((mes, idx) => {
        return (
          <div
            style={{
              display: "flex",
              margin: "10px",
              justifyContent:
                socket.id === mes.sid
                  ? "flex-end"
                  : "flex-start",
            }}
            key={idx}
          >
            <Card title={`~ ${socket.id === mes.sid? userDetails.username : mes?.name}`}>
            <Button style={{
                color: "white",
                backgroundColor: socket.id === mes.sid? "#00B96B": "#1684B9",
            }}> {mes?.text}</Button>
            </Card>
          </div>
        );
      })}
      {(typing?.user && typing?.sid !== socket.id) && (
        console.log(typing?.sid, socket.id),
      <Divider>{typing?.user} is typing...</Divider>
      )}
      <div style={{ display: "inline-flex" }}>
        <Input
          placeholder=""
          value={message}
          onChange={(e) => {

            
            setMessage(e?.target?.value)}}
        />
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
