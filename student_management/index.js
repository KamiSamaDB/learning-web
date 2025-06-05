let studentData = JSON.parse(localStorage.getItem('studentData')) || [];
const database = $('#database');
const thead = $('#thead');
var editIndex = -1;

function isAlpha(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

function isNumber(str) {
    return /^\d+$/.test(str);
}

function renderTable(data) {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable('#dataTable')) {
       $('#dataTable').DataTable().clear().destroy();
    }

    // Prepare data for DataTable, now with Edit/Delete buttons
    const tableData = data.map((student, idx) => [
        student.rollNo,
        student.name,
        student.class,
        student.englishMarks,
        student.mathsMarks,
        student.scienceMarks,
        student.historyMarks,
        student.percentage + "%",
        `<button class="btn btn-sm btn-primary edit-btn" data-index="${idx}">Edit</button>`,
        `<button class="btn btn-sm btn-danger delete-btn" data-index="${idx}">Delete</button>`
    ]);

    // Initialize DataTable with new columns
    $('#dataTable').DataTable({
        data: tableData,
        columns: [
            { title: "Roll No." },
            { title: "Name" },
            { title: "Class" },
            { title: "English Marks" },
            { title: "Maths Marks" },
            { title: "Science Marks" },
            { title: "History Marks" },
            { title: "Percentage" },
            { title: "Edit", orderable: false, searchable: false },
            { title: "Delete", orderable: false, searchable: false }
        ],
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        createdRow: function (row, data, dataIndex) {
            const percentage = parseFloat(data[7]);
            if (percentage < 40) {
                // Fail: make all cells red
                $(row).find('td').css('color', '#e24a4a');
            } else {
                // Pass: check each subject
                [3, 4, 5, 6].forEach(idx => {
                    if (parseFloat(data[idx]) < 40) {
                        $('td', row).eq(idx).css('color', '#ffe066'); // yellow
                    }
                });
            }
        }
    });

    $('#dataTable').off('click', '.edit-btn').on('click', '.edit-btn', function () {
        const idx = $(this).data('index');
        // Fill modal with student data for editing
        const student = studentData[idx];
        $('#name').val(student.name);
        $('#class').val(student.class);
        $('#englishMarks').val(student.englishMarks);
        $('#mathsMarks').val(student.mathsMarks);
        $('#scienceMarks').val(student.scienceMarks);
        $('#historyMarks').val(student.historyMarks);
        editIndex = idx;
        $('#dataSubmit').text('Update Student');
        $('#addStudentModal').modal('show');
    });

    $('#dataTable').off('click', '.delete-btn').on('click', '.delete-btn', function () {
        const idx = $(this).data('index');
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the student record.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                studentData.splice(idx, 1);
                localStorage.setItem('studentData', JSON.stringify(studentData));
                renderTable(studentData);
                Swal.fire('Deleted!', 'Student record has been deleted.', 'success');
            }
        });
    });
}

