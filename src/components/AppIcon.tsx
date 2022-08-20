import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp; // Only font awesome solid icons are supported at the moment
  className?: string;
  color?: string;
  title?: string;
  size?: SizeProp;
  onClick?: () => void;
  mode?: 'button' | 'icon'
}

export default function AppIcon({ icon, className, color, title, size, onClick, mode }: Props) {
  return <FontAwesomeIcon size={size}
    className={className}
    icon={icon}
    color={color}
    title={title}
    style={{ cursor: (mode === 'button' ? 'pointer' : 'auto') }}
    onClick={onClick} />
}
