import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlDLrvDNumFk9NA4ldTfr2vEBlMrxPzgg",
  authDomain: "datswari-boorking.firebaseapp.com",
  databaseURL: "https://datswari-boorking-default-rtdb.firebaseio.com",
  projectId: "datswari-boorking",
  storageBucket: "datswari-boorking.firebasestorage.app",
  messagingSenderId: "994128829706",
  appId: "1:994128829706:web:5da06448e62c095c75eef3",
  measurementId: "G-9Z13Q3102W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.book = function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const time = document.getElementById("time").value;
  const userCode = document.getElementById("userCode").value;

  if (!name || !phone || !time || !userCode) return alert("املأ كل البيانات");

  set(ref(db, "bookings/" + time), {
    name,
    phone,
    time,
    userCode
  });
  alert("تم الحجز بنجاح!");
};

function loadBookings() {
  const tableBody = document.querySelector("#bookingTable tbody");
  const bookingsRef = ref(db, "bookings");
  onValue(bookingsRef, (snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = `<tr><td>${data.name}</td><td>${data.phone}</td><td>${data.time}</td></tr>`;
      tableBody.innerHTML += row;
    });
  });
}

loadBookings();
