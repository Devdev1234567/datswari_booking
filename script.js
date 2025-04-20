import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMPx38CeZAkHY7PGSM_E4GIsndaPNJ_wU",
  authDomain: "datswari-booring.firebaseapp.com",
  databaseURL: "https://datswari-booring-default-rtdb.firebaseio.com",
  projectId: "datswari-booring",
  storageBucket: "datswari-booring.firebasestorage.app",
  messagingSenderId: "962253857620",
  appId: "1:962253857620:web:0d66148bac90cce8745ec1",
  measurementId: "G-FGX0THTN8L"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// تعبئة قائمة الساعات تلقائياً
const hourSelect = document.getElementById("hour");
for (let i = 16; i <= 25; i++) {
  const option = document.createElement("option");
  const displayHour = i <= 24 ? `${i}:00` : `${i - 24}:00 صباحًا`;
  option.value = displayHour;
  option.textContent = displayHour;
  hourSelect.appendChild(option);
}

// عرض الحجوزات عند التحميل
const bookingTable = document.getElementById("bookingTable");
onValue(ref(db, "bookings"), (snapshot) => {
  bookingTable.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach((booking) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${booking.hour}</td>
        <td>${booking.name}</td>
        <td>${booking.phone}</td>
        <td>
          <button onclick="promptDelete('${booking.hour}', '${booking.code}')">🗑️</button>
        </td>
      `;
      bookingTable.appendChild(row);
    });
  }
});

// عند إرسال الفورم
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const hour = document.getElementById("hour").value;
  const code = document.getElementById("code").value.trim();

  if (!name || !phone || !code) return alert("يرجى تعبئة جميع الحقول");

  const bookingRef = ref(db, `bookings/${hour}`);
  set(bookingRef, { name, phone, code, hour })
    .then(() => {
      alert("تم الحجز بنجاح!");
      document.getElementById("bookingForm").reset();
    })
    .catch((err) => alert("حدث خطأ أثناء الحجز: " + err.message));
});

// إظهار خانة حذف الكل
window.showDeleteAllPrompt = function () {
  document.getElementById("deleteAllCode").style.display = "block";
  document.getElementById("deleteAllCode").focus();
};

// حذف كل الحجوزات
window.deleteAll = function () {
  const code = document.getElementById("deleteAllCode").value.trim();
  if (code === "Abduo123") {
    remove(ref(db, "bookings"))
      .then(() => alert("تم حذف جميع الحجوزات"))
      .catch((err) => alert("خطأ: " + err.message));
  } else {
    alert("رمز خاطئ");
  }
  document.getElementById("deleteAllCode").value = "";
  document.getElementById("deleteAllCode").style.display = "none";
};

// حذف حجز معين بالكود
window.promptDelete = function (hour, correctCode) {
  const inputCode = prompt("أدخل الرمز لإلغاء الحجز:");
  if (inputCode === correctCode) {
    remove(ref(db, `bookings/${hour}`))
      .then(() => alert("تم حذف الحجز"))
      .catch((err) => alert("خطأ: " + err.message));
  } else {
    alert("رمز خاطئ، لا يمكن حذف الحجز.");
  }
};
