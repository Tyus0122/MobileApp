import React, { useRef, useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	Dimensions,
	Pressable,
	StyleSheet,
	Animated,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Link, router,useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
const { width } = Dimensions.get("window");
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function PhotosComponent({ images, _id }) {
	const segments = useSegments();
	const pathname = (segments.join('/'))
    const scrollViewRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const listener = scrollX.addListener(({ value }) => {
			setCurrentIndex(Math.round(value / width));
		});

		return () => {
			scrollX.removeListener(listener);
		};
	}, []);
	const renderImages = () => {
		return images.map((image, index) => (
			<Pressable className="flex items-center pl-5 pr-5 mb-2 mt-2" key={index} onPress={() => {
				if (pathname != "singlepost" && pathname !='(tabs)/post') {
					router.push({
						pathname: "/singlepost",
                        params: {
                            _id: _id,
                        },
					});
				}
			}}>
				<Image source={{ uri: image }} style={styles.image} />
			</Pressable>
		));
    };
    
	return (
		<View>
			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				{renderImages()}
			</ScrollView>
			<View className="flex-row items-center justify-center">
				{images.map((_, index) => {
					const opacity = scrollX.interpolate({
						inputRange: [
							(index - 1) * width,
							index * width,
							(index + 1) * width,
						],
						outputRange: [0.3, 1, 0.3],
						extrapolate: "clamp",
					});
					return (
						<Animated.View
							key={index}
							className="bg-blue-500"
							style={[styles.indicator, { opacity }]}
						/>
					);
				})}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	image: {
		width: 400,
		height: 400,
		resizeMode: "cover",
	},
	indicator: {
		height: 10,
		width: 10,
		borderRadius: 5,
		margin: 5,
	},
});