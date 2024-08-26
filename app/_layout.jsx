import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
export default function RootLayout() {
    console.log('ehllo')
    return (
            <Stack>
                <Stack.Screen name="index" options={{headerShown:false}}/>
                <Stack.Screen name="login/index" options={{headerShown:false}}/>
                <Stack.Screen name="signup/index" options={{headerShown:false}}/>
            </Stack>
    );
}
