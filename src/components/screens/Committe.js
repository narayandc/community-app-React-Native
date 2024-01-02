import React, { useState, useEffect } from 'react';
import { View, Image, Text, FlatList, RefreshControl } from 'react-native';
import { db } from '../../services/db';
import { getFirestore, collection, getDocs, where, query, orderBy } from 'firebase/firestore';
import { MEMBERS_LIST } from '../../utils/Constant';
import styles from '../../css/styles';

const Committe = () => {
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    fetchCommitteeMembers();
  }, []); // Run only once when the component mounts

  const fetchCommitteeMembers = async () => {
    try {
      setIsRefreshing(true);
      const db = getFirestore();
      const committeeCollection = collection(db, 'users');
      const querySnapshot = await getDocs(query(committeeCollection,
        where('is_committe_member', '==', true),
        where('is_approve', '==', 1),
        orderBy('member_id', 'asc') 
      ));

      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommitteeMembers(members);
    } catch (error) {
      console.error('Error: fetching committe members');
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderCommitteeMember = ({ item }) =>
  (<View style={styles.memberContainer}>
    <Image
      source={item.profileURL ? { uri: item.profileURL } : require('../../assets/images/Profile.png')}
      style={styles.profileIcon}>
    </Image>
    <View style={styles.contactDetails}>
      <Text style={[styles.headline, styles.capitalize]}>{item.fullname}</Text>
      <Text style={styles.contactItem}>{MEMBERS_LIST.find(list => list.key === item.member_id)?.value || '?'}</Text>
      <Text style={styles.contactItem}>Contact:{' '}{item.phonenumber}</Text>
    </View>
  </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={committeeMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderCommitteeMember}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchCommitteeMembers}
          />
        }
      />
    </View>
  );
};

export default Committe;