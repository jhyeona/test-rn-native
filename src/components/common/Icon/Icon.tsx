import React from 'react';
import {SvgProps} from 'react-native-svg';

import * as Icons from '#assets/svg';

type IconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  stroke?: string;
};
const Icon = ({
  name,
  width: _width,
  height: _height,
  size,
  color,
  stroke,
  ...props
}: IconProps) => {
  const SvgIcon = Icons[name];

  const width = _width ?? size;
  const height = _height ?? size;
  const sizeProps = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  return (
    <SvgIcon
      {...props}
      {...sizeProps}
      {...(color ? {fill: color} : {})}
      {...(stroke ? {stroke: stroke} : {})}
    />
  );
};

export default Icon;
