
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
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as mime from 'react-native-mime-types'; // ✅ Optional, for dynamic type resolution
import API_CONFIG from '../config/apiConfig';
import { useLanguage } from '../contexts/LanguageContext';


const CATEGORIES = [
  { labelKey: 'all', value: 'All' },
  { labelKey: 'tractors', value: 'Tractors' },
  { labelKey: 'weeders', value: 'Weeders' },
  { labelKey: 'mowers', value: 'Mowers' },
  { labelKey: 'sprayers', value: 'Sprayers' },
  { labelKey: 'tools', value: 'Tools' },
];

type Equipment = {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
};

type RentRequest = {
  _id: string;
  equipmentName: string;
  requestedBy: string;
  status: string;
};

type PickedImage = {
  uri: string;
  name: string;
  type: string;
  file?: File;
};

const normalizeArrayResponse = <T,>(payload: any): T[] => {
  const candidates = [
    payload,
    payload?.data,
    payload?.items,
    payload?.equipment,
    payload?.listings,
    payload?.requests,
    payload?.rentRequests,
    payload?.results,
  ];

  return candidates.find(Array.isArray) || [];
};

const getApiErrorMessage = (error: any, fallback: string) => {
  const responseData = error?.response?.data;
  if (typeof responseData === 'string') return responseData;
  return responseData?.message || responseData?.error || fallback;
};


import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = (token: string | null) => {
  try {
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    console.log('DECODED TOKEN:', decoded);

    return (
      decoded?.user?.id ||
      decoded?.id ||
      decoded?._id ||
      decoded?.userId ||
      decoded?.sub ||
      null
    );
  } catch (err) {
    console.log('JWT Decode Error:', err);
    return null;
  }
};

const appendImageToFormData = async (formData: FormData, image: PickedImage) => {
  if (Platform.OS === 'web') {
    if (image.file) {
      formData.append('image', image.file, image.name);
      return;
    }

    const imageResponse = await fetch(image.uri);
    const blob = await imageResponse.blob();
    formData.append('image', blob, image.name);
    return;
  }

  formData.append('image', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);
};

