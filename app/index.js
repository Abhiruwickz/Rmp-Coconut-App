import { useState } from "react";
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { firebase_Auth } from "../firebaseConfig"; // Adjust the path if necessary
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true); 
    const unsubscribe = onAuthStateChanged(firebase_Auth, (user) => {
      if (user) {
        // User is signed in, redirect to home page
        router.replace('./(tabs)/home'); 
      } else {
        // No user is signed in, redirect to sign-in page
        router.replace('./user/open'); 
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  };

  return (
    <View className="items-center flex-1 justify-center bg-white">
      <Image
        source={require("../assets/images/Rmplogo.png")}
        className="rounded-lg w-[200px] h-[200px]"
      />
      
      {/* If loading, show an activity indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <TouchableOpacity
          className="bg-orange-600 rounded-lg w-[200px] h-[40px] mt-8"
          onPress={handleGetStarted}
        >
          <Text className="text-center text-white font-semibold text-lg mt-1">Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
