const firebaseConfig = {
  apiKey: "AIzaSyBlDLrvDNumFk9NA4ldTfr2vEBlMrxPzgg",
  authDomain: "datswari-boorking.firebaseapp.com",
  databaseURL: "https://datswari-boorking-default-rtdb.firebaseio.com",
  projectId: "datswari-boorking",
  storageBucket: "datswari-boorking.appspot.com",
  messagingSenderId: "994128829706",
  appId: "1:994128829706:web:5da06448e62c095c75eef3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const bookingForm = document.getElementById("bookingForm");
const bookingTable = document.getElementById("bookingTable");
const hourSelect = document.getElementById("hour");

const hours = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM"];
hours.forEach(hour => {
  const option = document.createElement("option");
  option.value = hour;
  option.textContent = hour;
  hourSelect.appendChild(option);
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const hour = document.getElementById("hour").value;
  const code = document.getElementById("code").value;

  if (!name || !phone || !code) return;

  db.ref("bookings/" + hour).set({ name, phone, code });
  bookingForm.reset();
});

function loadBookings() {
  db.ref("bookings").on("value", (snapshot) => {
    bookingTable.innerHTML = "";
    snapshot.forEach(child => {
      const hour = child.key;
      const data = child.val();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${hour}</td>
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td><button onclick="deleteBookingPrompt('${hour}')">🗑️</button></td>
      `;
      bookingTable.appendChild(tr);
    });
  });
}

function deleteBookingPrompt(hour) {
  const userCode = prompt("اكتب الرمز الخاص بك لإلغاء الحجز:");
  db.ref("bookings/" + hour).once("value", snapshot => {
    if (snapshot.exists() && snapshot.val().code === userCode) {
      db.ref("bookings/" + hour).remove();
    } else {
      alert("رمز خاطئ");
    }
  });
}

function showDeleteAllPrompt() {
  document.getElementById("deleteAllCode").style.display = "inline-block";
}

function deleteAll() {
  const input = document.getElementById("deleteAllCode");
  if (input.value === "Abduo123") {
    db.ref("bookings").remove();
    input.value = "";
    input.style.display = "none";
  } else {
    alert("رمز خاطئ");
  }
}

loadBookings();

// Reset bookings every 24h
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 3 && now.getMinutes() === 0) {
    db.ref("bookings").remove();
  }
}, 60000);
