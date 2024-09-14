import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { UserComponent } from "@/components/UserComponent";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url,debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

export default function Accomodation() {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [connects, setConnects] = useState(true);
	const [isLastPage, setIsLastPage] = useState(false);
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState("");
	const [isChecked, setIsChecked] = useState(true);

	async function endHandler() {
		if (!isLastPage) {
			setPage(page + 1);
			fetchData(page + 1, search, true, isChecked);
		}
	}
	const debounceCallSearch = useCallback(
		debounce((data) => {
			fetchData(0, data, false, isChecked);
		}, debounce_time),
		[]
	);
	const debounceCallAvailable = useCallback(
		debounce((data) => {
			fetchData(0, search, false, data);
		}, debounce_time),
		[]
	);
	async function fetchData(
		page = 0,
		search = "",
		fromend = false,
		available = isChecked
	) {
		if (page == 0) setLoading(true);
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
				if (page == 0) setLoading(false);
			})
			.catch((err) => {
				if (page == 0) setLoading(false);
			});
	}
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
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
				{connects ? (
					<View className="flex-row justify-between w-[80%]">
						<View className="p-3">
							<TouchableOpacity onPress={() => setConnects(true)}>
								<Text className="text-xl font-semibold">Accomodation</Text>
								<View className="bg-gray-500 h-[2px] "></View>
							</TouchableOpacity>
						</View>
						<View className="p-3">
							<TouchableOpacity onPress={() => setConnects(false)}>
								<Text className="text-xl">Events</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View className="flex-row justify-between w-[80%]">
						<View className="p-3">
							<TouchableOpacity onPress={() => setConnects(true)}>
								<Text className="text-xl">Accomodation</Text>
							</TouchableOpacity>
						</View>
						<View className="p-3">
							<TouchableOpacity onPress={() => setConnects(false)}>
								<Text className="text-xl font-semibold">Events</Text>
								<View className="bg-gray-500 h-[2px] "></View>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
			<View className="bg-gray-300 h-[2px] "></View>
			<View className="bg-white p-5">
				<View
					className="pr-5"
					style={{
						alignItems: "flex-end",
					}}
				>
					<View className="flex-row items-center justify-center gap-2">
						<Pressable
							className="flex-row items-center justify-center gap-2"
							onPress={() => {
								setPage(0);
								debounceCallAvailable(!isChecked);
								setIsChecked(!isChecked);
							}}
						>
							<Ionicons
								name={isChecked ? "checkbox-outline" : "square-outline"}
								size={24}
								color="gray"
							/>
							<Text className="text-xl text-gray-500">Available</Text>
						</Pressable>
					</View>
				</View>
			</View>
			{loading ? (
				<View className="h-screen bg-white flex-1 items-center justify-center ">
					<ActivityIndicator size="large" color="blue" />
				</View>
			) : (
				<FlatList
					className="bg-white"
					data={users}
					renderItem={({ item, index }) => (
						<UserComponent user={item} key={index} />
					)}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", padding: 30 }}>
							No Data: Please change filters
						</Text>
					}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
					contentContainerStyle={{ padding: 10 }}
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
				/>
			)}
		</SafeAreaView>
	);
}
