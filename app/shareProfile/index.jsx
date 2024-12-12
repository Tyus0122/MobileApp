import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	FlatList,
	Platform,
	KeyboardAvoidingView,
	Keyboard,
	TouchableOpacity,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { ShareUserComponent } from "@/components/ShareUserComponent";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { CommentComponent } from "@/components/CommentComponent";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function shareProfiles() {
	const params = useLocalSearchParams();
	const [AccomodationLoading, setAccomodationLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [connects, setConnects] = useState(true);
	const [
		AccomodationsIsLastAccomodationsPage,
		setAccomodationsIsLastAccomodationsPage,
	] = useState(false);
	const [AccomodationsPage, setAccomodationsPage] = useState(0);
	const [AccomodationSearch, setAccomodationSearch] = useState("");
	const [isChecked, setIsChecked] = useState("NA");
	const [selected_ids, setSelected_ids] = useState([]);
	const [shareLoading, setShareLoading] = useState(false);
	async function accomodationsEndHandler() {
		if (!AccomodationsIsLastAccomodationsPage) {
			setAccomodationsPage(AccomodationsPage + 1);
			fetchAccomodationsData(
				AccomodationsPage + 1,
				AccomodationSearch,
				true,
				isChecked
			);
		}
	}
	const debounceCallAccomodationSearch = useCallback(
		debounce((data, iscchecked) => {
			fetchAccomodationsData(0, data, false, iscchecked);
		}, debounce_time),
		[]
	);
	async function fetchAccomodationsData(
		AccomodationsPage = 0,
		AccomodationSearch = "",
		fromend = false,
		available = isChecked
	) {
		if (AccomodationsPage == 0) setAccomodationLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					`v1/user/getUsers?page=${AccomodationsPage}&search=${AccomodationSearch}&available=${available}`,
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
				setAccomodationsIsLastAccomodationsPage(
					response.data.message.isLastPage
				);
				if (AccomodationsPage == 0) setAccomodationLoading(false);
			})
			.catch((err) => {
				if (AccomodationsPage == 0) setAccomodationLoading(false);
			});
	}
	useEffect(() => {
		fetchAccomodationsData();
	}, []);
	const handleToggleSelect = (id) => {
		setSelected_ids((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((selectedId) => selectedId !== id)
				: [...prevSelected, id]
		);
	};
	async function shareProfileHandler() {
		try {
			setShareLoading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const body = {
				type: "shareProfile",
				message: params.profile_id,
				toUserIds: selected_ids,
			};
			const response = await axios.post(
				backend_url + "v1/user/shareProfileService",
				body,
				{
					headers,
				}
			);
			setShareLoading(false);
			setSelected_ids([]);
			router.push({ pathname: "/home" });
		} catch (error) {
			console.error(error);
		}
	}
	function renderItem({ item }) {
		const isSelected = selected_ids.includes(item._id);
		return (
			<TouchableOpacity onPress={() => handleToggleSelect(item._id)}>
				<View
					className={`pl-5 pr-5 pt-2 pb-2 m-1 border ${
						isSelected ? "border-blue-500" : "border-gray-200"
					} rounded-xl flex-row items-center justify-between`}
				>
					<View className="flex-row items-center gap-8">
						<Image
							source={item.pic ? { uri: item.pic.url } : imagePlaceholder}
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: isSelected ? "blue" : "black",
								borderWidth: 1.5,
							}}
						/>
						<View>
							<Text className="text-xl">{item.username}</Text>
							<Text className="text-gray-500">{item.city}</Text>
						</View>
					</View>
					<Ionicons
						name={isSelected ? "checkmark-circle" : "ellipse-outline"}
						size={24}
						color={isSelected ? "blue" : "gray"}
					/>
				</View>
			</TouchableOpacity>
		);
	}
	return (
		<GestureHandlerRootView>
			<SafeAreaView>
				<View className="bg-white items-center">
					<View className="flex-row p-5 items-center gap-3">
						<Pressable onPress={() => router.back()}>
							<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
						</Pressable>
						<View className="flex-row items-center bg-[#ECE6F0] rounded-full w-[90%] h-[50px] p-3">
							<Ionicons
								name="search-outline"
								size={20}
								color="gray"
								style={{ position: "absolute", left: 15 }}
							/>
							<TextInput
								style={{
									// flex: 1,
									height: "100%",
									paddingLeft: 40,
								}}
								onChangeText={(data) => {
									setAccomodationSearch(data);
									setAccomodationsPage(0);
									debounceCallAccomodationSearch(data, isChecked);
								}}
								placeholder="AccomodationSearch by ID or University or Location"
							/>
						</View>
					</View>
				</View>
				{/* <View className="bg-gray-300 h-[2px] "></View> */}
			</SafeAreaView>

			{AccomodationLoading ? (
				<View className="h-screen bg-white flex-1 items-center justify-center ">
					<ActivityIndicator size="large" color="blue" />
				</View>
			) : (
				<FlatList
					className="bg-white"
					data={users}
					renderItem={renderItem}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", padding: 30 }}>
							No Data: Please change filters
						</Text>
					}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
					contentContainerStyle={{ padding: 10 }}
					onEndReached={accomodationsEndHandler}
					ListFooterComponent={() =>
						AccomodationsIsLastAccomodationsPage ? (
							<Text style={{ textAlign: "center", padding: 30 }}>
								You have reached the end of AccomodationsPage
							</Text>
						) : (
							<ActivityIndicator size="large" color="gray" />
						)
					}
				/>
			)}
			{selected_ids.length > 0 && (
				<Pressable
					className="border p-4 flex-row items-center justify-center bg-blue-500 rounded-full ml-5 mr-5 mb-5"
					onPress={shareProfileHandler}
				>
					{shareLoading ? (
						<ActivityIndicator size="large" color="white" />
					) : (
						<Text className="text-4xl text-white">Send</Text>
					)}
				</Pressable>
			)}
		</GestureHandlerRootView>
	);
}
