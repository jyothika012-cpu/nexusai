import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBjFzJSW36kOI75Nhz0uiZgwhU9qTnSiKE',
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nexusai-4d13c.firebaseapp.com',
 projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nexusai-4d13c',
 storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nexusai-4d13c.firebasestorage.app',
 messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '146380568447',
 appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:146380568447:web:fd77f2ee48351e9af30c4a'
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, import.meta.env.VITE_FUNCTIONS_REGION || 'asia-south1');
