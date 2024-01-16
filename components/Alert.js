import { StyleSheet, View, Text, Button, Pressable } from 'react-native'

const Alert = ({ active, closeAlert }) => {
  return (
    <Pressable style={styles.box(active)} onPress={closeAlert}>
        <View style={styles.textCtn}>
            <Text style={styles.text}>NEW ORDER</Text>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    box: (active) => {
        const visible = active ? 'flex' : 'none'
        return {
            position: 'absolute',
            backgroundColor: '#C89663',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: visible,
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    textCtn: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        height: 300,
        width: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 40,
    }
})

export default Alert