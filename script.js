document.addEventListener("DOMContentLoaded", () => {
  const foodForm = document.getElementById("foodForm");
  const foodList = document.getElementById("foodList");
  const reminders = document.getElementById("reminders");

  // Load items from local storage
  let items = JSON.parse(localStorage.getItem("foodItems")) || [];

  displayItems();
  checkReminders();

  // Ask for notification permission
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  foodForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = document.getElementById("itemName").value;
    const expiryDate = document.getElementById("expiryDate").value;

    const item = { name: itemName, expiry: expiryDate };
    items.push(item);

    // Save to local storage
    localStorage.setItem("foodItems", JSON.stringify(items));

    displayItems();
    checkReminders();
    foodForm.reset();
  });

  function displayItems() {
    foodList.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires on ${new Date(item.expiry).toDateString()}`;

      // Add delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => {
        items.splice(index, 1);
        localStorage.setItem("foodItems", JSON.stringify(items));
        displayItems();
        checkReminders();
      };

      li.appendChild(delBtn);
      foodList.appendChild(li);
    });
  }

  function checkReminders() {
    reminders.innerHTML = "";
    const today = new Date();
    items.forEach(item => {
      const expiry = new Date(item.expiry);
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 0) {
        const reminder = document.createElement("p");
        reminder.textContent = `⚠️ ${item.name} expires in ${diffDays} day(s)!`;
        reminders.appendChild(reminder);

        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Food Expiry Reminder", {
            body: `${item.name} expires in ${diffDays} day(s)!`,
            icon: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" // optional icon
          });
        }
      }
    });
  }
});