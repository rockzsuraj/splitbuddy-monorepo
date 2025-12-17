import { Platform, StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    // padding: 10,
    marginBottom: 5,
    borderRadius: 5
  },
  textInputSignIn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    borderRadius: 5
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1
  },
  textView: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 10,
  },
  buttonContainer: {
    // position: 'absolute',
    // bottom: 30,
    // left: 20,
    // right: 20
    flex: 1
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center'
  },
  icon: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'ChokoMilky',
      android: 'ChokoMilky-gx8gR'
    }),
    color: 'orange'
  },
  infoText: {
    fontSize: 18,
    lineHeight: 24,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  buttonElementContainer: {
    // width: '100%',
    // height: '30%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textArea: {
    height: 80,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default globalStyles;
