
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyDDd61T-UsAGKzvyZb4D7Dn6n8WRbi1FEI",
        authDomain: "instagram-clone-258f1.firebaseapp.com",
        databaseURL: "https://instagram-clone-258f1.firebaseio.com",
        projectId: "instagram-clone-258f1",
        storageBucket: "instagram-clone-258f1.appspot.com",
        messagingSenderId: "775067648051",
        appId: "1:775067648051:web:ced613348d94bdede7e346",
        measurementId: "G-8QLK25W9YT"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage()

export { db, auth , storage}


