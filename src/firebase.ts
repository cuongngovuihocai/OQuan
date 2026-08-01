import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC_Lm0oSoGlRRmaCTiOB3d1o-Mwih-WOpk",
  authDomain: "line98-game.firebaseapp.com",
  projectId: "line98-game",
  storageBucket: "line98-game.firebasestorage.app",
  messagingSenderId: "252310123568",
  appId: "1:252310123568:web:ad9906f17019b28ec669f5",
  databaseURL: "https://line98-game-default-rtdb.asia-southeast1.firebasedatabase.app"
};

export const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
