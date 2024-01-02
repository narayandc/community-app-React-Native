import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import InputText from '../screens/InputText';
import { db } from '../../services/db';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Button from '../common/Button';
import styles from '../../css/styles';
import { colors } from '../../styles/colors';
import Label from '../screens/Label';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { v4 as uuidv4 } from 'uuid';

const NewEvents = ({ route }) => {
  const navigation = useNavigation();
  const { id: eventId } = route.params || {}; // Extract id from route.params or use undefined
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});


  useEffect(() => {
    // Fetch existing event data if in edit mode
    const fetchEventData = async () => {
      try {
        const db = getFirestore();
        const eventCollection = collection(db, 'events');
        const querySnapshot = await getDocs(query(eventCollection,
          where('id', '==', eventId),
        ));

        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDate(events[0].date);
        setLocation(events[0].location);
        setDescription(events[0].description);
      } catch (error) {
        console.error('Error: fetching events');
      }
    };

    if (eventId) {
      fetchEventData();
    }

  }, [eventId]);

  const handleFocus = (input) => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!date.trim()) {
      errors.date = 'Please enter event date';
    } else {
      const dateRegex = /^\d{4}-(0\d|1[0-2])-(0\d|[12]\d|3[01])$/;
      if (!dateRegex.test(date)) {
        errors.date = 'Please enter a valid date in the format YYYY-MM-DD';
      } else {
        const enteredDate = new Date(date);
        const currentDate = new Date();

        if (enteredDate.getTime() < currentDate.getTime()) {
          errors.date = 'Event date must be in the future';
        }
      }
    }

    if (!location.trim()) {
      errors.location = 'Please enter event location';
    }

    if (!description.trim()) {
      errors.description = 'Please enter event description';
    }

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddEvent = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        setLoadingDate(true);

        const data = {
          id: uuidv4(),
          date: date,
          location,
          description: description,
        };

        if (eventId) {
          const eventQuery = query(collection(db, 'events'), where('id', '==', eventId));
          const querySnapshot = await getDocs(eventQuery);

          if (querySnapshot.size === 1) {
            const eventDoc = querySnapshot.docs[0].ref;
            await updateDoc(eventDoc, data);
            console.log('Event updated');
          }
        } else {
          await addDoc(collection(db, 'events'), data);
        }

        setDate('');
        setLocation('');
        setDescription('');
      } catch (error) {
        console.error('Error: ddding event');
      } finally {
        setLoading(false);
        setLoadingDate(false);
        navigation.navigate('Dashboard');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Label label='Date (YYYY-MM-DD)' style={{ marginLeft: wp(1), padding: wp(1) }}/>
        <InputText
          value={date}
          placeholder="Date* (YYYY-MM-DD)"
          onChangeText={(value) => setDate(value)}
          onFocus={() => handleFocus('date')}
          onBlur={handleBlur}
          keyboardType="numeric"
          error={errorMessages.date}
        />
        <Label label='Event Address' style={{ marginLeft: wp(1), padding: wp(1) }}/>
        <InputText
          value={location}
          placeholder="Location*"
          onChangeText={(value) => setLocation(value)}
          onFocus={() => handleFocus('location')}
          onBlur={handleBlur}
          error={errorMessages.location}
        />
        <Label label='Description' style={{ marginLeft: wp(1), padding: wp(1) }}/>
        <TextInput
          style={styles.textArea}
          value={description}
          placeholder="Description"
          onChangeText={(value) => setDescription(value)}
          onFocus={() => handleFocus('description')}
          onBlur={handleBlur}
          multiline
          numberOfLines={10}
        />


        <Text style={styles.errorText}>{errorMessages.description ? errorMessages.description : ''}</Text>


        {loading ? (
          <ActivityIndicator size="large" color={colors.primaryBackground} />
        ) : (
          <Button label={eventId ? 'Update' : 'Save'} onPress={() => handleAddEvent()} />
        )}
      </ScrollView>
    </View>
  );
};

export default NewEvents;
