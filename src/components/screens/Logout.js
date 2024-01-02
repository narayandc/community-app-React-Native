import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import DynamicImage from '../common/DynamicImage';
import { colors } from '../../styles/colors';


const Logout = ({ closeLogoutButton }) => {
    const { handleLogout } = useAuth();
    const navigation = useNavigation();

    const handleLogoutButton = () => {
        handleLogout();
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.logoutContainer}>
            <View style={styles.innerContainer}>
            <TouchableOpacity onPress={closeLogoutButton}>
                <DynamicImage style={styles.closeIcon} source={require('../../assets/images/close.png')} width={35} height={35} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    closeIcon: {
        marginTop: 4
    },
    logoutContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        right: 20,
        zIndex: 1,
        top: 40,
        width: 120,
        borderRadius: 5,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    logoutText: {
        color: colors.primaryTextColor,
        fontSize: 18,
        marginLeft: 5,
    },
});

export default Logout;