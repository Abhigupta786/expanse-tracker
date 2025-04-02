// document.addEventListener("DOMContentLoaded", function () {
//     const userName = "Abhishek"; // Change this to dynamically fetch user name
//     const hour = new Date().getHours();
//     let greetingText = "Good Evening";

//     if (hour < 12) {
//         greetingText = "Good Morning";
//     } else if (hour < 18) {
//         greetingText = "Good Afternoon";
//     }

//     document.getElementById("greeting").textContent = `${greetingText}, ${userName}!`;
// });
document.getElementById("daterange").onfocus = function () {
    this.blur();
};
document.addEventListener("DOMContentLoaded", function () {
    let navbarToggler = document.querySelector(".navbar-toggler");
    let navbarCollapse = document.querySelector("#navbarNav");

    navbarToggler.addEventListener("click", function () {
        navbarCollapse.classList.toggle("show");
    });
});
$(document).ready(function () {
    const expenses = [
        { description: "Dinner", amount: 1200, payer: "Amit", share: 400 },
        { description: "Movie Tickets", amount: 800, payer: "Akhil", share: 200 },
        { description: "Groceries", amount: 1500, payer: "Rahul", share: 500 },
        { description: "Cab Ride", amount: 600, payer: "Neha", share: 150 }
    ];

    const indianHolidays = new Set(['01/26/2024', '03/25/2024', '08/15/2024', '10/02/2024', '10/31/2024']);

    function loadExpenses() {
        let expenseHTML = expenses.map(({ description, amount, payer, share }) => `
            <div class="expense-card">
                <div class="expense-description">${description}</div>
                <div class="expense-amount">₹${amount}</div>
                <div class="expense-payer">Paid by: ${payer}</div>
                <div class="expense-share">Your Share: ₹${share}</div>
            </div>
        `).join('');
        $("#expenses-container").html(expenseHTML);
    }

    function setGreeting() {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
        $("#greeting").text(`${greeting}, ${$("#userName").text()}!`);
    }

    function setupDateRangePicker() {
        const start = moment(), end = moment();
        const ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Lifetime': [moment('2024-01-01'), moment()]
        };

        $('#daterange').daterangepicker({
            startDate: start,
            endDate: end,
            alwaysShowCalendars: true,
            ranges,
            showCustomRangeLabel: true,
            linkedCalendars: true,
            autoApply: true,
            isInvalidDate: date => date.day() === 0 || indianHolidays.has(date.format('DD/MM/YYYY'))
        }, (start, end) => {
            $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
        });

        $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
    }

    // Initialize functions
    loadExpenses();
    setGreeting();
    setupDateRangePicker();
});

