import React, { useRef, useEffect } from 'react';
import { Text, View } from 'react-native';
import styles from '../../css/styles';
import * as Animatable from 'react-native-animatable';

const AnimatedBanner = ({ visible, onAnimationEnd, label }) => {
    const bannerRef = useRef(null);

    useEffect(() => {
        if (visible) {
            bannerRef.current.fadeIn(800, 'ease-out'); // Adjusted duration and added easing
        } else {
            bannerRef.current.fadeOut(800, 'ease-in'); // Adjusted duration and added easing
        }
    }, [visible]);

    return (
        <Animatable.View ref={bannerRef} onAnimationEnd={onAnimationEnd}>
            <View style={styles.updating}>
                <Text style={styles.processingText}>{label}</Text>
            </View>
        </Animatable.View>
    );
};

export default AnimatedBanner;
