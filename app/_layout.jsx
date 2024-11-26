import { useState, createContext, useEffect } from "react";
import { Stack } from "expo-router";
import "../global.css";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
export const SocketContext = createContext(null);
import io from "socket.io-client";
import { socket_url } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function RootLayout() {
	const [socket, setSocket] = useState(null);
	useEffect(() => {
		const newSocket = io(socket_url);
		setSocket(newSocket);
		return () => newSocket.close();
	}, []);
	return (
		<SocketContext.Provider value={socket}>
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
					name="editProfile/index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</SocketContext.Provider>
	);
}
