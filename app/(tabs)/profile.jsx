import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import PhoneInput from "react-native-phone-input";
import { OptionsIconComponent } from "@/components/OptionsIconComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
const EVENTSPlaceholder = require("@/assets/tyuss/events.png");

export default function Profile() {
	const [user, setUser] = useState({});
	const [conn, setConn] = useState("");
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	async function refreshHandler() {
		setRefresh(true);
		await fetchData();
		setRefresh(false);
	}
	async function fetchData() {
		setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getLoggedInUser", { headers })
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
	useEffect(() => {
		fetchData();
	}, []);
	return (
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
			<SafeAreaView>
				{loading ? (
					<View className="h-screen bg-white flex items-center justify-center">
						<ActivityIndicator size="large" color="gray" />
					</View>
				) : (
					<View className="h-screen bg-white">
						<View className="items-end">
							<Link href={"/profileactions"} className="pt-5 pr-5 mt-5 mr-5">
								<View>
									<OptionsIconComponent />
								</View>
							</Link>
						</View>
						<View className="relative items-center">
							<View className="relative z-10 items-center bg-white rounded-full p-2">
								<Image
									source={user.pic ? { uri: user.pic.url } : imagePlaceholder}
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
									<Text className="mt-1 text-xl text-gray-500">{user.bio}</Text>
									<View className="flex-row items-center gap-3">
										<Text className="mt-5 text-4xl">{conn}</Text>
										<Text className="mt-5 text-2xl">Connections</Text>
									</View>
								</View>
								<View className="mt-5 items-center gap-3">
									<View className="flex-row items-center  justify-between w-[80%] ">
										<View className="gap-4">
											<Text className="text-3xl fot-semibold">City</Text>
											<Text className="text-3xl fot-semibold">
												Accomodation
											</Text>
											<Text className="text-3xl fot-semibold">University</Text>
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
												Edit Profile
											</Text>
										</TouchableOpacity>
										<TouchableOpacity className=" bg-[#24A0ED] rounded-xl w-[140px] h-[45px] flex items-center justify-center">
											<Text className="text-white text-xl font-semibold ml-3 mr-3">
												Share Profile
											</Text>
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
									<View className="flex-row flex-wrap justify-between">
										{posts.map((value, key) => (
											<View
												key={key}
												style={{
													width: "32%",
													marginBottom: 10,
												}}
											>
												<Image
													source={{ uri: value.files[0].url }}
													style={{
														width: "100%",
														height: 150,
														resizeMode: "cover",
													}}
												/>
											</View>
										))}
									</View>
								</View>
							</View>
						</View>
					</View>
				)}
			</SafeAreaView>
		</ScrollView>
	);
}
