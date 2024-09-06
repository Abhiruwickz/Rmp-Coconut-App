import { View, Text,Image,TextInput,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {router} from 'expo-router'
import { firebase_auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

const signIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[showPassword, setShowPassword] = useState(false);

const handlesignIn = async () => {
    try{
       const userCredential = await signInWithEmailAndPassword(
        firebase_auth,
        email,
        password
       );
       const user = userCredential.user;
       console.log("User Log In Successfully");
       router.replace("../(tabs)/explore")
    }  
    catch(error){
        switch(error.message){
            case "Invalid email address!":
                alert("Invalid email address!");
                break;
            case "Invalid email or password!":
                alert("Invalid email or password!");
                break;
            case "Password is required." :
                alert("Password is required.");
                break;
            case "At least 6 characters required for password!":
                alert("At least 6 characters required for password!");
                break;
            case "Network error! Please check your internet connection.":
                alert("Network error! Please check your internet connection.");
                break;
            default:
                alert(error.message);    
        }
    }  
};
  return (
      <View className="justify-center items-center bg-white flex-1">
          <Image
          source={require("../../assets/images/Rmplogo.png")} className="rounded-lg w-[150px] h-[150px] justify-center"
          />
        <Text className="text-2xl font-medium">Welcome Back!</Text>
      
      <View className="gap-6 mr-5 items-center">
      <View>
        <Text className="font-bold mb-1"> Email </Text>
        <TextInput
          placeholder="Enter your email"
          className="border border-gray-800 rounded w-72 p-2"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      
      <View>
        <Text className="font-bold mb-1"> Password </Text>
        <TextInput
          className="border border-gray-800 rounded w-72 p-2"
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
        //sign in button
          className="bg-orange-600 rounded-lg p-3 w-48 text-center top-5"
          onPress={handlesignIn}
        >
          <Text className="text-white text-center font-semibold"> Log In </Text>
        </TouchableOpacity>
      </View>
      </View>
  

  );
}

export default signIn