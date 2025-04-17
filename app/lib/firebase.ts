// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const FIREBASE_KEY = process.env.NEXT_PUBLIC_FIREBASE_KEY;

const firebaseConfig = {
  apiKey: "AIzaSyA7J8eCzqlqfv9WpyhsSUsJJ_Tod_0xXks",
  authDomain: "pdfuploaderp.firebaseapp.com",
  projectId: "pdfuploaderp",
  storageBucket: "pdfuploaderp.firebasestorage.app",
  messagingSenderId: "260418100607",
  appId: "1:260418100607:web:0b5f3871ccc548db3c8e4a"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
