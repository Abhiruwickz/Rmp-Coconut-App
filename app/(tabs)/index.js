import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import { router } from "expo-router";

export default function App() {
 

  return (
    <View className="items-center flex-1 justify-center bg-white">
      <Image
        source={require("../../assets/images/Rmplogo.png")}
        className="rounded-lg w-[200px] h-[200px]"
      />
    </View>
  );
}
