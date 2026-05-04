import React from 'react';
import { Image } from 'react-native';

export default function BeninLogoSVG({ width = 120, height = 120 }) {
  return (
    <Image
      source={require('../../../assets/icon.png')}
      style={{ width, height, resizeMode: 'contain' }}
    />
  );
}
