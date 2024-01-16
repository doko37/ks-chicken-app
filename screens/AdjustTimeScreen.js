import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Modal, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import request from '../api/request';
import moment from 'moment-timezone';
import CalendarPicker from 'react-native-calendar-picker'

const AdjustTimeScreen = ({ navigation }) => {
  const [times, setTimes] = useState([])
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.app.token)
  const orders = useSelector((state) => state.order.currentOrders)
  const [orderLen, setOrderLen] = useState(orders.length)
  const [alert, setAlert] = useState(false)
  const [timeModalState, setTimeModalState] = useState({visible: false, disable: true})
  const [hourModalState, setHourModalState] = useState(false)
  const [time, setTime] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  })
  const dispatch = useDispatch()

  const getHours = async () => {
    const data = await request.get("/dates/storeHours", {
      headers: { token: 'Headers ' + token }
    })
    setHours(data.data)
  }

  useEffect(() => {
      setDateRange({
          startDate: null,
          endDate: null
      })

      getHours()
  }, [hourModalState])
  
  useEffect(() => {
    const getTimes = async () => {
      setLoading(true)
      try {
        const res = await request.get('/times')
        setTimes(res.data)
      } catch(err) { console.log(err) }
      setLoading(false)
    }

    getTimes()
    if(orders.length > orderLen) {
      setOrderLen(orders.length)
      setAlert(true)
    }

  }, [orders])

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setDateRange({...dateRange, endDate: date})
    } else {
      setDateRange({
        startDate: date,
        endDate: null
      })
    }
  }

  const createHours = async () => {
    try {
      if(dateRange.startDate !== null && dateRange.endDate !== null) {
        await request.post("/dates/storeHours", {
          startDate: moment(dateRange.startDate.toString()).format('YYYY-MM-DD'),
          endDate: moment(dateRange.endDate.toString()).format('YYYY-MM-DD')
        }, {
          headers: {
            token: "Bearer " + token
          }
        })

        setHourModalState(false)
      }
    } catch(err) {
        console.log(err)
    }
  }

  const deleteHours = async (date) => {
    try {
      await request.delete('/dates/storeHours', {
        headers: { token: 'Bearer ' + token },
        data: { date: date }
      })

      await getHours()
    } catch(err) {
      console.log(err)
    }
  }

  const toggleModal = (time, disable=true) => {
    setTime(time)
    setTimeModalState({visible: true, disable: disable})
  }

  const disableTimeSlot = async () => {
    const selectedTime = moment().startOf('d').add(time).format('YYYY-MM-DD HH:mm')
    try {
      await request.post(`/times/timeSlot`, {time: selectedTime, available: false}, { headers: {
        token: "Bearer " + token 
      }})
    } catch(err) { console.log(err) }
    setTimeModalState({visible: false, disable: false})
  }

  const enableTimeSlot = async () => {
    const selectedTime = moment().startOf('d').add(time).format('YYYY-MM-DD HH:mm')
    try {
      await request.delete('/times/timeSlot', { 
        headers: {
          token: "Bearer " + token
        }, 
        data: {
          time: selectedTime
        }
      })
    } catch(err) { console.log(err) }
    setTimeModalState({visible: false, disable: false})
  }

  return (
    <View style={styles.container}>
      <View style={styles.timeList}>
        <ScrollView>
          {times.map(time => (
            <TouchableOpacity style={styles.time} key={time.time} onPress={() => toggleModal(moment().startOf('d').add(time.time).format('HH:mm'), time.available ? true : false)}>
              <Text style={[styles.timeText(time.available), {textDecorationLine: time.available ? 'none' : 'line-through', fontWeight: '600'}]}>{moment().startOf('d').add(time.time).format('h:mm A')}</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Icon name="food-drumstick" color={time.available ? 'white' : '#595959'} size={15} type="material-community"/>
                <Text style={[styles.timeText(time.available), {marginLeft: 4}]}>{(time.numHalfs / 2).toFixed(1)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ActivityIndicator animating={loading} size={50} style={{
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: 0, 
          right: 0, 
          margin: 'auto',
          display: loading ? 'flex' : 'none'
        }}/>
      </View>
      <View style={styles.hoursCtn}>
        { hours.length < 1 ? 
        <View style={styles.calendarIcon}>
          <Icon name='date-range' color='#2F2F2F' size={80} />
          <Text style={{color: '#2F2F2F', fontSize: 16}}>No hours have been added yet.</Text>
        </View> : <ScrollView>
          {hours.map(hour => (
            <View key={hour._id} style={{
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 8,
              marginVertical: 8
            }}>
              <Text style={{fontSize: 20}}>{hour.date}</Text>
              <TouchableOpacity onPress={() => deleteHours(hour.date)}>
                <Icon name="close" size={20} color="white"/>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView> }
        <TouchableOpacity style={styles.newButton} onPress={() => setHourModalState(true)}>
          <Icon name="add" color="white" size={35}/>
        </TouchableOpacity>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={timeModalState.visible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 16,
            borderRadius: 8
          }}>
            <Text style={styles.text(20)}>Make {time} {timeModalState.disable ? " unavailable?" : " available?"}</Text>
            <View style={{flexDirection: 'row', marginVertical: 8, justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => setTimeModalState({...timeModalState, visible: false})} style={[styles.modalBtn, {backgroundColor: 'red', marginRight: 4}]}>
                <Icon name="close" color="white" size={30}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => timeModalState.disable ? disableTimeSlot() : enableTimeSlot()} style={[styles.modalBtn, {backgroundColor: 'green', marginLeft: 4}]}>
                <Icon name="check" color="white" size={30}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={hourModalState}
        onRequestClose={() => setHourModalState(false)}
      >
        <View style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setHourModalState(false)} style={{position: 'absolute', right: 0, top: 0, margin: 8}}>
              <Icon name='close' size={30}/>
            </TouchableOpacity>
              <CalendarPicker 
                  onDateChange={onDateChange}
                  todayBackgroundColor='red'
                  todayTextStyle={{color: 'white'}}
                  selectedRangeStyle={{color: 'white'}}
                  textStyle={{color: 'black'}}
                  width={425}
                  height={425}
                  allowRangeSelection={true}
              />
            <View style={{flex: 1, height: '100%', marginHorizontal: 8, justifyContent: 'flex-end'}}>
              <View>
                <Text style={{color: '#000'}}>Selected Date Range:</Text>
                <Text style={{color: '#000'}}>{dateRange.startDate ? moment(dateRange.startDate.toString()).format('Y/M/D') + " - " : ""} {dateRange.endDate ? moment(dateRange.endDate.toString()).format('Y/M/D') : ""}</Text>
                <Text style={{color: '#000'}}>{dateRange.startDate ? dateRange.startDate.toString() + " - " : ""} {dateRange.endDate ? dateRange.endDate.toString() : ""}</Text>
              </View>
              <TouchableOpacity style={styles.createButton} onPress={createHours}>
                <Text style={{color: 'white', fontSize: 16}}>Create</Text>
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
  backBtn: (alert) => {
    return {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: alert ? '#C89663' : 'rgba(255,255,255,0.1)',
      padding: 12,
      borderRadius: 16
    }
  },
  text: (size) => {
    return {
      color: 'white',
      fontSize: size
    }
  },
  timeList: {
    position: 'relative',
    minWidth: 224,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    margin: 16,
    borderRadius: 16
  },
  time: {
    margin: 4,
    marginVertical: 8,
    padding: 8,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },  
  timeText: (available) => {
    return {
      color: available ? 'white' : '#595959'
    }
  },
  modalBtn: {
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  hoursCtn: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    margin: 16,
    borderRadius: 16,
    flex: 1,
    minHeight: '93%'
  },
  calendarIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  newButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
    borderRadius: 128,
    padding: 8,
    backgroundColor: '#0F0F0F'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    height: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8
  },
  createButton: {
      position: 'relative',
      backgroundColor: '#000',
      borderRadius: 8,
      paddingVertical: 8,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
  }
})

export default AdjustTimeScreen