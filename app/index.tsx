import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query, page]);

  const fetchData = async () => {
    setLoading(true);

    const limit = 25;
    const url = `https://itunes.apple.com/search?term=${query}&limit=${limit}&offset=${(page - 1) * limit}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.results.length > 0) {
        setData((prev) => [...prev, ...json.results]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchData();
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
        artist: item.artistName,
        price: item.trackPrice,
        currency: item.currency,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search.."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {error && <Text style={styles.loading}>{error}</Text>}

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toDetailScreen(item)}>
            <View style={styles.resultItem}>
              <Image
                source={{ uri: item.artworkUrl100 }}
                style={styles.thumbnail}
              />
              <View>
                <Text style={styles.itemTrack}>{item.trackName}</Text>
                <Text style={styles.itemName}>{item.kind}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />

      {!loading && !hasMore && data.length === 0 && (
        <Text style={styles.itemNoMore}>No result found</Text>
      )}

      {!loading && !hasMore && data.length > 0 && (
        <Text style={styles.itemNoMore}>No more result</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  loading: {
    marginVertical: 10,
    textAlign: "center",
    color: "gray",
  },
  resultItem: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemTrack: {
    fontWeight: "bold",
  },
  itemName: {
    color: "gray",
  },
  itemNoMore: {
    textAlign: "center",
    marginTop: 10,
  },
});
