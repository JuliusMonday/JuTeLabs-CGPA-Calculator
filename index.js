document.addEventListener("DOMContentLoaded", function () {
const courseContainer = document.getElementById("courseContainer");
const addCourseBtn = document.getElementById("addCourseBtn");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const resultCard = document.getElementById("resultCard");
const gpaResult = document.getElementById("gpaResult");
const gpaProgress = document.getElementById("gpaProgress");
const totalUnits = document.getElementById("totalUnits");
const totalPoints = document.getElementById("totalPoints");
const totalGrade = document.getElementById("totalGrade");
const saveResultBtn = document.getElementById("saveResultBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
let courseCount = 0;
// Add initial course rows
addCourseRow();

// Add course row function
function addCourseRow() {
    courseCount++;
    const courseRow = document.createElement("div");
    courseRow.className =
    "course-row";
    courseRow.dataset.id = courseCount;
    courseRow.innerHTML = `
<div class="form-group col-span-4">
  <label class="label">Course Code</label>
  <input type="text" class="course-code" placeholder="e.g. CSC101">
</div>

<div class="form-group col-span-3">
  <label class="label">Course Unit</label>
  <input type="number" min="1" max="6" class="course-unit" placeholder="1-6" value="3">
</div>
<div class="form-group col-span-4">
  <label class="label">Grade</label>
  <div class="select-wrapper">
    <select class="course-grade">
      <option value="">Select Grade</option>
      <option value="4.00">A (4.00)</option>
      <option value="3.50">AB (3.50)</option>
      <option value="3.25">B (3.25)</option>
      <option value="3.00">BC (3.00)</option>
      <option value="2.75">C (2.75)</option>
      <option value="2.50">CD (2.50)</option>
      <option value="2.25">D (2.50)</option>
      <option value="2.O0">E/P (2.O0)</option>
      <option value="0.00">F (0.0)</option>
    </select>
    <div class="select-icon">
      <i class="ri-arrow-down-s-line"></i>
    </div>
  </div>
</div>
<div class="form-group col-span-1 flex-end">
  <button class="remove-course-btn">
    <i class="ri-delete-bin-line"></i>
  </button>
</div>
<hr>

`;
    courseContainer.appendChild(courseRow);
    // Add event listener to remove button
    const removeBtn = courseRow.querySelector(".remove-course-btn");
    removeBtn.addEventListener("click", function () {
    if (document.querySelectorAll(".course-row").length > 1) {
        courseRow.classList.add("removing");
        setTimeout(() => {
        courseContainer.removeChild(courseRow);
        }, 300);
    } else {
        showNotification("You need at least one course", "error");
    }
    });
}
// Add course button event listener
addCourseBtn.addEventListener("click", addCourseRow);
// Calculate GPA button event listener
calculateBtn.addEventListener("click", calculateGPA);
// Reset button event listener
resetBtn.addEventListener("click", resetCalculator);
// Save results button event listener
saveResultBtn.addEventListener("click", function () {
    showNotification("Results saved successfully!", "success");
});
// Export PDF button event listener
exportPdfBtn.addEventListener("click", function () {
    showNotification("PDF export initiated", "info");
});
// Calculate GPA function
function calculateGPA() {
    const courseRows = document.querySelectorAll(".course-row");
    let totalQualityPoints = 0;
    let totalCourseUnits = 0;
    let isValid = true;
    courseRows.forEach((row) => {
    const courseCode = row.querySelector(".course-code").value.trim();
    const courseUnit = parseFloat(row.querySelector(".course-unit").value);
    const courseGrade = row.querySelector(".course-grade").value;
    
        // Validate inputs
    if (!courseCode) {
        row
        .querySelector(".course-code")
        .classList.add("ring-2", "ring-red-500");
        isValid = false;
    } else {
        row
        .querySelector(".course-code")
        .classList.remove("ring-2", "ring-red-500");
    }
    if (isNaN(courseUnit) || courseUnit < 1 || courseUnit > 6) {
        row
        .querySelector(".course-unit")
        .classList.add("ring-2", "ring-red-500");
        isValid = false;
    } else {
        row
        .querySelector(".course-unit")
        .classList.remove("ring-2", "ring-red-500");
    }
    if (!courseGrade) {
        row
        .querySelector(".course-grade")
        .classList.add("ring-2", "ring-red-500");
        isValid = false;
    } else {
        row
        .querySelector(".course-grade")
        .classList.remove("ring-2", "ring-red-500");
    }
        
    if (
        courseCode &&
        !isNaN(courseUnit) &&
        courseUnit >= 1 &&
        courseUnit <= 6 &&
        courseGrade
    ) {
        const gradeValue = parseFloat(courseGrade);
        totalQualityPoints += courseUnit * gradeValue;
        totalCourseUnits += courseUnit;
    }
    });
    if (!isValid) {
    showNotification("Please fill in all required fields correctly", "error");
    return;
    }
    if (totalCourseUnits === 0) {
    showNotification("Please add at least one valid course", "error");
    return;
    }

    // Calculate GPA
    const gpa = totalQualityPoints / totalCourseUnits;
    if (gpa >= 3.50) {
    totalGrade.textContent = "A Distinction";
    } else if (gpa >= 3.00 && gpa < 3.50) {
    totalGrade.textContent = "Upper Credit";
    } else if (gpa >= 2.50 && gpa < 3.00) {
    totalGrade.textContent = "Lower Credit";
    } else if (gpa >= 2.00 && gpa < 2.50) {
    totalGrade.textContent = "Pass";
    } else {
    totalGrade.textContent = "Fail";
    }

    // Update result card
    gpaResult.textContent = gpa.toFixed(2);
    totalUnits.textContent = totalCourseUnits;
    totalPoints.textContent = totalQualityPoints.toFixed(2);
    // Update progress bar
    const progressPercentage = (gpa / 4) * 100;
    gpaProgress.style.width = `${progressPercentage}%`;
    // Show result card with animation
    resultCard.classList.remove("hidden");
    setTimeout(() => {
    resultCard.classList.add("show");
    }, 100);
    // Scroll to result card
    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
// Reset calculator function
function resetCalculator() {
    // Remove all course rows except the first one
    const courseRows = document.querySelectorAll(".course-row");
    if (courseRows.length > 0) {
    for (let i = courseRows.length - 1; i > 0; i--) {
        courseContainer.removeChild(courseRows[i]);
    }
    // Reset the first row
    const firstRow = courseRows[0];
    firstRow.querySelector(".course-code").value = "";
    firstRow.querySelector(".course-unit").value = "3";
    firstRow.querySelector(".course-grade").value = "";
    // Reset validation styling
    firstRow
        .querySelector(".course-code")
        .classList.remove("ring-2", "ring-red-500");
    firstRow
        .querySelector(".course-unit")
        .classList.remove("ring-2", "ring-red-500");
    firstRow
        .querySelector(".course-grade")
        .classList.remove("ring-2", "ring-red-500");
    }
    // Add a second row
    addCourseRow();
    // Hide result card
    resultCard.classList.remove("show");
    setTimeout(() => {
    resultCard.classList.add("hidden");
    }, 500);
    showNotification("Calculator has been reset", "info");
}
// Notification function
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
    document.body.removeChild(existingNotification);
    }
    // Create notification element
    const notification = document.createElement("div");
    notification.className =
    "notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full";
    // Set notification style based on type
    if (type === "success") {
    notification.classList.add("bg-green-500", "text-white");
    notification.innerHTML = `
<div class="flex items-center">
<span class="w-5 h-5 flex items-center justify-center mr-2">
<i class="ri-check-line"></i>
</span>
<span>${message}</span>
</div>
`;
    } else if (type === "error") {
    notification.classList.add("bg-red-500", "text-white");
    notification.innerHTML = `
<div class="flex items-center">
<span class="w-5 h-5 flex items-center justify-center mr-2">
<i class="ri-error-warning-line"></i>
</span>
<span>${message}</span>
</div>
`;
    } else {
    notification.classList.add("bg-blue-500", "text-white");
    notification.innerHTML = `
<div class="flex items-center">
<span class="w-5 h-5 flex items-center justify-center mr-2">
<i class="ri-information-line"></i>
</span>
<span>${message}</span>
</div>
`;
    }
    // Add notification to the DOM
    document.body.appendChild(notification);
    // Animate notification
    setTimeout(() => {
    notification.classList.remove("translate-x-full");
    notification.classList.add("translate-x-0");
    }, 10);
    // Remove notification after 3 seconds
    setTimeout(() => {
    notification.classList.remove("translate-x-0");
    notification.classList.add("translate-x-full");
    setTimeout(() => {
        if (notification.parentNode) {
        document.body.removeChild(notification);
        }
    }, 300);
    }, 3000);
}
});