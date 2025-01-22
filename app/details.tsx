import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function details() {
  type Params = {
    title: string,
    type: string,
    image: string,
    price: string,
    currency: string,
    artist: string,
  }

  const params:Params = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
            title: params.title
        }}
      />
      <Image source={{uri: params.image}} style={styles.thumbnail} />
      <Text style={styles.title}>type: {params.type}</Text>
      <Text style={styles.type}>Artist: {params.artist}</Text>
      <Text style={styles.price}>Price: {params.price} {params.currency}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    thumbnail: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    type: {
        fontSize: 18,
        marginTop: 10,
    },
    price: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold',
        color: 'blue'
    },
})