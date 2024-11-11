import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth"; // Import getAuth and signOut
import { ref, get } from "firebase/database"; 
import { Real_time_database } from "../../firebaseConfig"; 
import { router } from "expo-router";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Reference to the user's data in the Realtime Database
        const userRef = ref(Real_time_database, `users/${user.uid}`);

        // Fetch user data from Realtime Database
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.val()); // Set the user data
            } else {
              Alert.alert("No Data", "No user data found in the database.");
            }
          })
          .catch((error) => {
            Alert.alert("Error", "Failed to fetch user data: " + error.message);
          })
          .finally(() => {
            setLoading(false); // Stop the loading indicator
          });
      } else {
        console.log("No User", "No user is currently signed in.");
        setLoading(false); // Stop loading if no user is signed in
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Log out the user
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Yes", onPress: () => logout() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.replace("../user/open"); // Navigate to the sign-in screen after successful sign-out
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Failed to log out:", error);
        Alert.alert("Logout Error", "Failed to log out. Please try again.");
      });
  };

  return (
    <View className="bg-white flex-1 p-4">
      {userData ? (
        <>
          <Text className="text-xl font-bold mb-4 mt-8 text-center">Profile</Text>
          <Image
            source={require("../../assets/images/profile.png")}
            className="rounded-lg w-[250px] h-[250px] ml-12"
          />
          <View className="rounded-lg border-blue-600 border-2 w-[300px] ml-4">
            <Text className="text-lg mb-2 text-center font-semibold text-blue-800">
              Username: {userData.username || "No name provided"}
            </Text>
          </View>
          <View className="border-2 rounded-lg mt-8 border-blue-600 w-[300px] ml-4">
            <Text className="text-lg mb-2 font-semibold text-blue-800 text-center">
              Email: {userData.email}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              className="bg-red-600 rounded-lg items-center mt-10 w-52 h-10 justify-center ml-16"
              onPress={handleLogout}
            >
              <Text className="text-center text-white text-lg font-semibold">Log out</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text className="text-lg">No user data available</Text>
      )}
    </View>
  );
};

export default Profile;
