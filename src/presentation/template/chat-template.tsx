import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../components";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (texto: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: texto, isGpt: false },
    ]);

    //TODO: Use case

    setIsLoading(false);

    //todo: añadir mensaje isGPT true
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-y2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones"></GptMessage>

          {messages.map((message, index) => {
            if (message.isGpt) {
              return <GptMessage key={index} text={message.text}></GptMessage>;
            } else {
              return <MyMessage key={index} text={message.text}></MyMessage>;
            }
          })}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={(message) => handlePost(message)}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
