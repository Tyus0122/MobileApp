import React, { useState, useEffect, useContext } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend_url } from "@/constants/constants";
import { SplashScreen } from "@/components/SplashScreenComponent";

export default function Index() {
	return (
		<SafeAreaView>
			<View>
				<SplashScreen></SplashScreen>
			</View>
		</SafeAreaView>
	);
}

// import React, { useState, useEffect, useContext } from "react";
// import { Text, View, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Redirect } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { backend_url } from "@/constants/constants";

// export default function Index() {
// 	const [isLoggedin, setIsLoggedin] = useState("");

// 	async function fetchData() {
// 		const token = await AsyncStorage.getItem("BearerToken");
// 		let is_onboarded = await AsyncStorage.getItem("is_onboarded");
// 		is_onboarded = is_onboarded === "yes" ? "yes" : "no";
// 		const headers = {
// 			authorization: "Bearer " + token,
// 			"content-type": "application/json",
// 		};
// 		axios
// 			.get(backend_url + "v1/user/dashboard", { headers })
// 			.then((response) => {
// 				if (is_onboarded === "yes") {
// 					setIsLoggedin("yes");
// 				} else {
// 					AsyncStorage.removeItem("BearerToken");
// 					setIsLoggedin("no");
// 				}
// 			})
// 			.catch(async (err) => {
// 				if (is_onboarded === "yes") {
// 					setIsLoggedin("false");
// 				} else setIsLoggedin("no");
// 			});
// 	}

// 	useEffect(() => {
// 		fetchData();
// 	}, []);
// 	return isLoggedin === "" ? (
// 		<SafeAreaView>
// 			<View className="h-screen flex items-center justify-center">
// 				<ActivityIndicator size={"large"} color={"blue"} />
// 				<Text className="ml-5 mt-3 text-xl font-semibold">Loading ...</Text>
// 			</View>
// 		</SafeAreaView>
// 	) : isLoggedin === "no" ? (
// 		<Redirect href={"/onboarding1"} />
// 	) : isLoggedin === "yes" ? (
// 		<Redirect href={"/home"} />
// 	) : (
// 		<Redirect href={"/login"} />
// 	);
// }
