import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";
import { ProsConsDiscusserResponse } from "../../../interfaces";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    role: string;
    content: string;
    refusal: null;
  };
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (texto: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: texto, isGpt: false },
    ]);

    const data = await prosConsDiscusserUseCase(texto);

    const { content, role, refusal } = data as ProsConsDiscusserResponse;

    if (!data.ok) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "No se pudo realizar la comparación.", isGpt: true },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: `${content}`,
          isGpt: true,
          info: {
            role,
            content,
            refusal,
          },
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-y2">
          <GptMessage text="Hola, puedes escribir lo que quieras y te daré mis puntos de vista"></GptMessage>

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
