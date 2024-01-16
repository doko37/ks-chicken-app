import { StyleSheet, View, Text, Button, Pressable } from 'react-native'
import { styles } from './ChickenItem'

const SideItem = ({ item }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{item.name} x{item.quantity}</Text>
        {
            item.key.includes("chips") ? <View>
                <Text style={styles.text}>- {item.size.substring(0, 1).toUpperCase()}{item.size.substring(1)}</Text>
                <Text style={[styles.text, {marginTop: 8}]}>Toppings:</Text>
                <Text style={[styles.text, {display: item.toppings.snowy ? 'flex' : 'none'}]}>- Snowy</Text>
                <Text style={[styles.text, {display: item.toppings.onion ? 'flex' : 'none'}]}>- Onion</Text>
            </View> : null
        }
        
        <Text style={[styles.text, styles.price]}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  )
}

export default SideItem