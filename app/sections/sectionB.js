import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator,TouchableOpacity,Alert,Image } from 'react-native';
import { ref, query, orderByChild, equalTo, onValue,remove } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';
import { router } from 'expo-router';

const SectionB = () => {
  const [loading, setLoading] = useState(true);
  const [coconuts, setCoconuts] = useState([]);

  useEffect(() => {
    // Query to get coconuts for Section A
    const coconutsRef = ref(Real_time_database, 'Coconuts');
    const sectionQuery = query(coconutsRef, orderByChild('section'), equalTo('Section B'));

    // Listen for value changes
    onValue(sectionQuery, (snapshot) => {
      const data = snapshot.val();
      const coconutsList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setCoconuts(coconutsList);
      setLoading(false);

      coconutsList.sort((a, b) => new Date(b.date) - new Date(a.date));

      setCoconuts(coconutsList);
      setLoading(false);
      
    });
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this coconut?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            const coconutRef = ref(Real_time_database, `Coconuts/${id}`);
            remove(coconutRef)
              .then(() => {
                alert('Coconut deleted successfully');
                console.log('Coconut deleted successfully');
                // Optionally, you can refresh the list after deletion
                setCoconuts(coconuts.filter(coconut => coconut.id !== id));
              })
              .catch((error) => {
                console.error('Error deleting coconut:', error);
                console.log('Error deleting coconut:', error);
              });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-xl font-bold mb-5 text-center mt-10">Section B Coconuts</Text>
      {coconuts.length > 0 ? (
        coconuts.map((coconut) => (
          <View key={coconut.id} className="border p-3 rounded-lg mb-4">
            <TouchableOpacity onPress={() => handleDelete(coconut.id)} className="ml-64">
              <Image source={require('../../assets/images/delete.png')} className="w-[36px] h-[36px]" />
            </TouchableOpacity>
            <Text>Date: {coconut.date}</Text>
            <Text>SR/GRN: {coconut.sr_grn}</Text>
            <Text>Weight: {coconut.weight}</Text>
            <Text>No of Nuts: {coconut.noOfNuts}</Text>
            <Text>Rejected: {coconut.rejected}</Text>
            <Text>Supplier: {coconut.supplier}</Text>
            <Text>Vehicle No: {coconut.vehicleNo}</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "../sections/updateSectionB", params: { id: coconut.id, coconut }  })} className="rounded-lg bg-red-300 h-[40px] w-[140px] ml-40 ">
              <Text className="text-center mt-2 font-semibold ">Update </Text>
               
              </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No coconuts found for Section B</Text>
      )}
    </ScrollView>
  );
};

export default SectionB;
