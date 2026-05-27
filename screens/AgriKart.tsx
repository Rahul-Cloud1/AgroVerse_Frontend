
import React, { useState } from 'react';
import { SafeAreaView,  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

type Product = {
  id: string;
  nameKey: string;
  categoryKey: string;
  category: string;
  price: string;
  image: any;
};

const PRODUCTS: Product[] = [
  { id: '1', nameKey: 'fertilizerX', categoryKey: 'fertilizers', category: 'Fertilizers', price: '₹500', image: require('../assets/Images/rentitems/ferti.jpeg') },
  { id: '2', nameKey: 'hybridSeeds', categoryKey: 'seeds', category: 'Seeds', price: '₹300', image: require('../assets/Images/rentitems/seeds.jpeg') },
  { id: '3', nameKey: 'pesticideY', categoryKey: 'pesticides', category: 'Pesticides', price: '₹250', image: require('../assets/Images/rentitems/Pesticides.jpeg') },
  { id: '4', nameKey: 'waterPumpZ', categoryKey: 'tools', category: 'Tools', price: '₹1500', image: require('../assets/Images/rentitems/Tools.jpg') },
  { id: '5', nameKey: 'tractor', categoryKey: 'machinery', category: 'Machinery', price: '₹50000', image: require('../assets/Images/rentitems/Machinery.jpeg') },
];

const CATEGORIES = [
  { labelKey: 'all', value: 'All' },
  { labelKey: 'fertilizers', value: 'Fertilizers' },
  { labelKey: 'seeds', value: 'Seeds' },
  { labelKey: 'pesticides', value: 'Pesticides' },
  { labelKey: 'machinery', value: 'Machinery' },
  { labelKey: 'tools', value: 'Tools' },
];

export default function AgriKart() {
  const { tr } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredProducts = PRODUCTS.filter(item => {
  const translatedName = tr(item.nameKey).toLowerCase();

  const matchesQuery =
    translatedName.includes(searchQuery.toLowerCase());

  const matchesCategory =
    selectedCategory === 'All' ||
    item.category === selectedCategory;

  return matchesQuery && matchesCategory;
});

  // Filter products based on search query and selected category
 

  // Handle category selection
 // Handle category selection
const handleCategorySelect = (category: string) => {
  setSelectedCategory(category);
};

const handleRequestQuote = (productName: string) => {
  alert(`Request for quote sent for ${productName}`);
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🛍️ {tr('wholesaleB2B')}</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder={tr('searchProducts')}
            value={searchQuery}
           onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>{tr('search')}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
<View style={styles.categoryFilter}>
  <Text style={styles.filterText}>
    {tr('filterByCategory')}
  </Text>

  <FlatList
    data={CATEGORIES}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.value}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => handleCategorySelect(item.value)}
        style={[
          styles.categoryBtn,
          selectedCategory === item.value &&
            styles.selectedCategoryBtn,
        ]}>
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.value &&
              styles.selectedCategoryText,
          ]}>
          {tr(item.labelKey)}
        </Text>
      </TouchableOpacity>
    )}
  />
</View>

        {/* Special Offers & Bulk Deals Section */}
        <View style={styles.offersSection}>
          <Text style={styles.subtitle}>{tr('specialOffers')}</Text>
          <Text style={styles.offersDescription}>{tr('specialOffersDescription')}</Text>
        </View>

        {/* Product Listings */}
<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item.id}
  ListEmptyComponent={
    <Text
      style={{
        textAlign: 'center',
        marginTop: 40,
        color: '#666',
        fontSize: 16,
      }}>
      No products found
    </Text>
  }
  renderItem={({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        <Image
          source={item.image}
          style={styles.productImage}
        />
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productName}>
          {tr(item.nameKey)}
        </Text>

        <Text style={styles.productCategory}>
          {tr(item.categoryKey)}
        </Text>

        <Text style={styles.productPrice}>
          {item.price}
        </Text>

        <TouchableOpacity
          style={styles.requestBtn}
          onPress={() =>
            handleRequestQuote(tr(item.nameKey))
          }>
          <Text style={styles.requestBtnText}>
            {tr('requestQuote')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#388E3C', textAlign: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1,
  },
  searchBtn: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  categoryFilter: { marginBottom: 20 },
  filterText: { fontSize: 16, color: '#388E3C', marginBottom: 10 },
  categoryBtn: {
    backgroundColor: '#388E3C',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryBtn: {
    backgroundColor: '#43A047',
  },
  categoryText: { color: '#fff', fontWeight: 'bold' },
  selectedCategoryText: { color: '#fff' },
  offersSection: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#388E3C' },
  offersDescription: { fontSize: 14, color: '#7b7b7b', marginTop: 5 },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
productImage: {
  width: 80,
  height: 80,
  borderRadius: 8,
  resizeMode: 'cover',
},
  productDetails: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  productCategory: { fontSize: 14, color: '#7b7b7b' },
  productPrice: { fontSize: 16, color: '#388E3C', marginTop: 5 },
  requestBtn: {
    backgroundColor: '#43a047',
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestBtnText: { color: '#fff', fontWeight: 'bold' },
});
