import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyCU_RIBXEkGi_f-7AqeCMSp_mBlOmPP4Wc',
  authDomain: 'rack-chat.firebaseapp.com',
  databaseURL: 'https://rack-chat.firebaseio.com',
  projectId: 'rack-chat',
  storageBucket: 'rack-chat.appspot.com',
  messagingSenderId: '744846557833',
  appId: '1:744846557833:web:7e2db18dae8a3bdd847c58',
  measurementId: 'G-XCQTLES0YP'
}

firebase.initializeApp(config)

export default firebase
