import React from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, ScrollView } from 'react-native';
import styles from '../../css/styles';

const OverLay = ({ isVisible, onClose, content }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: isVisible ? 0.9 : 0,
        duration: 300,
        useNativeDriver: true,
      }
    ).start();
  }, [isVisible, fadeAnim]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overLayContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <View style={styles.overLay}>
            {content === 'forgot_password' && (
              <>
                <Text style={styles.headline}>
                  Technical Support
                </Text>
                <Text style={styles.subHeadline}>
                  Whatapps: +39-3339409958
                </Text>
                <Text style={styles.subHeadline}>
                  Email: narayandc777@gmail.com
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.subHeadline}>Close</Text>
                </TouchableOpacity>
              </>
            )}

            {content === 'term_and_content' && (
              <>
                <Text style={styles.headline}>
                  Terms and Conditions
                </Text>
                <Text style={styles.privacyPolicyText}>
                  Welcome to our Nepalese community (NEPAL MITERI MUNCH MILANO) app, exclusively for individuals of Nepalese origin in Milan and Italy. By using this app, you affirm your eligibility to join this community platform, connecting with fellow Nepalese residents. Participation is voluntary, and your information will only be used for community-related purposes. We prioritize your privacy and assure you that data usage is confined to Milan and Italy. However, it is important to note that while we take precautions, we are not responsible for any loss or damage to your data. Please exercise caution to secure your account. For assistance or queries, our support team is ready to help. Thank you for being part of our Nepalese community in Milan and Italy!
                </Text>

                <Text style={styles.subHeadline}>
                  Contact: miterimunch@yahoo.com
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.subHeadline}>Close</Text>
                </TouchableOpacity>
              </>
            )}
            {content !== 'forgot_password' && content !== 'term_and_content' && (
              <>
              <Text style={styles.subHeadline}>
              Take a screenshot of the new password
                </Text>
                <Text style={styles.subHeadline}>
                  {content}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.subHeadline}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default OverLay;
