import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; 
import { firebase_Auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_Auth, (user) => {
      if (user) {
        // User is signed in, navigate to home page
        router.replace("/home"); 
        console.log("User Logged in Successfully");
      } else {
        // No user is signed in, navigate to sign-in page
        router.replace("/user/open"); // Adjust path as per your app structure
        console.log("User not Logged in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);



  return (
    <View className="items-center flex-1 justify-center bg-white">
      <Image
        source={require("../assets/images/Rmplogo.png")}
        className="rounded-lg w-[200px] h-[200px]"
      />

      
    </View>
  );
}
