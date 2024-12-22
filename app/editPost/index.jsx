import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EditPreview } from "@/components/EditPreview";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce, isEqual } from "lodash";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function editPost() {
	// const params = useLocalSearchParams();
	const params = { post_id: "66e3d867ffe950ee7ab0db7e" };
	let [image, setImage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
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
	const [post, setPost] = useState({});
	const updatePost = (newData) => {
		setPost((prevPost) => ({
			...prevPost,
			...newData, // Merge new data with the existing state
		}));
	};
	async function fetchPostData() {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + `v1/user/getEditPost?post_id=${params.post_id}`, {
				headers,
			})
			.then((response) => {
				setPost(response.data.post[0]);
				setUserIds(response.data.post[0].peopleTagged);
			})
			.catch((err) => {});
	}
	useEffect(() => {
		fetchPostData();
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
					setUserIds((prevSelected) => {
						if (!prevSelected.includes(item._id)) {
							return [...prevSelected, item._id];
						} else {
							return prevSelected.filter((_id) => _id !== item._id);
						}
					});
				}}
			>
				<View className="flex-row items-center justify-between border border-gray-500 ml-4 mr-4 mb-1 mt-1 rounded-xl p-2">
					<View className="flex-row items-center gap-5">
						{/* Profile Image */}
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
						{/* User Info */}
						<View>
							<Text className="text-xl font-semibold">{item.username}</Text>
							<Text className="text-lg text-gray-500">{item.city}</Text>
						</View>
					</View>

					{/* Custom Checkbox */}
					<View
						style={{
							width: 24,
							height: 24,
							borderWidth: 2,
							borderColor: "gray",
							borderRadius: 4,
							justifyContent: "center",
							alignItems: "center",
							marginRight: 15,
						}}
					>
						{usersIds.includes(item._id) && (
							<View
								style={{
									width: 14,
									height: 14,
									backgroundColor: "lightblue",
									borderRadius: 2,
								}}
							/>
						)}
					</View>
				</View>
			</Pressable>
		),
		[usersIds]
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
			<View className="bg-white h-full">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
				>
					<SafeAreaView>
						<ScrollView
							keyboardShouldPersistTaps={"always"}
							keyboardDismissMode="on-drag"
						>
							<View>
								<View>
									{!isEqual(post, {}) && (
										<View>
											<EditPreview
												setImage={setImage}
												setModalVisible={setModalVisible}
												handleSnapPress={handleSnapPress}
												usersIds={usersIds}
												post={post}
												updatePost={updatePost}
											/>
										</View>
									)}
								</View>
							</View>
						</ScrollView>
					</SafeAreaView>
					{modalVisible && (
						<BottomSheet
							ref={sheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose
							className="bg-white"
						>
							<View className="p-3 flex-row flex-wrap"></View>
							<View className="flex-row items-center gap-5 pl-5">
								<Ionicons
									name={"close-outline"}
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
										style={{
											flex: 1,
											height: "100%",
											paddingLeft: 40,
										}}
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
								keyboardShouldPersistTaps="always"
								keyboardDismissMode="on-drag"
								contentContainerStyle={{ padding: 10 }}
							/>
						</BottomSheet>
					)}
				</KeyboardAvoidingView>
			</View>
		</GestureHandlerRootView>
	);
}
