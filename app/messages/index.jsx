import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import { Link, router } from "expo-router";
import { UserMessageComponent } from "@/components/UserMessageComponent";
import { backend_url, debounce_time } from "@/constants/constants";

export default function Messages() {
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [isLastPage, setIsLastPage] = useState(false);
	const [conversations, setConversations] = useState([]);

	async function fetchData(data, page = 0) {
		if (page == 0) setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					"v1/user/getConversations?search=" +
					data +
					"&page=" +
					page,
				{
					headers,
				}
			)
			.then((response) => {
				setConversations([...conversations, ...response.data.conversations]);
				setIsLastPage(response.data.isLastPage);
				if (page == 0) setLoading(false);
			})
			.catch((err) => {
				if (page == 0) setLoading(false);
			});
	}
	useEffect(() => {
		fetchData("");
	}, []);
	const debounceCallSearch = useCallback(
		debounce((data) => {
			fetchData(data);
		}, debounce_time),
		[]
	);
	async function endHandler() {
		if (!isLastPage) {
			setPage(page + 1);
			fetchData(search, page + 1);
		}
	}
	return (
		<SafeAreaView>
			<View className='p-5'>
				<View className="flex-row items-center gap-3">
					<Pressable onPress={() => router.back()}>
						<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
					</Pressable>
					<View className="flex-row items-center bg-[#ECE6F0] rounded-xl w-[90%] h-[40px] p-3">
						<Ionicons
							name="search-outline"
							size={24}
							color="black"
							style={{ position: "absolute", left: 15 }}
						/>
						<TextInput
							style={{
								flex: 1,
								height: "100%",
								paddingLeft: 50,
							}}
							value={search}
							onChangeText={(data) => {
								setSearch(data);
								setPage(0);
								debounceCallSearch(data);
							}}
							placeholder="Search ..."
						/>
					</View>
				</View>
				<Text className='text-4xl mt-5 ml-3'>
					Messages
				</Text>
				{loading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : (
					<FlatList
						data={conversations}
						keyExtractor={(item) => item._id}
						renderItem={({ item, index }) => (
							<Pressable
								key={index}
								onPress={() => {
									router.push({
										pathname: "/chat",
										params: {
											conversation_id: item.conversation_id,
											otherUser_id: item.otherUser_id,
										},
									});
								}}
							>
								<UserMessageComponent user={item} />
							</Pressable>
						)}
						ListEmptyComponent={() => (
							<View style={{ padding: 20, alignItems: "center" }}>
								<Text>No messages found.</Text>
							</View>
						)}
						onEndReached={endHandler}
						keyboardShouldPersistTaps="always"
						keyboardDismissMode="on-drag"
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
			</View>
		</SafeAreaView>
	);
}
