import { StyleSheet,  View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react'
import Order from './Order';
import { useSelector } from 'react-redux'

const OrderList = ({ fetchData }) => {
  const orders = useSelector(state => state.order)
  const currOrders = useSelector(state => state.order.currentOrders)
  const pastOrders = useSelector(state => state.order.pastOrders)
  const app = useSelector((state) => state.app)
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {app.homeScreen === "current" ? currOrders.map(order => (
            <Order 
              fname={order.user.fname} 
              lname={order.user.lname} 
              time={order.pickupTime}
              date={order.pickupDate} 
              orderNo={order.orderNo}
              confirmed={order.confirmed} 
              key={order._id} 
              user={order.user}
              token={app.token}
              fetchData={fetchData}
            />
        )) : app.homeScreen === "completed" ?
          pastOrders.map(order => {
            return (
              <Order 
                fname={order.user.fname} 
                lname={order.user.lname} 
                time={order.pickupTime} 
                date={order.pickupDate} 
                orderNo={order.orderNo}
                confirmed={order.confirmed} 
                key={order._id} 
                user={order.user}
                token={app.token}
                completed={true}
                completedAt={order.completedAt}
                fetchData={fetchData}
              />
            )
          }) : null}
      </ScrollView>
      <ActivityIndicator style={styles.spinner(orders.loading ? 'flex' : 'none')} size={80}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 5,
    flex: 1,
    margin: 16,
    marginLeft: 0
  },
  spinner: (loading) => {
    return {
      display: loading,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }
})

export default OrderList