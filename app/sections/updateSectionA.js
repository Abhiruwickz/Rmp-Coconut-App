import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { ref, get,update } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';

const UpdateSectionB = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Retrieve the coconut id

  // State for coconut details
  const [coconutDetails, setCoconutDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch coconut data from Firebase
  useEffect(() => {
    const coconutRef = ref(Real_time_database, `Coconuts/${id}`);
    get(coconutRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCoconutDetails(snapshot.val());
        } else {
          alert('Coconut data not found!');
        }
      })
      .catch((error) => {
        console.error('Error fetching coconut data:', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Form input states
  const [date, setDate] = useState('');
  const [sr_grn, setSr_grn] = useState('');
  const [weight, setWeight] = useState('');
  const [noOfNuts, setNoOfNuts] = useState('');
  const [rejected, setRejected] = useState('');
  const [supplier, setSupplier] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');



  // Set initial values from fetched coconut data
  useEffect(() => {
    if (coconutDetails) {
      setDate(coconutDetails.date || '');
      setSr_grn(coconutDetails.sr_grn || '');
      setWeight(coconutDetails.weight || '');
      setNoOfNuts(coconutDetails.noOfNuts || '');
      setRejected(coconutDetails.rejected || '');
      setSupplier(coconutDetails.supplier || '');
      setVehicleNo(coconutDetails.vehicleNo || '');
  
    }
  }, [coconutDetails]);

  // Function to handle the update
  const handleUpdate = () => {
    const coconutRef = ref(Real_time_database, `Coconuts/${id}`);
    update(coconutRef, {
      date,
      sr_grn,
      weight,
      noOfNuts,
      rejected,
      supplier,
      vehicleNo,
    })
      .then(() => {
        alert('Coconut updated successfully!');
        router.back();
      })
      .catch((error) => {
        console.error('Error updating coconut:', error);
      });
  };

  // Display loading indicator until data is fetched
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="p-5 bg-white flex-1 mt-10">
      <Text className="text-xl font-bold mb-5 text-center">Update Coconut</Text>

     <Text className="font-semibold text-md mb-3"> Date     </Text>
      <TextInput value={date} onChangeText={setDate} placeholder="Date" className="border p-2 mb-3" />
 
      <Text className="font-semibold text-md mb-3"> SR/GRN    </Text>
      <TextInput value={sr_grn} onChangeText={setSr_grn} placeholder="SR/GRN" className="border p-2 mb-3" />
  
      <Text className="font-semibold text-md mb-3"> Weight   </Text>
      <TextInput value={weight} onChangeText={setWeight} placeholder="Weight" className="border p-2 mb-3" />
   
      <Text className="font-semibold text-md mb-3"> No of Nuts  </Text>
      <TextInput value={noOfNuts} onChangeText={setNoOfNuts} placeholder="No of Nuts" className="border p-2 mb-3" />
    
      <Text className="font-semibold text-md mb-3"> Rejected </Text>
      <TextInput value={rejected} onChangeText={setRejected} placeholder="Rejected" className="border p-2 mb-3" />
     
      <Button title="Update Coconut" onPress={handleUpdate} />
    </View>
  );
};

export default UpdateSectionB;
