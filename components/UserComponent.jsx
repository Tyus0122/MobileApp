import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend_url } from "@/constants/constants";
import axios from "axios";

export function UserComponent({ user }) {
	// let statusvaluemap = {
	// 	connected: {
	// 		color: "gray",
	// 		disabled: true,
	// 	},
	// 	"Request sent": {
	// 		color: "#24A0ED",
	// 		disabled: false,
	// 	},
	// 	connect: {
	// 		color: "#24A0ED",
	// 		disabled: false,
	// 	},
	// 	Accept: {
	// 		color: "green",
	// 		disabled: false,
	// 	},
	// 	Reject: {
	// 		color: "red",
	// 		disabled: false,
	// 	},
	// };
	const [sendConnect, setsendConnect] = useState(false);
	async function connectionHandler() {
		const body = {
			user_id: user._id,
			send: !sendConnect,
		};
		setsendConnect(!sendConnect);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		console.log(sendConnect);
		console.log(body);
		axios
			.post(backend_url + "v1/user/sendConnectionRequest", body, { headers })
			.then((response) => {
				console.log(response.data);
			})
			.catch((err, message) => {
				console.log(JSON.stringify(err));
				setLoading(false);
			});
	}
	async function RejectHandler() {
		console.log("hello")
	}
	return (
		<View>
			<View className="pl-5 pr-5 pt-2 pb-2 m-1 border border-gray-200 rounded-xl flex-row items-center justify-between">
				<View className="flex-row items-center gap-8">
					<View>
						<Image
							source={require("@/assets/tyuss/shadow1.png")}
							class
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: "black",
								borderWidth: 1.5,
							}}
						/>
					</View>
					<View>
						<Text className="text-xl">{user.username}</Text>
						<Text className="text-gray-500">{user.city}</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
