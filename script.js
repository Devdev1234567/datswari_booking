import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

  if (!name || !phone || !time) return alert("املأ كل البيانات");

  set(ref(db, "bookings/" + time), {
    name,
    phone,
    time
  });
};

window.clearBookings = function () {
  const code = document.getElementById("deleteCode").value;
  if (code === "123456") {
    remove(ref(db, "bookings"));
  } else {
    alert("الرمز خاطئ");
  }
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

// رسترة تلقائية عند 3 صباحًا
const now = new Date();
if (now.getHours() === 3) {
  remove(ref(db, "bookings"));
}

loadBookings();
