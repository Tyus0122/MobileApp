import {
	View,
	Text,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OptionsIconComponent } from "@/components/OptionsIconComponent";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
const EVENTSPlaceholder = require("@/assets/tyuss/events.png");

export default function userProfile() {
	const params = useLocalSearchParams();
	const [user, setUser] = useState({});
	const [conn, setConn] = useState("");
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);
	const [page, setPage] = useState(false);
	const [buttonloading, setbuttonloading] = useState(false);

	async function refreshHandler() {
		setRefresh(true);
		await fetchData();
		setRefresh(false);
	}
	async function fetchData() {
		setLoading(true);
		setPosts([]);
		setIsLastPage(false);
		setPage(0);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getUserProfile?user_id=" + params._id, {
				headers,
			})
			.then((response) => {
				setUser(response.data.user);
				setConn(response.data.user.connectionslength);
				setPosts(response.data.user.posts);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}
	async function fetchPosts(page) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getUserPosts?page=" + page, {
				headers,
			})
			.then((response) => {
				setPosts([...posts, ...response.data.posts.posts]);
				setIsLastPage(response.data.posts.isLastPage);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	useEffect(() => {
		fetchData();
	}, []);

	const renderPost = ({ item }) => (
		<Pressable
			className="w-[32%] m-1"
			onPress={() => {
				router.push({
					pathname: "/singlepost",
					params: {
						_id: item._id,
					},
				});
			}}
		>
			<Image
				source={{ uri: item.files[0].url }}
				style={{
					width: "100%",
					height: 150,
					resizeMode: "cover",
				}}
			/>
		</Pressable>
	);
	async function endHandler() {
		if (!isLastPage) {
			fetchPosts(page + 1);
			setPage(page + 1);
		}
	}
	async function messageHandler() {
		try {
			setbuttonloading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				otherUser_id: user._id,
			};
			const response = await axios.post(
				backend_url + "v1/user/postProfileMessage",
				data,
				{
					headers,
				}
			);
			setbuttonloading(false)
			router.push({
				pathname: "/chat",
				params: {
					conversation_id: response.data.posts.conversation_id,
					otherUser_id: user._id
				},
			});
		} catch (error) {
			setbuttonloading(false)
			console.error(error);
		}
	}
	return (
		<SafeAreaView>
			<View className="bg-white h-screen">
				{loading ? (
					<View className="h-screen bg-white flex items-center justify-center">
						<ActivityIndicator size="large" color="gray" />
					</View>
				) : (
					<FlatList
						className="bg-white"
						data={posts}
						numColumns={3}
						keyExtractor={(item, index) => index.toString()}
						ListHeaderComponent={
							<View className="h-[550px] bg-white">
								<View className="items-end">
									<Link
										href={"/profileactions"}
										className="pt-5 pr-5 mt-5 mr-5"
									>
										<OptionsIconComponent />
									</Link>
								</View>
								<View className="items-center">
									<View className="z-10 items-center bg-white rounded-full p-2">
										<Image
											source={
												user.pic ? { uri: user.pic.url } : imagePlaceholder
											}
											style={{
												width: 100,
												height: 100,
												borderRadius: 50,
												borderColor: "black",
												borderWidth: 1,
											}}
										/>
									</View>
									<View className="absolute top-[50%] w-[90%] bg-[#D9D9D97D] rounded-t-[50px]">
										<View className="flex items-center">
											<Text className="mt-[70px] text-2xl font-semibold text-gray-500">
												{user.fullname}
											</Text>
											<Text className="mt-1 text-xl text-gray-500">
												{user.bio}
											</Text>
											<View className="flex-row items-center gap-3">
												<Text className="mt-5 text-4xl">{conn}</Text>
												<Text className="mt-5 text-2xl">Connections</Text>
											</View>
										</View>
										<View className="mt-5 items-center gap-3">
											<View className="flex-row items-center justify-between w-[80%]">
												<View className="gap-4">
													<Text className="text-3xl font-semibold">City</Text>
													<Text className="text-3xl font-semibold">
														Accomodation
													</Text>
													<Text className="text-3xl font-semibold">
														University
													</Text>
												</View>
												<View className="gap-3">
													<Text className="text-3xl text-gray-500 font-light">
														{user.city}
													</Text>
													<View className="h-[30px] w-[60px] bg-green-500 mr-5 rounded-full items-end">
														<View className="bg-white h-[30px] w-[35px] rounded-full"></View>
													</View>
													<Text className="text-3xl text-gray-500 font-light">
														{user.university}
													</Text>
												</View>
											</View>
											<View className="w-[80%] mt-3 mb-5 flex-row items-center justify-between">
												<TouchableOpacity className=" bg-[#24A0ED] rounded-xl w-[140px] h-[45px] flex items-center justify-center">
													<Text className="text-white text-xl font-semibold ml-3 mr-3">
														Connect
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													className=" bg-[#24A0ED] rounded-xl w-[140px] h-[45px] flex items-center justify-center"
													onPress={messageHandler}
													disabled={buttonloading}
												>
													{
														buttonloading? (
                                                            <ActivityIndicator
                                                                size="small"
                                                                color="white"
                                                            />
                                                        ) : (
                                                            <Text className="text-white text-xl font-semibold ml-3 mr-3">
                                                                Message
                                                            </Text>
                                                        )
													}
												</TouchableOpacity>
											</View>
										</View>
										<View className="bg-white">
											<View className=" h-[60px] flex items-center justify-center">
												<Image
													source={EVENTSPlaceholder}
													style={{
														width: 125,
														height: 30,
													}}
												/>
											</View>
										</View>
									</View>
								</View>
							</View>
						}
						renderItem={renderPost}
						refreshControl={
							<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />
						}
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
			</View>
		</SafeAreaView>
	);
}
