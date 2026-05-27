import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';

// Products data
const PRODUCTS = [
  { 
    id: '1', 
    name: 'Stihl Bc 230', 
    price: 500, 
    image: require('../assets/Images/PowerWeeder/bc230.jpg'), 
    category: 'Power Weeders',
    description: 'High-performance power weeder ideal for small and medium farms.',
    moreImages: [
      require('../assets/Images/PowerWeeder/bc230.jpg'),
      require('../assets/Images/PowerWeeder/bc230.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '2', 
    name: 'Cub Cadet 750', 
    price: 600, 
    image: require('../assets/Images/PowerWeeder/ft750.png'), 
    category: 'Power Weeders', 
    description: 'Reliable and efficient weeder for tough soil conditions.',
    moreImages: [
      require('../assets/Images/PowerWeeder/ft750.png'),
      require('../assets/Images/PowerWeeder/ft750.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '3', 
    name: 'Stihl Mh 710', 
    price: 700, 
    image: require('../assets/Images/PowerWeeder/mh710.jpg'), 
    category: 'Power Weeders',
    description: 'Heavy-duty machine designed for deep tillage and soil preparation.',
    moreImages: [
      require('../assets/Images/PowerWeeder/mh710.jpg'),
      require('../assets/Images/PowerWeeder/mh710.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '4', 
    name: 'Husqvarna 545', 
    price: 750, 
    image: require('../assets/Images/PowerWeeder/tf5451.png'), 
    category: 'Power Weeders',
    description: 'Powerful and compact weeder for efficient field operations.',
    moreImages: [
      require('../assets/Images/PowerWeeder/tf5451.png'),
      require('../assets/Images/PowerWeeder/tf5451.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '5', 
    name: 'Husqvarna 120', 
    price: 800, 
    image: require('../assets/Images/PowerWeeder/tf120.png'), 
    category: 'Power Weeders',
    description: 'Compact and lightweight weeder, perfect for home gardens.',
    moreImages: [
      require('../assets/Images/PowerWeeder/tf120.png'),
      require('../assets/Images/PowerWeeder/tf120.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '6', 
    name: 'Sharpex 18 inch', 
    price: 300, 
    image: require('../assets/Images/LawnMowers/spx2.jpg'), 
    category: 'Lawn Mowers',
    description: 'Durable and efficient 18-inch manual lawn mower.',
    moreImages: [
      require('../assets/Images/LawnMowers/spx2.jpg'),
      require('../assets/Images/LawnMowers/spx2.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '7', 
    name: 'Manual Lawn Mower', 
    price: 350, 
    image: require('../assets/Images/LawnMowers/easy38.jpeg'), 
    category: 'Lawn Mowers',
    description: 'Economical and lightweight manual lawn mower for small gardens.',
    moreImages: [
      require('../assets/Images/LawnMowers/easy38.jpeg'),
      require('../assets/Images/LawnMowers/easy38.jpeg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '8', 
    name: 'Honda Lawn Mower', 
    price: 250, 
    image: require('../assets/Images/LawnMowers/honda.png'), 
    category: 'Lawn Mowers',
    description: 'Petrol-powered Honda mower designed for smooth grass cutting.',
    moreImages: [
      require('../assets/Images/LawnMowers/honda.png'),
      require('../assets/Images/LawnMowers/honda.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '9', 
    name: 'Diesel Mower', 
    price: 300, 
    image: require('../assets/Images/LawnMowers/diesel.jpg'), 
    category: 'Lawn Mowers',
    description: 'Heavy-duty diesel mower for large lawn areas.',
    moreImages: [
      require('../assets/Images/LawnMowers/diesel.jpg'),
      require('../assets/Images/LawnMowers/diesel.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '10', 
    name: 'Petrol Rover', 
    price: 400, 
    image: require('../assets/Images/LawnMowers/rover.jpeg'), 
    category: 'Lawn Mowers',
    description: 'High-torque petrol mower for professional landscaping needs.',
    moreImages: [
      require('../assets/Images/LawnMowers/rover.jpeg'),
      require('../assets/Images/LawnMowers/rover.jpeg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '11', 
    name: 'Stihl MS 172', 
    price: 250, 
    image: require('../assets/Images/ChainSaw/ms172.png'), 
    category: 'Chain Saws',
    description: 'Compact chainsaw for home garden maintenance.',
    moreImages: [
      require('../assets/Images/ChainSaw/ms172.png'),
      require('../assets/Images/ChainSaw/ms172.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '12', 
    name: 'Stihl MS 182', 
    price: 300, 
    image: require('../assets/Images/ChainSaw/ms182.png'), 
    category: 'Chain Saws',
    description: 'Versatile chainsaw for pruning and light cutting work.',
    moreImages: [
      require('../assets/Images/ChainSaw/ms182.png'),
      require('../assets/Images/ChainSaw/ms182.png'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '13', 
    name: 'Stihl MS 230', 
    price: 400, 
    image: require('../assets/Images/ChainSaw/ms230.jpg'), 
    category: 'Chain Saws',
    description: 'Mid-range chainsaw designed for regular farm tasks.',
    moreImages: [
      require('../assets/Images/ChainSaw/ms230.jpg'),
      require('../assets/Images/ChainSaw/ms230.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '14', 
    name: 'Stihl MS 250', 
    price: 350, 
    image: require('../assets/Images/ChainSaw/ms250.jpg'), 
    category: 'Chain Saws',
    description: 'Powerful chainsaw for tough cutting and heavy workloads.',
    moreImages: [
      require('../assets/Images/ChainSaw/ms250.jpg'),
      require('../assets/Images/ChainSaw/ms250.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '15', 
    name: 'Stihl MS 382', 
    price: 450, 
    image: require('../assets/Images/ChainSaw/ms382.jpg'), 
    category: 'Chain Saws',
    description: 'Robust professional chainsaw for continuous usage.',
    moreImages: [
      require('../assets/Images/ChainSaw/ms382.jpg'),
      require('../assets/Images/ChainSaw/ms382.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '16', 
    name: 'Stihl Electric', 
    price: 1500, 
    image: require('../assets/Images/BrushCutter/fse81.jpg'), 
    category: 'Brush Cutters',
    description: 'Electric brush cutter ideal for trimming in residential areas.',
    moreImages: [
      require('../assets/Images/BrushCutter/fse81.jpg'),
      require('../assets/Images/BrushCutter/fse81.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '17', 
    name: 'Stihl FS 120', 
    price: 2500, 
    image: require('../assets/Images/BrushCutter/fs120.jpg'), 
    category: 'Brush Cutters',
    description: 'Powerful and reliable brush cutter for heavy vegetation.',
    moreImages: [
      require('../assets/Images/BrushCutter/fs120.jpg'),
      require('../assets/Images/BrushCutter/fs120.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '18', 
    name: 'Stihl Fs 380', 
    price: 3000, 
    image: require('../assets/Images/BrushCutter/fs380.jpg'), 
    category: 'Brush Cutters',
    description: 'Heavy-duty cutter for agricultural and industrial use.',
    moreImages: [
      require('../assets/Images/BrushCutter/fs380.jpg'),
      require('../assets/Images/BrushCutter/fs380.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
  { 
    id: '19', 
    name: 'Stihl Fs 410', 
    price: 4500, 
    image: require('../assets/Images/BrushCutter/fs410.jpg'), 
    category: 'Brush Cutters',
    description: 'Professional-grade cutter with extended runtime performance.',
    moreImages: [
      require('../assets/Images/BrushCutter/fs410.jpg'),
      require('../assets/Images/BrushCutter/fs410.jpg'),
    ],
  },
  { 
    id: '20', 
    name: 'Stihl Fs 460', 
    price: 3500, 
    image: require('../assets/Images/BrushCutter/fs460.jpg'), 
    category: 'Brush Cutters',
    description: 'High-power cutter designed for continuous large-area cutting.',
    moreImages: [
      require('../assets/Images/BrushCutter/fs460.jpg'),
      require('../assets/Images/BrushCutter/fs460.jpg'),
      require('../assets/Images/BrushCutter/fs460.jpg'),
    ],
    videos: ['https://www.example.com/video1.mp4'],
  },
];

const CATEGORY_OPTIONS = [
  { labelKey: 'all', value: '' },
  { labelKey: 'powerWeeders', value: 'Power Weeders' },
  { labelKey: 'lawnMowers', value: 'Lawn Mowers' },
  { labelKey: 'chainSaws', value: 'Chain Saws' },
  { labelKey: 'brushCutters', value: 'Brush Cutters' },
];



if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}



import { StackNavigationProp } from '@react-navigation/stack';

type AgroMartProps = {
  navigation: StackNavigationProp<any>;
};

export default function AgroMart({ navigation }: AgroMartProps) {
  const { tr } = useLanguage();
  const [cart, setCart] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [paymentMode, setPaymentMode] = useState('COD');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const addToCart = (item: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const showProductDetails = (item: any) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = PRODUCTS.filter(item => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearchQuery && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCheckout = async () => {
    if (!address || !contact) {
      alert(tr('enterAddressContact'));
      return;
    }
    // Save order to AsyncStorage
    const order = {
      id: Date.now(),
      items: cart,
      total,
      address,
      contact,
      paymentMode,
      date: new Date().toLocaleString(),
    };
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      const prevOrders = ordersData ? JSON.parse(ordersData) : [];
      await AsyncStorage.setItem('orders', JSON.stringify([order, ...prevOrders]));
    } catch (e) {}
    setOrderConfirmed(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutVisible(false);
      setCartVisible(false);
      setOrderConfirmed(false);
      setAddress('');
      setContact('');
      setPaymentMode('COD');
      // Optionally navigate to Orders page
      // navigation.navigate('Orders');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{tr('productStore')}</Text>

        <View style={styles.topBar}>
          <TextInput
            style={styles.searchBar}
            placeholder={tr('searchProducts')}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.cartBtnTop} onPress={() => setCartVisible(true)}>
            <Text style={styles.cartText}>🛒 {cart.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilterContainer}>
          <FlatList
            data={CATEGORY_OPTIONS}
            keyExtractor={item => item.labelKey}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCategorySelect(item.value)}
                style={[
                  styles.categoryBtn,
                  selectedCategory === item.value && styles.selectedCategoryBtn,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.value && styles.selectedCategoryText,
                  ]}
                >
                  {tr(item.labelKey)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Animated.View style={styles.item}>
              <TouchableOpacity onPress={() => showProductDetails(item)}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.productInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
                    <Text style={styles.cartText}>{tr('addToCart')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buyNowBtn}>
                    <Text style={styles.buyNowText}>{tr('buyNow')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />

        {/* Cart Modal */}
        <Modal visible={cartVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>🛍️ {tr('yourCart')}</Text>
              {cart.map((item, idx) => (
                <Text key={idx} style={styles.modalText}>
                  {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                </Text>
              ))}
              <Text style={[styles.modalText, { fontWeight: 'bold' }]}>
                {tr('total')}: ₹{total}
              </Text>
              <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCheckoutVisible(true)}>
                <Text style={styles.checkoutText}>{tr('checkout')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCartVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>{tr('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Checkout Modal */}
        <Modal visible={checkoutVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{tr('checkout')}</Text>
              {orderConfirmed ? (
                <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                  {tr('orderConfirmed')}
                </Text>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={tr('deliveryAddress')}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={tr('contactNumber')}
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                  />
                  <Text style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>{tr('paymentMode')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      paymentMode === 'COD' && { backgroundColor: '#388e3c' },
                    ]}
                    onPress={() => setPaymentMode('COD')}
                  >
                    <Text style={{ color: paymentMode === 'COD' ? '#fff' : '#388e3c' }}>{tr('cashOnDelivery')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      paymentMode === 'ONLINE' && { backgroundColor: '#388e3c' },
                    ]}
                    onPress={() => setPaymentMode('ONLINE')}
                    disabled // Only COD enabled for now
                  >
                    <Text style={{ color: paymentMode === 'ONLINE' ? '#fff' : '#388e3c', opacity: 0.5 }}>
                      {tr('onlinePaymentSoon')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>{tr('placeOrder')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setCheckoutVisible(false)} style={styles.closeBtn}>
                    <Text style={styles.closeText}>{tr('cancel')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Product Details Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
              <Image source={selectedProduct?.image} style={styles.modalImage} />
              <Text style={styles.modalText}>{tr('price')}: ₹{selectedProduct?.price}</Text>
              <Text style={styles.modalDescription}>{selectedProduct?.description}</Text>

              {/* More Images */}
              <FlatList
                data={selectedProduct?.moreImages}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moreImagesContainer}
                renderItem={({ item }) => <Image source={item} style={styles.moreImage} />}
              />

              {/* Product Videos */}
              {selectedProduct?.videos?.map((videoUrl: string, index: number) => (
                <View key={index} style={styles.videoContainer}>
                  <Text style={styles.videoText}>{tr('video')} {index + 1}</Text>
                  {/* Replace with actual video player component */}
                  <Text style={styles.videoUrl}>{videoUrl}</Text>
                </View>
              ))}

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>{tr('close')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}



/// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', textAlign: 'center', marginBottom: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  searchBar: {
    flex: 1,
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cartBtnTop: { backgroundColor: '#ff5722', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 30 },
  cartText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  categoryFilterContainer: { marginBottom: 20 },
  categoryList: { paddingVertical: 10 },
  categoryBtn: {
    backgroundColor: '#e8f5e9',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 12,
  },
  selectedCategoryBtn: { backgroundColor: '#81c784' },
  categoryText: { color: '#2e7d32', fontWeight: '600', fontSize: 14 },
  selectedCategoryText: { color: '#fff' },
  item: { backgroundColor: '#ffffff', borderRadius: 15, padding: 15, marginBottom: 20, alignItems: 'center' },
  image: { width: 160, height: 160, borderRadius: 10, marginBottom: 10, resizeMode: 'contain' },
  productInfo: { alignItems: 'center' },
  name: { fontWeight: 'bold', fontSize: 16, color: '#388e3c' },
  price: { fontSize: 14, color: '#388e3c', marginBottom: 10 },
  cartBtn: { backgroundColor: '#ff5722', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 30, marginBottom: 5 },
  buyNowBtn: { backgroundColor: '#388e3c', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 30 },
  buyNowText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 15, width: Dimensions.get('window').width - 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  modalText: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  modalImage: { width: '100%', height: 200, borderRadius: 15, resizeMode: 'contain', marginBottom: 10 },
  modalDescription: { fontSize: 12, color: '#555', marginBottom: 10 },
  moreImagesContainer: { paddingVertical: 5 },
  moreImage: { width: 100, height: 100, borderRadius: 10, marginRight: 10, resizeMode: 'contain' },
  videoContainer: { marginTop: 10, marginBottom: 20 },
  videoText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  videoUrl: { fontSize: 14, color: '#388e3c', textAlign: 'center' },
  closeBtn: { backgroundColor: '#f44336', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 30, marginTop: 15 },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  checkoutBtn: { backgroundColor: '#388e3c', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 15 },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#eef8e9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#388e3c',
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    alignItems: 'center',
  },
});
