export { default as IconRobot } from './robot.svg?react';
export { default as IconUser } from './user.svg?react';
export { default as IconSend } from './send.svg?react';
export { default as IconStop } from './stop.svg?react';
export { default as IconMenu } from './menu.svg?react';
export { default as IconPlus } from './plus.svg?react';
export { default as IconSidebar } from './sidebar.svg?react';
export { default as IconSettings } from './settings.svg?react';
export { default as IconClose } from './close.svg?react';
export { default as IconSearch } from './search.svg?react';
export { default as IconChat } from './chat.svg?react';
export { default as IconEdit } from './edit.svg?react';
export { default as IconTrash } from './trash.svg?react';
export { default as IconCopy } from './copy.svg?react';
export { default as IconCheck } from './check.svg?react';
export { default as IconArrowRight } from './arrow-right.svg?react';
export { default as IconAlert } from './alert.svg?react';
export { default as IconLogo } from './logo.svg?react';
export { default as IconLogoLarge } from './logo-large.svg?react';

export const IconImage = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
