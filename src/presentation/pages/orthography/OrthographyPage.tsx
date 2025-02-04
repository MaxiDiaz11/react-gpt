import { useState } from "react";
import {
  GptMessage,
  GptOrtographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { ortographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (texto: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: texto, isGpt: false },
    ]);

    const { errors, message, ok, userScore } = await ortographyUseCase(texto);

    if (!ok) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "No se pudo realizar la corrección.", isGpt: true },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: `${message}`,
          isGpt: true,
          info: {
            userScore,
            errors,
            message,
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
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones"></GptMessage>

          {messages.map((message, index) => {
            if (message.isGpt) {
              return (
                <GptOrtographyMessage
                  key={index}
                  {...message.info!}
                ></GptOrtographyMessage>
              );
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
