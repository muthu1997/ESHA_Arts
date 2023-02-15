import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

const ImageWithResizeMode = ({ source, custom_style }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  return (
    <Image
      source={source}
      style={[
        styles.image,
        {
          resizeMode: dimensions.width == dimensions.height ? 'stretch' : 'cover',
        },
        custom_style
      ]}
      onLoad={(event) => {
        setDimensions({
          width: event.nativeEvent.source.width,
          height: event.nativeEvent.source.height,
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%", 
    height: "100%"
  },
});

export default ImageWithResizeMode;