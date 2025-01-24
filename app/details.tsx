import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function details() {
  type Params = {
    title: string;
    type: string;
    image: string;
    price: string;
    currency: string;
    artist: string;
    releaseDate: string;
    gendre: string;
  };

  const params: Params = useLocalSearchParams();

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: params.image }} style={styles.thumbnail} />
      <Text style={styles.title}>{params.title}</Text>
      <View style={styles.detailsContainer}>
        <DetailRow label="Type" value={params.type} />        
        <DetailRow label="Price" value={`${params.currency} ${params.price}`} />
        <DetailRow label="Artist" value={params.artist} />
        <DetailRow label="Release Date" value={params.releaseDate} />
        <DetailRow label="Genre" value={params.gendre} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  thumbnail: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "gary",
  },
});
