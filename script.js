import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMPx38CeZAkHY7PGSM_E4GIsndaPNJ_wU",
  authDomain: "datswari-booring.firebaseapp.com",
  databaseURL: "https://datswari-booring-default-rtdb.firebaseio.com",
  projectId: "datswari-booring",
  storageBucket: "datswari-booring.appspot.com",
  messagingSenderId: "962253857620",
  appId: "1:962253857620:web:0d66148bac90cce8745ec1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const codeInput = document.getElementById("code");
const timeSelect = document.getElementById("time");
const bookingsTable = document.getElementById("bookingsTable");
const bookBtn = document.getElementById("bookBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const adminCode = document.getElementById("adminCode");

function renderTable() {
  const bookingsRef = ref(db);
  onValue(bookingsRef, (snapshot) => {
    bookingsTable.innerHTML = "";
    snapshot.forEach((child) => {
      const time = child.key;
      const data = child.val();

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${time}</td>
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td>${data.code}</td>
        <td><button class="delete-btn" data-time="${time}" data-code="${data.code}">🗑</button></td>
      `;

      bookingsTable.appendChild(row);
    });
  });
}

bookBtn.onclick = () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const code = codeInput.value.trim();
  const time = timeSelect.value;

  if (!name || !phone || !code || !time) {
    alert("يرجى ملء جميع الخانات");
    return;
  }

  const timeRef = ref(db, time);

  set(timeRef, {
    name,
    phone,
    code
  }).then(() => {
    nameInput.value = "";
    phoneInput.value = "";
    codeInput.value = "";
    timeSelect.value = "";
  });
};

bookingsTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const time = e.target.dataset.time;
    const trueCode = e.target.dataset.code;
    const userCode = prompt("أدخل رمز الحجز لإلغاء الحجز");

    if (userCode === trueCode) {
      remove(ref(db, time));
    } else {
      alert("رمز غير صحيح");
    }
  }
});

deleteAllBtn.onclick = () => {
  const masterCode = adminCode.value.trim();
  if (masterCode === "Abduo123") {
    remove(ref(db));
    adminCode.value = "";
  } else {
    alert("رمز خاطئ!");
  }
};

renderTable();