$(document).ready(function () {
    console.log('Document ready');
    renderTable(studentData);

    $('#addStudent').attr({
        'data-bs-toggle': 'tooltip',
        'data-bs-placement': 'top',
        'title': 'Add a new student'
    });

    $('#addStudentButton').attr({
        'data-bs-toggle': 'tooltip',
        'data-bs-placement': 'top',
        'title': 'Add a new student'
    });

    $('#dataSubmit').attr({
        'data-bs-toggle': 'tooltip',
        'data-bs-placement': 'top',
        'title': 'Submit student details'
    });

    $('#showAlert').attr({
        'data-bs-toggle': 'tooltip',
        'data-bs-placement': 'top',
        'title': 'Show a test alert'
    });

    $('[data-bs-toggle="tooltip"]').tooltip({trigger: 'hover'});

    $('#addStudent').click(function () {
        editIndex = -1; // Reset edit index
        console.log('Add Student button clicked');
        $('#addStudentModal').modal('show');
    });

    $('#addStudentButton').click(function () { 
        if(editIndex !== -1) {
            editIndex = -1;
            $('#name').val('');
            $('#class').val('');
            $('#englishMarks').val('');
            $('#mathsMarks').val('');
            $('#scienceMarks').val('');
            $('#historyMarks').val('');
            $('#errorText').text('');
            $('#name, #class, #englishMarks, #mathsMarks, #scienceMarks, #historyMarks').css('border-color', '');
            $('#dataSubmit').text('Add Student');
            console.log('Resetting form for new student');
        }
        console.log('Add Student button clicked');
        $('#addStudentModal').modal('show');
    });

    $('#addStudent, #addStudentButton').click(function () {
        editIndex = -1;
        console.log('Add Student button clicked');
        $('#addStudentModal').modal('show');
    });


    $('#filterBy').change(function () {
        const filterValue = $(this).val();
        console.log('Filter changed to:', filterValue);
        if (filterValue === '') {
            renderTable(studentData);
        } else if (filterValue === 'fail') {
            const filteredData = studentData.filter(student => parseFloat(student.percentage) < 40);
            renderTable(filteredData);
        } else if (filterValue === 'pass') {
            const filteredData = studentData.filter(student => parseFloat(student.percentage) >= 40);
            renderTable(filteredData);
        }
    });
    
    $('#dataSubmit').click(function (e) {
        e.preventDefault();

        console.log('Submit button clicked');
        const name = $('#name').val();
        const classID = $('#class').val();
        const englishMarks = parseInt($('#englishMarks').val());
        const mathsMarks = parseInt($('#mathsMarks').val());
        const scienceMarks = parseInt($('#scienceMarks').val());
        const historyMarks = parseInt($('#historyMarks').val());
        let flag = true;

        console.log('Form values:', { name, classID, englishMarks, mathsMarks, scienceMarks, historyMarks });

        if (!isAlpha(name)) {
            console.log('Name validation failed');
            $('#name').css('border-color', 'red');
            $('#nameError').text('Must contain only letters.');
            flag = false;
        }
        if (!isNumber(classID)) {
            console.log('Class validation failed');
            $('#class').css('border-color', 'red');
            $('#classError').text('Must be a number.');
            flag = false;
        }
        if (!isNumber(englishMarks) || englishMarks < 0 || englishMarks > 100) {
            console.log('English marks validation failed');
            $('#englishMarks').css('border-color', 'red');
            $('#englishError').text('Must be a number between 0 and 100.');
            flag = false;
        }
        if (!isNumber(mathsMarks) || mathsMarks < 0 || mathsMarks > 100) {
            console.log('Maths marks validation failed');
            $('#mathsMarks').css('border-color', 'red');
            $('#mathsError').text('Must be a number between 0 and 100.');
            flag = false;
        }
        if (!isNumber(scienceMarks) || scienceMarks < 0 || scienceMarks > 100) {
            console.log('Science marks validation failed');
            $('#scienceMarks').css('border-color', 'red');
            $('#scienceError').text('Must be a number between 0 and 100.');
            flag = false;
        }
        if (!isNumber(historyMarks) || historyMarks < 0 || historyMarks > 100) {
            console.log('History marks validation failed');
            $('#historyMarks').css('border-color', 'red');
            $('#historyError').text('Must be a number between 0 and 100.');
            flag = false;
        }
        $('#name, #class, #englishMarks, #mathsMarks, #scienceMarks, #historyMarks').on('input', function () {
            $(this).css('border-color', '');
        });
        $('#name').on('input', function () {
            $('#nameError').text('');
        });
        $('#class').on('input', function () {  
            $('#classError').text('');
        });
        $('#englishMarks').on('input', function () {
            $('#englishError').text('');
        });
        $('#mathsMarks').on('input', function () {
            $('#mathsError').text('');
        });
        $('#scienceMarks').on('input', function () {
            $('#scienceError').text('');
        });
        $('#historyMarks').on('input', function () {
            $('#historyError').text('');
        });
        if (flag) {
            let edited = false;
            if(editIndex !== -1){
                studentData.splice(editIndex, 1);
                editIndex = -1;
                edited = true;
                $('#dataSubmit').text('Add Student');
                console.log('Updating student data');
            }
            let rollRandom = Math.floor(Math.random() * 1000);
            let totalMarks = englishMarks + mathsMarks + scienceMarks + historyMarks;
            let percentage = (totalMarks / 400) * 100;
            let rollNo = 2025 + rollRandom.toString().padStart(3, '0');
            let student = {
                rollNo: rollNo,
                name: name,
                class: classID,
                englishMarks: englishMarks,
                mathsMarks: mathsMarks,
                scienceMarks: scienceMarks,
                historyMarks: historyMarks,
                totalMarks: totalMarks,
                percentage: percentage.toFixed(2)
            };
            $('#name').val('');
            $('#class').val('');
            $('#englishMarks').val('');
            $('#mathsMarks').val('');
            $('#scienceMarks').val('');
            $('#historyMarks').val('');
            $('#errorText').text('');
            $('#name, #class, #englishMarks, #mathsMarks, #scienceMarks, #historyMarks').css('border-color', '');
            console.log('Adding student:', student);
            studentData.push(student);
            renderTable(studentData);
            localStorage.setItem('studentData', JSON.stringify(studentData));
            $('#addStudentModal').modal('hide');
            $('#errorText').text('');
            if(edited){
                Swal.fire({
                    title: 'Success!',
                    text: 'Student updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'Confirm'
                });
            }else{
                Swal.fire({
                title: 'Success!',
                text: 'Student added successfully.',
                icon: 'success',
                confirmButtonText: 'Confirm'
            });
            }
        }
    });
});