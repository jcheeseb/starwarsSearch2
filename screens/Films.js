import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
  Animated,
} from "react-native";

function AnimatedFilmItem({ item, index }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 200, // Stagger each item's animation
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0], // Slide item up from 20px below
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.filmContainer, animatedStyle]}>
      <Text style={styles.filmTitle}>{item.name}</Text>
      <Text style={styles.filmDetails}>UID: {item.uid}</Text>
      <Text style={styles.filmDetails}>URL: {item.url}</Text>
    </Animated.View>
  );
}

export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("https://swapi.dev/api/films/");
        const data = await response.json();
        setFilms(data.results);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  // Filter films based on the search input
  const filteredFilms = films.filter((film) =>
    film.name.toLowerCase().includes(inputText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("./movie-slate-film-reel-wood-clapper-wooden-backgorund-36502412.jpg.webp")}
        style={styles.logo}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Films"
          placeholderTextColor="gray"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Search" onPress={() => {}} />
      </View>

      {loading ? (
        <Text style={styles.text}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredFilms}
          keyExtractor={(item) => item.uid}
          renderItem={({ item, index }) => (
            <AnimatedFilmItem item={item} index={index} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
    marginRight: 10,
  },
  filmContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "darkgray",
    borderRadius: 8,
  },
  filmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  filmDetails: {
    fontSize: 14,
    color: "lightgray",
  },
});
