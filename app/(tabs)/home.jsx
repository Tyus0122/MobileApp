import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	BackHandler,
	StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
export default function Home() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	//
	let [image, setImage] = useState("");
	const [selected, setSelected] = useState([]);
	const [isLastPage, setIsLastPage] = useState(false);
	const [users, setUsers] = useState([]);
	const [usersIds, setUserIds] = useState([]);
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState("");
	const [loggedInUser, setLoggedInUser] = useState({});
	//
	function handleBackPress() {
		BackHandler.exitApp();
		return true;
	}
	const [refresh, setRefresh] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	async function refreshHandler() {
		setRefresh(true);
		await fetchData();
		setRefresh(false);
	}
	useFocusEffect(
		React.useCallback(() => {
			BackHandler.addEventListener("hardwareBackPress", handleBackPress);
			return () => {
				BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
			};
		})
	);
	async function fetchData() {
		setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getposts", { headers })
			.then((response) => {
				setPosts(response.data.message.posts);
				setLoggedInUser(response.data.message.logged_in_user);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	useEffect(() => {
		fetchData();
	}, []);
	const sheetRef = useRef(null);
	const snapPoints = ["80%"];
	const handleSnapPress = useCallback((index) => {
		if (index === -1) setModalVisible(false);
		sheetRef.current?.snapToIndex(index);
	}, []);
	async function endHandler() {
		// if (!isLastPage) {
		// 	setPage(page + 1);
		// 	fetchData(page + 1, search, true);
		// }
		console.log("hello world");
	}
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
							<Text className="text-xl font-semibold">{item.username}</Text>
							<Text className="text-lg text-gray-500">{item.city}</Text>
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
	return (
		<GestureHandlerRootView>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<View className="bg-white h-full">
					<SafeAreaView>
						<ScrollView
							keyboardShouldPersistTaps={"always"}
							keyboardDismissMode="on-drag"
							refreshControl={
								<RefreshControl
									refreshing={refresh}
									onRefresh={() => refreshHandler()}
								/>
							}
						>
							<View>
								<NavBarComponent />
							</View>
							{loading ? (
								<View className="h-screen flex items-center justify-center">
									<ActivityIndicator size="large" color="gray" />
								</View>
							) : (
								posts?.map((post, index) => (
									<PostComponent
										key={index}
										post={post}
										modalVisible={modalVisible}
										setModalVisible={setModalVisible}
										handleSnapPress={handleSnapPress}
									/>
								))
							)}
							<View style={{ height: 50 }}></View>
						</ScrollView>
					</SafeAreaView>
					{modalVisible && (
						<BottomSheet
							ref={sheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose
							className="bg-white h-full"
							onClose={() => {
								setModalVisible(false);
							}}
						>
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
							<View className=" m-3 flex-row justify-between items-center bg-[#FFFFFF] h-[50px] border rounded-2xl">
								<View className="flex-row items-center ml-2 w-[73%]">
									<Image
										source={loggedInUser.pic ? {uri:loggedInUsercd.pic.url} :imagePlaceholder}
										style={{
											width: 30,
											height: 30,
											borderRadius: 50,
											borderColor: "black",
											borderWidth: 1.5,
										}}
									/>
									<TextInput
										className="h-[45px] pl-5 w-full"
										placeholder="Leave your comment here"
									/>
								</View>
								<Pressable className="pl-5 pr-5 pt-1 pb-1 mr-5 rounded-full bg-[#24A0ED]">
									<Ionicons name="arrow-up-outline" size={24} color="white" />
								</Pressable>
							</View>
						</BottomSheet>
					)}
				</View>
			</KeyboardAvoidingView>
		</GestureHandlerRootView>
	);
}
