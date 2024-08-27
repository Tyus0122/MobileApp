import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { router, Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { React, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend_url } from "@/constants/constants";
export default function Index() {
    const [isLoggedin, setIsLoggedin] = useState("");
    const [dashboard_json, setdashboard_json] = useState({});
    useEffect(() => {
        async function fetchData() {
            const token = await AsyncStorage.getItem("BearerToken");

            const headers = {
                authorization: "Bearer " + token,
                "content-type": "application/json",
            };
            axios
                .get(backend_url + "v1/user/dashboard", { headers })
                .then((response) => {
                    setIsLoggedin(true);
                })
                .catch((err) => {
                    setIsLoggedin(false);
                });
        }
        fetchData();
    }, []);
    return isLoggedin === "" ? (
        <SafeAreaView>
            <View className="h-screen flex items-center justify-center">

            <ActivityIndicator size={"large"} color={"blue"} />
            <Text className="ml-5 mt-3 text-xl font-semibold">Loading ...</Text>
            </View>
        </SafeAreaView>
    ) : isLoggedin === true ? (
        <Redirect href={"/home"} />
    ) : (
        (<Redirect href={"/login"} />)
    );
}
