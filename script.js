const dbUrl = "https://datswari-booring-default-rtdb.firebaseio.com/bookings.json";
const masterCode = "Abduo123";

function fetchBookings() {
  fetch(dbUrl)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#bookingTable tbody");
      tbody.innerHTML = "";
      for (const key in data) {
        const row = data[key];
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.time}</td>
          <td>${row.name}</td>
          <td>${row.phone}</td>
          <td>${row.code}</td>
          <td><button class="delete-btn" onclick="deleteBooking('${key}', '${row.code}')">حذف</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
}

function bookSlot() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const code = document.getElementById("code").value;
  const time = document.getElementById("time").value;

  if (!name || !phone || !code || !time) return alert("يرجى تعبئة جميع البيانات");

  fetch(dbUrl)
    .then(res => res.json())
    .then(data => {
      for (const key in data) {
        if (data[key].time === time) return alert("هذه الساعة محجوزة بالفعل");
      }

      fetch(dbUrl.replace(".json", ""), {
        method: "POST",
        body: JSON.stringify({ name, phone, code, time })
      }).then(() => {
        fetchBookings();
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("code").value = "";
        document.getElementById("time").selectedIndex = 0;
      });
    });
}

function deleteBooking(id, userCode) {
  const inputCode = prompt("أدخل رمز الإلغاء:");
  if (inputCode !== userCode) return alert("رمز الإلغاء غير صحيح");
  fetch(`https://datswari-booring-default-rtdb.firebaseio.com/bookings/${id}.json`, { method: "DELETE" })
    .then(() => fetchBookings());
}

function clearAll() {
  const input = document.getElementById("adminCode").value;
  if (input !== masterCode) return alert("رمز غير صحيح");
  fetch(dbUrl)
    .then(res => res.json())
    .then(data => {
      for (const key in data) {
        fetch(`https://datswari-booring-default-rtdb.firebaseio.com/bookings/${key}.json`, { method: "DELETE" });
      }
      fetchBookings();
    });
}

fetchBookings();
