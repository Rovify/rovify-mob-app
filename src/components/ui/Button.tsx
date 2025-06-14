import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={\`\${variant === 'primary' ? 'bg-primary-500' : 'bg-gray-200'} rounded-lg px-4 py-3 \${disabled ? 'opacity-50' : ''}\`}
      style={style}
    >
      <Text 
        className={\`\${variant === 'primary' ? 'text-white' : 'text-gray-900'} font-semibold text-center\`}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
