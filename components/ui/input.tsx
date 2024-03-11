type Props = {
  text: string;
  type: string;
  name: string;
  id?: string;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
};

export const Input = ({ text, type, name, id, onChange,onClick }: Props) => {
  return (
    <div className="group relative z-0 mb-6 w-full">
      <input
        type={type}
        name={name}
        id={id == undefined ? name : id}
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-orange-400"
        placeholder=""
        required
        onChange={onChange}
      />
      <label
        htmlFor={name}
        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-500 dark:text-gray-400 peer-focus:dark:text-orange-400 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
      >
        {text}
      </label>
    </div>
  );
};
