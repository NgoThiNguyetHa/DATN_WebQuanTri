const { initializeApp } = require('firebase/app');
const {getAuth} = require('firebase/auth')
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

module.exports = { auth, firebaseApp };