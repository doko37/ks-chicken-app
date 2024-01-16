import React, { useState, useRef, useEffect } from 'react'
import NaviBar from '../components/NaviBar'
import OrderList from '../components/OrderComponents/OrderList';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Sound from 'react-native-sound';
import request from '../api/request';
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '../features/app/appSlice'
import { setCurrentOrders, setPastOrders } from '../features/order/orderSlice'
import Alert from '../components/Alert';

const Home = ({ navigation }) => {
  let alertSound = useRef(null)
  const dispatch = useDispatch()
  const [newOrder, setNewOrder] = useState(false)
  const [loading, setLoading] = useState(false)
  const orders = useSelector((state) => state.order.currentOrders)
  const token = useSelector((state) => state.app.token)
  const numOrders = useSelector((state) => state.order.currentOrders.length)
  Sound.setCategory('Playback')

  useEffect(() => {
    alertSound.current = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if(error) {
        console.log('failed to load the sound file', error);
        return;
      }
    });

    const getToken = async () => {
      const login = await request.post('/auth/login/', {
          email: "hunubmm@gmail.com",
          password: "admin"
      })

      console.log("setting token")
      dispatch(setToken({token: login.data.accessToken}))
    }

    getToken()

    return () => {
      alertSound.current?.release()
    }
  }, [])

  const fetchData = async () => {
    console.log("fetching data...")
    setLoading(true)

    try {
      const res = await request.get('/order/today', {
        headers: { token: `Bearer ${token}` }
      })
      const data = res.data
      if(data === "Invalid token") {
        dispatch(setCurrentOrders({ orders: [], loading: true }))
      } else {
        console.log(data.length, orders.length)
        if(data.length > orders.length) {
          setNewOrder(true)
          console.log("playing sound")
          alertSound.current?.setNumberOfLoops(-1).play()
        }
        dispatch(setCurrentOrders({ orders: data, loading: false }))
      }
    } catch(error) {
      console.log("fetchData: " + error)
    }

    setLoading(false)
  }

  const getPastOrders = async () => {
    setLoading(true)
    try {
      dispatch(setPastOrders({orders: [], loading: true}))
      const res = await request.get("/order/", {headers: {
        token: "Bearer " + token
      }})

      const orders = res.data
      dispatch(setPastOrders({orders: orders, loading: false}))
    } catch(err) { 
      console.log("getPastOrders: " + err)
      dispatch(setPastOrders({orders: [], loading: false})) 
    }

    setLoading(false)
  }

  const closeAlert = () => {
    setNewOrder(false)
    if (alertSound.current) {
      if(alertSound.current?.isPlaying()) {
        console.log("sound is playing")
        alertSound.current?.stop()
      } else {
        console.log("sound exists but not playing")
      }
    } else {
      console.log("sound does not exists")
    }
  }

  useEffect(() => {
    if(!newOrder) {
      fetchData()
      getPastOrders()
    }

    const interval = setInterval(() => {
      if(!newOrder) {
        fetchData()
      }
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [newOrder, token, numOrders])

  return (
    <View style={styles.container}>
        <NaviBar toggleDrawer={() => navigation.openDrawer()}/>
        <OrderList fetchData={fetchData}/>
        <Alert active={newOrder} closeAlert={() => closeAlert()} />
        <ActivityIndicator animating={loading} size={100} style={styles.loadingSymbol(loading)} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#191919',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      zIndex: 10,
    },
    loadingSymbol: (active) => {
      return {
        display: active ? 'flex' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100
      }
    }
});

export default Home