export default function AgroRent() {
  const { tr } = useLanguage();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRentingOwn, setIsRentingOwn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCategory, setEquipmentCategory] = useState('');
  const [equipmentPrice, setEquipmentPrice] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [image, setImage] = useState<PickedImage | null>(null);

  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [myListings, setMyListings] = useState<Equipment[]>([]);
  const [myRequests, setMyRequests] = useState<RentRequest[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Mock equipment data for development/fallback
  

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
  AsyncStorage.getItem('token')
    .then(token => {
      console.log('TOKEN:', token);

      setAuthToken(token);

      const extractedUserId = getUserIdFromToken(token);

      console.log('EXTRACTED USER ID:', extractedUserId);

      setUserId(extractedUserId);
    })
    .catch(error => {
      console.log('Token load error:', error);
    });
}, []);

  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

  const fetchEquipment = async () => {
  setLoading(true);
  setApiError(null);

  try {
    const res = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPMENT}`
    );

    console.log('EQUIPMENT API RESPONSE:', res.data);

    const equipmentData =
      res.data?.equipment ||
      res.data?.data ||
      res.data;

    console.log('PARSED EQUIPMENT:', equipmentData);

    if (Array.isArray(equipmentData) && equipmentData.length > 0) {
      setEquipmentList(equipmentData);
    } else {
      // Fallback to mock data if API returns empty
      
    }

  } catch (e) {
    console.log('API Error:', e);

    // Use mock data as fallback when API fails
    

    setApiError(
      'Using sample equipment data'
    );
  } finally {
    setLoading(false);
  }
};
  const filterEquipment = () => {
    if (!Array.isArray(equipmentList)) return [];
    return equipmentList.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  };

  const handleBookNow = async (equipmentId: string | undefined) => {
  try {
    console.log('equipmentId:', equipmentId);
    console.log('userId:', userId);

    if (!equipmentId) {
      Alert.alert('Error', 'Equipment ID missing');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const payload = {
      equipmentId,
      userId,
    };

    console.log('Sending Payload:', payload);

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RENT_REQUESTS}`,
      payload,
      {
        headers: authHeaders,
      }
    );

    console.log('SUCCESS:', response.data);

    Alert.alert(
      tr('requestSent'),
      tr('requestSentMessage')
    );

  } catch (e: any) {
    console.log(
      'FULL ERROR:',
      JSON.stringify(e?.response?.data, null, 2)
    );

    Alert.alert(
      tr('error'),
      getApiErrorMessage(e, tr('sendRentFailed'))
    );
  }
};

  // --- UPDATED IMAGE PICKER --- 
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(tr('permissionRequired'), tr('photoPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = asset.fileName || uri.split('/').pop() || 'equipment-image.jpg';
      const type = mime.lookup(uri) || 'image/jpeg'; // ✅ Get MIME type dynamically

      setImage({ uri, name, type, file: asset.file });
    }
  };

  // --- UPDATED RENT SUBMIT ---
  const handleRentSubmit = async () => {
    if (!equipmentName || !equipmentCategory || !equipmentPrice || !equipmentDescription) {
      Alert.alert(tr('fillAllFields'));
      return;
    }

    const price = Number(equipmentPrice);
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert(tr('error'), 'Please enter a valid price.');
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
        const uploadData = new FormData();
        await appendImageToFormData(uploadData, image);
        const imgRes = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`, uploadData, {
          headers: authHeaders,
          // ✅ DO NOT manually set content-type; Axios will set it
        });

        imageUrl = imgRes.data.url;
      } catch (err) {
        const uploadError = err as any;
        console.log('Image upload error:', uploadError.response?.data || uploadError.message);
        Alert.alert(tr('imageUploadFailed'), getApiErrorMessage(uploadError, tr('uploadImageFailedMessage')));
        return;
      }
    }

    try {
      const payload = {
        name: equipmentName,
        category: equipmentCategory,
        price,
        description: equipmentDescription,
        ...(userId ? { ownerId: userId } : {}),
        imageUrl,
      };

      await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPMENT}`, payload, {
        headers: authHeaders,
      });
      Alert.alert(tr('success'), tr('listingSuccess', { equipment: equipmentName }));
      setEquipmentName('');
      setEquipmentCategory('');
      setEquipmentPrice('');
      setEquipmentDescription('');
      setImage(null);
      fetchEquipment();
    } catch (error) {
      console.log('Equipment submit error:', (error as any)?.response?.data || (error instanceof Error ? error.message : error));
      Alert.alert(tr('error'), getApiErrorMessage(error, tr('submitEquipmentFailed')));
    }
  };

  const openDashboard = async () => {
    setDashboardVisible(true);
    try {
      const ownerQuery = userId ? `?ownerId=${encodeURIComponent(userId)}` : '';
      const listingsRes = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPMENT}${ownerQuery}`, {
        headers: authHeaders,
      });
      setMyListings(normalizeArrayResponse<Equipment>(listingsRes.data));

      const requestsRes = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RENT_REQUESTS}${ownerQuery}`, {
        headers: authHeaders,
      });
      setMyRequests(normalizeArrayResponse<RentRequest>(requestsRes.data));
    } catch (e: any) {
      console.log('Dashboard fetch error:', e?.response?.data || e?.message);
      Alert.alert(tr('error'), getApiErrorMessage(e, tr('fetchDashboardFailed')));
      setMyListings([]);
      setMyRequests([]);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RENT_REQUESTS}/${requestId}/approve`, undefined, {
        headers: authHeaders,
      });
      Alert.alert(tr('approved'), tr('approvedMessage'));
      openDashboard();
    } catch (e: any) {
      console.log('Approve request error:', e?.response?.data || e?.message);
      Alert.alert(tr('error'), getApiErrorMessage(e, tr('approveFailed')));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🚜 {tr('equipmentRentals')}</Text>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, !isRentingOwn && styles.toggleActive]}
            onPress={() => {
              setIsRentingOwn(false);
              setDashboardVisible(false);
            }}>
            <Text style={styles.toggleText}>{tr('bookEquipment')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, isRentingOwn && styles.toggleActive]}
            onPress={() => {
              setIsRentingOwn(true);
              setDashboardVisible(false);
            }}>
            <Text style={styles.toggleText}>{tr('rentYourEquipment')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, dashboardVisible && styles.toggleActive]}
            onPress={openDashboard}>
            <Text style={styles.toggleText}>{tr('myRentDashboard')}</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Section */}
        {!isRentingOwn && !dashboardVisible && (
          <>
            {apiError && (
              <View style={{ backgroundColor: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#ffc107' }}>
                <Text style={{ color: '#856404', fontSize: 13 }}>{apiError}</Text>
              </View>
            )}
            
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#66bb6a" />
                <Text style={{ marginTop: 12, color: '#666' }}>{tr('loading')}</Text>
              </View>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={tr('searchEquipment')}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                <View style={styles.categories}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryButton,
                        selectedCategory === cat.value && styles.categoryActive,
                      ]}
                      onPress={() => setSelectedCategory(cat.value)}>
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === cat.value && styles.categoryTextActive,
                        ]}>
                        {tr(cat.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filterEquipment().length === 0 ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
                    <Text style={{ fontSize: 16, color: '#999', textAlign: 'center' }}>
                      {equipmentList.length === 0 
                        ? tr('noEquipmentAvailable') || 'No equipment available'
                        : tr('noMatchingEquipment') || 'No equipment matches your search'}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filterEquipment()}
                    keyExtractor={(item, index) => item._id || item.id || String(index)}
                    renderItem={({ item }) => (
                      <View style={styles.card}>
                        <View style={styles.imageContainer}>
                          <Image
                            source={
                              item.imageUrl
                                ? { uri: item.imageUrl }
                                : require('../assets/logo.png')
                            }
                            style={styles.image}
                          />
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{item.category}</Text>
                          </View>
                        </View>
                        <View style={styles.cardContent}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.price}>₹{item.price}/day</Text>
                          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                          <TouchableOpacity
                            style={styles.bookBtn}
                            onPress={() => handleBookNow(item._id || item.id)}>
                            <Text style={styles.bookText}>{tr('bookNow')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Rent Equipment Form */}
        {isRentingOwn && !dashboardVisible && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>{tr('rentOutYourEquipment')}</Text>
            <TextInput
              style={styles.input}
              placeholder={tr('equipmentName')}
              value={equipmentName}
              onChangeText={setEquipmentName}
            />
            <TextInput
              style={styles.input}
              placeholder={tr('category')}
              value={equipmentCategory}
              onChangeText={setEquipmentCategory}
            />
            <TextInput
              style={styles.input}
              placeholder={tr('pricePerDay')}
              value={equipmentPrice}
              onChangeText={setEquipmentPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder={tr('description')}
              value={equipmentDescription}
              onChangeText={setEquipmentDescription}
            />
            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
              <Text style={styles.uploadText}>{image ? tr('imageSelected') : tr('uploadImage')}</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8 }} />
            )}
            <Button title={tr('submitListing')} onPress={handleRentSubmit} />
          </View>
        )}

        {/* Dashboard Modal */}
        {dashboardVisible && (
          <Modal visible={dashboardVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={styles.title}>{tr('myEquipmentListings')}</Text>
                {(!Array.isArray(myListings) || myListings.length === 0) ? (
                  <Text>{tr('noListingsYet')}</Text>
                ) : (
                  myListings.map(listing => (
                    <View key={listing._id || listing.id} style={styles.card}>
                      <Text style={styles.name}>{listing.name}</Text>
                      <Text style={styles.price}>₹{listing.price}</Text>
                      <Text style={styles.desc}>{listing.description}</Text>
                    </View>
                  ))
                )}
                <Text style={[styles.title, { marginTop: 24 }]}>{tr('rentRequests')}</Text>
                {(!Array.isArray(myRequests) || myRequests.length === 0) ? (
                  <Text>{tr('noRequestsYet')}</Text>
                ) : (
                  myRequests.map(req => (
                    <View key={req._id} style={styles.card}>
                      <Text style={styles.name}>{tr('equipment')}: {req.equipmentName}</Text>
                      <Text>{tr('requestedBy')}: {req.requestedBy}</Text>
                      <Text>{tr('status')}: {req.status}</Text>
                      {req.status === 'pending' && (
                        <TouchableOpacity
                          style={styles.bookBtn}
                          onPress={() => handleApproveRequest(req._id)}>
                          <Text style={styles.bookText}>{tr('approve')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
                <Button title={tr('closeDashboard')} onPress={() => setDashboardVisible(false)} />
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
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: { 
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  image: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(102, 187, 106, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: { 
    flex: 1,
    padding: 12,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 6 },
  desc: { fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 18 },

  bookBtn: {
    backgroundColor: '#66bb6a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 0,
  },
  bookText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

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


