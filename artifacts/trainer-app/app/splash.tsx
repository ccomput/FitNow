import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const logoY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace("/filters");
      }, 1400);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          { opacity, transform: [{ scale }, { translateY: logoY }] },
        ]}
      >
        <View style={styles.iconBg}>
          <Feather name="zap" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>FitNow</Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Personal Trainer Sob Demanda
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomText,
          { opacity: taglineOpacity, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <Text style={styles.bottomLabel}>O seu treino começa aqui</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#FF5A1F",
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FF5A1F",
    opacity: 0.06,
    bottom: 50,
    left: -80,
  },
  bgCircle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    opacity: 0.03,
    top: height * 0.4,
    right: -50,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: "#FF5A1F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5A1F",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
    fontFamily: "Inter_700Bold",
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  bottomText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
