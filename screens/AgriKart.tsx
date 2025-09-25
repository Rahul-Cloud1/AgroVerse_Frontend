import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Fertilizer X', category: 'Fertilizers', price: '₹500', image: require('../assets/Images/rentitems/ferti.jpeg') },
  { id: '2', name: 'Hybrid Seeds', category: 'Seeds', price: '₹300', image: require('../assets/Images/rentitems/seeds.jpeg') },
  { id: '3', name: 'Pesticide Y', category: 'Pesticides', price: '₹250', image: require('../assets/Images/rentitems/Pesticides.jpeg') },
  { id: '4', name: 'Water Pump Z', category: 'Tools', price: '₹1500', image: require('../assets/Images/rentitems/Tools.jpg') },
  { id: '5', name: 'Tractor', category: 'Machinery', price: '₹50000', image: require('../assets/Images/rentitems/Machinery.jpeg') },
];

export default function AgriKart() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products based on search query and selected category
  const filterProducts = () => {
    const filtered = PRODUCTS.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
    setFilteredProducts(filtered);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Update the filtered products based on the selected category
    filterProducts();
  };

  const handleRequestQuote = (productName) => {
    alert(`Request for quote sent for ${productName}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🛍️ AgriKart – Wholesale & B2B</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Products"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={filterProducts}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <Text style={styles.filterText}>Filter by Category:</Text>
          <FlatList
            data={['All', 'Fertilizers', 'Seeds', 'Pesticides', 'Machinery', 'Tools']}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCategorySelect(item)}
                style={[styles.categoryBtn, selectedCategory === item && styles.selectedCategoryBtn]}>
                <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Special Offers & Bulk Deals Section */}
        <View style={styles.offersSection}>
          <Text style={styles.subtitle}>Special Offers & Bulk Deals</Text>
          <Text style={styles.offersDescription}>Check out our special deals for bulk purchases and B2B customers!</Text>
        </View>

        {/* Product Listings */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <View style={styles.productImageContainer}>
                <Image source={item.image} style={styles.productImage} />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <TouchableOpacity
                  style={styles.requestBtn}
                  onPress={() => handleRequestQuote(item.name)}>
                  <Text style={styles.requestBtnText}>Request for Quote</Text>
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
  productImage: { width: 60, height: 60, resizeMode: 'contain' },
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
