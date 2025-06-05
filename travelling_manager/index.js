function isNum(str) {
            return /^\d+(\.\d+)?$/.test(str);
        }
        function isAlpha(str) {
            return /^[a-zA-Z\s]+$/.test(str);
        }

        let totalAmountCollected = parseInt(localStorage.getItem('totalAmountCollected')) || 0;
        let amountCollectedFromDeletedEntries = parseInt(localStorage.getItem('amountCollectedFromDeletedEntries')) || 0;

        function updateTotalsDisplay() {
            let sum = dataEntries.reduce((acc, entry) => acc + (parseInt(entry.amount) || 0), 0);
            totalAmountCollected = sum + amountCollectedFromDeletedEntries;
            $('#totalAmountCollected').text(`Total Amount Collected: Rs. ${totalAmountCollected}`);
            $('#amountCollectedFromDeletedEntries').text(`Total Amount Collected from Deleted Entries: Rs. ${amountCollectedFromDeletedEntries}`);
            saveTotals();
        }

        function saveTotals() {
            localStorage.setItem('totalAmountCollected', totalAmountCollected);
            localStorage.setItem('amountCollectedFromDeletedEntries', amountCollectedFromDeletedEntries);
        }

        function renderTable(array) {
            const tableBody = document.querySelector('#dataTable tbody');
            tableBody.innerHTML = '';
            if (array.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No entries found.</td></tr>';
                updateTotalsDisplay();
                return;
            }
            array.forEach((entry, index) => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = entry.name || '';
                row.insertCell(1).textContent = entry.phone || '';
                row.insertCell(2).textContent = entry.amount ? `Rs.${entry.amount}` : '';
                let dateStr = '', timeStr = '';
                if (entry.time) {
                    let dateObj = new Date(entry.time);
                    if (!isNaN(dateObj.getTime())) {
                        dateStr = dateObj.toLocaleDateString();
                        timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                }
                row.insertCell(3).innerHTML = `<span style="font-weight:600;color:#4a90e2;">${dateStr}</span><br><span style="font-size:0.95em;color:#a3b8d8;">${timeStr}</span>`;
                const editCell = row.insertCell(4);
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.classList.add('btn', 'edit-btn');
                editBtn.onclick = () => {
                    $('#dataAddModal').data('edit-index', index);
                    $('#nameInput').val(entry.name);
                    $('#phoneInput').val(entry.phone);
                    $('#genderSelect').val(entry.gender);
                    $('#amountInput').val(entry.amount);
                    $('input[name="discountRadio"][value="' + entry.extraLuggage + '"]').prop('checked', true);
                    $('#errorText').text('');
                    new bootstrap.Modal(document.getElementById('dataAddModal')).show();
                };
                editCell.appendChild(editBtn);
                const deleteCell = row.insertCell(5);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('btn', 'delete-btn');
                deleteBtn.onclick = () => {
                    deleteIndex = index;
                    new bootstrap.Modal(document.getElementById('deletionModal')).show();
                };
                deleteCell.appendChild(deleteBtn);
            });
            updateTotalsDisplay();
        }

        function showHomePage(budget) {
            $('#budgetSetDiv').hide();
            $('#homePage').show();
            $('#budgetText').text(`Budget: Rs. ${budget}`);
            renderTable(dataEntries);
        }

        function sortEntries(entries, sortBy) {
            let sorted = [...entries];
            if (sortBy === "name") {
                sorted.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === "amount") {
                sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
            } else if (sortBy === "lastUpdated") {
                sorted.sort((a, b) => new Date(b.time) - new Date(a.time));
            }
            return sorted;
        }

        $(document).ready(function () {
            const storedBudget = localStorage.getItem('budgetAmount');
            dataEntries = JSON.parse(localStorage.getItem('dataEntries')) || [];

            if (storedBudget) {
                showHomePage(storedBudget);
            } else {
                $('#homePage').hide();
                $('#budgetSetDiv').show();
            }

            $('#budgetSetDivButton').click(function () {
                const val = $('#budgetSetDivBodyInput').val().trim();
                if (!val || !isNum(val) || parseFloat(val) <= 1000) {
                    $('#budgetSetDivErrorText').text('Budget should be greater than Rs.1000.');
                    return;
                }
                $('#budgetSetDivErrorText').text('');
                budgetValStr = val;
                $('#modalBodyText').text(`Are you sure you want to set the budget to Rs. ${val}?`);
                new bootstrap.Modal(document.getElementById('budgetModal')).show();
            });

            $('#confirmBudgetBtn').click(function () {
                localStorage.setItem('budgetAmount', budgetValStr);
                showHomePage(budgetValStr);
                bootstrap.Modal.getInstance(document.getElementById('budgetModal')).hide();
            });

            $('#addEntryBtn').click(function () {
                $('#errorText').text('');
                $('#nameInput').val('');
                $('#phoneInput').val('');
                $('#genderSelect').val('');
                $('#amountInput').val('');
                $('input[name="discountRadio"][value="no"]').prop('checked', true);
                $('#dataAddModal').removeData('edit-index');
                new bootstrap.Modal(document.getElementById('dataAddModal')).show();
            });

            $('#submit-btn').click(function () {
                let name = $('#nameInput').val().trim();
                let phone = $('#phoneInput').val().trim();
                let gender = $('#genderSelect').val();
                let extraLuggage = $('input[name="discountRadio"]:checked').val();
                let amount = $('#amountInput').val().trim();

                if (!name || !phone || !gender || !amount || !extraLuggage) {
                    $('#errorText').text('Please fill all fields with valid values.');
                    return;
                }
                if (!isAlpha(name)) {
                    $('#errorText').text('Name should only contain letters and spaces.');
                    return;
                }
                if (!/^\d{10}$/.test(phone)) {
                    $('#errorText').text('Phone number should be exactly 10 digits.');
                    return;
                }
                if (parseInt(amount) <= 0) {
                    $('#errorText').text('Amount should be a positive number.');
                    return;
                }
                if (extraLuggage !== 'yes' && extraLuggage !== 'no') {
                    $('#errorText').text('Please select whether you have extra luggage.');
                    return;
                }

                const editIndex = $('#dataAddModal').data('edit-index');

                if (editIndex !== undefined) {
                    if (dataEntries.some((e, i) => i !== editIndex && e.phone === phone)) {
                        $('#errorText').text('An entry with this phone number already exists.');
                        return;
                    }
                    if (dataEntries.some((e, i) => i !== editIndex && e.name.toLowerCase() === name.toLowerCase())) {
                        $('#errorText').text('An entry with this name already exists.');
                        return;
                    }
                } else {
                    if (dataEntries.some(e => e.phone === phone)) {
                        $('#errorText').text('An entry with this phone number already exists.');
                        return;
                    }
                    if (dataEntries.some(e => e.name.toLowerCase() === name.toLowerCase())) {
                        $('#errorText').text('An entry with this name already exists.');
                        return;
                    }
                }

                $('#errorText').text('');

                const newEntry = {
                    name,
                    phone,
                    gender,
                    extraLuggage,
                    amount: parseInt(amount),
                    time: new Date().toISOString()
                };

                if (editIndex !== undefined) {
                    dataEntries[editIndex] = newEntry;
                } else {
                    dataEntries.push(newEntry);
                }
                localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
                saveTotals();
                renderTable(dataEntries);

                bootstrap.Modal.getInstance(document.getElementById('dataAddModal')).hide();
            });

            $('#confirmDeletionBtn').click(function () {
                bootstrap.Modal.getInstance(document.getElementById('deletionModal')).hide();
                if (deleteIndex !== null && deleteIndex >= 0 && deleteIndex < dataEntries.length) {
                    const refund = Math.round(0.7 * dataEntries[deleteIndex].amount);
                    $('#deletedText').html(`Entry deleted. 30% fee deducted, <span id="refundedText">Rs. ${refund}</span> will be refunded.`);
                } else {
                    $('#deletedText').text('Entry deleted. 30% fee deducted.');
                }
                new bootstrap.Modal(document.getElementById('deletedModal')).show();
            });

            $('#deletedBtn').click(function () {
                if (deleteIndex !== null && deleteIndex >= 0 && deleteIndex < dataEntries.length) {
                    const amount = dataEntries[deleteIndex].amount;
                    const fee = Math.round(0.3 * amount);
                    amountCollectedFromDeletedEntries += fee;
                    dataEntries.splice(deleteIndex, 1);
                    localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
                    saveTotals();
                    renderTable(dataEntries);
                }
                deleteIndex = null;
                bootstrap.Modal.getInstance(document.getElementById('deletedModal')).hide();
            });

            $('#searchInput').on('input', function () {
                const query = $(this).val().toLowerCase();
                const filtered = dataEntries.filter(e =>
                    e.name.toLowerCase().includes(query) || e.phone.includes(query)
                );
                renderTable(filtered);
            });

            $('#sortBtn').click(function () {
                const sortBy = $('#sortSelect').val();
                dataEntries = sortEntries(dataEntries, sortBy);
                renderTable(dataEntries);
            });

            updateTotalsDisplay();
        });