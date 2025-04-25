import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, remove, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMPx38CeZAkHY7PGSM_E4GIsndaPNJ_wU",
  authDomain: "datswari-booring.firebaseapp.com",
  databaseURL: "https://datswari-booring-default-rtdb.firebaseio.com",
  projectId: "datswari-booring",
  storageBucket: "datswari-booring.appspot.com",
  messagingSenderId: "962253857620",
  appId: "1:962253857620:web:0d66148bac90cce8745ec1",
  measurementId: "G-FGX0THTN8L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const hours = [
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
  "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM"
];

const hourSelect = document.getElementById("hourSelect");
const tableBody = document.getElementById("tableBody");

// Populate hour select
hours.forEach(hour => {
  const option = document.createElement("option");
  option.value = hour;
  option.textContent = hour;
  hourSelect.appendChild(option);
});

// Book Slot
window.bookSlot = function() {
  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const code = document.getElementById("codeInput").value.trim();
  const hour = document.getElementById("hourSelect").value;

  if (!name || !phone || !code || !hour) {
    alert("رجاءً عبي جميع الخانات");
    return;
  }

  set(ref(db, "bookings/" + hour), {
    name,
    phone,
    code
  }).then(() => {
    alert("تم الحجز بنجاح");
    document.getElementById("nameInput").value = "";
    document.getElementById("phoneInput").value = "";
    document.getElementById("codeInput").value = "";
    document.getElementById("hourSelect").value = "";
  }).catch(error => {
    alert("خطأ: " + error.message);
  });
}

// Display bookings
function displayBookings() {
  const bookingsRef = ref(db, "bookings");
  onValue(bookingsRef, (snapshot) => {
    tableBody.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(hour => {
        const booking = data[hour];
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${hour}</td>
          <td>${booking.name}</td>
          <td>${booking.phone}</td>
          <td>${booking.code}</td>
          <td><button onclick="deleteBooking('${hour}', '${booking.code}')">حذف</button></td>
        `;
        tableBody.appendChild(tr);
      });
    }
  });
}

// Delete single booking
window.deleteBooking = function(hour, userCode) {
  const inputCode = prompt("ادخل رمزك لحذف الحجز:");
  if (inputCode === userCode) {
    remove(ref(db, "bookings/" + hour));
    alert("تم حذف الحجز");
  } else {
    alert("رمز خاطئ");
  }
}

// Delete all bookings
window.deleteAllBookings = function() {
  const masterCode = "Abduo123"; // رمز مسح جميع الحوجزات
  const input = document.getElementById("adminCodeInput").value.trim();
  if (input === masterCode) {
    remove(ref(db, "bookings")).then(() => {
      alert("تم مسح جميع الحجزات");
    });
  } else {
    alert("رمز خاطئ");
  }
}

displayBookings();
