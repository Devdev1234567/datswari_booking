const hours = [
  "04:00 مساءً", "05:00 مساءً", "06:00 مساءً", "07:00 مساءً", "08:00 مساءً", "09:00 مساءً",
  "10:00 مساءً", "11:00 مساءً", "12:00 صباحاً", "01:00 صباحاً"
];

const hourSelect = document.getElementById("hour");
const bookingTable = document.getElementById("bookingTable");
const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
const password = "janzor"; // كلمة السر الثابتة

// إضافة الخيارات للـ select
hours.forEach(hour => {
  const option = document.createElement("option");
  option.value = hour;
  option.textContent = hour;
  hourSelect.appendChild(option);
});

// عرض الحجوزات في الجدول
function renderBookings() {
  bookingTable.innerHTML = "";
  hours.forEach(hour => {
    const booking = bookings[hour];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${hour}</td>
      <td>${booking ? booking.name : '<span class="empty">غير محجوز</span>'}</td>
      <td>${booking ? booking.phone : '<span class="empty">---</span>'}</td>
      <td>${booking ? `<button class="cancelBtn" data-hour="${hour}">إلغاء</button>` : ''}</td>
    `;
    bookingTable.appendChild(tr);
  });

  // إضافة وظيفة لأزرار الإلغاء
  document.querySelectorAll(".cancelBtn").forEach(button => {
    button.addEventListener("click", (e) => {
      const hour = e.target.dataset.hour;
      const enteredPassword = prompt("أدخل كلمة السر لإلغاء الحجز:");
      if (enteredPassword === password) {
        delete bookings[hour];
        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderBookings();
      } else {
        alert("كلمة السر غير صحيحة!");
      }
    });
  });
}

// حجز الملعب
document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const hour = document.getElementById("hour").value;
  const enteredPassword = document.getElementById("password").value;

  // التحقق من كلمة السر
  if (enteredPassword !== password) {
    alert("كلمة السر غير صحيحة!");
    return;
  }

  if (bookings[hour]) {
    alert("هذه الساعة محجوزة بالفعل!");
    return;
  }

  bookings[hour] = { name, phone };
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderBookings();
  this.reset();
});

// مسح جميع السجلات
document.getElementById("clearAllBtn").addEventListener("click", function() {
  const enteredPassword = prompt("أدخل كلمة السر لإلغاء جميع الحجوزات:");
  if (enteredPassword === password) {
    localStorage.removeItem("bookings");
    renderBookings();
  } else {
    alert("كلمة السر غير صحيحة!");
  }
});

renderBookings();
