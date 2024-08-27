import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { useState, useEffect } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Accomodation() {
  return (
      <SafeAreaView>
        <TextInput className="bg-blue-50">

        </TextInput>
          <ScrollView keyboardShouldPersistTaps={"always"}>
          
          </ScrollView>
      </SafeAreaView>
  );
}
