import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCfP49xeGRbxq2gz_vWHZIo8qIkWoB6Y4U",
  authDomain: "voxnow-4d5bc.firebaseapp.com",
  projectId: "voxnow-4d5bc",
  storageBucket: "voxnow-4d5bc.appspot.com",
  messagingSenderId: "104623273587",
  appId: "1:104623273587:web:bd101a4d5d036f0e20dc06",
  measurementId: "G-7CZZ3J9YS9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);