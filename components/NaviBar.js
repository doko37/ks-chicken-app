import { StyleSheet, View, Text, Button, Pressable, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from '@rneui/themed'
import { useDispatch, useSelector } from 'react-redux'
import { setHomeScreen } from '../features/app/appSlice'

const NaviBar = ({ toggleDrawer }) => {
    const dispatch = useDispatch()
    const state = useSelector((state) => state.app.homeScreen)
    const currOrders = useSelector((state) => state.order.currentOrders.length)

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.menuIcon}>
                <Icon name='menu' color="white" size={40} style={styles.icon(false)} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => toggleState("create")}>
                <Icon name="add-circle-outline" color='white' size={40} style={styles.icon(state === "create" ? true : false)} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => dispatch(setHomeScreen({homeScreen: "current"}))}>
                <Icon name="schedule" color='white' size={40} style={styles.icon(state === "current" ? true : false)} />
                {
                    currOrders > 0 ? <View style={styles.badge}>
                        <Text style={styles.badgeText}>{currOrders}</Text>
                    </View> : null
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(setHomeScreen({homeScreen: "completed"}))}>
                <Icon name="history" color='white' size={40} style={styles.icon(state === "completed" ? true : false)} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: (Dimensions.get('window').height - 32),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 80,
        borderRightWidth: 2,
        borderColor: 'white',
        marginRight: 16,
        paddingVertical: 32
    },
    menuIcon: {
        padding: 2,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8
    },
    icon: (state) => {
        return {
            width: '100%',
            backgroundColor: state ? 'rgba(255,255,255,0.2)' : 'transparent',
            borderRadius: 8,
            padding: 4
        }
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 32,
        backgroundColor: '#3f51b5',
        paddingBottom: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        color: 'white', 
        margin: 0, 
        fontSize: 12
    }
})

export default NaviBar