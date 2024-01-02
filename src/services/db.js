import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCu2wffgzzsk3AJxfaGVaxDNwMj_59ik1A",
    authDomain: "nepal-miteri-munch.firebaseapp.com",
    projectId: "nepal-miteri-munch",
    storageBucket: "nepal-miteri-munch.appspot.com",
    messagingSenderId: "566084105583",
    appId: "1:566084105583:web:aa1022d02834490c2ba49a",
    measurementId: "G-JGSGCD3FHH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };