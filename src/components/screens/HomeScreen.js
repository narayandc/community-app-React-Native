import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ScrollView, RefreshControl } from 'react-native';
import DynamicImage from '../common/DynamicImage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Button from '../common/Button';
import PagerView from 'react-native-pager-view';
import { widthPercentageToDP, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../styles/colors';
import styles from '../../css/styles';


const calculateDimensions = (percentage, aspectRatio = 1) => {
    const width = widthPercentageToDP(percentage);
    const height = width * aspectRatio;
    return { width, height };
};


const HomeScreen = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const dotsAnimation = useRef(new Animated.Value(0)).current;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const pagerRef = useRef(null);

    useEffect(() => {
        Animated.spring(dotsAnimation, {
            toValue: currentPage,
            useNativeDriver: false,
        }).start();
    }, [currentPage]);

    const refreshPage = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    const handlePageChange = (event) => {
        const newPage = event.nativeEvent.position;
        setCurrentPage(newPage);
    };

    const handleRegisterPress = () => {
        setCurrentPage(1);
        setTimeout(() => {
            pagerRef.current.setPage(1);
        }, 0);
    };

    const handleLoginPress = () => {
        setCurrentPage(2);
        setTimeout(() => {
            pagerRef.current.setPage(2);
        }, 0);
    };

    const renderDots = () => {
        const totalPages = 3;
        const dots = [];

        for (let i = 0; i < totalPages; i++) {
            dots.push(
                <TouchableOpacity
                    key={i}
                    style={styles.dotContainer}
                    onPress={() => handleDotPress(i)}
                >
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                width: 20,
                                height: 20,
                                backgroundColor: dotsAnimation.interpolate({
                                    inputRange: [i - 1, i, i + 1],
                                    outputRange: ['#ffffff', colors.primaryBackground, '#ffffff'],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ]}
                    />
                </TouchableOpacity>
            );
        }
        return dots;
    };

    const handleDotPress = (index) => {
        pagerRef.current.setPage(index);
    };

    return (
        <View style={styles.mainContainer}>
            <PagerView
                style={styles.pageViewer}
                initialPage={0}
                onPageSelected={handlePageChange}
                ref={pagerRef}>
                <View key="1" style={styles.pageContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logo}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.screenHeadline}>
                                NEPAL METERI MUNCH MILANO
                            </Text>
                            <Text style={styles.screenSubHeadline}>
                                “Let’s join & build strong and supportive communities where we can help and cheer each other”
                            </Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <DynamicImage
                            source={require('../../assets/images/group.png')}
                            {...calculateDimensions(80, 0.8)} // Adjust percentage as needed
                        />
                        <Button
                            label="LOGIN"
                            onPress={handleLoginPress}
                        />
                        <Text style={styles.link} onPress={handleRegisterPress}>
                            Register
                        </Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refreshPage}
                        />
                    }
                >
                    <View key="2" style={styles.pageContainer}>
                        <SignUp reload={isRefreshing} />
                    </View>
                </ScrollView>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View key="3" style={styles.pageContainer}>
                        <SignIn />
                    </View>
                </ScrollView>
            </PagerView>
            <View style={styles.dotsContainer}>{renderDots()}</View>
        </View>
    );
};

export default HomeScreen;
