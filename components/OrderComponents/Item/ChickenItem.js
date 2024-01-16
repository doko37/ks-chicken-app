import { StyleSheet, View, Text, Button, Pressable } from 'react-native'

const ChickenItem = ({ item }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{item.name} - {item.size.substring(0,1).toUpperCase()}{item.size.substring(1)} x{item.quantity}</Text>
        <Text style={styles.text}>- {item.cut === "whole" ? "Whole Chicken" : item.cut === "boneless" ? "Boneless Chicken" : "Chicken Nibbles"}</Text>
        <Text style={[styles.text, {marginTop: 8}]}>Toppings:</Text>
        <Text style={[styles.text, {display: item.toppings.sesame ? 'flex' : 'none'}]}>- Sesame</Text>
        <Text style={[styles.text, {display: item.toppings.peanuts ? 'flex' : 'none'}]}>- Peanuts</Text>
        <Text style={[styles.text, {display: item.toppings.parsley ? 'flex' : 'none'}]}>- Parsley</Text>
        <Text style={[styles.text, {display: item.toppings.snowy ? 'flex' : 'none'}]}>- Snowy</Text>
        <Text style={[styles.text, {display: item.toppings.onion ? 'flex' : 'none'}]}>- Onion</Text>
        <Text style={[styles.text, {marginTop: 8}]}>Sides:</Text>
        <Text style={[styles.text]}>- {item.sides.side1}</Text>
        <Text style={[styles.text]}>- {item.sides.side2}</Text>
        <Text style={[styles.text, styles.price]}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  )
}

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 16,
        borderRadius: 4,
        width: 400,
        marginVertical: 8,
    },  
    text: {
        color: 'white',
        textAlign: 'left',
        fontSize: 18
    },
    price: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 16,
        fontWeight: 600,
        fontSize: 18
    }
})

export default ChickenItem