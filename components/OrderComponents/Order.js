import { StyleSheet, View, Text, Button, Pressable, Animated, ActivityIndicator } from 'react-native'
import { useState, useRef } from 'react'
import OrderInfo from './OrderInfo'
import moment from 'moment-timezone'
import { Icon } from '@rneui/base'
import axios from 'axios'
import EscPosPrinter from 'react-native-esc-pos-printer'
import request from '../../api/request'
import { getCurrentOrders } from '../../features/order/orderSlice'

const Order = ({ 
    fname, 
    lname, 
    orderNo, 
    confirmed, 
    time, 
    date, 
    user, 
    toggleScroll, 
    token, 
    fetchData, 
    completed = false, 
    completedAt,
    toggleModalState 
}) => {
    const [active, setActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const animation = useRef(new Animated.Value(0)).current

    const print = async () => {
        try {
            await EscPosPrinter.init({
                target: "BT:00:01:90:56:FC:66",
                seriesName: 'EPOS2_TM_M30II',
                language: 'EPOS2_LANG_EN'
            }).then(() => console.log('printer connected'))
            .catch((e) => console.log('printer error: ' + e))

            const printing = new EscPosPrinter.printing()

            const status = printing
                .initialize()
                .align('center')
                .newline(2)
                .size(2)
                .line(`${fname} ${lname.substring(0, 1).toUpperCase()}.`)
                .line(moment().startOf('d').add(time).format('h:mm A'))
                .line(`#${orderNo}`)
                .newline(2)
                .size(1, 2)
                .align('left')

            for(i in user.cart.items) {
                const item = user.cart.items[i]
                if(item.type === "chicken") {
                    printing
                        .bold()
                        .line(`${item.name} (${item.size}) x${item.quantity}`)
                        .bold(false)
                        .line(`- ${item.cut}`)
                        .bold()
                        .newline(1)
                        .line('Toppings:')
                        .bold(false)
                        .line(`${item.toppings.sesame ? 'sesame' : ''}${item.toppings.peanuts ? ', peanuts' : ''}${item.toppings.parsley ? ', parsley' : ''}${item.toppings.snowy ? ', snowy' : ''}${item.toppings.onion ? ', onion' : ''}`)
                        .bold()
                        .newline(1)
                        .line('Sides:')
                        .bold(false)
                        .line(`- ${item.sides.side1}`)
                        .line(`- ${item.sides.side2}`)
                } else if(item.key.includes("chips")) {
                    printing
                        .bold()
                        .line(`${item.name} (${item.size}) x${item.quantity}`)
                        .newline(1)
                        .line('Toppings:')
                        .bold(false)
                        .line(`${item.toppings.snowy ? 'snowy' : ''}${item.toppings.onion ? ', onion' : ''}`)
                } else if(item.type === "drinks") {
                    printing
                        .bold()
                        .line(`${item.name} (${item.size}) x${item.quantity}`)
                        .bold(false)
                        .line(`${item.drink ? `-${item.drink}` : ''}`)
                } else {
                    printing
                        .bold()
                        .line(`${item.name} x${item.quantity}`)
                        .bold(false)
                }

                if(i < user.cart.items.length - 1) {
                    printing
                        .textLine(96, {
                            left: '',
                            right: '',
                            gapSymbol: '-'
                        })
                }
            }

            printing
                .newline(2)
                .cut()
                .send()

        } catch(e) { console.log("Print error: " + e.stack) }
    }

    const openAnimation = () => {
        Animated.timing(animation, {
            toValue: 400,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const closeAnimation = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const toggleActive = () => {
        if(active) {
            closeAnimation()
        } else {
            openAnimation()
        }
        setActive(!active)
    }

    const toggleParentScroll = (state) => {
        toggleScroll(state)
    }

    const confirmOrder = async () => {
        setLoading(true)
        try {
            await request.put(`/order/confirm/${orderNo}`, {}, { headers: {
                token: "Bearer " + token
            } })

            await print()
            
            fetchData()
        } catch(err) { console.log(err) }
        setLoading(false)
    }

    const completeOrder = async () => {
        setLoading(true)
        try {
            console.log("completing order " + orderNo)
            await request.post(`/order/complete/${orderNo}`, {}, { headers: {
                token: "Bearer " + token 
            }})

            fetchData()
        } catch(err) { console.log(err) }
        setLoading(false)
    }

    const helpme = async () => {
        try {
            await EscPosPrinter.init({
                target: "BT:00:01:90:56:FC:66",
                seriesName: 'EPOS2_TM_M30II',
                language: 'EPOS2_LANG_EN'
            }).then(() => console.log('printer connected'))
            .catch((e) => console.log('printer error: ' + e))

            const printing = new EscPosPrinter.printing()

            printing
                .initialize()
                .line("HELP ME")
                .newline(2)
                .line("HELP ME")
                .cut()
                .send()

        } catch(e) { console.log("Print error: " + e.stack) }
    }

    return (
        <View>
            <View style={styles.container}>
                <Pressable style={styles.titleCtn(active)} onPress={() => toggleActive()}>
                    <View>
                        <Text style={[styles.title, {fontWeight: 600}]}>{moment(date).startOf('d').add(time).format(`${completed ? 'Do MMM, ' : ''}h:mm A`)}</Text>
                        <Text style={[styles.title]}>{fname} {lname.toUpperCase().substring(0, 1)}.</Text>
                    </View>
                    {
                        completed ? null :
                        confirmed ? <Pressable style={[styles.button(active), {display: confirmed ? 'flex' : 'none', backgroundColor: '#4CA64C'}]} onPress={() => completeOrder()}>
                            <ActivityIndicator style={{display: loading ? 'flex' : 'none'}}/>
                            <View style={{display: loading ? 'none' : 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                <Text style={{fontWeight: "600", color: 'white', marginRight: 8}}>COMPLETE</Text>
                                <Icon name="check" color="white"/>
                            </View>
                        </Pressable> :
                        <Pressable style={[styles.button(true), {marginTop: 0, display: confirmed ? 'none' : 'flex', flexDirection: 'row'}]} onPress={() => confirmOrder()}>
                            <ActivityIndicator style={{display: loading ? 'flex' : 'none'}}/>
                            <View style={{display: loading ? 'none' : 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                <Text style={{fontWeight: "600", color: 'white', marginRight: 8}}>CONFIRM</Text>
                                <Icon name="print" color="white"/>
                            </View>
                        </Pressable>
                    }
                </Pressable>
                <Animated.View style={styles.subContainer(animation, active)}>
                    <OrderInfo 
                        user={user} 
                        orderNo={orderNo} 
                        toggleScrollOff={() => toggleParentScroll(false)} 
                        toggleScrollOn={() => toggleParentScroll(true)}
                        toggleModalState={toggleModalState}
                        completed={completed}
                        token={token}
                        fetchData={fetchData}
                        completedAt={completedAt}
                    />
                    <Pressable onPress={helpme}>
                        <Text>Print</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    )
}

export default Order

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        //backgroundColor: '#3f51b5',
        backgroundColor: '#5E5D5E',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderRadius: 4
    },
    subContainer: (animation, active) => {
        return {
            //display: visible,
            //backgroundColor: '#2C387E',
            maxHeight: animation,
            overflow: 'hidden',
            borderRadius: 4,
            marginTop: 8,
            padding: 8,
            paddingVertical: active ? 8 : 0
        }   
    },
    titleCtn: (active) => {

        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            //backgroundColor: '#324090',
            backgroundColor: '#4D4C4D',
            margin: -10,
            padding: 8,
            paddingHorizontal: 16,
            borderRadius: 4,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            elevation: 4
        }
    },  
    title: {
        color: 'white',
        fontSize: 20
    },
    desc: {
        color: 'white'
    },
    button: (active) => {
        return {
            backgroundColor: '#C89663',
            width: 160,
            borderRadius: 4,
            padding: 16,
            display: active ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
})