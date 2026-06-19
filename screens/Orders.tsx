import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/apiConfig';

import { useLanguage } from '../contexts/LanguageContext';

type OrderItem = {
  name: string;
  quantity: number;
  price?: number;
};

type Order = {
 _id: string;
  createdAt: string;
  address: string;
  contact: string;
  paymentMode: string;
  total: number;
  items: OrderItem[];
};

export default function Orders() {
  const { tr } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setOrders([]);
      return;
      }
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load orders (${res.status})`);
      }
      const data = await res.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (e) {
      console.log('Fetch orders error:', e);
      setError(tr('loadOrdersFailed'));
    }
  }, [tr]);

  useEffect(() => {
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{tr('orderHistory')}</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#1b5e20" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item._id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
                <Text style={styles.orderDetail}>{tr('address')}: {item.address}</Text>
                <Text style={styles.orderDetail}>{tr('contactNo')}: {item.contact}</Text>
                <Text style={styles.orderDetail}>{tr('payment')}: {item.paymentMode}</Text>
                <Text style={styles.orderDetail}>{tr('total')}: ₹{item.total}</Text>
                <Text style={styles.orderDetail}>{tr('items')}:</Text>
                {item.items.map((prod, idx) => (
                  <Text key={idx} style={styles.orderItem}>
                    - {prod.name} x {prod.quantity}
                  </Text>
                ))}
              </View>
           )}
            ListEmptyComponent={
             <Text style={{ textAlign: 'center', marginTop: 40 }}>
                {error || tr('noOrders')}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', textAlign: 'center', marginBottom: 20 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  orderDate: { fontWeight: 'bold', color: '#388e3c', marginBottom: 5 },
  orderDetail: { fontSize: 14, color: '#333' },
  orderItem: { fontSize: 13, color: '#555', marginLeft: 10 },
});
