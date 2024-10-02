import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string, selectedOption: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
}

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  options,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;
    if (selectedOption === "") return;

    const newMessage = `Traduce: "${message}" al idioma ${selectedOption}`;

    onSendMessage(newMessage, selectedOption);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 bg-white w-full px-4"
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            type="text"
            autoFocus
            name="message"
            className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? "true" : "false"}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <select
            name="select"
            value={selectedOption}
            onChange={(event) => setSelectedOption(event.target.value)}
            className="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
          >
            <option value="">Selecciona una opción</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ml-4">
        <button className="btn-primary">
          <span className="mr-2">Enviar</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
