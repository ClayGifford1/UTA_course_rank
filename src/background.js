import { initializeApp } from '@firebase/app';
import { getAnalytics } from '@firebase/analytics';
import { getDatabase } from '@firebase/database'; 

const firebaseConfig = {
  apiKey: "AIzaSyDbGq-_w7iBzjmCncRVHeUovDsZNuaID3Q",
  authDomain: "course-rank.firebaseapp.com",
  databaseURL: "https://course-rank-default-rtdb.firebaseio.com",
  projectId: "course-rank",
  storageBucket: "course-rank.appspot.com",
  messagingSenderId: "303355690951",
  appId: "1:303355690951:web:97eb35208734ced587a3e2",
  measurementId: "G-9D8S1QQCY5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);