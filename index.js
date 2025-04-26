// index.js

document.addEventListener('DOMContentLoaded', () => {
  const courseContainer = document.getElementById('courseContainer');
  const addCourseBtn = document.getElementById('addCourseBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultCard = document.getElementById('resultCard');
  const gpaResult = document.getElementById('gpaResult');
  const gpaProgress = document.getElementById('gpaProgress');
  const totalUnits = document.getElementById('totalUnits');
  const totalPoints = document.getElementById('totalPoints');
  const totalGrade = document.getElementById('totalGrade');
  const saveResultBtn = document.getElementById('saveResultBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  let courseCount = 0;

  // Initialize first row
  addCourseRow();

  // Event listeners
  addCourseBtn.addEventListener('click', addCourseRow);
  calculateBtn.addEventListener('click', calculateGPA);
  resetBtn.addEventListener('click', resetCalculator);
  saveResultBtn.addEventListener('click', saveResults);
  exportPdfBtn.addEventListener('click', generatePDF);

  // Add a new course input row
  function addCourseRow() {
    courseCount++;
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `
      <div class="form-group col-span-4">
        <label class="label">Course Title/Code</label>
        <input type="text" class="course-code" placeholder="e.g. CSC101">
      </div>
      <div class="form-group col-span-3">
        <label class="label">Course Unit/Load</label>
        <input type="number" min="1" max="6" class="course-unit" value="3">
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
            <option value="2.25">D (2.25)</option>
            <option value="2.00">E/P (2.00)</option>
            <option value="0.00">F (0.00)</option>
          </select>
          <div class="select-icon"><i class="ri-arrow-down-s-line"></i></div>
        </div>
      </div>
      <div class="form-group col-span-1 flex-end">
        <button class="remove-course-btn"><i class="ri-delete-bin-line"></i></button>
      </div>
      <hr>
    `;
    courseContainer.appendChild(row);
    row.querySelector('.remove-course-btn').addEventListener('click', () => {
      if (courseContainer.children.length > 1) row.remove();
      else showNotification('You need at least one course', 'error');
    });
  }

  // Calculate GPA and display
  function calculateGPA() {
    let totalQuality = 0;
    let totalUnit = 0;
    let valid = true;
    document.querySelectorAll('.course-row').forEach(r => {
      const code = r.querySelector('.course-code').value.trim();
      const unit = parseFloat(r.querySelector('.course-unit').value);
      const gradeVal = parseFloat(r.querySelector('.course-grade').value);
      if (!code || isNaN(unit) || isNaN(gradeVal)) valid = false;
      else {
        totalQuality += unit * gradeVal;
        totalUnit += unit;
      }
    });
    if (!valid || totalUnit === 0) return showNotification('Fill all fields correctly', 'error');

    const gpa = totalQuality / totalUnit;
    gpaResult.textContent = gpa.toFixed(2);
    totalUnits.textContent = totalUnit;
    totalPoints.textContent = totalQuality.toFixed(2);
    // Determine classification
    if (gpa >= 3.5) totalGrade.textContent = 'A Distinction';
    else if (gpa >= 3) totalGrade.textContent = 'Upper Credit';
    else if (gpa >= 2.5) totalGrade.textContent = 'Lower Credit';
    else if (gpa >= 2) totalGrade.textContent = 'Pass';
    else totalGrade.textContent = 'Fail';

    gpaProgress.style.width = `${(gpa / 4) * 100}%`;
    resultCard.classList.add('show');
    resultCard.scrollIntoView({ behavior: 'smooth' });
  }

  // Reset calculator
  function resetCalculator() {
    while (courseContainer.children.length > 1) courseContainer.lastChild.remove();
    const first = courseContainer.firstChild;
    first.querySelector('.course-code').value = '';
    first.querySelector('.course-unit').value = '3';
    first.querySelector('.course-grade').value = '';
    resultCard.classList.remove('show');
    showNotification('Calculator reset', 'info');
    addCourseRow();
  }

  // Save results locally
  function saveResults() {
    const courses = Array.from(document.querySelectorAll('.course-row')).map(r => ({
      code: r.querySelector('.course-code').value,
      unit: r.querySelector('.course-unit').value,
      grade: r.querySelector('.course-grade').value
    }));
    const data = {
      courses,
      gpa: gpaResult.textContent,
      totalUnits: totalUnits.textContent,
      totalPoints: totalPoints.textContent,
      grade: totalGrade.textContent,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedGPA', JSON.stringify(data));
    showNotification('Results saved', 'success');
  }

  // Generate PDF including user details in colored header, courses, and summary
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const marginLeft = 14;
    const headerHeight = 12;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Fetch user details
    const fullName = document.getElementById('fullName').value.trim() || 'N/A';
    const department = document.getElementById('department').value.trim() || 'N/A';
    const level = document.getElementById('level').value || 'N/A';
    const semester = document.getElementById('semester').value || 'N/A';
    const regNumber = document.getElementById("regnumber").value || "N/A";

    // Draw header background
    doc.setFillColor(112, 87, 255); // #7057FF
    doc.rect(marginLeft - 2, marginLeft - 2, pageWidth - (marginLeft * 2) + 4, headerHeight + 4, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    const detailsText = `Name: ${fullName}   Department: ${department}   Reg-No: ${regNumber}  
     Level: ${level}   Semester: ${semester}`;
    doc.text(detailsText, marginLeft, marginLeft + headerHeight / 1.5);

    // Reset text color for rest
    doc.setTextColor(0, 0, 0);

    // Prepare courses table data
    const rows = Array.from(document.querySelectorAll('.course-row')).map(r => [
      r.querySelector('.course-code').value.trim(),
      r.querySelector('.course-unit').value.trim(),
      r.querySelector('.course-grade').selectedOptions[0].text
    ]);

    // Insert table below header
    doc.autoTable({
      head: [['Course Code', 'Unit', 'Grade']],
      body: rows,
      startY: marginLeft + headerHeight + 6,
      margin: { left: marginLeft, right: 14 },
      theme: 'grid'
    });

    // Add GPA summary after table
    const finalY = doc.lastAutoTable.finalY + 10;
    // doc.text(`GPA: ${gpaResult.textContent}`, marginLeft, finalY);
    // doc.text(`Total Units: ${totalUnits.textContent}`, marginLeft + 50, finalY);
    // doc.text(`Total Points: ${totalPoints.textContent}`, marginLeft + 100, finalY);
    // doc.text(`Grade: ${totalGrade.textContent}`, marginLeft + 150, finalY);
    // doc.text('Created By JuTeLabs', marginLeft, finalY + 10);

    doc.text(`GPA: ${gpaResult.textContent}`, 12, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Units: ${totalUnits.textContent}`, 12, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Points: ${totalPoints.textContent}`, 12, doc.lastAutoTable.finalY + 30);
    doc.text(`Grade: ${totalGrade.textContent}`, 12, doc.lastAutoTable.finalY + 40);
    doc.text(`Created By JuTeLabs`, 12, doc.lastAutoTable.finalY + 50);

    doc.save('GPA_Result.pdf');
    showNotification('PDF export initiated')

  }

  // Notification helper
  function showNotification(msg, type) {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }
});
