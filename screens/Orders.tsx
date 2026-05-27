import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: number;
  date: string;
  address: string;
  contact: string;
  paymentMode: string;
  total: number;
  items: OrderItem[];
};

export default function Orders() {
  const { tr } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await AsyncStorage.getItem('orders');
      setOrders(data ? JSON.parse(data) : []);
    };
    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{tr('orderHistory')}</Text>
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderDate}>{item.date}</Text>
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
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>{tr('noOrders')}</Text>}
        />
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
