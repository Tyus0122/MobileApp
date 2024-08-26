import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    BackHandler
} from "react-native";
import { React, useState ,useEffect} from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
    function handleBackPress(){
        console.log("hello")
        BackHandler.exitApp()
    }
    const [showPassword, setShowPassword] = useState(true);
    const [token,setToken] = useState(false);

    const [submit, setSubmit] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    BackHandler.addEventListener("hardwareBackPress",handleBackPress)

    useEffect( () => {
        async function fetchData(){
            const token=await AsyncStorage.getItem("BearerToken");
            console.log(token)
        }
        fetchData()
    }, [])
    
    function submitHandler() {
        setSubmit(true);
        console.log(formData);
        axios
            .post(backend_url + "v1/user/loginSubmit", formData)
            .then((response) => {
                console.log(response.data);
                AsyncStorage.setItem("BearerToken",response.data.BearerToken)
            })
            .catch((err) => {
                console.log(err.status);
            });
    }
    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <Text>hellow rodl</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
