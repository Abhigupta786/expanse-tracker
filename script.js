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
// Dropdown toggle functionality using JavaScript
// document.getElementById('userDropdownBtn').addEventListener('click', function () {
//     const dropdownMenu = document.getElementById('userDropdownMenu');
//     const currentDisplay = dropdownMenu.style.display;

//     // Toggle the dropdown menu visibility
//     if (currentDisplay === 'none' || currentDisplay === '') {
//         dropdownMenu.style.display = 'block';
//     } else {
//         dropdownMenu.style.display = 'none';
//     }
// });

// Optional: Close dropdown when clicking outside
// document.addEventListener('click', function (event) {
//     const dropdownMenu = document.getElementById('userDropdownMenu');
//     const dropdownButton = document.getElementById('userDropdownBtn');
//     if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
//         dropdownMenu.style.display = 'none';
//     }
// });
document.addEventListener("DOMContentLoaded", function () {
    // Select the navbar-toggler (hamburger button) and navbar-collapse (menu)
    let navbarToggler = document.querySelector(".navbar-toggler");
    let navbarCollapse = document.querySelector("#navbarSupportedContent");

    // Toggle navbar visibility
    navbarToggler.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent immediate closing when toggler is clicked
        if (navbarCollapse.style.display === 'block') {
            navbarCollapse.style.display = 'none';
        } else {
            navbarCollapse.style.display = 'block';
        }
    });

    // // Hide navbar when clicking anywhere outside OR inside a nav link
    // document.addEventListener("click", function (event) {
    //     const isClickInsideNavbar = navbarCollapse.contains(event.target);
    //     const isClickOnToggler = navbarToggler.contains(event.target);

    //     // If click is outside navbar AND not on the toggler
    //     if (!isClickInsideNavbar && !isClickOnToggler) {
    //         navbarCollapse.style.display = 'none';
    //     }

    //     // Optional: close if any nav item is clicked (even inside navbar)
    //     if (event.target.tagName === 'A' || event.target.classList.contains('nav-link')) {
    //         navbarCollapse.style.display = 'none';
    //     }
    // });


});
$(document).ready(function () {
    let currentStartDate;
    let currentEndDate;
    const expenses = [
        { description: "Dinner", amount: 1200, payer: "Amit", share: 400, date: "2024-04-12", group: "Friends Gathering" },
        { description: "Movie Tickets", amount: 800, payer: "Akhil", share: 200, date: "2024-03-28", group: "Friends Gathering" },
        { description: "Groceries", amount: 1500, payer: "Rahul", share: 500, date: "2024-04-01", group: "Family Trip" },
        { description: "Cab Ride", amount: 600, payer: "Neha", share: 150, date: "2024-04-14", group: "Work Expenses" }
    ];
    


    const indianHolidays = new Set(['01/26/2024', '03/25/2024', '08/15/2024', '10/02/2024', '10/31/2024']);
    function getRandomColor() {
        // Card background colors (from your provided colors)

        return "#f9f9f9";
    }


    function loadExpenses() {
        let expenseHTML = expenses.map(({ description, amount, payer, share, date, group }) => `
            <div class="col-md-4 mb-4">
                <div class="rounded-4 recent-expense-card border-0 shadow-sm p-4 h-100" style="background: ${getRandomColor()}; transition: all 0.3s ease;">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-1">${description}</h5>
                        <small class="text-muted">${moment(date).format("DD MMM YYYY")}</small>
                    </div>
                    <p class="text-secondary mb-2">
                        <strong>Amount:</strong> ₹${amount}<br>
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
    


    function setGreeting() {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
        $("#greeting").text(`${greeting}, ${$("#userName").text()}!`);
    }
    function updateUserAvatar(fullName) {
        // Split the full name by space and take the first letter of each word
        const nameParts = fullName.split(" ");
        const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join(""); // Concatenate the first letter of each part

        // Update the initial in the circle and the username in the dropdown
        document.getElementById('user-initial').textContent = initials;
        //document.getElementById('user-name').textContent = fullName; // If you want to display full name in the dropdown
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
            currentStartDate=start;
            currentEndDate=end;
            $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
        });

        $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
    }
    const micon = "bi-cash-coin";
    const groups = [
        { name: 'Family Trip', people: ['Akhil', 'Priya', 'Rohit'], icon: micon, cardClass: 'card-family' },
        { name: 'Friends Gathering', people: ['Akhil', 'Aman', 'Neha'], icon: micon, cardClass: 'card-friends' },
        { name: 'Work Expenses', people: ['Akhil', 'Sarah', 'John'], icon: micon, cardClass: 'card-work' },
        { name: 'Gym Group', people: ['Akhil', 'Raj', 'Mike'], icon: micon, cardClass: 'card-gym' },
        { name: 'Travel Expenses', people: ['Akhil', 'Sita', 'Ram'], icon: micon, cardClass: 'card-travel' },
        { name: 'Project Team', people: ['Akhil', 'Jasmine', 'Sam'], icon: micon, cardClass: 'card-project' }
    ];

    function loadVerticalExpenses(startDate = null, endDate = null) {
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
                        <h5 class="mb-0 text-primary">${description}</h5>
                        <div class="text-muted small fw-medium">${moment(date).format("DD MMM YYYY")}</div>
                    </div>
    
                    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
                        <div class="d-flex flex-column small fw-medium text-dark" style="min-width: 120px;">
                            <div><strong>Amount:</strong> ₹${amount}</div>
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
            currentStartDate=start;
            currentEndDate=end;
            $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
            loadVerticalExpenses(start, end); // Re-load expenses with filtered dates
        });

        $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
        loadVerticalExpenses(start, end); // Initial load
    }



    // Function to generate the group cards
    // 
    let currentGroup = null;

    function createGroupCards() {
        const container = document.getElementById('group-cards-container');
        container.innerHTML = ''; // Clear existing cards
        groups.forEach(group => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4', 'col-sm-6');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('group-card');

            const iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');

            const icon = document.createElement('i');
            icon.className = group.icon;
            iconContainer.appendChild(icon);

            const groupName = document.createElement('h5');
            groupName.textContent = group.name;

            const groupPeople = document.createElement('p');
            groupPeople.textContent = 'Involved: ' + group.people.join(', ');

            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary');
            button.textContent = 'View Details';

            // View Details Modal Trigger
            button.addEventListener('click', function () {
                currentGroup = group;
                document.getElementById('groupDetailsName').textContent = group.name;

                const memberPills = document.getElementById('memberPills');
                memberPills.innerHTML = '';
                group.people.forEach(person => {
                    const pill = createMemberPill(person);
                    memberPills.appendChild(pill);
                });

                const modal = new bootstrap.Modal(document.getElementById('groupDetailsModal'));
                modal.show();
            });

            cardDiv.appendChild(iconContainer);
            cardDiv.appendChild(groupName);
            cardDiv.appendChild(groupPeople);
            cardDiv.appendChild(button);

            colDiv.appendChild(cardDiv);
            container.appendChild(colDiv);
        });
    }

    function createMemberPill(email) {
        const pill = document.createElement('div');
        pill.className = 'badge bg-primary d-flex align-items-center gap-2 p-2';
        pill.innerHTML = `
    <span>${email}</span>
    <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Remove" title="Remove"></button>
  `;

        pill.querySelector('button').addEventListener('click', () => {
            Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: `Remove ${email} from the group?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, remove',
                cancelButtonText: 'Cancel'
            }).then(result => {
                if (result.isConfirmed) {
                    pill.remove();
                    currentGroup.people = currentGroup.people.filter(p => p !== email);
                }
            });
        });

        return pill;
    }

    // Add member logic
    document.getElementById('addMemberBtn').addEventListener('click', () => {
        const emailInput = document.getElementById('newMemberEmail');
        const email = emailInput.value.trim();

        if (email && !currentGroup.people.includes(email)) {
            const pill = createMemberPill(email);
            document.getElementById('memberPills').appendChild(pill);
            currentGroup.people.push(email);
            emailInput.value = '';
        }
    });

    // Save group details
    document.getElementById('groupDetailsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        modal.hide();

        Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Group details have been updated.',
            showConfirmButton: false,
            timer: 2000
        });
    });


    // Call the function to generate the group cards
    createGroupCards();

    // Navigation functionality
    const homeLink = document.getElementById('homeLink');
    const groupsLink = document.getElementById('groupsLink');
    const homeSection = document.getElementById('home');
    const groupSection = document.getElementById('group');
    const expensesLink = document.getElementById('expensesLink');
    const expenseSection = document.getElementById('expense-section');
    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        homeSection.style.display = 'block';
        groupSection.style.display = 'none';
        expenseSection.style.display = 'none';
        homeLink.classList.add('active');
        groupsLink.classList.remove('active');
        expensesLink.classList.remove('active');
    });

    groupsLink.addEventListener('click', function (e) {
        e.preventDefault();
        homeSection.style.display = 'none';
        groupSection.style.display = 'block';
        expenseSection.style.display = 'none';
        groupsLink.classList.add('active');
        homeLink.classList.remove('active');
        expensesLink.classList.remove('active');
    });

    // Default to the Home section on page load
    homeSection.style.display = 'block';
    groupSection.style.display = 'none';
    expenseSection.style.display = 'none';
    // Reference to the new section


    expensesLink.addEventListener('click', function (e) {
        e.preventDefault();
        homeSection.style.display = 'none';
        groupSection.style.display = 'none';
        expenseSection.style.display = 'block';

        homeLink.classList.remove('active');
        groupsLink.classList.remove('active');
        expensesLink.classList.add('active');

        setupExpenseDateRangePicker(); // 🆕 Date filter setup on open
    });
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            debugger;
            localStorage.removeItem('token');
            location.reload();
        });
    });



    // Initialize functions
    loadExpenses();
    setGreeting();
    setupDateRangePicker();
    updateUserAvatar("Akhil Sharma");


});

