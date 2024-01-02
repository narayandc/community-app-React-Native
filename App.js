import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Platform } from 'react-native';
import DynamicImage from './src/components/common/DynamicImage';
import { AuthProvider, useAuth } from './src/components/screens/AuthContext';

import HomeScreen from './src/components/screens/HomeScreen';
import SignIn from './src/components/screens/SignIn';
import SignUp from './src/components/screens/SignUp';
import Settings from './src/components/screens/Settings';
import Logout from './src/components/screens/Logout';
import EditProfile from './src/components/screens/EditProfile';
import Dashboard from './src/components/screens/Dashboard';
import Committe from './src/components/screens/Committe';
import NewEvent from './src/components/screens/NewEvent';
import MilanGroups from './src/components/screens/MilanGroups';
import Events from './src/components/screens/Events';
import Voting from './src/components/screens/Voting';
import UserList from './src/components/screens/UserList';
import AppAnimation from './src/components/screens/AppAnimation';
import { colors } from './src/styles/colors';
import styles from './src/css/styles';


const Stack = createStackNavigator();

const App = () => {
  const { userLoggedIn } = useAuth();
  const [showLogoutText, setShowLogoutText] = useState(false);

  useEffect(() => {
    if (!userLoggedIn) setShowLogoutText(false);
  }, [userLoggedIn]);

  const closeLogoutButton = () => {
    setShowLogoutText(false);
  };


  const commonOptions = ({ navigation, title }) => ({
    headerStyle: { backgroundColor: colors.primaryBackground },
    headerTintColor: '#fff',
    headerTitleStyle: Platform.OS === 'android'
      ? {
        ...styles.title,
        textAlign: 'center',
        flexGrow: 1,
      }
      : styles.title,
  headerRight: () => (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowLogoutText(!showLogoutText)}>
        <DynamicImage
          source={require('./src/assets/images/MenuLines.png')}
          style={styles.horizontalLinesIcons}
          width={5}
          height={5}
        />
      </TouchableOpacity>
      {showLogoutText && userLoggedIn && (
        <Logout closeLogoutButton={closeLogoutButton} />
      )}
    </View>
  ),
    title: title,
      headerLeft: () => (
        <View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <DynamicImage source={require('./src/assets/images/left-arrow.png')} style={styles.LeftArrowIcons} width={5} height={5} />
          </TouchableOpacity>
        </View>
      ),
  });

return (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={userLoggedIn ? commonOptions : { headerShown: false }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen name="Dashboard" component={Dashboard}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: '',
          headerLeft: null,
        })}
      />
      <Stack.Screen name="Committe" component={Committe}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'Committe Members',
        })} />

      <Stack.Screen name="MilanGroups" component={MilanGroups}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'Milan Groups',
        })} />
      <Stack.Screen name="NewEvent" component={NewEvent}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'New Event',
        })} />
      <Stack.Screen name="Events" component={Events}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'Events',
        })} />
      <Stack.Screen name="Voting" component={Voting}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'Voting page',
        })} />
      <Stack.Screen name="UserList" component={UserList}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'List',
        })} />
      <Stack.Screen name="Settings" component={Settings}
        options={({ navigation }) => ({
          ...commonOptions({ navigation }),
          title: 'Settings',
        })} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  </NavigationContainer>
);
};

const WrappedApp = () => (
  <AppAnimation>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AppAnimation>
);

export default WrappedApp;
