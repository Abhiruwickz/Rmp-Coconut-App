import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { ref, get, update, onValue } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as MailComposer from 'expo-mail-composer';

const UpdateSectionB = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Retrieve the coconut id

  // State for coconut details
  const [coconutDetails, setCoconutDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState([]); // State to store user emails

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

  // Fetch user emails from Firebase
  useEffect(() => {
    const usersRef = ref(Real_time_database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const emails = Object.values(usersData || {}).map((user) => user.email);
      setUserEmails(emails);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Form input states
  const [date, setDate] = useState('');
  const [sr_grn, setSr_grn] = useState('');
  const [weight, setWeight] = useState('');
  const [weight2, setWeight2] = useState('');
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
      setWeight2(coconutDetails.weight2 || '');
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
      weight2,
      noOfNuts,
      rejected,
      supplier,
      vehicleNo,
    })
      .then(() => {
        alert('Coconut updated successfully!');
        sendEmail(); // Trigger email sending
        router.back();
      })
      .catch((error) => {
        console.error('Error updating coconut:', error);
      });
  };

  // Function to send an email
  const sendEmail = () => {
    const recipients = userEmails;
    const subject = "Coconut Details Updated";
    const body = `The following coconut details have been updated:\n\n
    Date: ${date}\n
    SR/GRN: ${sr_grn}\n
    Weight: ${weight}\n
    Weight2: ${weight2}\n
    No of Nuts: ${noOfNuts}\n
    Rejected: ${rejected}\n
    Supplier: ${supplier}\n
    Vehicle No: ${vehicleNo}`;

    MailComposer.composeAsync({
      recipients,
      subject,
      body,
    })
      .then((result) => {
        if (result.status === 'sent') {
          console.log('Email sent successfully');
        } else {
          console.log('Email was not sent');
        }
      })
      .catch((error) => {
        console.error('Error sending email:', error);
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

    <Text className="font-semibold text-md mb-3">1st Weight   </Text>
    <TextInput value={weight} onChangeText={setWeight} placeholder="Weight" className="border p-2 mb-3" />

    <Text className="font-semibold text-md mb-3">2nd  Weight   </Text>
    <TextInput value={weight2} onChangeText={setWeight} placeholder="Weight" className="border p-2 mb-3" />
 
    <Text className="font-semibold text-md mb-3"> No of Nuts  </Text>
    <TextInput value={noOfNuts} onChangeText={setNoOfNuts} placeholder="No of Nuts" className="border p-2 mb-3" />
  
    <Text className="font-semibold text-md mb-3"> Rejected </Text>
    <TextInput value={rejected} onChangeText={setRejected} placeholder="Rejected" className="border p-2 mb-3" />
   
    <Button title="Update Coconut" onPress={handleUpdate} />
  </View>
  );
};

export default UpdateSectionB;
