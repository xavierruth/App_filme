import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = 'a36ccd46'; // Substitua pelo seu próprio API Key / substituído 
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Busca de Filmes</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme"
          value={movieTitle}
          onChangeText={(text) => setMovieTitle(text)}
          placeholderTextColor="#ffb6c1"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar Filme</Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Sua Localização</Text>
            <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
            <View style={styles.mapCard}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Sua Localização"
                />
              </MapView>
            </View>
          </View>
        )}

        {movieData && (
          <View style={styles.movieContainer}>
            <Text style={styles.movieTitle}>{movieData.Title}</Text>
            <Text style={styles.movieText}>Ano: {movieData.Year}</Text>
            <Text style={styles.movieText}>Gênero: {movieData.Genre}</Text>
            <Text style={styles.movieText}>Diretor: {movieData.Director}</Text>
            <Text style={styles.movieText}>Prêmios: {movieData.Awards}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe4e1',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff69b4',
    borderRadius: 10,
    margin: 10,
    padding: 8,
    color: '#ff69b4',
    width: '80%',
  },
  button: {
    backgroundColor: '#ff69b4',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  locationText: {
    color: '#ff69b4',
  },
  mapCard: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ff69b4',
    backgroundColor: '#fff0f5',
    width: 300,
    height: 300,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  movieContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff0f5',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  movieText: {
    color: '#ff69b4',
  },
});

export default App;
