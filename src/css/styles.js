import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../styles/colors';

const styles = StyleSheet.create({
    // define HomeScreen page container
    mainContainer: {
        flex: 1,
        backgroundColor: colors.secondaryBackground,
        padding: 15
    },
    pageViewer: {
        flex: 4,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    // define Navigation view after login
    headerRightContainer: {
        flexDirection: 'column',
        position: 'relative'
    },
    horizontalLinesIcons: {
        alignItems: 'center',
        padding: 15,
        marginRight: 25,
        marginBottom: 10
    },
    LeftArrowIcons: {
        alignItems: 'center',
        padding: 10,
        margin: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '300',
        color: '#fff',
        marginTop: 10,
        marginBottom: 15
    },
    // define page wrapper
    container: {
        flex: 1,
        backgroundColor: colors.secondaryBackground,
        padding: 15
    },
    // define logo style
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 25
    },
    logo: {
        flex: 3,
        width: hp('50%'),
        height: hp('50%'),
        resizeMode: 'contain',
    },
    // define text style
    textContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    headline: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryTextColor,
        marginBottom: 5
    },
    subHeadline: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 5,
        //fontStyle: 'italic',
        color: colors.secondaryTextColor
    },
    screenHeadline: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: colors.primaryTextColor,
    },
    screenSubHeadline: {
        fontSize: wp('4%'),
        textAlign: 'center',
        marginVertical: hp('1%'),
        color: colors.secondaryTextColor
    },
    eventSubHeadline: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
        color: colors.secondaryTextColor
    },
    subleftHeadline: {
        fontSize: 16,
        marginVertical: 5,
        //fontStyle: 'italic',
        color: colors.secondaryTextColor,
    },
    link: {
        fontSize: 18,
        fontWeight: '300',
        color: colors.secondaryTextColor,
        marginTop: 10,
        marginBottom: 15
    },
    eventDescription: {
        fontSize: 16,
        fontWeight: '300',
        color: colors.secondaryTextColor,
        marginBottom: 15,
        marginTop: 5
    },
    // button
    buttonContainer: {
        backgroundColor: colors.primaryBackground,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff'
    },
    buttonHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        height: 50,
    },
    secondaryButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
    },
    secondaryButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.secondaryTextColor,
        textTransform: 'capitalize'
    },
    actionButton: {
        fontSize: 16,
        textTransform: 'capitalize',
        backgroundColor: colors.primaryBackground,
        padding: 7,
        borderRadius: 15,
        color: '#fff'
    },
    // define HomeScreen footer
    footer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10
    },
    // define style for 3 slide dots (HomeScreen)
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    dotContainer: {
        marginHorizontal: 3,
    },
    dot: {
        borderRadius: 50,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: colors.primaryBackground,
    },
    inactiveDot: {
        backgroundColor: '#ffffff',
    },
    // define style for input text
    fieldLabelContainer: {
        justifyContent: 'flex-start',
        width: '100%',
        padding: wp(1),
        marginLeft: wp(4),
    },

    fieldLabel: {
        color: colors.secondaryTextColor,
        fontSize: 16
    },
    inputContainer: {
        width: '100%',
        marginBottom: 5
    },
    input: {
        position: 'relative',
        flex: 1,
        fontSize: 14,
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.secondaryBackground,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: colors.primaryTextColor
    },
    placeholder: {
        position: 'absolute',
        left: 14,
        top: 18,
        fontSize: 12,
        color: colors.primaryBackground,
        fontStyle: 'italic',
    },
    placeholderFocused: {
        color: colors.primaryBackground,
    },
    inputError: {
        borderColor: colors.errorColor,
    },
    disabled: {
        backgroundColor: colors.secondaryBackground,
        opacity: 0.5,
    },
    disabledButton: {
        backgroundColor: colors.disabledBackground,
        opacity: 0.5,
    },
    // define DashBoard profile container
    profileContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.primaryBackground,
        borderRadius: 5,
        padding: 5
    },
    profileImage: {
        width: wp('40%'),
        height: wp('40%'),
        borderRadius: wp(50),
        backgroundColor: 'grey',
    },
    uploadIcon: {
        width: wp(8),
        height: wp(8),
        //borderRadius: wp(50),
    },
    contentItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: wp(5),
        padding: wp(4),
        marginBottom: hp(2),
    },
    dashboardItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: wp(5),
        padding: wp(4),
        marginTop: hp(2)
    },
    progressBar: {
        height: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '100%',
        height: 20
    },
    // define error box with fix height
    errorBox: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        color: colors.errorColor,
        fontSize: 16,
        marginBottom: 5
    },
    errorText: {
        justifyContent: 'flex-start',
        color: colors.errorColor,
        fontSize: 14,
        marginBottom: 5,
        width: '100%'
    },
    radioButtonerrorText: {
        color: colors.errorColor,
        fontSize: 14,
    },
    // define contact details
    memberContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: hp(2),
        backgroundColor: '#fff',
        borderRadius: wp(2),
        padding: wp(3),
    },
    memberDetailsContainer: {
        flexDirection: 'row', // Display icon and details in the same row
        alignItems: 'stretch', // Stretch the icon to cover the height of details
    },
    contactDetails: {
        flex: 1,
        flexDirection: 'column',

    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingRight: 8, // Adjust as needed for spacing
    },
    inputIcon: {
        width: wp('5%'),
        height: wp('5%'),
    },
    profileIcon: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp(50),
        backgroundColor: 'silver',
        marginRight: wp(4)
    },
    contactItem: {
        fontSize: 14,
        color: colors.secondaryTextColor,
        marginVertical: 5
    },
    // define style for checkbox
    checkboxContainer: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'none',
    },
    checkbox: {
        alignSelf: 'center',
        borderWidth: 0,
    },
    checkboxBorder: {
        borderColor: colors.primaryBackground,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    radioButton: {
        backgroundColor: 'red'
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: '#fff',
        borderColor: colors.primaryBackground, // Border color of the radio button
    },
    radioButtonSelected: {
        backgroundColor: '#C2F3ED', // Background color when the radio button is selected
    },
    // dropdown box
    dropdownBox: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.secondaryBackground,
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    dropdownBoxSelect: {
        fontSize: 16,
        color: colors.primaryTextColor
    },
    dropdownBoxItemView: {
        borderRadius: 20,
        backgroundColor: '#fff',
        borderColor: colors.secondaryBackground,
        marginTop: 1
    },
    dropdownBoxItem: {
        paddingHorizontal: 10,
    },
    // define style for Success Message
    success: {
        backgroundColor: colors.primaryBackground,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
        width: '100%',
        marginBottom: 8,
    },
    updating: {
        backgroundColor: colors.primaryBackground,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
        width: '100%',
        marginBottom: 8,
        height: 50,
        color: '#fff'
    },
    processingText: {
        color: '#fff',
        textTransform: 'capitalize',
        flexWrap: 'wrap',
        fontWeight: '600'
    },
    // define notification icon css
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    notificationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
    // define style for textarea
    textArea: {
        fontSize: 16,
        height: 200,
        borderColor: colors.primaryBackground,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',
    },
    longTextContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: wp(5),
        padding: wp(4),
        minHeight: 250,
        marginBottom: 15,
    },
    // define upcoming event 'text' style 
    pending: {
        position: 'absolute',
        top: wp(0),
        right: wp(4),
        backgroundColor: '#F24040'
    },
    upcomingEvent: {
        position: 'absolute',
        top: wp(0),
        right: wp(4),
        backgroundColor: colors.primaryBackground
    },
    upcomingEventText: {
        color: '#fff',
        padding: 5,
        fontSize: 12,
    },
    ExpiredEventText: {
        position: 'absolute',
        top: 0,
        right: wp(4),
        backgroundColor: '#FFEDD1',
    },
    // define style for usere list
    list: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: hp(1),
        backgroundColor: '#fff',
        borderRadius: wp(2),
        padding: wp(2),
    },
    // define privary polity
    privacyPolicy: {
        flexDirection: 'row',
        marginBottom: wp(2),
        color: colors.primaryTextColor,
        padding: 8,
        width: '100%'
    },
    termConditions: {
        textDecorationLine: 'underline',
        color: colors.primaryTextColor
    },
    privacyPolicyText: {
        color: colors.secondaryTextColor,
    },
    overLay: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: wp(2),
        padding: 25
    },
    overLayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        backgroundColor: colors.primaryBackground,
        opacity: 0.8
    },
    // define style for password show/hide icon
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingVertical: 10,
    },
    eyeIconContainer: {
        paddingRight: 10,
    },
    eyeIcon: {
        width: 24,
        height: 24,
    },
    capitalize: {
        textTransform: 'uppercase',
        fontSize: 16,
        flexWrap: 'wrap',
        width: wp('50%')
    }
});

export default styles;
