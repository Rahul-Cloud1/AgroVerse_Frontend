import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as mime from 'react-native-mime-types'; // ✅ Optional, for dynamic type resolution

const CATEGORIES = ['All', 'Tractors', 'Weeders', 'Mowers', 'Sprayers', 'Tools'];

export default function AgroRent() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRentingOwn, setIsRentingOwn] = useState(false);

  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCategory, setEquipmentCategory] = useState('');
  const [equipmentPrice, setEquipmentPrice] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [userId] = useState('user1');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get('http://192.168.56.1:5000/api/equipment');
      setEquipmentList(res.data);
    } catch (e) {
      Alert.alert('Error', 'Could not fetch equipment list.');
    }
  };

  const filterEquipment = () => {
    return equipmentList.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  };

  const handleBookNow = async (equipmentId) => {
    try {
      await axios.post('http://192.168.56.1:5000/api/rent-requests', {
        equipmentId,
        userId,
      });
      Alert.alert('Request Sent!', 'Your rent request has been sent to the owner.');
    } catch (e) {
      Alert.alert('Error', 'Could not send rent request.');
    }
  };

  // --- UPDATED IMAGE PICKER ---
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = uri.split('/').pop();
      const type = mime.lookup(uri) || 'image/jpeg'; // ✅ Get MIME type dynamically

      setImage({ uri, name, type });
    }
  };

  // --- UPDATED RENT SUBMIT ---
  const handleRentSubmit = async () => {
    if (!equipmentName || !equipmentCategory || !equipmentPrice || !equipmentDescription) {
      Alert.alert('Please fill in all fields');
      return;
    }

    let imageUrl = '';
    if (image) {
      const formData = new FormData();

      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any); // ✅ React Native needs casting for file

      try {
        const imgRes = await axios.post('http://192.168.56.1:5000/api/upload', formData, {
          // ✅ DO NOT manually set content-type; Axios will set it
        });

        imageUrl = imgRes.data.url;
      } catch (err) {
        console.log('Image upload error:', err.message);
        Alert.alert('Image Upload Failed', err.response?.data?.message || 'Could not upload image.');
        return;
      }
    }

    try {
      const payload = {
        name: equipmentName,
        category: equipmentCategory,
        price: Number(equipmentPrice),
        description: equipmentDescription,
        ownerId: userId,
        imageUrl,
      };

      await axios.post('http://192.168.56.1:5000/api/equipment', payload);
      Alert.alert('Success', `Your equipment "${equipmentName}" is now listed!`);
      setEquipmentName('');
      setEquipmentCategory('');
      setEquipmentPrice('');
      setEquipmentDescription('');
      setImage(null);
      fetchEquipment();
    } catch (error) {
      console.log('Equipment submit error:', error.message);
      Alert.alert('Error', 'Failed to submit equipment. Please try again.');
    }
  };

  const openDashboard = async () => {
    setDashboardVisible(true);
    try {
      const listingsRes = await axios.get(`http://192.168.56.1:5000/api/equipment?ownerId=${userId}`);
      setMyListings(listingsRes.data);

      const requestsRes = await axios.get(`http://192.168.56.1:5000/api/rent-requests?ownerId=${userId}`);
      setMyRequests(requestsRes.data);
    } catch (e) {
      Alert.alert('Error', 'Could not fetch dashboard data.');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.post(`http://192.168.56.1:5000/api/rent-requests/${requestId}/approve`);
      Alert.alert('Approved', 'Rent request approved.');
      openDashboard();
    } catch (e) {
      Alert.alert('Error', 'Could not approve request.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🚜 AgroRent Equipment Rentals</Text>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, !isRentingOwn && styles.toggleActive]}
            onPress={() => {
              setIsRentingOwn(false);
              setDashboardVisible(false);
            }}>
            <Text style={styles.toggleText}>Book Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, isRentingOwn && styles.toggleActive]}
            onPress={() => {
              setIsRentingOwn(true);
              setDashboardVisible(false);
            }}>
            <Text style={styles.toggleText}>Rent Your Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, dashboardVisible && styles.toggleActive]}
            onPress={openDashboard}>
            <Text style={styles.toggleText}>My Rent Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Section */}
        {!isRentingOwn && !dashboardVisible && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search equipment"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.categories}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat && styles.categoryTextActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filterEquipment()}
              keyExtractor={item => item._id || item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image
                    source={
                      item.imageUrl
                        ? { uri: item.imageUrl }
                        : require('../assets/Images/PowerWeeder/bc230.jpg')
                    }
                    style={styles.image}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => handleBookNow(item._id || item.id)}>
                      <Text style={styles.bookText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </>
        )}

        {/* Rent Equipment Form */}
        {isRentingOwn && !dashboardVisible && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Rent Out Your Equipment</Text>
            <TextInput
              style={styles.input}
              placeholder="Equipment Name"
              value={equipmentName}
              onChangeText={setEquipmentName}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={equipmentCategory}
              onChangeText={setEquipmentCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Price per day (₹)"
              value={equipmentPrice}
              onChangeText={setEquipmentPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={equipmentDescription}
              onChangeText={setEquipmentDescription}
            />
            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
              <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Upload Image'}</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8 }} />
            )}
            <Button title="Submit Listing" onPress={handleRentSubmit} />
          </View>
        )}

        {/* Dashboard Modal */}
        {dashboardVisible && (
          <Modal visible={dashboardVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={styles.title}>My Equipment Listings</Text>
                {myListings.length === 0 ? (
                  <Text>No listings yet.</Text>
                ) : (
                  myListings.map(listing => (
                    <View key={listing._id || listing.id} style={styles.card}>
                      <Text style={styles.name}>{listing.name}</Text>
                      <Text style={styles.price}>₹{listing.price}</Text>
                      <Text style={styles.desc}>{listing.description}</Text>
                    </View>
                  ))
                )}
                <Text style={[styles.title, { marginTop: 24 }]}>Rent Requests</Text>
                {myRequests.length === 0 ? (
                  <Text>No requests yet.</Text>
                ) : (
                  myRequests.map(req => (
                    <View key={req._id} style={styles.card}>
                      <Text style={styles.name}>Equipment: {req.equipmentName}</Text>
                      <Text>Requested by: {req.requestedBy}</Text>
                      <Text>Status: {req.status}</Text>
                      {req.status === 'pending' && (
                        <TouchableOpacity
                          style={styles.bookBtn}
                          onPress={() => handleApproveRequest(req._id)}>
                          <Text style={styles.bookText}>Approve</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
                <Button title="Close Dashboard" onPress={() => setDashboardVisible(false)} />
              </ScrollView>
            </SafeAreaView>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2e7d32' },

  toggleGroup: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
  toggleButton: {
    flex: 1,
    backgroundColor: '#c8e6c9',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#66bb6a' },
  toggleText: { color: '#fff', fontWeight: 'bold' },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },

  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    margin: 4,
  },
  categoryActive: { backgroundColor: '#66bb6a' },
  categoryText: { color: '#555' },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },

  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 12 },
  cardContent: { flex: 1 },
  name: { fontSize: 18, fontWeight: '500' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  desc: { fontSize: 14, color: '#666' },

  bookBtn: {
    backgroundColor: '#66bb6a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  bookText: { color: '#fff', fontWeight: 'bold' },

  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },

  uploadBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  uploadText: { color: '#fff', fontWeight: 'bold' },
});
