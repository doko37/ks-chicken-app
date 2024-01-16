import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Modal, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import request from '../api/request';
import moment from 'moment-timezone';
import CalendarPicker from 'react-native-calendar-picker'

const StoreHours = ({ navigation }) => {
    const [modalState, setModalState] = useState(false)
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    })
    const token = useSelector((store) => store.app.token)

    useEffect(() => {
        setDateRange({
            startDate: null,
            endDate: null
        })
    }, [modalState])

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

                setModalState(false)
            }
        } catch(err) {
            console.log(err)
        }
    }


    return (
        <View style={styles.container}>
            <View>
                <Icon name='date-range' color='#2F2F2F' size={80} />
                <Text style={{color: '#2F2F2F', fontSize: 16}}>No hours have been added yet.</Text>
            </View>
            <TouchableOpacity style={styles.newButton} onPress={() => setModalState(true)}>
                <Icon name="add" color="white" size={35}/>
            </TouchableOpacity>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalState}
                onRequestClose={() => setModalState(false)}
            >
                <View style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                    <View style={styles.modalView}>
                        <TouchableOpacity onPress={() => setModalState(false)} style={{position: 'absolute', right: 0, top: 0, margin: 8}}>
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
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 10,
    },
    calendarCtn: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        borderRadius: 8,
    },
    centerIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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

export default StoreHours