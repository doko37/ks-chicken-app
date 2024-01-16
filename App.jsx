import { StyleSheet, View, StatusBar, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import Home from './screens/Home';
import AdjustTimeScreen from './screens/AdjustTimeScreen';
import { Provider } from 'react-redux';
import store from './store';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Icon } from '@rneui/themed';
import StoreHours from './screens/StoreHours';

function App() {
  StatusBar.setHidden(true)
  const Drawer = createDrawerNavigator()

  return (
    <Provider store={store}>
      <StatusBar hidden={true}/>
      <NavigationContainer>
        <View style={styles.container}>
          <Drawer.Navigator screenOptions={{
            drawerStyle: {
              backgroundColor: '#E5E5E5'
            }
          }}>
            <Drawer.Screen 
              name="Home" 
              component={Home}
              options={{ 
                headerShown: false,
                drawerIcon: (({focused, size}) => (
                  <Icon 
                    name="home" 
                    size={size}
                    color={focused ? 'blue' : 'gray'}
                  />
                ))
              }} 
            />
            <Drawer.Screen
              name="Adjust Time and Hours"
              component={AdjustTimeScreen}
              options={{ 
                //headerShown: false,
                headerStyle: {
                  backgroundColor: '#191919'
                },
                headerTintColor: '#fff',
                drawerIcon: (({focused, size}) => (
                  <Icon 
                    name="lock-clock" 
                    size={size}
                    color={focused ? 'blue' : 'gray'}
                  />
                ))
              }} 
            />
          </Drawer.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
