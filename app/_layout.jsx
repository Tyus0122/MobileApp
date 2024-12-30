import { useState, createContext, useEffect } from "react";
import { Stack } from "expo-router";
import "../global.css";
import { LogBox, View, Text, Image } from "react-native";
import io from "socket.io-client";
import { socket_url } from "@/constants/constants";
import * as _ from "lodash";
LogBox.ignoreAllLogs();
export const SocketContext = createContext(null);
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
	const [socket, setSocket] = useState(null);
	async function connectSocket() {
		console.log("Attempting to connect to socket...", socket_url);
		const newSocket = io(socket_url);

		newSocket.on("connect", () => {
			console.log("Socket connected successfully:", newSocket.id);
			setSocket(newSocket);

			// Register token after successful connection
			registerToken(newSocket);
		});

		newSocket.on("connect_error", (err) => {
			console.error("Socket connection error:", err.message);
		});

		newSocket.on("disconnect", () => {
			console.log("Socket disconnected.");
			setSocket(null);
		});
		return () => {
			console.log("Cleaning up socket...");
			newSocket.close();
		};
	}

	async function registerToken(socketInstance) {
		try {
			const token = await AsyncStorage.getItem("BearerToken");
			if (!_.isNil(token)) {
				console.log("Registering token with the socket...");
				socketInstance.emit("registerTheToken", { token });
				console.log("Token registered successfully!");
			} else {
				console.warn("No token found in AsyncStorage.");
			}
		} catch (error) {
			console.error("Error registering token:", error.message);
		}
	}
	useEffect(() => {
		connectSocket();
	}, []);
	return !socket ? (
		<View className="h-screen flex items-center justify-center">
			<Image source={require("@/assets/tyuss/loginLogo.png")} />
			<View>
				<Text className="text-black text-4xl">TYUS</Text>
			</View>
		</View>
	) : (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="login/index" options={{ headerShown: false }} />
				<Stack.Screen name="signup/index" options={{ headerShown: false }} />
				<Stack.Screen name="dashboard/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="forgotphno/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="forgototp/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="resetpassword/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="temp/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="profileactions/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="singlepost/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="userProfile/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="messages/index" options={{ headerShown: false }} />
				<Stack.Screen name="chat/index" options={{ headerShown: false }} />
				<Stack.Screen name="saved/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="shareProfile/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="editProfile/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="notifications/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="suggestions/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="requests/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="latestNotifications/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="blocked/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="changePassword/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="myPosts/index" options={{ headerShown: false }} />
				<Stack.Screen name="editPost/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="onboarding1/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="onboarding2/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="onboarding3/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="onboarding4/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="onboarding5/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="main/index" options={{ headerShown: false }} />
				<Stack.Screen name="help/index" options={{ headerShown: false }} />
				<Stack.Screen name="loginOtp/index" options={{ headerShown: false }} />
				<Stack.Screen
					name="searchMessages/index"
					options={{ headerShown: false }}
				/>
			</Stack>
		</SocketContext.Provider>
	);
}
