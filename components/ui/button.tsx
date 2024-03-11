type Props = {
  text: string;
  type?: "submit" | "button" | "reset" | undefined;
  id?: string;
  revertColor?: boolean;
};

export const Button = ({ text, type, id, revertColor }: Props) => {
  return revertColor ? (
    <button
      type={type || "submit"}
      id={id || Math.random().toString(36).substring(7)}
      className="w-full rounded-lg bg-transparent px-5 py-2.5 text-center text-sm font-medium text-orange-500 border-2  border-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 bg-white hover:bg-orange-500 focus:ring-orange-800 hover:text-white transition "
    >
      {text}
    </button>
  ) : (
    <button
      type={type || "submit"}
      id={id || Math.random().toString(36).substring(7)}
      className="w-full rounded-lg 
      bg-orange-500 px-5 py-2.5 text-center text-sm font-medium 
      text-white hover:bg-orange-600 
      focus:outline-none focus:ring-4 
      focus:ring-orange-300"
    >
      {text}
    </button>
  );
};
