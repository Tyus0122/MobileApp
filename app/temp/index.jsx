import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
	const sheetRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const data = Array(50)
		.fill(0)
		.map((_, index) => `index-${index}`);
	const snapPoints = ["25%", "50%", "100%"];
	const handleSheetChange = useCallback((index) => {
		console.log("handleSheetChange", index);
	}, []);
	const handleSnapPress = useCallback((index) => {
		sheetRef.current?.snapToIndex(index);
		setIsVisible(true);
	}, []);

	const renderItem = useCallback(
		({ item }) => (
			<View style={styles.itemContainer}>
				<Text>{item}</Text>
			</View>
		),
		[]
	);
	return (
		<View className="flex-1">
			<Button title="Close" onPress={() => setIsVisible(false)} />
			<Button title="Open" onPress={() => setIsVisible(true)} />
				<GestureHandlerRootView>
					<BottomSheet
						ref={sheetRef}
						snapPoints={snapPoints}
						onChange={handleSheetChange}
					>
						<TextInput className="bg-blue-500" />
						<BottomSheetFlatList
							data={data}
							keyExtractor={(i) => i}
							renderItem={renderItem}
						/>
					</BottomSheet>
				</GestureHandlerRootView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 200,
	},
	contentContainer: {
		backgroundColor: "white",
	},
	itemContainer: {
		padding: 6,
		margin: 6,
		backgroundColor: "#eee",
	},
});

export default App;
