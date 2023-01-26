import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"

firebase.initializeApp({
    apiKey: "AIzaSyCI-m2KDJP5_pGbSCm4uCYNxY2882egk7c",
    authDomain: "spablofy.firebaseapp.com",
    projectId: "spablofy",
    storageBucket: "spablofy.appspot.com",
    messagingSenderId: "444494815294",
    appId: "1:444494815294:web:33311a35ea003ccbc0b16f",
    measurementId: "G-2G7S4M90BR"
  })
  
const firestore = firebase.firestore();

const SendFirebase = () => {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy('createdAt').limit(200);
    const [messages] = useCollectionData(query, {idField: 'id'});
}

export default SendFirebase
