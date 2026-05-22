import * as Icons from 'lucide-react';

export const getIcon = (name: string) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent || Icons.HelpCircle;
};

export const ICON_NAMES = Object.keys(Icons).filter(key => typeof (Icons as any)[key] === 'function');
