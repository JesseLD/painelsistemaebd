import { IconType } from "react-icons";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
type Props = {
  icon: IconType;
  text: string;
  iconProps?: IconProps;
  isActive?: Boolean;
};

interface IconProps {
  size?: string | number;
  color?: string;
}

export const ButtonWithIcon: React.FC<Props> = ({
  icon: Icon,
  text,
  iconProps,
  isActive,
}) => {
  return (
    <div
      className={`-rounded-sm after: flex w-full max-w-[80px] md:max-w-[220px] cursor-pointer items-center gap-4 rounded-l-lg ${
        isActive ? "bg-gray-200" : "bg-white"
      } p-4 transition hover:-translate-y-2`}
    >
      <div>
        <Icon {...iconProps} size={24} />
      </div>
      <div className="hidden md:block">{text}</div>
    </div>
  );
};
