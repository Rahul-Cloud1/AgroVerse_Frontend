import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import { Alert, ActivityIndicator, Modal, Linking } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import cropCalendarData from '../assets/crop.json';
import cropPriceData from '../assets/cropPrice.json';
import { LANGUAGE_OPTIONS, LanguageCode, useLanguage } from '../contexts/LanguageContext';

const CROP_OPTIONS = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Soybean'] as const;
const SOIL_OPTIONS = ['Loamy', 'Clay', 'Sandy', 'Black', 'Red'] as const;
type CropOption = typeof CROP_OPTIONS[number];
type SoilOption = typeof SOIL_OPTIONS[number];
const UI_TEXT = {
  en: {
    title: 'KrishiMitra - Your Smart Farming Companion',
    cropAdvisory: 'AI Crop Advisory',
    selectCrop: 'Select Crop:',
    selectSoil: 'Select Soil Type:',
    getRecommendations: 'Get Recommendations',
    missingSelection: 'Please select both crop and soil type.',
    pestDetection: 'Pest/Disease Detection',
    uploadPlantImage: 'Upload Plant Image',
    seasonalCalendar: 'Seasonal Crop Calendar',
    calendarDescription: 'Select your state to view sowing/harvesting months and crops.',
    selectState: 'Select State:',
    showCropCalendar: 'Show Crop Calendar',
    noCalendarData: 'No data found for this state.',
    calendarError: 'Error loading crop calendar.',
    weatherTitle: 'Live Weather Updates',
    weatherDescription: 'Location-based real-time weather info.',
    checkWeather: 'Check Weather',
    loading: 'Loading...',
    pricesTitle: 'Crop Price Trends',
    pricesDescription: 'See real-time mandi prices and trends.',
    viewPrices: 'View Prices',
    newsTitle: 'Agri News Feed',
    readLatestNews: 'Read Latest News',
    
  
    voiceTitle: 'Voice-Based Tips',
    playAdvice: 'Play Advice',
    languageTitle: 'Language Support',
    selectLanguage: 'Select Language:',
    applyLanguage: 'Apply Language',
    languageApplied: 'Language updated.',
    cropPrices: 'Crop Prices',
    filterState: 'Filter by State:',
    filterCommodity: 'Filter by Commodity:',
    all: 'All',
    close: 'Close',
    agriNews: 'Agri News',
    noNews: 'No news found.',
    noPriceData: 'No data available.',
    permissionDenied: 'Permission Denied',
    permissionMessage: 'Location permission is required for weather updates.',
    locationUnavailable: 'Location not available',
    locationMessage: 'Please allow location access.',
    weatherFailed: 'Unable to fetch weather data.',
    newsFailed: 'Unable to fetch news. Please try again later.',
    uploadTitle: 'Upload',
    uploadMessage: 'Image picker for pest/disease detection will be added.',
    
    voiceMessage: 'Voice tips will play.',
  },
  es: {
    title: 'KrishiMitra - Tu compañero agrícola inteligente',
    cropAdvisory: 'Asesoría de cultivos con IA',
    selectCrop: 'Seleccionar cultivo:',
    selectSoil: 'Seleccionar tipo de suelo:',
    getRecommendations: 'Obtener recomendaciones',
    missingSelection: 'Seleccione cultivo y tipo de suelo.',
    pestDetection: 'Detección de plagas/enfermedades',
    uploadPlantImage: 'Subir imagen de planta',
    seasonalCalendar: 'Calendario de cultivos',
    calendarDescription: 'Seleccione su estado para ver meses de siembra/cosecha y cultivos.',
    selectState: 'Seleccionar estado:',
    showCropCalendar: 'Mostrar calendario',
    noCalendarData: 'No hay datos para este estado.',
    calendarError: 'Error al cargar el calendario.',
    weatherTitle: 'Clima en vivo',
    weatherDescription: 'Información meteorológica en tiempo real según ubicación.',
    checkWeather: 'Consultar clima',
    loading: 'Cargando...',
    pricesTitle: 'Tendencias de precios',
    pricesDescription: 'Vea precios y tendencias de mandi en tiempo real.',
    viewPrices: 'Ver precios',
    newsTitle: 'Noticias agrícolas',
    readLatestNews: 'Leer noticias',
   
    voiceTitle: 'Consejos por voz',
    playAdvice: 'Reproducir consejo',
    languageTitle: 'Soporte de idioma',
    selectLanguage: 'Seleccionar idioma:',
    applyLanguage: 'Aplicar idioma',
    languageApplied: 'Idioma actualizado.',
    cropPrices: 'Precios de cultivos',
    filterState: 'Filtrar por estado:',
    filterCommodity: 'Filtrar por producto:',
    all: 'Todos',
    close: 'Cerrar',
    agriNews: 'Noticias agrícolas',
    noNews: 'No se encontraron noticias.',
    noPriceData: 'No hay datos disponibles.',
    permissionDenied: 'Permiso denegado',
    permissionMessage: 'Se requiere permiso de ubicación para el clima.',
    locationUnavailable: 'Ubicación no disponible',
    locationMessage: 'Permita el acceso a la ubicación.',
    weatherFailed: 'No se pudo obtener el clima.',
    newsFailed: 'No se pudieron obtener noticias. Inténtelo más tarde.',
    uploadTitle: 'Subir',
    uploadMessage: 'Se agregará selector de imagen para detectar plagas/enfermedades.',
    
    voiceMessage: 'Los consejos de voz se reproducirán.',
  },
  fr: {
    title: 'KrishiMitra - Votre assistant agricole intelligent',
    cropAdvisory: 'Conseil cultures IA',
    selectCrop: 'Choisir une culture :',
    selectSoil: 'Choisir le type de sol :',
    getRecommendations: 'Obtenir des recommandations',
    missingSelection: 'Veuillez choisir une culture et un type de sol.',
    pestDetection: 'Détection parasites/maladies',
    uploadPlantImage: 'Importer une image de plante',
    seasonalCalendar: 'Calendrier saisonnier',
    calendarDescription: 'Choisissez votre état pour voir les mois de semis/récolte et les cultures.',
    selectState: 'Choisir un état :',
    showCropCalendar: 'Afficher le calendrier',
    noCalendarData: 'Aucune donnée pour cet état.',
    calendarError: 'Erreur de chargement du calendrier.',
    weatherTitle: 'Météo en direct',
    weatherDescription: 'Infos météo en temps réel selon la position.',
    checkWeather: 'Vérifier la météo',
    loading: 'Chargement...',
    pricesTitle: 'Tendances des prix',
    pricesDescription: 'Voir les prix mandi et tendances en temps réel.',
    viewPrices: 'Voir les prix',
    newsTitle: 'Actualités agricoles',
    readLatestNews: 'Lire les actualités',
    
    voiceTitle: 'Conseils vocaux',
    playAdvice: 'Lire le conseil',
    languageTitle: 'Langue',
    selectLanguage: 'Choisir la langue :',
    applyLanguage: 'Appliquer la langue',
    languageApplied: 'Langue mise à jour.',
    cropPrices: 'Prix des cultures',
    filterState: 'Filtrer par état :',
    filterCommodity: 'Filtrer par produit :',
    all: 'Tous',
    close: 'Fermer',
    agriNews: 'Actualités agricoles',
    noNews: 'Aucune actualité trouvée.',
    noPriceData: 'Aucune donnée disponible.',
    permissionDenied: 'Permission refusée',
    permissionMessage: 'La permission de localisation est requise pour la météo.',
    locationUnavailable: 'Position indisponible',
    locationMessage: 'Veuillez autoriser l’accès à la position.',
    weatherFailed: 'Impossible de récupérer la météo.',
    newsFailed: 'Impossible de récupérer les actualités. Réessayez plus tard.',
    uploadTitle: 'Importer',
    uploadMessage: 'Le sélecteur d’image pour la détection sera ajouté.',
    
  },
  hi: {
    title: 'कृषिमित्र - आपका स्मार्ट खेती साथी',
    cropAdvisory: 'एआई फसल सलाह',
    selectCrop: 'फसल चुनें:',
    selectSoil: 'मिट्टी का प्रकार चुनें:',
    getRecommendations: 'सलाह पाएं',
    missingSelection: 'कृपया फसल और मिट्टी दोनों चुनें।',
    pestDetection: 'कीट/रोग पहचान',
    uploadPlantImage: 'पौधे की फोटो अपलोड करें',
    seasonalCalendar: 'मौसमी फसल कैलेंडर',
    calendarDescription: 'बुवाई/कटाई के महीने और फसलें देखने के लिए अपना राज्य चुनें।',
    selectState: 'राज्य चुनें:',
    showCropCalendar: 'फसल कैलेंडर दिखाएं',
    noCalendarData: 'इस राज्य के लिए डेटा नहीं मिला।',
    calendarError: 'फसल कैलेंडर लोड करने में त्रुटि।',
    weatherTitle: 'लाइव मौसम अपडेट',
    weatherDescription: 'स्थान आधारित रियल-टाइम मौसम जानकारी।',
    checkWeather: 'मौसम देखें',
    loading: 'लोड हो रहा है...',
    pricesTitle: 'फसल मूल्य रुझान',
    pricesDescription: 'रियल-टाइम मंडी कीमतें और रुझान देखें।',
    viewPrices: 'कीमतें देखें',
    newsTitle: 'कृषि समाचार',
    readLatestNews: 'ताजा समाचार पढ़ें',
    
    voiceTitle: 'आवाज आधारित सुझाव',
    playAdvice: 'सलाह सुनें',
    languageTitle: 'भाषा समर्थन',
    selectLanguage: 'भाषा चुनें:',
    applyLanguage: 'भाषा लागू करें',
    languageApplied: 'भाषा अपडेट हो गई।',
    cropPrices: 'फसल कीमतें',
    filterState: 'राज्य से फिल्टर करें:',
    filterCommodity: 'कमोडिटी से फिल्टर करें:',
    all: 'सभी',
    close: 'बंद करें',
    agriNews: 'कृषि समाचार',
    noNews: 'कोई समाचार नहीं मिला।',
    noPriceData: 'डेटा उपलब्ध नहीं है।',
    permissionDenied: 'अनुमति अस्वीकृत',
    permissionMessage: 'मौसम अपडेट के लिए लोकेशन अनुमति जरूरी है।',
    locationUnavailable: 'लोकेशन उपलब्ध नहीं',
    locationMessage: 'कृपया लोकेशन एक्सेस की अनुमति दें।',
    weatherFailed: 'मौसम डेटा प्राप्त नहीं हो सका।',
    newsFailed: 'समाचार प्राप्त नहीं हो सके। कृपया बाद में प्रयास करें।',
    uploadTitle: 'अपलोड',
    uploadMessage: 'कीट/रोग पहचान के लिए इमेज पिकर जोड़ा जाएगा।',
    
  },
};

