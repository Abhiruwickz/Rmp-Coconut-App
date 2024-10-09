import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { firebase_Auth, Real_time_database } from '../../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, set } from 'firebase/database'; // Import Realtime Database methods
import { router } from 'expo-router';

const SignUp = () => {
  const [username, setUsername] = useState(''); // Username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!username) {
      Alert.alert('Error', 'Username is required!');
      return;
    }

    if (!email || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email!');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters!');
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebase_Auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the user data to Realtime Database
      const userRef = ref(Real_time_database, `users/${user.uid}`); // Reference to the user's data in Realtime Database
      await set(userRef, {
        username: username,
        email: email,
      });

      console.log("User signed up successfully", user);
      Alert.alert('Success', 'Account created successfully!');

      // Reset input fields
      setUsername('');
      setEmail('');
      setPassword('');

      // Navigate to sign in screen
      router.replace("../user/signIn");  
    } catch (error) {
      // Handle sign-up errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'Email is already in use!');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'Invalid email format!');
          break;
        case 'auth/weak-password':
          Alert.alert('Error', 'Password should be at least 6 characters!');
          break;
        default:
          Alert.alert('Error', error.message);
      }
    }
  };

  // Validate email format using regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <View className="justify-center items-center bg-white flex-1">
      <Image
        source={require("../../assets/images/Rmplogo.png")}
        className="rounded-lg w-[150px] h-[150px] justify-center"
      />
      <View className="bg-gray-200 rounded-xl items-center w-[330px] h-[450px]">     
        <Image
          source={require("../../assets/images/user.png")}
          className="rounded-lg w-[24px] h-[24px] right-28 top-10"   
        />
        <Text className="text-xl font-semibold mt-3">Create an Account</Text>

        <View className="gap-6 items-center mt-2">
          <View>
            <Text className="font-bold mb-1">Username</Text>
            <TextInput
              placeholder="Enter your username"
              className="border border-gray-800 rounded w-72 p-2 bg-white"
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          <View>
            <Text className="font-bold mb-1">Email</Text>
            <TextInput
              placeholder="Enter your email"
              className="border rounded w-72 p-2 bg-white"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address" // Ensures the keyboard shows the email layout
            />
          </View>

          <View>
            <Text className="font-bold mb-1">Password</Text>
            <TextInput
              className="border rounded w-72 p-2 bg-white" 
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 mt-8"
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-orange-600 rounded-lg p-3 w-48 text-center top-5"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
