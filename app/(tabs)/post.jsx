import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	Modal,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	StyleSheet,
	TouchableWithoutFeedback,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Preview } from "@/components/Preview";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function post() {
	let [image, setImage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [selected, setSelected] = useState([]);
	const [isLastPage, setIsLastPage] = useState(false);
	const [users, setUsers] = useState([]);
	const [usersIds, setUserIds] = useState([]);
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState("");
	const debounceCallSearch = useCallback(
		debounce((data) => {
			fetchData(0, data, false);
		}, debounce_time),
		[]
	);
	async function endHandler() {
		if (!isLastPage) {
			setPage(page + 1);
			fetchData(page + 1, search, true);
		}
	}
	async function fetchData(
		page = 0,
		search = "",
		fromend = false,
		available = "NA"
	) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					`v1/user/getUsers?page=${page}&search=${search}&available=${available}`,
				{
					headers,
				}
			)
			.then((response) => {
				if (fromend) {
					setUsers([...users, ...response.data.message.users]);
				} else {
					setUsers(response.data.message.users);
				}
				setIsLastPage(response.data.message.isLastPage);
			})
			.catch((err) => {});
	}
	useEffect(() => {
		fetchData();
	}, []);
	const sheetRef = useRef(null);
	const snapPoints = ["50%", "75%"];
	const handleSnapPress = useCallback((index) => {
		if (index === -1) setModalVisible(false);
		sheetRef.current?.snapToIndex(index);
	}, []);
	const renderItem = useCallback(
		({ item }) => (
			<Pressable
				onPress={() => {
					setSelected((prevSelected) => {
						if (!prevSelected.includes(item.username)) {
							return [...prevSelected, item.username];
						} else {
							return prevSelected.filter(
								(username) => username !== item.username
							);
						}
					});
					setUserIds((prevSelected) => {
						if (!prevSelected.includes(item._id)) {
							return [...prevSelected, item._id];
						} else {
							return prevSelected.filter((_id) => _id !== item._id);
						}
					});
				}}
			>
				<View className="flex-row items-center justify-between border border-gray-500 ml-4 mr-4 mb-1 mt-1 rounded-xl p-2 ">
					<View className="flex-row items-center gap-5">
						<Image
							source={imagePlaceholder}
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: "black",
								borderWidth: 1.5,
							}}
						/>
						<View>
							<Text className="text-base font-semibold">{item.username}</Text>
							<Text className="text-base text-gray-500">{item.city}</Text>
						</View>
					</View>

					{/* Show checkmark only if the item is selected */}
					{selected.includes(item.username) && (
						<View className="mr-5">
							<Ionicons name={"checkmark-circle"} size={28} color="lightblue" />
						</View>
					)}
				</View>
			</Pressable>
		),
		[selected] // Add 'selected' to dependency array to re-render correctly
	);

	async function uploadImage(mode = "gallery", selection = "single") {
		let result = {};

		if (mode === "gallery" && selection === "single") {
			result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],

				quality: 1,
			});
		} else if (mode === "gallery" && selection === "multiple") {
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
			setImage(result.assets);
		}
	}

	return (
		<GestureHandlerRootView>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps={"always"}
				keyboardDismissMode="on-drag"
			>
				<SafeAreaView className="bg-white">
					{image === "" ? (
						<View className="bg-white h-screen">
							<View className="flex-row p-5 items-center gap-3">
								<Pressable onPress={() => router.back()}>
									<Ionicons name="arrow-back-outline" size={28} color="gray" />
								</Pressable>
								<Text className="text-base">New Post</Text>
							</View>
							<View className="flex items-center justify-center mt-40">
								<View className="border border-gray-500 p-5 rounded-lg items-center w-[90%] opacity-30">
									<View className="flex-row flex-wrap justify-center">
										<TouchableOpacity onPress={() => uploadImage("camera")}>
											<View className="flex items-center justify-center m-2">
												<Ionicons name="camera-outline" size={90} />
												<Text className="text-base font-semibold">Camera</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => uploadImage("gallery", "single")}
										>
											<View className="flex items-center justify-center m-2">
												<Ionicons name="image-outline" size={90} />
												<Text className="text-base font-semibold">Single</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => uploadImage("gallery", "multiple")}
										>
											<View className="flex items-center justify-center m-2">
												<Ionicons name="images-outline" size={90} />
												<Text className="text-base font-semibold">
													Multiple
												</Text>
											</View>
										</TouchableOpacity>
									</View>
									<Text className="text-base font-semibold text-center mt-5 mb-4">
										Click on the icon to add a new post
									</Text>
								</View>
							</View>
						</View>
					) : (
						<Preview
							image={image}
							setImage={setImage}
							setModalVisible={setModalVisible}
							handleSnapPress={handleSnapPress}
						/>
					)}

					{modalVisible && (
						<BottomSheet
							ref={sheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose
						>
							<View className="p-3 flex-row flex-wrap">
								{selected.map((value, key) => (
									<Pressable
										key={key}
										className="pl-2 pr-2 pt-1 pb-1 m-1 bg-blue-500 rounded-xl flex-row gap-1 items-center justify-center"
										onPress={() =>
											setSelected((prev) =>
												prev.filter((item) => item !== value)
											)
										}
									>
										<Text className="text-white text-base">{value}</Text>
										<Ionicons name="close-outline" size={20} color="white" />
									</Pressable>
								))}
							</View>
							<View className="flex-row items-center gap-5 pl-5">
								<Ionicons
									name="close-outline"
									size={26}
									color="gray"
									onPress={() => {
										setModalVisible(false);
										handleSnapPress(-1);
									}}
								/>
								<View className="flex-row items-center justify-center bg-[#ECE6F0] rounded-lg w-[80%] p-3">
									<Ionicons
										name="search-outline"
										size={20}
										color="gray"
										style={{ position: "absolute", left: 15 }}
									/>
									<TextInput
										style={{ flex: 1, height: "100%", paddingLeft: 40 }}
										onChangeText={(data) => {
											setSearch(data);
											setPage(0);
											debounceCallSearch(data);
										}}
										placeholder="Search by ID or University or Location"
									/>
								</View>
							</View>
							<BottomSheetFlatList
								data={users}
								keyExtractor={(i) => i._id}
								renderItem={renderItem}
								onEndReached={endHandler}
								ListFooterComponent={() =>
									isLastPage ? (
										<Text style={{ textAlign: "center", padding: 30 }}>
											You have reached the end of Page
										</Text>
									) : (
										<ActivityIndicator size="large" color="gray" />
									)
								}
								ListEmptyComponent={
									<Text style={{ textAlign: "center", padding: 30 }}>
										No Data: Please change filters
									</Text>
								}
								keyboardShouldPersistTaps="handled"
								keyboardDismissMode="on-drag"
								contentContainerStyle={{ padding: 10 }}
							/>
						</BottomSheet>
					)}
				</SafeAreaView>
			</KeyboardAwareScrollView>
		</GestureHandlerRootView>
	);
}
