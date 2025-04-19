// نماذج الحجز
const bookingTable = document.getElementById("bookingTable");
const bookingForm = document.getElementById("bookingForm");
const hourSelect = document.getElementById("hour");

// إعداد ساعات الحجز
const hours = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM"];

hours.forEach(hour => {
  const option = document.createElement("option");
  option.value = hour;
  option.textContent = hour;
  hourSelect.appendChild(option);
});

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// إضافة الحجز
bookingForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const hour = document.getElementById("hour").value;
  const uniqueCode = document.getElementById("uniqueCode").value;

  const newBooking = { name, phone, hour, uniqueCode };
  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderBookings();
  bookingForm.reset();
});

// عرض الحجزات
function renderBookings() {
  bookingTable.innerHTML = "";
  bookings.forEach((booking, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.hour}</td>
      <td>${booking.name}</td>
      <td>${booking.phone}</td>
      <td>${booking.uniqueCode}</td>
      <td><button class="remove-btn" onclick="removeBooking(${index})">إزالة</button></td>
    `;
    bookingTable.appendChild(row);
  });
}

// إزالة الحجز
function removeBooking(index) {
  if (confirm("هل أنت متأكد أنك تريد إزالة هذا الحجز؟")) {
    bookings.splice(index, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
  }
}

// إزالة جميع الحجوزات
document.getElementById("removeAllBookings").addEventListener("click", function() {
  if (confirm("هل أنت متأكد أنك تريد إزالة جميع الحجوزات؟")) {
    bookings = [];
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
  }
});

renderBookings();
