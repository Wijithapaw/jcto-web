import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp; // Only font awesome solid icons are supported at the moment
  className?: string;
  color?: string;
  title?: string;
}

export default function SapIcon({icon, className, color, title}: Props) {
  return <FontAwesomeIcon 
    className={className} 
    icon={icon} 
    color={color}
    title={title} />
}
