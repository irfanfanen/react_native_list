import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
        setData([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }
  }, [query]);

  useEffect(() => {
      if(query && hasMore) {
        fetchData();
      }
  }, [page]);

  const fetchData = async () => {
    if(!query) return;

    setLoading(true);
    setError(null);

    const url = `https://itunes.apple.com/search?term=${query}&limit=${limit}&offset=${(page - 1) * limit}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const json = await res.json();

      if (json.results.length > 0) {
        setData((prev) => [...prev, ...json.results]);
      } else {
        setHasMore(false);
        if (page === 1) {
            setError("No result found");
        }
      }
    } catch (error: any) {
      console.log(error);
      setHasMore(false);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = async () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const toDetailScreen = async (item: any) => {
    router.push({
      pathname: "/details",
      params: {
        title: item.trackName,
        type: item.kind,
        image: item.artworkUrl100,
        price: item.trackPrice,
        currency: item.currency,
        artist: item.artistName,
        releaseDate: item.releaseDate,
        gendre: item.primaryGenreName,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color="gray"
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Find Movies, Show and more"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => fetchData()}
        />
        {query.length> 0 && (
          <MaterialIcons
            name="close"
            size={24}
            color="black"
            onPress={() => setQuery("")}
          />
        )}
      </View>

      {error && <Text style={styles.itemMessage}>{error}</Text>}

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toDetailScreen(item)}>
            <View style={styles.itemCard}>
              <Image
                source={{ uri: item.artworkUrl100 }}
                style={styles.itemImage}
              />
              <View>
                <Text style={styles.itemTitle}>{item.trackName}</Text>
                <Text style={styles.itemType}>{item.kind}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.itemContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#f9f9f9",
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  itemContainer: {
    alignItems: "center",
  },
  itemCard: {
    width: 160,
    margin: 8,
    alignItems: "center",
  },
  itemImage: {
    width: 160,
    height: 160,
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  itemType: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  itemMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});
