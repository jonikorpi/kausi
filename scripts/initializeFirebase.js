import firebase from "firebase";

const initializeFirebase = () => {
  try {
    firebase.initializeApp({
      authDomain: "muisti-6a29a.firebaseapp.com",
      apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
      databaseURL: "https://muisti-6a29a.firebaseio.com",
    });
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }
};

export default initializeFirebase;
