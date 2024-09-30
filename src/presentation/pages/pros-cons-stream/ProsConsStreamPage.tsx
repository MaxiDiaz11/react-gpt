import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import {
  prosConsDiscusserStreamGeneratorUseCase,
  // prosConsDiscusserStreamUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (texto: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: texto, isGpt: false },
    ]);

    // const reader = await prosConsDiscusserStreamUseCase(texto);
    const stream = prosConsDiscusserStreamGeneratorUseCase(
      texto,
      abortController.current.signal
    );

    setIsLoading(false);

    setMessages((prevMessages) => [...prevMessages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].text = text;

        return newMessages;
      });
    }
    isRunning.current = false;

    //!Generar el ultimo mensaje
    // if (!reader) return alert("No se pudo realizar la comparación");

    // const decoder = new TextDecoder();
    // let message = "";

    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { text: message, isGpt: true },
    // ]);

    // while (true) {
    //   const { value, done } = await reader.read();

    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });

    //   message += decodedChunk;

    //   setMessages((prevMessages) => {
    //     const newMessages = [...prevMessages];
    //     newMessages[newMessages.length - 1].text = message;

    //     return newMessages;
    //   });
    // }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-y2">
          <GptMessage text="Hola, puedes escribir lo que quieras y te daré mis puntos de vista en base a comparaciones"></GptMessage>

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
