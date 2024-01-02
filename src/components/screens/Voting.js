import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import InputText from '../screens/InputText';
import { db } from '../../services/db';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Button from '../common/Button';
import styles from '../../css/styles';
import { useAuth } from './AuthContext';
import { colors } from '../../styles/colors';
import Label from '../screens/Label';
import { v4 as uuidv4 } from 'uuid';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

const Voting = ({ route }) => {
    const { loginData } = useAuth();
    const navigation = useNavigation();
    const { id: eventId } = route.params || {};
    const [date, setDate] = useState('');
    const [childrenCount, setChildrenCount] = useState('');
    const [parentsCount, setParentsCount] = useState('');
    const [isGoing, setIsGoing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});
    const [userVote, setUserVote] = useState(false);

    useEffect(() => {
        checkIfUserVotingExist();
    }, []); // Run only once when the component mounts

    const checkIfUserVotingExist = async () => {
        try {
            const db = getFirestore();
            const votingCollection = collection(db, 'votingCollections');
            const querySnapshot = await getDocs(query(votingCollection,
                where('event_id', '==', eventId),
                where('user_id', '==', loginData.id)
            ));

            const userVote = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (userVote.length > 0) {
                setParentsCount(userVote[0].no_of_parents);
                setChildrenCount(userVote[0].no_of_childrens);
                setIsGoing(userVote[0].isGoing ? 'yes' : 'no');
                setUserVote(true);
            } else {
                setUserVote(false);
            }
        } catch (error) {
            console.error('Error fetching user vote:', error);
        }
    };

    const handleFocus = (input) => {
        setFocusedInput(input);
    };

    const handleBlur = () => {
        setFocusedInput(null);
    };

    const validateForm = () => {
        const errors = {};

        if (isGoing === null) {
            errors.isGoing = 'Please select an option for attending the program';
        } else if (isGoing === 'yes' && (isNaN(childrenCount) || childrenCount < 0)) {
            errors.childrenCount = 'Please enter a valid number of children';
        }

        if (isGoing === 'yes' && !childrenCount.trim()) {
            errors.childrenCount = 'Please enter event location';
        }

        if (isGoing === 'yes' && !parentsCount.trim()) {
            errors.parentsCount = 'Please enter event description';
        }
        setErrorMessages(errors);

        return Object.keys(errors).length === 0;
    };

    const handleVoting = async () => {
        if (validateForm()) {
            try {
                setLoading(true);
                const data = {
                    voting_id: uuidv4(),
                    event_id: eventId,
                    user_id: loginData.id,
                    isGoing: isGoing === 'yes' ? true : false,
                    no_of_parents: isGoing === 'yes' ? parentsCount : '',
                    no_of_childrens: isGoing === 'yes' ? childrenCount : ''
                };
                await addDoc(collection(db, 'votingCollections'), data);
                setIsGoing(null);
                setParentsCount('');
                setChildrenCount('');
            } catch (error) {
                console.error('Error submitting data:', error);
            } finally {
                setLoading(false);
                navigation.navigate('Events');
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                    <Text style={styles.headline}>Miteri munch will wait for you Miteri munch will wait for you </Text>
                </View>
                {/* <Text style={styles.link}>Are you going in this program?</Text> */}
                <Label label='Are you going in this program?' style={{ marginLeft: wp(0), padding: wp(0) }}/>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton.Android
                        value="yes"
                        status={isGoing === 'yes' ? 'checked' : 'unchecked'}
                        onPress={() => setIsGoing('yes')}
                    />
                    <Text style={styles.link}>Yes</Text>

                    <RadioButton.Android
                        value="no"
                        status={isGoing === 'no' ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIsGoing('no');
                            setChildrenCount(''); // Reset childrenCount when selecting 'No'
                        }}
                    />
                    <Text style={styles.link}>No</Text>
                </View>
                {errorMessages.isGoing && (
                    <Text style={styles.radioButtonerrorText}>{errorMessages.isGoing}</Text>
                )}

                {isGoing === 'yes' && (
                    <>
                        {/* <Text style={styles.link}>How Many Children under 10?</Text> */}
                        <Label label='How Many Children under 10?'  style={{ marginLeft: wp(0), padding: wp(0)}} />
                        <InputText
                            value={childrenCount}
                            placeholder="Children Count*"
                            onChangeText={(value) => setChildrenCount(value)}
                            onFocus={() => handleFocus('childrenCount')}
                            onBlur={handleBlur}
                            error={errorMessages.childrenCount}
                        />
                        {/* <Text style={styles.link}>Please put 2 if husband and wife are coming?</Text> */}
                        <Label label='Please put 2 if husband and wife are coming?'  style={{ marginLeft: wp(0), padding: wp(0)}} />
                        <InputText
                            value={parentsCount}
                            placeholder="Parents Count*"
                            onChangeText={(value) => setParentsCount(value)}
                            onFocus={() => handleFocus('parentsCount')}
                            onBlur={handleBlur}
                            error={errorMessages.parentsCount}
                        />

                    </>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primaryBackground} />
                ) : (
                    <Button label='Vote' disabled={userVote ? true : false} style={userVote ? [styles.disabledButton, { marginTop: 15 }] : { marginTop: 15 }} onPress={() => handleVoting()} />
                )}
            </ScrollView>
        </View>
    );
};

export default Voting;
