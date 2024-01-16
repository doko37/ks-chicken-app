import { StyleSheet, View, Text, Button, Pressable } from 'react-native'
import { styles } from './ChickenItem'

const DrinkItem = ({ item }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{item.name} x{item.quantity}</Text>
        <Text style={styles.text}>- {item.size}</Text>
        { item.drink ? <Text style={styles.text}>- {item.drink}</Text> : null}
        
        <Text style={[styles.text, styles.price]}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  )
}

export default DrinkItem