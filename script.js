// قائمة الساعات المتاحة
const hours = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'];

// إضافة الساعات إلى select
const hourSelect = document.getElementById('hour');
hours.forEach(hour => {
  const option = document.createElement('option');
  option.value = hour;
  option.textContent = hour;
  hourSelect.appendChild(option);
});

// مصفوفة لحفظ الحجوزات
let bookings = [];

// إضافة حجز جديد
document.getElementById('bookingForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const hour = document.getElementById('hour').value;
  const code = 'janzor'; // رمز ثابت هنا يمكن تغييره لأي شيء آخر

  // إضافة الحجز إلى المصفوفة
  bookings.push({ name, phone, hour, code });
  updateBookingTable();
});

// تحديث جدول الحجوزات
function updateBookingTable() {
  const tableBody = document.getElementById('bookingTable');
  tableBody.innerHTML = ''; // تفريغ الجدول قبل التحديث

  bookings.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.hour}</td>
      <td>${booking.name}</td>
      <td>${booking.phone}</td>
      <td><button onclick="deleteBooking(${index})">حذف</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// حذف الحجز
function deleteBooking(index) {
  const code = prompt('أدخل كلمة السر لإلغاء الحجز:');
  if (code === 'janzor') {
    bookings.splice(index, 1); // حذف الحجز من المصفوفة
    updateBookingTable(); // تحديث الجدول
  } else {
    alert('كلمة السر غير صحيحة!');
  }
}
