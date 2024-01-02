import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ProgressBar } from 'react-native-paper';
import { useAuth } from './AuthContext';
import { storage, db } from '../../services/db';
import { getFirestore, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../css/styles';


const Dashboard = () => {
  const { loginData, setLoginData, isAdmin } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getPendingRequestCount();
  }, []);

  const getPendingRequestCount = async () => {
    try {
     // setIsRefreshing(true);
      const db = getFirestore();
      const committeeCollection = collection(db, 'users');
      const querySnapshot = await getDocs(committeeCollection);

      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const pendingMembersCount = members.filter(member => member.is_approve === false).length;
      //setPendingRequest(pendingMembersCount);

    } catch (error) {
      console.error('Error: pending request');
    } finally {
      setIsRefreshing(false);
    }

  };

  const redirectToPage = (page) => {
    navigation.navigate(page);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setUploadProgress(0);
        const uri = result.assets[0].uri;
        await uploadImage(uri, 'image');
      }
    } catch (error) {
      console.error('Error: picking image');
    }
  };

  const uploadImage = async (uri, fileType) => {
    try {
      const fileName = `${loginData.phonenumber}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, (error) => {
          console.error('Error uploading image:', error);
        }, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setLoginData({ ...loginData, profileURL: downloadURL });

          const userPhone = loginData.phonenumber;
          const userQuery = query(collection(db, 'users'), where('phonenumber', '==', userPhone));
          const querySnapshot = await getDocs(userQuery);

          if (querySnapshot.size === 1) {
            const userDoc = querySnapshot.docs[0].ref;
            await updateDoc(userDoc, {
              profileURL: downloadURL,
            });
            console.log('File uploaded');
          }
        });
    } catch (error) {
      console.error('Error: uploading image');
    }
  };

  const menuItems = ([
    {
      id: 'milan-groups',
      image: require('../../assets/images/milan-group.png'),
      label: 'Milan Groups',
      page: 'MilanGroups',
    },
    {
      id: 'committee-members',
      image: require('../../assets/images/ComitteIcon.png'),
      label: 'Committe Members',
      page: 'Committe',
    },
    {
      id: 'previous-events',
      image: require('../../assets/images/previous-event.png'),
      label: 'Events',
      page: 'Events',
    },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={getPendingRequestCount}
          />
        }
      >
        <View style={styles.profileContainer}>
          <Image
            source={loginData && loginData.profileURL ? { uri: loginData.profileURL } : require('../../assets/images/Profile.png')}
            style={styles.profileImage}>
          </Image>
          <View>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
            <Image source={require('../../assets/images/upload.png')} style={styles.uploadIcon} />
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => redirectToPage('EditProfile')}>Edit Profile</Text>
        </View>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <ProgressBar style={styles.progressBar} color={colors.progressBar} progress={uploadProgress / 100} />
        )}
        {menuItems.map((menuItem) => (
          <TouchableOpacity
            key={menuItem.id}
            style={styles.dashboardItem}
            activeOpacity={0.7}
            onPress={() => redirectToPage(menuItem.page)}
          >
            <Image source={menuItem.image} />
            <Text style={styles.link}>{menuItem.label}</Text>
          </TouchableOpacity>
        ))}
        {isAdmin && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => redirectToPage('Settings')}>
            <View style={styles.dashboardItem}>
              <View style={styles.iconWrapper}>
                <Image source={require('../../assets/images/setting.png')} />
                {pendingRequest > 0 && (<View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{pendingRequest}</Text>
                </View>)}

              </View>
              <Text style={styles.link}>Settings</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View >

  );
};

export default Dashboard;