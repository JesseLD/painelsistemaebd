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
  return isActive ? (
    <div className="flex w-full max-w-[220px] cursor-pointer items-center gap-4 rounded-l-lg bg-neutral-200 p-4 transition hover:-translate-y-2">
      <div>
        <Icon {...iconProps} size={24} />
      </div>
      <div>{text}</div>
    </div>
  ) : (
    <div className="flex w-full max-w-[220px] cursor-pointer items-center gap-4 rounded-l-lg bg-white p-4 transition hover:-translate-y-2">
      <div>
        <Icon {...iconProps} size={24} />
      </div>
      <div>{text}</div>
    </div>
  );
};
