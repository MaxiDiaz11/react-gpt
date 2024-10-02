import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from "../../components";
import { translateTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (texto: string, selectedOption: string) => {
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

    const stream = translateTextUseCase(
      texto,
      selectedOption,
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
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-y2">
          <GptMessage text="Hola, puedes escribir lo que quieras y lo traduciré al lenguaje que elijas."></GptMessage>

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

      <TextMessageBoxSelect
        options={languages}
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
