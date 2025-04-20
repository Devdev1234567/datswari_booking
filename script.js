// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, push, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// إعدادات Firebase الجديدة
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
const analytics = getAnalytics(app);
const db = getDatabase(app);

// دالة لإضافة حجز جديد
function addBooking(hour, name, phone, code) {
  const bookingRef = ref(db, `bookings/${hour}`);
  set(bookingRef, {
    name: name,
    phone: phone,
    code: code,
    hour: hour
  });
}

// دالة لحذف جميع الحجوزات
function deleteAllBookings(masterCode) {
  if (masterCode === "Abduo123") {
    const allBookingsRef = ref(db, 'bookings');
    remove(allBookingsRef)
      .then(() => alert("تم حذف جميع الحجوزات"))
      .catch((error) => alert("حدث خطأ: " + error.message));
  } else {
    alert("رمز خاطئ!");
  }
}

// تحميل جميع الحجوزات وعرضها في الجدول
function loadBookings() {
  const bookingsRef = ref(db, 'bookings');
  bookingsRef.on('value', (snapshot) => {
    const bookings = snapshot.val();
    const bookingTable = document.getElementById("bookingTable").getElementsByTagName('tbody')[0];
    bookingTable.innerHTML = ""; // مسح الجدول الحالي

    // عرض جميع الحجوزات
    for (let hour in bookings) {
      const data = bookings[hour];
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.hour}</td>
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td><button onclick="deleteBookingPrompt('${hour}')">🗑️</button></td>
      `;
      bookingTable.appendChild(tr);
    }
  });
}

// دالة لحذف حجز محدد
function deleteBookingPrompt(hour) {
  const userCode = prompt("اكتب الرمز الخاص بك لإلغاء الحجز:");
  const bookingRef = ref(db, `bookings/${hour}`);
  bookingRef.once('value', snapshot => {
    if (snapshot.exists() && snapshot.val().code === userCode) {
      remove(bookingRef);
      alert("تم الحذف!");
    } else {
      alert("رمز خاطئ");
    }
  });
}

loadBookings(); // تحميل البيانات عند تحميل الصفحة
