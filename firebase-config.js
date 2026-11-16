<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBL9-jYD1MPEB8N48O3hxXXzN8z7uRcAmw",
    authDomain: "cisk-adc82.firebaseapp.com",
    projectId: "cisk-adc82",
    storageBucket: "cisk-adc82.firebasestorage.app",
    messagingSenderId: "14222915431",
    appId: "1:14222915431:web:336d89952a9bd4275821c2",
    measurementId: "G-C63B9KFFTG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
