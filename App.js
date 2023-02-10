import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';

import loadingGif from './assets/loading.gif';

const API_URL = 'https://giftideas.vercel.app/api';
//const API_URL = 'https://localhost:3000/api'; если по лакалке API

export default function App() {
  const [gender, setGender] = useState('man');
  const [age, setAge] = useState(25);
  const [priceMin, setPriceMin] = useState(25);
  const [priceMax, setPriceMax] = useState(50);
  const [hobbies, setHobbies] = useState('');

  const [loading, setloading] = useState(false);
  const [result, setResult] = useState('');

  const onSubmit = async () => {
    if (loading) {
      return;
    }
    setloading(true);

    try {
      const response = await fetch(`${API_URL}/generate-gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      Alert.alert('Failed to generate gift ideas. Try later');
    } finally {
      setloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Looking for the best gift ideas 🎁 💡</Text>
        <Image
          source={loadingGif}
          style={styles.loading}
          resizeMode="contain"
        />
      </View>
    );
  }

  const onTryAgain = () => {
    setResult('');
  };

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Here are some great Christmas gift ideas 🎁 💡
        </Text>
        <Text style={styles.result}>{result}</Text>
        <Pressable onPress={onTryAgain} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleFront}>For who is the gift?</Text>
        <View style={styles.selectorContainer}>
          <Text
            onPress={() => setGender('man')}
            style={[
              styles.selector,
              gender === 'man' && { backgroundColor: '#10a37f' },
            ]}
          >
            Man
          </Text>
          <Text
            onPress={() => setGender('woman')}
            style={[
              styles.selector,
              gender === 'woman' && { backgroundColor: '#10a37f' },
            ]}
          >
            Woman
          </Text>
        </View>

        <Text style={styles.label}>Age</Text>
        <TextInput
          placeholder="Age"
          keyboardType="numeric"
          style={styles.input}
          value={age.toString()}
          onChangeText={(s) => setAge(Number.parseInt(s) || 0)}
        />

        <Text style={styles.label}>Price from ($)</Text>
        <TextInput
          placeholder="Price from"
          keyboardType="numeric"
          style={styles.input}
          value={priceMin.toString()}
          onChangeText={(s) => setPriceMin(Number.parseInt(s) || 0)}
        />

        <Text style={styles.label}>Price to ($)</Text>
        <TextInput
          placeholder="Price to"
          keyboardType="numeric"
          style={styles.input}
          value={priceMax.toString()}
          onChangeText={(s) => setPriceMax(Number.parseInt(s) || 0)}
        />

        <Text style={styles.label}>Hobbies</Text>
        <TextInput
          placeholder="Hobbies"
          style={styles.input}
          value={hobbies}
          onChangeText={setHobbies}
        />

        <Pressable onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Generate gift ideas</Text>
        </Pressable>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  titleFront: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    fontSize: 16,
    borderColor: '#353740',
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },

  selectorContainer: {
    flexDirection: 'row',
  },
  selector: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: 'gainsboro',
    margin: 5,
    padding: 16,
    borderRadius: 5,
    overflow: 'hidden',
  },

  button: {
    marginTop: 'auto',
    backgroundColor: '#10a37f',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 6,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  loading: {
    width: '100%',
  },
});
