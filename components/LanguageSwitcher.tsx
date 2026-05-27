import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LANGUAGE_OPTIONS, LanguageCode, useLanguage } from '../contexts/LanguageContext';

type LanguageSwitcherProps = {
  compact?: boolean;
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, tr } = useLanguage();

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {!compact && <Text style={styles.label}>{tr('selectLanguage')}</Text>}
      <Picker
        selectedValue={language}
        onValueChange={(value) => setLanguage(value as LanguageCode)}
        style={[styles.picker, compact && styles.compactPicker]}
        dropdownIconColor="#33691e"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  compactContainer: {
    width: 132,
    marginVertical: 0,
    marginLeft: 8,
  },
  label: {
    color: '#33691e',
    fontWeight: '700',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#eef8e9',
    borderRadius: 8,
    color: '#1b5e20',
  },
  compactPicker: {
    height: 42,
    backgroundColor: '#ffffff',
  },
});
