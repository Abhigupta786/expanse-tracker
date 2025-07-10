let expenses = [];

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
if (token) {


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

    function isTokenExpired(token) {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;

            const now = Math.floor(Date.now() / 1000); // Current time in seconds
            return exp < now;
        } catch (e) {
            return true;
        }
    }
    function validateTokenOrRedirect() {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Please log in again.',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('token');
                window.location.href = '/login'; // or your login route
            });
        }
    }

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




        const indianHolidays = new Set(['01/26/2024', '03/25/2024', '08/15/2024', '10/02/2024', '10/31/2024']);
        function getRandomColor() {
            // Card background colors (from your provided colors)

            return "#f9f9f9";
        }






        function setGreeting(fullName) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

            document.getElementById("greeting").textContent = `${greeting}, ${fullName}!`;
        }

        function updateUserAvatar(fullName) {

            const nameParts = fullName.split(" ");
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join("");

            const userInitialEl = document.getElementById('user-initial');
            userInitialEl.textContent = initials;
            userInitialEl.setAttribute('title', fullName);

            // Reinitialize Bootstrap tooltip
            const tooltip = bootstrap.Tooltip.getInstance(userInitialEl);
            if (tooltip) {
                tooltip.setContent({ '.tooltip-inner': fullName });
            } else {
                new bootstrap.Tooltip(userInitialEl);
            }
        }


        async function setupDateRangePicker() {
            let expense1 = await fetchMyExpenses();

            const start = moment().subtract(29, 'days'), end = moment();
            currentStartDate = start;
            currentEndDate = end;
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
                debugger;
                currentStartDate = start;
                currentEndDate = end;
                $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);

                loadExpenses(expense1, currentStartDate, currentEndDate);
                //updateTotalExpenseBox(expenses1, currentStartDate, currentEndDate)

            });

            $('#daterange').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);

            loadExpenses(expense1, start, end);
            // updateTotalExpenseBox(expenses1, start, end);
        }
        // const micon = "bi-cash-coin";
        // const groups = [
        //     { name: 'Family Trip', people: ['Akhil', 'Priya', 'Rohit'], icon: micon, cardClass: 'card-family' },
        //     { name: 'Friends Gathering', people: ['Akhil', 'Aman', 'Neha'], icon: micon, cardClass: 'card-friends' },
        //     { name: 'Work Expenses', people: ['Akhil', 'Sarah', 'John'], icon: micon, cardClass: 'card-work' },
        //     { name: 'Gym Group', people: ['Akhil', 'Raj', 'Mike'], icon: micon, cardClass: 'card-gym' },
        //     { name: 'Travel Expenses', people: ['Akhil', 'Sita', 'Ram'], icon: micon, cardClass: 'card-travel' },
        //     { name: 'Project Team', people: ['Akhil', 'Jasmine', 'Sam'], icon: micon, cardClass: 'card-project' }
        // ];
        function mapExpensesToFormat(apiExpenses, currentUser) {
            return apiExpenses.map(exp => {
                const userShareObj = exp.share?.find(s => s.member === currentUser);
                return {
                    description: exp.title || "Untitled",
                    amount: Number(exp.amount),
                    payer: exp.paidBy,
                    share: userShareObj ? Number(userShareObj.amount) : 0, // current user's share
                    allShares: exp.share || [], // include the full share array
                    date: new Date(exp.date).toISOString().split('T')[0], // formatted to "YYYY-MM-DD"
                    group: exp.groupName
                };
            });
        }

        /* ========= CONFIG (tweak freely) ========= */
        const EXPENSES_PER_PAGE = 9;  // 3×3 card grid
        /* ========================================= */

        /** Renders one page of expenses plus pager */
        function loadExpenses(expensesData, start, end, page = 1) {

            /* ----- FILTER THE FULL LIST ----- */
            const filtered = expensesData.filter(e => {
                const d = moment(e.date);
                return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
            });

            /* ----- TOTALS (whole filtered list) ----- */
            const totals = calcTotals(filtered);
            updateTotalBoxes(totals);

            /* ----- SLICE FOR THE REQUESTED PAGE ----- */
            const totalPages = Math.max(1, Math.ceil(filtered.length / EXPENSES_PER_PAGE));
            page = Math.min(page, totalPages);                     // keep in range
            const startIdx = (page - 1) * EXPENSES_PER_PAGE;
            const slice = filtered.slice(startIdx, startIdx + EXPENSES_PER_PAGE);

            /* ----- DRAW CARDS FOR THAT PAGE ----- */
            $("#expenses-container").html(slice.map((exp, i) => cardHTML(exp, startIdx + i)).join(""));

            /* ----- (RE)WIRE DETAILS BUTTONS ----- */
            $(".view-details-btn").off("click").on("click", function () {
                showExpenseDetails(expensesData[this.dataset.index]);  // still points to source array
            });

            /* ----- BUILD & WIRE PAGER ----- */
            renderPager(totalPages, page, (targetPage) =>
                loadExpenses(expensesData, start, end, targetPage));
        }

        /* ---------- helpers (all local to this feature) ---------- */

        function calcTotals(list) {
            let totalPaid = 0, totalShare = 0, totalReceive = 0;
            debugger;
            list.forEach(e => {
                if (e.paidBy === currentUser) {
                    totalPaid += e.amount;
                    e.share.forEach(s => { if (s.member !== currentUser) totalReceive += +s.amount; });
                } else {
                    e.share.forEach(s => { if (s.member === currentUser) totalShare += +s.amount; });
                }
            });
            return { totalPaid, totalShare, totalReceive };
        }

        function updateTotalBoxes({ totalPaid, totalShare, totalReceive }) {
            $("#totalExpenseBox").text(`💸 Total Expense:  ₹${totalPaid}`);
            $("#totalshareBox").text(`💸 Total Payables:  ₹${totalShare}`);
            $("#totalreceiveBox").text(`💰 You Receive: ₹${totalReceive}`);
        }

        function cardHTML(e, globalIndex) {
            const { title, description, amount, paidBy, payer, date, groupName, group } = e;
            return `
            <div class="col-md-4 mb-4">
            <div class="rounded-4 recent-expense-card border-0 shadow-sm p-4 h-100"
                style="background:#f9f9f9;transition:all .3s;">
                <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold mb-1">₹${amount}</h5>
                <small class="text-muted">${moment(date).format("DD MMM YYYY")}</small>
                </div>
                <div>${title || description}</div>
                <p class="text-secondary mb-2">
                <strong>Amount:</strong><br>
                <strong>Paid by:</strong> ${paidBy || payer}<br>
                <strong>Group:</strong> ${groupName || group}
                </p>
                <div class="text-center mt-3">
                <button class="btn btn-outline-dark btn-sm view-details-btn"
                        data-index="${globalIndex}">View Details</button>
                </div>
            </div>
            </div>`;
        }

        function renderPager(totalPages, activePage, onJump) {
            const $wrap = $("#expensesPager").empty();
            if (totalPages <= 1) return;

            const pageBtn = (pg, lbl = pg, disabled = false) =>
                `<li class="page-item ${disabled ? "disabled" : ""} ${pg === activePage ? "active" : ""}">
       <button class="page-link" data-jump="${pg}">${lbl}</button>
     </li>`;

            const prevDis = activePage === 1;
            const nextDis = activePage === totalPages;
            let html = `<ul class="pagination justify-content-center mb-0">`;
            html += pageBtn(activePage - 1, "&laquo;", prevDis);

            let first = Math.max(1, activePage - 2);
            let last = Math.min(totalPages, first + 4);
            if (last - first < 4) first = Math.max(1, last - 4);

            for (let p = first; p <= last; p++) html += pageBtn(p);
            html += pageBtn(activePage + 1, "&raquo;", nextDis);
            html += `</ul>`;

            $wrap.html(html)
                .off("click", "button.page-link")
                .on("click", "button.page-link", function () {
                    const jump = +$(this).data("jump");
                    if (!isNaN(jump)) onJump(jump);
                });
        }

        /* === call the loader wherever appropriate === */
        // loadExpenses(allExpenses, startDate, endDate);   // page defaults to 1



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

                expenses1 = await res.json();
                expenses = mapExpensesToFormat(expenses1, currentUser);  // Optional: format or enrich data

                //loadExpenses(expenses1);
                return expenses1;
            } catch (err) {
                console.error('Network or server error:', err);
                Swal.fire('Error', 'Failed to fetch expenses.', 'error');
            }
        }

        function showExpenseDetails(expense) {
            const {
                title,
                description,
                amount,
                date,
                paidBy,
                payer,
                groupName,
                group,
                share
            } = expense;

            const groupLabel = group || groupName || 'N/A';
            const paidLabel = paidBy || payer || 'N/A';
            const titleLabel = title || description;

            const shareList = Array.isArray(share)
                ? share.map(s => `<li>${s.member} owes ₹${s.amount}</li>`).join('')
                : `<li>Your share: ₹${share}</li>`;

            Swal.fire({
                title: `<p><strong>Amount:</strong> ₹${amount}</p>`,
                html: `
            <div class="text-start">
                <p>${titleLabel}</p>
                <p><strong>Paid By:</strong> ${paidLabel}</p>
                <p><strong>Group:</strong> ${groupLabel}</p>
                <p><strong>Date:</strong> ${moment(date).format("DD MMM YYYY")}</p>
                <p><strong>Shares:</strong></p>
                <ul>${shareList}</ul>
            </div>
        `,
                confirmButtonText: 'Close',
                width: 500,
                showCloseButton: true
            });
        }



        /* ---------- CONFIG ---------- */
        const ITEMS_PER_PAGE = 10;       // tweak this to show more/less cards
        let currentPage = 1;        // tracks the page we’re on
        /* ---------------------------- */

        async function loadVerticalExpenses(startDate = null, endDate = null, page = 1) {
            currentPage = page;               // record the requested page
            const expenses = await fetchMyExpenses();   // ① fetch all

            /* ---------- FILTER ---------- */
            const selectedGroup = $("#groupFilterInput").val();          // single group name
            const filtered = expenses.filter(exp => {
                const raw = new Date(exp.date).toISOString().split('T')[0];
                const expDate = moment(raw, "YYYY-MM-DD");

                const matchesDate = (!startDate || !endDate) ||
                    (expDate.isSameOrAfter(startDate) && expDate.isSameOrBefore(endDate));
                const matchesGroup = !selectedGroup || selectedGroup === exp.groupName;
                return matchesDate && matchesGroup;
            });

            /* ---------- PAGINATE ---------- */
            const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
            const sliceStart = (page - 1) * ITEMS_PER_PAGE;
            const pageData = filtered.slice(sliceStart, sliceStart + ITEMS_PER_PAGE);

            /* ---------- RENDER CARDS ---------- */
            const $grid = $("#vertical-expenses").empty();
            if (pageData.length === 0) {
                $grid.html(`<div class="col-12 text-center text-muted">
                      No expenses found for selected filters.
                    </div>`);
            } else {
                const cards = pageData.map(exp => `
            <div class="col-12">
              <div class="expense-list-card p-4 mb-4 shadow-sm border rounded bg-light"
                   ondblclick='showExpenseDetails(${JSON.stringify(exp)})'
                   style="cursor:pointer;">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="mb-0 text-primary">₹${exp.amount}</h5>
                  <div class="text-muted small fw-medium">
                    ${moment(exp.date).format("DD MMM YYYY")}
                  </div>
                </div>
                <div class="flex-grow-1 text-muted" style="font-size:.95rem;">
                  ${exp.description || exp.title}
                </div>
                <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
                  <div class="d-flex flex-column small fw-medium text-dark" style="min-width:120px;">
                    <div><strong>Paid by:</strong> ${exp.payer || exp.paidBy}</div>
                    <div><strong>Your Share:</strong>
                      ₹${exp.share?.find?.(s => s.member === currentUser)?.amount || exp.share || 'N/A'}
                    </div>
                    <div><strong>Group:</strong> ${exp.group || exp.groupName}</div>
                  </div>
                </div>
              </div>
            </div>`).join('');

                $grid.html(cards);
            }

            /* ---------- RENDER PAGER ---------- */
            buildExpensePager(totalPages, page);
        }

        /* helper to build Bootstrap pager */
        function buildExpensePager(totalPages, activePage) {
            const $nav = $("#expensePagination").empty();
            if (totalPages <= 1) return;      // nothing to paginate

            // utility to emit one page button
            const pageBtn = (page, label = page, disabled = false, extra = '') => `
        <li class="page-item ${disabled ? 'disabled' : ''} ${page === activePage ? 'active' : ''}">
          <button class="page-link" ${extra} data-go="${page}">${label}</button>
        </li>`;

            const prevDisabled = activePage === 1;
            const nextDisabled = activePage === totalPages;

            let html = `<ul class="pagination justify-content-center mb-0">`;
            html += pageBtn(activePage - 1, "&laquo;", prevDisabled, 'aria-label="Previous"');

            // show up to 5 numbered buttons centred around the active page
            let start = Math.max(1, activePage - 2);
            let end = Math.min(totalPages, start + 4);
            if (end - start < 4) start = Math.max(1, end - 4);

            for (let p = start; p <= end; p++) html += pageBtn(p);

            html += pageBtn(activePage + 1, "&raquo;", nextDisabled, 'aria-label="Next"');
            html += `</ul>`;

            $nav.html(html);

            /* click handler (delegated) */
            $nav.off("click", "button.page-link")           // clear previous
                .on("click", "button.page-link", function () {
                    const go = Number($(this).data("go"));
                    if (!isNaN(go) && go >= 1 && go <= totalPages) {
                        loadVerticalExpenses(
                            $("#startDate").val() || null,   // adapt if you keep these IDs
                            $("#endDate").val() || null,
                            go
                        );
                    }
                });
        }

        // /* ---------- FIRST LOAD ---------- */
        // $(document).ready(() => loadVerticalExpenses());

        // Group filter change
        $('#groupFilter').on('change', function () {
            loadVerticalExpenses(currentStartDate, currentEndDate); // update with your date range vars
        });

        let debounceTimer;
        function debounce(fn, delay = 300) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(fn, delay);
        }
        function showLoading(message = "Loading...") {
            const loadingModalEl = document.getElementById('loadingModal');
            loadingModalEl.querySelector('p').textContent = message;

            const loadingModal = new bootstrap.Modal(loadingModalEl, {
                backdrop: 'static',
                keyboard: false
            });
            loadingModal.show();
            return loadingModal;
        }

        async function setupExpenseDateRangePicker() {

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
            }, async function (start, end) {
                currentStartDate = start;
                currentEndDate = end;
                $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
                await loadVerticalExpenses(start, end);
            });

            $('#expenseDateFilter').val(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
            await loadVerticalExpenses(start, end);
            const res = await fetch(baseurl + '/group-names', {
                headers: { 'Authorization': token }
            });

            allGroups = await res.json();
            groupDatawithID = allGroups.map(g => ({
                id: g.groupId,
                name: g.groupName
            }));
            console.table(groupDatawithID);
            setupSuggestionInput({
                inputId: 'groupFilterInput',
                boxId: 'groupSuggestionBoxfilter',
                dataList: groupDatawithID,
                onSelect: (group) => {
                    selectedGroup = group;
                    debounce(async () => {
                        const loader = showLoading("Loading expenses...");
                        try {
                            await loadVerticalExpenses(start, end);
                        } finally {
                            bootstrap.Modal.getInstance(document.getElementById('loadingModal'))?.hide();
                        }
                    }, 100);
                }

            });

        }

        document.getElementById("totalshareBox").addEventListener("click", async () => {
            // Show loading popup
            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(baseurl + `/my-payables?startDate=${currentStartDate.format('DD/MM/YYYY')}&endDate=${currentEndDate.format('DD/MM/YYYY')}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch payables");

                const data = await response.json();

                const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
                const details = data.map(item => `₹${item.amount.toLocaleString()} → ${item.paidTo}`).join('<br>');

                Swal.fire({
                    title: `Total Payables: ₹${total.toLocaleString()}`,
                    html: `<strong>Breakdown:</strong><br>${details}`,
                    icon: 'info'
                });
            } catch (err) {
                Swal.fire({
                    title: 'Error!',
                    text: err.message || 'Failed to load data',
                    icon: 'error'
                });
            }
        });
        document.getElementById("totalreceiveBox").addEventListener("click", async () => {
            // Show loading popup
            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(baseurl + `/my-receivings?startDate=${currentStartDate.format('DD/MM/YYYY')}&endDate=${currentEndDate.format('DD/MM/YYYY')}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch payables");

                const data = await response.json();

                const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
                const details = data.map(item => `₹${item.amount.toLocaleString()} → ${item.from}`).join('<br>');

                Swal.fire({
                    title: `Total Payables: ₹${total.toLocaleString()}`,
                    html: `<strong>Breakdown:</strong><br>${details}`,
                    icon: 'info'
                });
            } catch (err) {
                Swal.fire({
                    title: 'Error!',
                    text: err.message || 'Failed to load data',
                    icon: 'error'
                });
            }
        });


        // Function to generate the group cards
        // 
        //     let currentGroup = null;

        //     function createGroupCards() {
        //         const container = document.getElementById('group-cards-container');
        //         container.innerHTML = ''; // Clear existing cards
        //         groups.forEach(group => {
        //             const colDiv = document.createElement('div');
        //             colDiv.classList.add('col-md-4', 'col-sm-6');

        //             const cardDiv = document.createElement('div');
        //             cardDiv.classList.add('group-card');

        //             const iconContainer = document.createElement('div');
        //             iconContainer.classList.add('icon-container');

        //             const icon = document.createElement('i');
        //             icon.className = group.icon;
        //             iconContainer.appendChild(icon);

        //             const groupName = document.createElement('h5');
        //             groupName.textContent = group.name;

        //             const groupPeople = document.createElement('p');
        //             groupPeople.textContent = 'Involved: ' + group.people.join(', ');

        //             const button = document.createElement('button');
        //             button.classList.add('btn', 'btn-outline-primary');
        //             button.textContent = 'View Details';

        //             // View Details Modal Trigger
        //             button.addEventListener('click', function () {
        //                 currentGroup = group;
        //                 document.getElementById('groupDetailsName').textContent = group.name;

        //                 const memberPills = document.getElementById('memberPills');
        //                 memberPills.innerHTML = '';
        //                 group.people.forEach(person => {
        //                     const pill = createMemberPill(person);
        //                     memberPills.appendChild(pill);
        //                 });

        //                 const modal = new bootstrap.Modal(document.getElementById('groupDetailsModal'));
        //                 modal.show();
        //             });

        //             cardDiv.appendChild(iconContainer);
        //             cardDiv.appendChild(groupName);
        //             cardDiv.appendChild(groupPeople);
        //             cardDiv.appendChild(button);

        //             colDiv.appendChild(cardDiv);
        //             container.appendChild(colDiv);
        //         });
        //     }

        //     function createMemberPill(email) {
        //         const pill = document.createElement('div');
        //         pill.className = 'badge bg-primary d-flex align-items-center gap-2 p-2';
        //         pill.innerHTML = `
        //     <span>${email}</span>
        //     <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Remove" title="Remove"></button>
        //   `;

        //         pill.querySelector('button').addEventListener('click', () => {
        //             Swal.fire({
        //                 icon: 'warning',
        //                 title: 'Are you sure?',
        //                 text: `Remove ${email} from the group?`,
        //                 showCancelButton: true,
        //                 confirmButtonText: 'Yes, remove',
        //                 cancelButtonText: 'Cancel'
        //             }).then(result => {
        //                 if (result.isConfirmed) {
        //                     pill.remove();
        //                     currentGroup.people = currentGroup.people.filter(p => p !== email);
        //                 }
        //             });
        //         });

        //         return pill;
        //     }

        //     // Add member logic
        //     document.getElementById('addMemberBtn').addEventListener('click', () => {
        //         const emailInput = document.getElementById('newMemberEmail');
        //         const email = emailInput.value.trim();

        //         if (email && !currentGroup.people.includes(email)) {memberIcons
        //             const pill = createMemberPill(email);
        //             document.getElementById('memberPills').appendChild(pill);
        //             currentGroup.people.push(email);
        //             emailInput.value = '';
        //         }
        //     });

        //     // Save group details
        //     document.getElementById('groupDetailsForm').addEventListener('submit', function (e) {
        //         e.preventDefault();
        //         const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        //         modal.hide();

        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Saved!',
        //             text: 'Group details have been updated.',
        //             showConfirmButton: false,
        //             timer: 2000
        //         });
        //     });


        //     // Call the function to generate the group cards
        //     createGroupCards();

        // Navigation functionality
        const homeLink = document.getElementById('homeLink');
        const groupsLink = document.getElementById('groupsLink');
        const expensesLink = document.getElementById('expensesLink');

        const homeSection = document.getElementById('home');
        const groupSection = document.getElementById('group');
        const expenseSection = document.getElementById('expense-section');

        // Function to show a section and store the preference
        function showSection(sectionName) {

            // Hide all sections
            homeSection.style.display = 'none';
            groupSection.style.display = 'none';
            expenseSection.style.display = 'none';

            // Remove all active classes
            homeLink.classList.remove('active');
            groupsLink.classList.remove('active');
            expensesLink.classList.remove('active');

            // Show selected section and mark active
            if (sectionName === 'home') {
                homeSection.style.display = 'block';
                homeLink.classList.add('active');
                debounce(async () => {
                    const loader = showLoading("Loading expenses...");
                    try {
                        await setupDateRangePicker();
                    } finally {
                        bootstrap.Modal.getInstance(document.getElementById('loadingModal'))?.hide();
                    }
                }, 100);
            } else if (sectionName === 'groups') {
                groupSection.style.display = 'block';
                groupsLink.classList.add('active');
            } else if (sectionName === 'expenses') {

                expenseSection.style.display = 'block';
                expensesLink.classList.add('active');
                debounce(async () => {
                    const loader = showLoading("Loading expenses...");
                    try {
                        await setupExpenseDateRangePicker();
                    } finally {
                        bootstrap.Modal.getInstance(document.getElementById('loadingModal'))?.hide();
                    }
                }, 100);
                // only when expenses opened
            }

            // Store preference
            localStorage.setItem('activeSection', sectionName);
        }

        // Link click handlers
        homeLink.addEventListener('click', function (e) {
            e.preventDefault();
            showSection('home');
        });

        groupsLink.addEventListener('click', function (e) {
            e.preventDefault();
            showSection('groups');
        });

        expensesLink.addEventListener('click', function (e) {
            e.preventDefault();
            showSection('expenses');
        });

        // Load preferred section or default to home
        const preferredSection = localStorage.getItem('activeSection') || 'home';
        showSection(preferredSection);

        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', function () {

                localStorage.removeItem('token');
                location.reload();
            });
        });
        updateUserAvatar(currentUser);
        setGreeting(currentUser);

        // function getTotalSpent(expenses, startDate, endDate) {
        //     
        //     const start = moment(startDate);
        //     const end = moment(endDate);

        //     const total = expenses.reduce((sum, expense) => {
        //         const expenseDate = moment(expense.date);
        //         if (expenseDate.isSameOrAfter(start, 'day') && expenseDate.isSameOrBefore(end, 'day')) {
        //             return sum + expense.amount;
        //         }
        //         return sum;
        //     }, 0);

        //     return total;
        // }
        // function updateTotalExpenseBox(expenses, startDate, endDate) {
        //     
        //     const total = getTotalSpent(expenses, startDate, endDate);
        //     document.getElementById("totalExpenseBox").textContent = `Total Expense: ₹${total}`;
        // }



    });

}