const ADVICE = {
  Wheat: {
    Loamy: 'Wheat grows best in well-drained loamy soil with good fertility. Ensure timely irrigation and use nitrogen-rich fertilizers.',
    Clay: 'Wheat can grow in clay soil, but ensure proper drainage and avoid waterlogging.',
    Sandy: 'Add organic matter to sandy soil for wheat. Frequent irrigation is needed.',
    Black: 'Black soil is suitable for wheat. Maintain soil moisture and use balanced fertilizers.',
    Red: 'Red soil needs organic amendments for wheat. Use compost and irrigate regularly.',
  },
  Rice: {
    Loamy: 'Loamy soil is good for rice. Maintain standing water during growth.',
    Clay: 'Clay soil is ideal for rice. Ensure proper puddling before transplanting.',
    Sandy: 'Rice in sandy soil needs frequent irrigation and organic matter.',
    Black: 'Black soil can be used for rice with proper water management.',
    Red: 'Red soil needs organic matter and regular irrigation for rice.',
  },
  Maize: {
    Loamy: 'Maize thrives in loamy soil. Use phosphorus-rich fertilizers.',
    Clay: 'Clay soil needs good drainage for maize. Avoid waterlogging.',
    Sandy: 'Sandy soil for maize requires frequent watering and organic matter.',
    Black: 'Black soil is good for maize. Ensure timely sowing.',
    Red: 'Red soil needs organic amendments for maize.',
  },
  Cotton: {
    Loamy: 'Loamy soil is excellent for cotton. Use potash-rich fertilizers.',
    Clay: 'Cotton can grow in clay soil with good drainage.',
    Sandy: 'Sandy soil is not ideal for cotton. Add organic matter.',
    Black: 'Black soil is best for cotton. Ensure deep ploughing.',
    Red: 'Red soil needs organic matter for cotton.',
  },
  Soybean: {
    Loamy: 'Soybean prefers loamy soil. Use phosphorus and potassium fertilizers.',
    Clay: 'Clay soil needs good drainage for soybean.',
    Sandy: 'Sandy soil for soybean requires frequent irrigation.',
    Black: 'Black soil is suitable for soybean.',
    Red: 'Red soil needs organic matter for soybean.',
  },
};

