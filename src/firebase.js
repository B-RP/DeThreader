import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
    apiKey: "AIzaSyCqFTVDX6h2fMqSsvjIRdAqZfkrMqDEDAU",
    authDomain: "threader-app-8163c.firebaseapp.com",
    databaseURL: "https://threader-app-8163c-default-rtdb.firebaseio.com",
    projectId: "threader-app-8163c",
    storageBucket: "threader-app-8163c.appspot.com",
    messagingSenderId: "1077400049279",
    appId: "1:1077400049279:web:af5dee3ccd6b064e3a914a",
    measurementId: "G-6QQ4CMXDPF"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
// const auth = getAuth();

// Initialize Firebase Realtime Database
// const db = getDatabase(app);


export default app;
