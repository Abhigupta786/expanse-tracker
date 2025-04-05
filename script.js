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
    function getRandomColor() {
        // Card background colors (from your provided colors)
        const colorPairs = [
            ['#fce4ec', '#e3f2fd'],  // Light Pink and Light Blue (family and friends)
            ['#e8f5e9', '#fff3e0'],  // Light Green and Light Peach (work and gym)
            ['#ffebee', '#e1f5fe'],  // Light Red and Light Sky Blue (travel and project)
        ];
    
        // Randomly select a pair of complementary colors
        const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    
        // Return a random color from the pair (just one color at a time)
        return pair[Math.floor(Math.random() * pair.length)];
    }
        
        
    function loadExpenses() {
        let expenseHTML = expenses.map(({ description, amount, payer, share }) => `
            <div class="col-md-4 mb-4">
                <div class="expense-card shadow-lg border-0" style="background: ${getRandomColor()};">
                    <div class="card-body">
                        <h5 class="card-title">${description}</h5>
                        <p class="card-text" style="color:#666;">
                            <strong>Amount:</strong> ₹${amount} <br>
                            <strong>Paid by:</strong> ${payer} <br>
                            <strong>Your Share:</strong> ₹${share}
                        </p>
                        <div class="d-flex justify-content-center" style="color:#666;">
                            <div class="btn btn-primary">Details</div>
                            
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    
        // Update the expenses container with the generated expense HTML
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
    const groups = [
        { name: 'Family Trip', people: ['Akhil', 'Priya', 'Rohit'], icon: 'bi bi-house-door', cardClass: 'card-family' },
        { name: 'Friends Gathering', people: ['Akhil', 'Aman', 'Neha'], icon: 'bi bi-person-heart', cardClass: 'card-friends' },
        { name: 'Work Expenses', people: ['Akhil', 'Sarah', 'John'], icon: 'bi bi-briefcase', cardClass: 'card-work' },
        { name: 'Gym Group', people: ['Akhil', 'Raj', 'Mike'], icon: 'bi bi-person-dash', cardClass: 'card-gym' },
        { name: 'Travel Expenses', people: ['Akhil', 'Sita', 'Ram'], icon: 'bi bi-person-check', cardClass: 'card-travel' },
        { name: 'Project Team', people: ['Akhil', 'Jasmine', 'Sam'], icon: 'bi bi-person-check', cardClass: 'card-project' }
    ];

    // Function to generate the group cards
    function createGroupCards() {
        const container = document.getElementById('group-cards-container');
        groups.forEach(group => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4', 'col-sm-6');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('group-card', group.cardClass);

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
            button.classList.add('btn', 'btn-primary');
            button.textContent = 'View Details';

            cardDiv.appendChild(iconContainer);
            cardDiv.appendChild(groupName);
            cardDiv.appendChild(groupPeople);
            cardDiv.appendChild(button);

            colDiv.appendChild(cardDiv);
            container.appendChild(colDiv);
        });
    }

    // Call the function to generate the group cards
    createGroupCards();

    // Navigation functionality
    const homeLink = document.getElementById('homeLink');
    const groupsLink = document.getElementById('groupsLink');
    const homeSection = document.getElementById('home');
    const groupSection = document.getElementById('group');

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.style.display = 'block';
        groupSection.style.display = 'none';
        homeLink.classList.add('active');
        groupsLink.classList.remove('active');
    });

    groupsLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.style.display = 'none';
        groupSection.style.display = 'block';
        groupsLink.classList.add('active');
        homeLink.classList.remove('active');
    });

    // Default to the Home section on page load
    homeSection.style.display = 'block';
    groupSection.style.display = 'none';

    // Initialize functions
    loadExpenses();
    setGreeting();
    setupDateRangePicker();
    
     
});

