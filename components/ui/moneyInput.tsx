import { TextInput } from "flowbite-react";
import React, { useState, ChangeEvent } from "react";

interface MoneyInputProps {
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ value = "", onChange,id,className,name }) => {
  const [inputValue, setInputValue] = useState(value);

  const formatMoney = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");

    // Adiciona uma vírgula para separar os centavos
    const formattedValue = (parseFloat(cleanValue) / 100).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

    return formattedValue;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = formatMoney(inputValue);

    setInputValue(formattedValue);
    if (onChange) {
      onChange(formattedValue);
    }
  };

  return (
    <TextInput
    id={id}
    className={className}
    name={name || id}
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="1.000,00"
    />
  );
};

export default MoneyInput;
