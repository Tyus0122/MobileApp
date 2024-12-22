import React, { useEffect } from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";
import { router } from "expo-router";

export function SplashScreen() {
	const scale = new Animated.Value(0.5); // Start with 50% zoom
	const rotate = new Animated.Value(0); // Initial rotation value

	useEffect(() => {
		// Animate the zoom and rotation
		Animated.timing(scale, {
			toValue: 1, // Zoom to 100%
			duration: 3000, // Duration of zoom
			useNativeDriver: true,
		}).start();

		Animated.timing(rotate, {
			toValue: 1,
			duration: 3000,
			useNativeDriver: true,
		}).start();

		setTimeout(() => {
			router.push("/main"); // Directly push to the main route
		}, 4000);
	}, [scale, rotate]);

	const rotateInterpolation = rotate.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});
	return (
		<Animated.View
			className="h-screen flex items-center justify-center"
			style={{
				transform: [{ rotate: rotateInterpolation }],
			}}
		>
			<Animated.Image
				source={require("@/assets/tyuss/loginLogo.png")}
				style={[
					styles.image,
					{
						transform: [{ scale }],
					},
				]}
			/>
			<Animated.View>
				<Text style={styles.text} className="text-black text-4xl">
					TYUS
				</Text>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	image: {
		width: 300,
		height: 300, // Adjust based on your image size
	},
});
