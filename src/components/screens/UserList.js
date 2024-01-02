import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import styles from '../../css/styles';

const UserList = ({ route }) => {
  const { id: eventId } = route.params || {};
  const [users, setUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [notGoing, setNotGoing] = useState(0);

  useEffect(() => {
    fetchUserNames();
  }, []); // Run only once when the component mounts

  const fetchUserNames = async () => {
    try {
      setIsRefreshing(true);
      const db = getFirestore();
      const votingCollection = collection(db, 'votingCollections');
      const eventVotesQuery = query(votingCollection, where('event_id', '==', eventId));
      const eventVotesSnapshot = await getDocs(eventVotesQuery);
      const userIds = eventVotesSnapshot.docs.map(doc => doc.data().user_id);


      if (userIds.length > 0) {
        const childrenCounts = eventVotesSnapshot.docs.map(doc => doc.data().no_of_childrens);
        const parentsCounts = eventVotesSnapshot.docs.map(doc => doc.data().no_of_parents);

        // Combine counts 
        const totalChildren = childrenCounts.reduce((acc, count) => acc + count, 0);
        const totalParents = parentsCounts.reduce((acc, count) => acc + count, 0);
        setTotalChildren(totalChildren);
        setTotalParents(totalParents);

        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection, where('id', 'in', userIds));
        const usersSnapshot = await getDocs(usersQuery);

        const users = usersSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          serialNumber: index + 1, // Serial number starting from 1
          isGoing: doc.data().isGoing,
          ...doc.data(),
        }));

        const notGoingCount = users.filter(user => !user.isGoing).length;
        setNotGoing(notGoingCount);
        console.log('Not Going Count:', notGoingCount);

        setUsers(users);
      } else {
        console.log('No user records found for the given event ID.');
        setTotalChildren(0);
        setTotalParents(0);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error: fetching list', users);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderUsers = ({ item }) => (
    <View style={styles.list}>
      <Text style={styles.serialNumber}>{item.serialNumber}. </Text>
      <Text style={styles.subHeadline}>{item.fullname}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {totalParents > 0 && (
          <Text style={styles.subHeadline}>
            Parents({Number(totalParents).toString()})
          </Text>
        )}
        {totalParents > 0 && totalChildren > 0 && (
          <Text style={styles.subHeadline}> | </Text>
        )}
        {totalChildren > 0 && (
          <Text style={styles.subHeadline}>
            Childrens({Number(totalChildren).toString()})
          </Text>
        )}
        {notGoing > 0 && (
          <Text style={styles.subHeadline}>
            {' '}Not Coming({Number(notGoing).toString()})
          </Text>
        )}
        {notGoing === 0 && totalChildren === 0 && totalParents === 0 && (
          <Text style={styles.subHeadline}>
          No voting
          </Text>
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUsers}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchUserNames}
          />
        }
      />
    </View>
  );
};

export default UserList;
