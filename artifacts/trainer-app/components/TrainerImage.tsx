import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

const TRAINER_IMAGES = {
  trainer1: require("@/assets/images/trainer1.png"),
  trainer2: require("@/assets/images/trainer2.png"),
  trainer3: require("@/assets/images/trainer3.png"),
};

interface TrainerImageProps {
  imageKey: "trainer1" | "trainer2" | "trainer3";
  style?: StyleProp<ImageStyle>;
}

export function TrainerImage({ imageKey, style }: TrainerImageProps) {
  return <Image source={TRAINER_IMAGES[imageKey]} style={style} />;
}
