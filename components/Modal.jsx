import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	Modal,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
export default function post() {
	const [image, setImage] = useState({});
	const [modalVisible, setModalVisible] = useState(false);
	async function uploadImage(mode = "gallery") {
		let result = {};

		if (mode === "gallery") {
			result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
				aspect: [1, 1],
				quality: 1,
			});
		} else {
			result = await ImagePicker.launchCameraAsync({
				cameraType: ImagePicker.CameraType.front,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});
		}
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	}

	return (
		<SafeAreaView>
			<View className="h-screen bg-white flex items-center justify-center">
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}
				>
					<View className="flex-1 justify-center items-center">
						<View className="bg-white w-4/5 p-5 rounded-lg shadow-lg">
							<Text className="text-base font-semibold mb-4">
								Enter Some Text
							</Text>
							<TextInput
								className="border border-gray-300 rounded p-2 mb-4 w-full"
								placeholder="Type here..."
								// value={inputText}
								// onChangeText={setInputText}
							/>
							<Pressable
								className="bg-blue-500 p-3 rounded"
								onPress={() => setModalVisible(false)}
							>
								<Text className="text-white text-center">Submit</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					className="p-5 border border-black-500 bg-blue-500"
				>
					<Text className="text-white">post</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}



import React, { useState, useRef } from "react";
import {
	View,
	Text,
	Image,
	FlatList,
	Dimensions,
	StyleSheet,
	Pressable,
	TextInput,
	ScrollView,
	TouchableOpacity,
} from "react-native";
const { width } = Dimensions.get("window");
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import PagerView from "react-native-pager-view";
const imagePlaceholder = require("@/assets/tyuss/parrot.png");
import _ from "lodash";

export function Preview({ images = imagePlaceholder, setImage }) {
	let data = [];
	images.map((image) => data.push({ uri: image.uri }));
	console.log(data);
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef(null);

	// Function to handle viewable items change
	const onViewableItemsChanged = ({ viewableItems }) => {
		if (viewableItems.length > 0) {
			setCurrentIndex(viewableItems[0].index);
		}
	};

	// Render each item in the carousel
	const renderItem = ({ item }) => (
		<View className="flex items-center p-5">
			<Image source={{ uri: item.uri }} style={styles.image} />
		</View>
	);

	return (
		<View className="h-screen bg-white">
			<View className="flex-row p-5 items-center gap-3">
				<Pressable onPress={() => setImage("")}>
					<Ionicons name={"close-outline"} size={28} color="gray" />
				</Pressable>
				<Text className="text-base">New Post</Text>
			</View>
			<View>
				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={(item) => item.uri}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
					ref={flatListRef}
				/>
				<View className="flex-row items-center justify-center">
					{data.map((_, index) => (
						<View
                            key={index}
                            className={`${index===currentIndex ? 'bg-blue-500' : 'bg-gray-500'}`}
							style={[
								styles.paginationDot
							]}
						/>
					))}
				</View>
			</View>
			<ScrollView>
				<View>
					<View className="flex-row items-center justify-between gap-5 pl-5 pr-5 pt-2 pb-2">
						<Text className="text-base font-semibold">Add a caption</Text>
						<TextInput
							className="bg-white border border-gray-300 rounded-lg"
							style={{
								height: 80,
								width: "70%",
							}}
						/>
					</View>
					<View className="flex-row items-center justify-between gap-5 pl-5 pr-5 pt-2 pb-2">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"location-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Add City</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</View>
					<View className="flex-row items-center justify-between gap-5 pl-5 pr-5 pt-2 pb-2">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"person-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Tag People</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</View>
					<View className="flex-row items-center justify-between gap-5 pl-5 pr-5 pt-2 pb-2">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"calendar-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Event date and time</Text>
						</View>
					</View>
					<View className='pl-5 pr-5 pt-2'>
						<TouchableOpacity className="p-5 bg-blue-500 flex  rounded-xl items-center justify-center">
							<Text className="text-base font-semibold text-white">Share</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		width: 400,
		height: 400,
		resizeMode: "cover",
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		margin: 3,
	},
});
