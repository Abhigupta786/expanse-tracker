


function mapExpensesToFormat(apiExpenses, currentUser) {
    return apiExpenses.map(exp => {
        const userShareObj = exp.share?.find(s => s.member === currentUser);
        return {
            description: exp.title || "Untitled",
            amount: Number(exp.amount),
            payer: exp.paidBy,
            share: userShareObj ? Number(userShareObj.amount) : 0,
            date: new Date(exp.date).toISOString().split('T')[0], // formatted to "YYYY-MM-DD"
            group: exp.groupName
        };
    });
}


async function fetchMyExpenses() {

    try {
        const res = await fetch(`${baseurl}/my-expenses`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        
        if (!res.ok) {

            const error = await res.json();
            console.error('Error fetching expenses:', error.message || error.error);
            Swal.fire('Error', error.message || error.error, 'error');
            return;
        }

        expenses = await res.json();
        expenses = mapExpensesToFormat(expenses, currentUser);  // Optional: format or enrich data
        loadExpenses();
        return expenses;
    } catch (err) {
        console.error('Network or server error:', err);
        Swal.fire('Error', 'Failed to fetch expenses.', 'error');
    }
}

function loadExpenses() {
    debugger;
    let expenseHTML = expenses.map(({ description, amount, payer, share, date, group }) => `
            <div class="col-md-4 mb-4">
                <div class="rounded-4 recent-expense-card border-0 shadow-sm p-4 h-100" style="background: #f9f9f9; transition: all 0.3s ease;">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-1">₹${amount}</h5>
                        <small class="text-muted">${moment(date).format("DD MMM YYYY")}</small>
                    </div>
                    <div>${description}</div>
                    <p class="text-secondary mb-2">
                        <strong>Paid by:</strong> ${payer}<br>
                        <strong>Your Share:</strong> ₹${share}<br>
                        <strong>Group:</strong> ${group}
                    </p>
                    <div class="text-center mt-3">
                        <button class="btn btn-outline-dark btn-sm">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');

    $("#expenses-container").html(expenseHTML);
}
function loadVerticalExpenses(startDate = null, endDate = null, expenses) {
        const container = $("#vertical-expenses");
        container.empty();

        const selectedGroup = $("#groupFilter").val(); // single group

        const filteredExpenses = expenses.filter(({ date, group }) => {
            const expenseDate = moment(date, "YYYY-MM-DD");

            const matchesDate = (!startDate || !endDate) ||
                (expenseDate.isSameOrAfter(startDate) && expenseDate.isSameOrBefore(endDate));

            const matchesGroup = !selectedGroup || selectedGroup === group;

            return matchesDate && matchesGroup;
        });

        if (filteredExpenses.length === 0) {
            container.html(`<div class="col-12 text-center text-muted">No expenses found for selected filters.</div>`);
            return;
        }

        const expenseHTML = filteredExpenses.map(({ description, amount, payer, share, date, group }) => `
            <div class="col-12">
                <div class="expense-list-card p-4 mb-4 shadow-sm border rounded bg-light">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="mb-0 text-primary">₹${amount}</h5>
                        <div class="text-muted small fw-medium">${moment(date).format("DD MMM YYYY")}</div>
                    </div>
    
                    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
                        <div class="d-flex flex-column small fw-medium text-dark" style="min-width: 120px;">
                            <div><strong>Paid by:</strong> ${payer}</div>
                            <div><strong>Your Share:</strong> ₹${share}</div>
                            <div><strong>Group:</strong> ${group}</div>
                        </div>
                        <div class="flex-grow-1 text-muted" style="font-size: 0.95rem;">
                            ${description}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.html(expenseHTML);
    }
    // Group filter change
    $('#groupFilter').on('change', function () {
        loadVerticalExpenses(currentStartDate, currentEndDate); // update with your date range vars
    });

    function setupExpenseDateRangePicker() {
        const start = moment().subtract(29, 'days');
        const end = moment();

        const ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Lifetime': [moment('2024-01-01'), moment()]
        };

        $('#expenseDateFilter').daterangepicker({
            startDate: start,
            endDate: end,
            alwaysShowCalendars: true,
            ranges,
            showCustomRangeLabel: true,
            linkedCalendars: true,
            autoApply: true,
            isInvalidDate: date => date.day() === 0 || indianHolidays.has(date.format('DD/MM/YYYY')),
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end) {
            currentStartDate = start;
            currentEndDate = end;
            $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
            loadVerticalExpenses(start, end, expenses); // Re-load expenses with filtered dates
        });

        $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
        loadVerticalExpenses(start, end, expenses); // Initial load
    }