export default function KrishiMitra() {
  const { language: selectedLanguage, setLanguage, tr } = useLanguage();
  const t = new Proxy({}, {
    get: (_target, key) => {
      const translationKey = key === 'title'
        ? 'krishiTitle'
        : key === 'languageTitle'
          ? 'language'
          : String(key);
      return tr(translationKey);
    },
  }) as Record<string, string>;

  // AI Crop Advisory
  const [crop, setCrop] = useState<CropOption>(CROP_OPTIONS[0] as CropOption);
  const [soil, setSoil] = useState<SoilOption>(SOIL_OPTIONS[0] as SoilOption);
  const [advice, setAdvice] = useState('');

  // Weather
  const [weather, setWeather] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Crop Calendar
  const [selectedState, setSelectedState] = useState(
    cropCalendarData[0]?.state || ''
  );
  const [calendarResults, setCalendarResults] = useState<typeof cropCalendarData>([]);
  const [calendarError, setCalendarError] = useState('');

  // Crop Price Trends
  const [pricesVisible, setPricesVisible] = useState(false);
  const [selectedPriceState, setSelectedPriceState] = useState('');
  const [selectedPriceCommodity, setSelectedPriceCommodity] = useState('');
  const [filteredPrices, setFilteredPrices] = useState<typeof cropPriceData>([]);

  // Agri News
  const [newsVisible, setNewsVisible] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsError, setNewsError] = useState('');

  // Get all unique states and commodities from cropPriceData
  const PRICE_STATES = Array.from(new Set(cropPriceData.map(item => item.state))).sort();
  const PRICE_COMMODITIES = Array.from(new Set(cropPriceData.map(item => item.commodity))).sort();

  // Get all unique states from crop.json
  const STATES = cropCalendarData
    .map((entry) => entry.state)
    .filter(Boolean)
    .sort();

  // Requesting location permission and fetching location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.permissionDenied, t.permissionMessage);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  // AI Crop Advisory logic
  const handleGetRecommendations = () => {
    if (crop && soil) {
      setAdvice(ADVICE[crop][soil]);
    } else {
      setAdvice(t.missingSelection);
    }
  };

  // Weather fetch logic
  const fetchWeather = async () => {
    if (!location) {
      Alert.alert(t.locationUnavailable, t.locationMessage);
      return;
    }
    setWeatherLoading(true);
    const { latitude, longitude } = location.coords;
    const apiKey = 'b1992fdf15fb7860662c4542def14e02'; // Replace with your OpenWeatherMap API Key
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      setWeather(
        `${t.location}: ${data.name}\n${t.weather}: ${data.weather[0].description}\n${t.temperature}: ${data.main.temp}°C\n${t.humidity}: ${data.main.humidity}%`
      );
    } catch (error) {
      setWeather(t.weatherFailed);
    }
    setWeatherLoading(false);
  };

  // Crop Calendar logic
  const handleFetchCalendar = () => {
    try {
      const filtered = cropCalendarData.filter(
        (entry) => entry.state === selectedState
      );
      setCalendarResults(filtered);
      setCalendarError(filtered.length === 0 ? t.noCalendarData : '');
    } catch (e) {
      setCalendarError(t.calendarError);
      setCalendarResults([]);
    }
  };

  // Crop Price Trends logic
  const handleViewPrices = () => {
    setPricesVisible(true);
    // Default filter: show all if nothing selected
    let filtered = cropPriceData;
    if (selectedPriceState) {
      filtered = filtered.filter(item => item.state === selectedPriceState);
    }
    if (selectedPriceCommodity) {
      filtered = filtered.filter(item => item.commodity === selectedPriceCommodity);
    }
    setFilteredPrices(filtered);
  };

  // Update filtered prices when filters change
  useEffect(() => {
    if (pricesVisible) {
      let filtered = cropPriceData;
      if (selectedPriceState) {
        filtered = filtered.filter(item => item.state === selectedPriceState);
      }
      if (selectedPriceCommodity) {
        filtered = filtered.filter(item => item.commodity === selectedPriceCommodity);
      }
      setFilteredPrices(filtered);
    }
  }, [selectedPriceState, selectedPriceCommodity, pricesVisible]);

  const handleClosePrices = () => {
    setPricesVisible(false);
    setSelectedPriceState('');
    setSelectedPriceCommodity('');
    setFilteredPrices([]);
  };

  // Agri News logic
  const fetchAgriNews = async () => {
    setNewsVisible(true);
    setNewsLoading(true);
    setNewsError('');
    setNewsArticles([]);
    try {
      // Replace YOUR_API_KEY with your NewsAPI.org API key
      const response = await axios.get(
        'https://newsapi.org/v2/everything?q=agriculture OR farming OR crops&language=en&sortBy=publishedAt&pageSize=10&apiKey=91b30bc7f1614a1394e0b98852a71807'
      );
      setNewsArticles(response.data.articles);
    } catch (e) {
      setNewsError(t.newsFailed);
    }
    setNewsLoading(false);
  };

  // Other handlers
  const handleUploadImage = () => {
    Alert.alert(t.uploadTitle, t.uploadMessage);
  };

  const handleTranslate = () => {
    Alert.alert(t.languageTitle, t.languageApplied);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t.title}</Text>

        {/* Language Support */}
        <FeatureCard title={t.languageTitle} icon={<Ionicons name="language" size={20} color="#3949ab" />}>
          <Text style={styles.label}>{t.selectLanguage}</Text>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(value) => setLanguage(value as LanguageCode)}
            style={styles.picker}
          >
            {LANGUAGE_OPTIONS.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
          <PrimaryButton text={t.applyLanguage} onPress={handleTranslate} />
        </FeatureCard>

        {/* AI Crop Advisory */}
        <FeatureCard title={t.cropAdvisory} icon={<FontAwesome5 name="seedling" size={20} color="#33691e" />}>
          <Text style={styles.label}>{t.selectCrop}</Text>
          <Picker
            selectedValue={crop}
            onValueChange={(value) => setCrop(value as CropOption)}
            style={styles.picker}
          >
            {CROP_OPTIONS.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          <Text style={styles.label}>{t.selectSoil}</Text>
          <Picker
            selectedValue={soil}
            onValueChange={(value) => setSoil(value as SoilOption)}
            style={styles.picker}
          >
            {SOIL_OPTIONS.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          <PrimaryButton text={t.getRecommendations} onPress={handleGetRecommendations} />
          {advice ? <Text style={styles.advice}>{advice}</Text> : null}
        </FeatureCard>

       
        {/* Seasonal Calendar */}
        <FeatureCard title={t.seasonalCalendar} icon={<Ionicons name="calendar" size={20} color="#33691e" />}>
          <Text style={styles.description}>{t.calendarDescription}</Text>
          <Text style={styles.label}>{t.selectState}</Text>
          <Picker
            selectedValue={selectedState}
            onValueChange={setSelectedState}
            style={styles.picker}
          >
            {STATES.map((state) => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
          <PrimaryButton text={t.showCropCalendar} onPress={handleFetchCalendar} />
          {calendarError ? <Text style={{ color: 'red', marginTop: 10 }}>{calendarError}</Text> : null}
          {calendarResults.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {calendarResults.map((item, idx) => (
                <View key={idx}>
                  <Text style={{ fontWeight: 'bold', color: '#33691e', marginBottom: 5 }}>{item.state}</Text>
                  <View style={{ backgroundColor: '#eef8e9', borderRadius: 8, padding: 8, marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{t.kharifSeason}</Text>
                    <Text>{t.months}: {item.kharif.months.join(', ')}</Text>
                    <Text>{t.crops}: {item.kharif.crops.join(', ')}</Text>
                  </View>
                  <View style={{ backgroundColor: '#f3e5f5', borderRadius: 8, padding: 8, marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{t.rabiSeason}</Text>
                    <Text>{t.months}: {item.rabi.months.join(', ')}</Text>
                    <Text>{t.crops}: {item.rabi.crops.join(', ')}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </FeatureCard>

        {/* Weather */}
        <FeatureCard title={t.weatherTitle} icon={<Ionicons name="cloud-outline" size={22} color="#039be5" />}>
          <Text style={styles.description}>{t.weatherDescription}</Text>
          <PrimaryButton text={weatherLoading ? t.loading : t.checkWeather} onPress={fetchWeather} />
          {weather ? <Text style={styles.weather}>{weather}</Text> : null}
        </FeatureCard>

        {/* Prices */}
        <FeatureCard title={t.pricesTitle} icon={<MaterialIcons name="trending-up" size={22} color="#2e7d32" />}>
          <Text style={styles.description}>{t.pricesDescription}</Text>
          <PrimaryButton text={t.viewPrices} onPress={handleViewPrices} />
        </FeatureCard>

        {/* Agri News */}
        <FeatureCard title={t.newsTitle} icon={<Entypo name="news" size={20} color="#6d4c41" />}>
          <PrimaryButton text={t.readLatestNews} onPress={fetchAgriNews} />
        </FeatureCard>

        

       

      </ScrollView>

      {/* Crop Prices Modal */}
      <Modal visible={pricesVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t.cropPrices}</Text>
            <Text style={styles.label}>{t.filterState}</Text>
            <Picker
              selectedValue={selectedPriceState}
              onValueChange={setSelectedPriceState}
              style={styles.picker}
            >
              <Picker.Item label={t.all} value="" />
              {PRICE_STATES.map(state => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
            <Text style={styles.label}>{t.filterCommodity}</Text>
            <Picker
              selectedValue={selectedPriceCommodity}
              onValueChange={setSelectedPriceCommodity}
              style={styles.picker}
            >
              <Picker.Item label={t.all} value="" />
              {PRICE_COMMODITIES.map(commodity => (
                <Picker.Item key={commodity} label={commodity} value={commodity} />
              ))}
            </Picker>
            <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
              {filteredPrices.length === 0 ? (
                <Text>{t.noPriceData}</Text>
              ) : (
                filteredPrices.map((item, idx) => (
                  <View key={idx} style={styles.priceCard}>
                    <Text style={{ fontWeight: 'bold' }}>{item.commodity} ({item.variety})</Text>
                    <Text>{t.market}: {item.market}, {t.district}: {item.district}, {t.state}: {item.state}</Text>
                    <Text>{t.date}: {item.arrival_date}</Text>
                    <Text>{t.min}: ₹{item.min_price}  {t.max}: ₹{item.max_price}  {t.modal}: ₹{item.modal_price} ({item.unit})</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <PrimaryButton text={t.close} onPress={handleClosePrices} />
          </View>
        </View>
      </Modal>

      {/* Agri News Modal */}
      <Modal visible={newsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t.agriNews}</Text>
            {newsLoading ? (
              <ActivityIndicator size="large" color="#33691e" />
            ) : newsError ? (
              <Text style={{ color: 'red' }}>{newsError}</Text>
            ) : (
              <ScrollView style={{ maxHeight: 350 }}>
                {newsArticles.length === 0 ? (
                  <Text>{t.noNews}</Text>
                ) : (
                  newsArticles.map((article, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => Linking.openURL(article.url)}
                      style={styles.newsCard}
                    >
                      <Text style={{ fontWeight: 'bold', color: '#33691e' }}>{article.title}</Text>
                      <Text style={{ color: '#555', fontSize: 13 }}>{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</Text>
                      <Text numberOfLines={2} style={{ color: '#333', marginBottom: 5 }}>{article.description}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}
            <PrimaryButton text={t.close} onPress={() => setNewsVisible(false)} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const FeatureCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      {icon}
      <Text style={styles.cardTitle}>  {title}</Text>
    </View>
    {children}
  </View>
);

const PrimaryButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={text.endsWith('...')}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f1f8e9',
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#33691e',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#558b2f',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#33691e',
  },
  picker: {
    backgroundColor: '#eef8e9',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#eef8e9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#7cb342',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  advice: {
    marginTop: 15,
    color: '#33691e',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  weather: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#039be5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2e7d32',
  },
  priceCard: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  newsCard: {
    backgroundColor: '#f9fbe7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
