import { useState } from 'react'
import { StyleSheet, View, Text, Button, Pressable, ScrollView, TouchableOpacity, Modal } from 'react-native'
import ChickenItem from './Item/ChickenItem'
import SideItem from './Item/SideItem'
import DrinkItem from './Item/DrinkItem'
import { Icon } from '@rneui/base'
import request from '../../api/request'
import moment from 'moment-timezone'

const OrderInfo = ({ user, orderNo, completed, token, fetchData, completedAt }) => {
  const [modalState, setModalState] = useState(false)

  const deleteOrder =  async () => {
    try {
      await request.delete(`/order/${orderNo}`, {headers: {
        token: "Bearer " + token
      }})
      fetchData()
      setModalState(false)
    } catch(err) { console.log("deleteOrder: " + err) }
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.textCtn}>
          <Icon name="email" color="white" size={25} style={styles.icon} />
          <Text style={[styles.text, styles.boldText]}>{user.email}</Text>
        </View>
        <View style={styles.textCtn}>
          <Icon name="phone" color="white" size={25} style={styles.icon} />
          <Text style={[styles.text, styles.boldText]}>{user.phoneNo}</Text>
        </View>
        <View style={styles.textCtn}>
          <Icon name="receipt" color="white" size={25} style={styles.icon} />
          <Text style={[styles.text, styles.boldText]}>{orderNo}</Text>
        </View>
        <Text style={[styles.text, {fontWeight: 600, marginTop: 16}]}>TOTAL: ${user.cart.total.toFixed(2)}</Text>
      </View>
      <View>
        <ScrollView style={{maxHeight: 300, overflow: 'scroll'}} nestedScrollEnabled={true}>
          {user.cart.items.map(item => {
            return (
              item.type === "chicken" ? <ChickenItem item={item} key={item.key}/> : 
              item.type === "sides" ? <SideItem item={item} key={item.key}/> : 
              item.type === "drinks" ? <DrinkItem item={item} key={item.key}/> : null
            )
          })}
        </ScrollView>
      </View>
      {completed ? <View style={{
          display: 'flex',
          flexDirection: 'row', 
          alignItems: 'center', 
          position: 'absolute', 
          left: 0, 
          bottom: 0, }}>
        <Icon name="check-circle" size={25} color="white"/>
        <Text style={{
          color: 'white', 
          fontSize: 16,
          marginLeft: 8
        }}>
          {moment(completedAt).format('Do MMM, h:mm A')} 
          </Text>
        </View> : null
        // <TouchableOpacity onPress={() => setModalState(true)} style={[styles.textCtn, {
        //   backgroundColor: 'red', 
        //   borderRadius: 4, 
        //   padding: 8,
        //   marginBottom: 8, 
        //   position: 'absolute', 
        //   bottom: 0, 
        //   left: 0
        // }]}>
        //   <Icon name="delete" color="white" size={25} />
        //   <Text style={[styles.text, styles.boldText, {marginRight: 4}]}>Delete</Text>
        // </TouchableOpacity>
      }
      <Modal
          animationType='slide'
          transparent={true}
          visible={modalState}
          onRequestClose={() => setModalState(false)}
        >
          <View style={styles.modalCtn}>
            <View style={styles.modalContent}>
              <Text style={styles.text}>Are you sure you want to delete this order?</Text>
              <View style={{display: 'flex', flexDirection: 'row', width: 'auto'}}>
                <TouchableOpacity onPress={() => deleteOrder()} style={{backgroundColor: 'green', padding: 8, borderRadius: 8, flex: 1, margin: 8}}>
                  <Text style={styles.text}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalState(false)} style={{backgroundColor: 'red', padding: 8, borderRadius: 8, flex: 1, margin: 8}}>
                  <Text style={styles.text}>No</Text>
                </TouchableOpacity>
              
              </View>
            </View>
          </View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  icon: {
    marginRight: 8,
  },
  textCtn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },  
  text: {
    color: 'white',
    marginVertical: 4,
    fontSize: 18,
  },
  boldText: {
    fontWeight: "600"
  },
  modalCtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: 'white'
  }
})

export default OrderInfo