import React from "react";
import { Image, StyleSheet } from "react-native";

type AvatarProps = {
  seed: string;
  size?: number;
};

const Avatar: React.FC<AvatarProps> = ({ seed, size = 100 }) => {
  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/png?seed=${seed}&size=${size}`;

  return (
    <Image
      source={{ uri: avatarUrl }}
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#f0f0f0",
  },
});

export default Avatar;
