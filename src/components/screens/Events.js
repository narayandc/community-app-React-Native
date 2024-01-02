import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { getFirestore, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import Button from '../common/Button';
import styles from '../../css/styles';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

const Events = () => {
  const { isAdmin } = useAuth();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchEventList();
  }, []); // Run only once when the component mounts

  const [visibleItems, setVisibleItems] = useState(3); // Number of initially visible items

  const redirectToPage = () => {
    navigation.navigate('NewEvent');
  };

  const fetchEventList = async () => {
    try {
      setIsRefreshing(true);
      const db = getFirestore();
      const eventCollection = collection(db, 'events');
      const querySnapshot = await getDocs(query(eventCollection));

      const eventList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch total votes for each event
      const votingCollection = collection(db, 'votingCollections');
      const totalVotesPromises = eventList.map(async (event) => {
        const totalVotesSnapshot = await getDocs(query(votingCollection, where('event_id', '==', event.id)));
        return {
          eventId: event.id,
          totalVotes: totalVotesSnapshot.size,
        };
      });

      const totalVotesResults = await Promise.all(totalVotesPromises);

      // Merge total votes into the eventList
      const updatedEventList = eventList.map((event) => {
        const totalVotesResult = totalVotesResults.find((result) => result.eventId === event.id);
        return {
          ...event,
          totalVotes: totalVotesResult ? totalVotesResult.totalVotes : 0,
        };
      });

      setEventList(updatedEventList);
    } catch (error) {
      console.error('Error fetching event list:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 2);
  };

  const renderText = (text, index) => {
    if (expandedIndex === index) {
      return text;
    } else {
      const truncatedText = text.slice(0, 400);
      return truncatedText;
    }
  };

  const handleToggleText = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const navigateTo = (page, eventId) => {
    navigation.navigate(page, { id: eventId });
  };

  const shouldDisplayMoreLink = (text, index) => {
    const truncatedText = text.slice(0, 400);
    return truncatedText.length < text.length;
  };

  const isDateExpired = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    return currentDate > eventDateObject;
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const db = getFirestore();
      const eventQuery = query(collection(db, 'events'), where('id', '==', eventId));
      const eventQuerySnapshot = await getDocs(eventQuery);
  
      if (eventQuerySnapshot.size === 1) {
        const eventDoc = eventQuerySnapshot.docs[0].ref;
        const votingCollectionQuery = query(collection(db, 'votingCollections'), where('event_id', '==', eventId));
        const votingCollectionQuerySnapshot = await getDocs(votingCollectionQuery);
  
        const batch = writeBatch(db);
        batch.delete(eventDoc);
  
        votingCollectionQuerySnapshot.forEach((votingDoc) => {
          batch.delete(votingDoc.ref);
        });
        await batch.commit();
        fetchEventList(); // Refresh the event list after deletion
      } else {
        console.error('Event not found');
      }
    } catch (error) {
      console.error('Error: deleting event');
    }
  };

  return (
    <View style={styles.container}>
      {isAdmin && (
        <View style={styles.buttonHeaderContainer}>
          <TouchableOpacity
            style={styles.secondaryButtonContainer}
            activeOpacity={0.7}
            onPress={() => redirectToPage('NewEvent')}
          >
            <Image source={require('../../assets/images/add.png')} style={styles.uploadIcon} />
            <Text style={styles.secondaryButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      )}
      {eventList.length === 0 && (
            <Text style={styles.subHeadline}>No Event</Text>
      )}
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={fetchEventList} />
      }>
        {eventList.length > 0 && eventList
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (isDateExpired(a.date) && !isDateExpired(b.date)) {
              return 1; // Move expired dates to the bottom
            } else if (!isDateExpired(a.date) && isDateExpired(b.date)) {
              return -1; // Move non-expired dates to the top
            } else {
              return dateA - dateB; // Sort non-expired dates in ascending order
            }
          })
          .map((event, index) => (
            <View
              key={index}
              style={[
                styles.longTextContainer,
                isDateExpired(event.date) ? { backgroundColor: '#FFEDD1' } : null,
              ]}
            >
              {!isDateExpired(event.date) && (
                <View style={styles.upcomingEvent}>
                  <Text style={styles.upcomingEventText}>New Event</Text>
                </View>
              )}
              <Text style={styles.secondaryButtonText}>date: <Text style={styles.secondaryButtonText}>{event.date}</Text></Text>
              <Text style={styles.secondaryButtonText}>address: <Text style={styles.secondaryButtonText}>{event.location}</Text></Text>
              {isDateExpired(event.date) ? (
                <>
                <Text style={styles.errorText}>Event Expired</Text>
                {isAdmin && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleDeleteEvent(event.id)}
                  >
                    <Text style={styles.subHeadline}>Delete</Text>
                  </TouchableOpacity>
                )}
                </>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {isAdmin && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => navigateTo('NewEvent', event.id)}
                    >
                      <Text style={styles.subHeadline}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  {isAdmin && (
                    <Text style={styles.subHeadline}>{' | '}</Text>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigateTo(event.id)}
                  >
                    <Text style={styles.subHeadline} onPress={() => navigateTo('Voting', event.id)}>{' '}Votes({event.totalVotes})</Text>
                  </TouchableOpacity>
                  <Text style={styles.eventSubHeadline}>{' | '}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigateTo(event.id)}
                  >
                    <Text style={styles.subHeadline} onPress={() => navigateTo('UserList', event.id)}>View</Text>
                  </TouchableOpacity>
                  {isAdmin && (
                    <Text style={styles.eventSubHeadline}>{' | '}</Text>
                  )}
                  {isAdmin && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Text style={styles.subHeadline}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <Text
                style={styles.eventDescription}
                numberOfLines={expandedIndex === index ? undefined : 50}
              >
                {renderText(event.description, index)}
              </Text>
           {shouldDisplayMoreLink(event.description, index) && (
                <TouchableOpacity onPress={() => handleToggleText(index)}>
                  <Text style={styles.subHeadline}>
                    {expandedIndex === index ? 'Less...' : 'More...'}
                  </Text>
                </TouchableOpacity>
              )} 
            </View>
          ))}
        {/* {visibleItems < eventList.length && (
          <Button label="Load more..." onPress={handleLoadMore} />
        )} */}
      </ScrollView>
    </View>
  );
};

export default Events;
