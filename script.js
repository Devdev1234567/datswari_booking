import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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
const tableBody = document.querySelector("tbody");

function loadBookings() {
  onValue(ref(db, "bookings"), snapshot => {
    tableBody.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(time => {
        const booking = data[time];
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${time}</td>
          <td>${booking.name}</td>
          <td>${booking.phone}</td>
          <td>${booking.code}</td>
          <td><button onclick="deleteBooking('${time}', '${booking.code}')">🗑</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  });
}
loadBookings();

window.book = function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const code = document.getElementById("code").value;
  const time = document.getElementById("time").value;
  if (name && phone && code && time) {
    set(ref(db, `bookings/${time}`), {
      name,
      phone,
      code
    });
    alert("تم الحجز بنجاح");
  } else {
    alert("يرجى تعبئة جميع الحقول");
  }
};

window.deleteBooking = function (time, code) {
  const inputCode = prompt("أدخل رمزك لحذف الحجز:");
  if (inputCode === code) {
    remove(ref(db, `bookings/${time}`));
    alert("تم حذف الحجز");
  } else {
    alert("الرمز غير صحيح");
  }
};

window.deleteAllBookings = function () {
  const input = document.getElementById("deleteCodeInput").value;
  if (input === "Abduo123") {
    remove(ref(db, "bookings"));
    alert("تم مسح جميع الحوجزات");
  } else {
    alert("رمز المسح غير صحيح");
  }
};

// حذف تلقائي كل يوم عند منتصف الليل
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    remove(ref(db, "bookings"));
  }
}, 60000);
