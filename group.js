let selectedGroup = null; // store the selected group globally
let allNames = [];
let selectedNames = [];
let allGroups = [];
let groupDatawithID = [];
const token = localStorage.getItem('token');
const baseurl = "https://expanse-tracker-api-a7b4.onrender.com"
const currentUser = getUsernameFromToken(token);

function getUsernameFromToken(token) {
    try {
        const payloadBase64 = token.split('.')[1]; // Get the payload part
        const decodedPayload = atob(payloadBase64); // Decode from base64
        const payload = JSON.parse(decodedPayload); // Parse JSON

        return payload.username || payload.name || payload.email; // Adjust based on your payload structure
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}

async function fetchAllNames(token) {
    try {
        const res = await fetch(baseurl+'/names', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const names = await res.json();
        return names;
    } catch (err) {
        console.error('Failed to fetch names:', err);
        return []; // Return empty array on failure
    }
}


function setupSuggestionInput({ inputId, boxId, dataList, onSelect }) {

    const input = document.getElementById(inputId);
    const suggestionBox = document.getElementById(boxId);

    input.addEventListener('input', () => {

        const query = input.value.trim().toLowerCase();
        const filtered = dataList.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            suggestionBox.innerHTML = `<div class="text-danger p-2">No matches found</div>`;
            suggestionBox.style.display = 'block';
            return;
        }

        suggestionBox.innerHTML = '';
        filtered.forEach(item => {
            const option = document.createElement('div');
            option.className = 'p-2 border-bottom suggestion-option';
            option.style.cursor = 'pointer';
            option.textContent = item.name;
            option.addEventListener('click', () => {
                input.value = item.name;
                suggestionBox.innerHTML = '';
                suggestionBox.style.display = 'none';
                if (typeof onSelect === 'function') onSelect(item);
            });
            suggestionBox.appendChild(option);
        });

        suggestionBox.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.style.display = 'none';
        }
    });
}


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
    if (!token || isTokenExpired(token)) {
        const loginModalEl = document.getElementById('loginModal');
        const loginModal = new bootstrap.Modal(loginModalEl, {
            backdrop: 'static',
            keyboard: false
        });
        loginModal.show();
    }


    document.getElementById('joinGroupBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('joinGroupModal'));
        modal.show();
    });

    document.getElementById('createGroupBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('createGroupModal'));
        modal.show();
    });

    function addMemberBadge(name) {
        const initials = name.slice(0, 2).toUpperCase();
        const icon = document.createElement('div');
        icon.className = 'rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center';
        icon.style.width = '40px';
        icon.style.height = '40px';
        icon.textContent = initials;
        document.getElementById('memberIcons').appendChild(icon);
    }
    const modal = document.getElementById('createGroupModal');
    modal.addEventListener('show.bs.modal', async () => {
        allNames = await fetchAllNames(token);
    });

    // Handle Add Member Button
    const input = document.getElementById('memberInput');
    const suggestionBox = document.getElementById('suggestionBox');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        suggestionBox.innerHTML = '';
        if (!query) {
            suggestionBox.style.display = 'none';
            return;
        }

        const filtered = allNames.filter(name => name.username.toLowerCase().includes(query) && !selectedNames.includes(name.username));
        if (filtered.length === 0) {
            suggestionBox.innerHTML = `<div class="text-danger p-2">No users found</div>`;
            suggestionBox.style.display = 'block';
            return;
        }


        filtered.forEach(name => {

            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = name.username;
            item.type = 'button';
            item.addEventListener('click', () => {
                input.value = name.username;
                suggestionBox.innerHTML = '';
                suggestionBox.style.display = 'none';
            });
            suggestionBox.appendChild(item);
        });

        suggestionBox.style.display = 'block';
    });

    document.getElementById('addMemberBtn').addEventListener('click', () => {

        const name = input.value.trim();
        if (name && !selectedNames.includes(name) && allNames.some(user => user.username === name)) {
            addMemberBadge(name);
            selectedNames.push(name);
            updateHiddenInput();
            //input.value = '';
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
            input.value = '';
        }
        else {
            input.value = '';
            //bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
            Swal.fire({
                icon: 'error',
                title: 'Invalid or Duplicate Name',
                text: 'Please select a valid name from suggestions or avoid adding the same member again.'
            });
        }

    });
    function updateHiddenInput() {
        document.getElementById('memberList').value = selectedNames.join(', ');
    }
    modal.addEventListener('hidden.bs.modal', () => {
        document.getElementById('createGroupForm').reset();
        document.getElementById('memberIcons').innerHTML = '';
        document.getElementById('memberList').value = '';
        selectedNames = [];
    });
    document.getElementById('createGroupForm').addEventListener('submit', async (e) => {

        e.preventDefault();

        const groupName = document.getElementById('groupName').value.trim();
        const memberList = document.getElementById('memberList').value.trim();

        if (!groupName || selectedNames.length === 0) {
            bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please add at least one member.'
            });
            return;
        }

        const groupData = {
            groupName: groupName,
            members: selectedNames
        };

        try {
            const response = await fetch(baseurl+'/create-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(groupData)
            });
            const result = await response.json();
            if (!response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || result.error
                });
            }
            else {

                bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Group Created!',
                    text: 'Your group was created successfully.'
                }).then(() => {
                    const modalElement = bootstrap.Modal.getInstance(document.getElementById('createGroupModal'));
                    modalElement.hide();
                });
            }
            window.location.reload();
        } catch (err) {
            console.error(err);
            bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while creating the group.'
            });
        }
    });

    document.getElementById('joinGroupModal').addEventListener('shown.bs.modal', async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(baseurl + '/group-names', {
            headers: { 'Authorization': token }
        });

        allGroups = await res.json();
        groupDatawithID = allGroups.map(g => ({
            id: g.groupId,
            name: g.groupName
        }));

        setupSuggestionInput({
            inputId: 'groupInput',
            boxId: 'groupSuggestionBox2',
            dataList: groupDatawithID,
            onSelect: (group) => {
                selectedGroup = group; // store selected group
            }
        });

    });

    document.getElementById('joinGroupModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('joinGroupForm').reset();
        selectedGroup = [];
    });

    document.getElementById('joinGroupForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!selectedGroup) {
            document.getElementById('groupSuggestionBox2').innerHTML = `<div class="text-danger p-2">Please select a valid group</div>`;
            document.getElementById('groupSuggestionBox2').style.display = 'block';
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(baseurl + '/join-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ groupName: selectedGroup.name })
            });

            const result = await res.json();

            bootstrap.Modal.getInstance(document.getElementById('joinGroupModal')).hide();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Request Sent',
                    text: result.message || 'Your request to join the group has been sent!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || result.error || 'Something went wrong.'
                });
            }

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while sending the request.'
            });
        }
    });


    // Mock current user ID for ownership logic

    let currentGroup = null;


    const icons = "bi-cash-coin";
    const classes = ['card-family', 'card-friends', 'card-work', 'card-gym'];

    function assignRandomIconAndClass(group) {
        return {
            ...group,
            icon: icons,
            cardClass: classes[Math.floor(Math.random() * classes.length)]
        };
    }

    async function fetchAndRenderGroups() {

        const res = await fetch(`${baseurl}/my-groups`, {
            headers: { 'Authorization': token }
        });

        const data = await res.json();
        const groups = data.map(assignRandomIconAndClass);
        renderGroupCards(groups);
    }

    function renderGroupCards(groups) {
        const container = document.getElementById('group-cards-container');
        container.innerHTML = '';

        groups.forEach(group => {
            const card = document.createElement('div');
            card.className = 'col-md-4 col-sm-6';

            const membersStr = group.members.join(', ');
            const displayedMembers = membersStr.length > 30 ? membersStr.slice(0, 30) + '...' : membersStr;

            // Badge HTML if invitations exist
            const badgeHTML = group.invitations && group.invitations.length > 0 ? `
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                  style="font-size: 0.7rem; transform: translate(-50%, 50%);">
                ${group.invitations.length}
            </span>` : '';

            card.innerHTML = `
            <div class="group-card ${group.cardClass} position-relative p-3">
                <div class="icon-container position-relative">
                    <i class="${group.icon}" style="font-size: 4rem;color:black;"></i>
                    ${badgeHTML}
                </div>
                <h5 class="mt-2">${group.groupName}</h5>
                <p>Involved: ${displayedMembers}</p>
                <button class="btn btn-outline-dark btn-sm" data-group-id="${group.id}">View Details</button>
            </div>
        `;

            card.querySelector('button').addEventListener('click', () => openGroupModal(group));
            container.appendChild(card);
        });
    }


    function openGroupModal(group) {
        currentGroup = group;
        document.getElementById('groupDetailsModalLabel').textContent = group.groupName;
        renderPills(group.members);

        if (group.groupOwner === currentUser) {
            showInvitations(group.invitations || []);
        }

        new bootstrap.Modal(document.getElementById('groupDetailsModal')).show();
    }

    document.getElementById('groupDetailsModal').addEventListener('hidden.bs.modal', () => {
        // Remove the invitation button
        const invBtn = document.getElementById('invitationBtn');
        if (invBtn) invBtn.remove();

        // Optionally clear other dynamic content like member pills or input fields if needed
        document.getElementById('memberPills').innerHTML = '';
        document.getElementById('newMemberEmail').value = '';
    });


    function renderPills(members) {

        const memberPills = document.getElementById('memberPills');
        memberPills.innerHTML = '';
        members.forEach(member => {
            memberPills.appendChild(createMemberPill(member));
        });
    }

    function createMemberPill(name) {

        const pill = document.createElement('div');
        pill.className = 'badge bg-primary d-flex align-items-center gap-2 p-2';
        pill.innerHTML = `
        <span>${name}</span>
        <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Remove" title="Remove"></button>
    `;

        pill.querySelector('button').addEventListener('click', async () => {
            const token = localStorage.getItem('token');

            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: `Remove ${name} from the group?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, remove',
                cancelButtonText: 'Cancel'
            });

            if (confirm.isConfirmed) {
                try {
                    const res = await fetch(`${baseurl}/remove-member`, {
                        method: 'POST',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            groupName: currentGroup.groupName,  // Make sure this is set correctly
                            memberName: name
                        })
                    });

                    const result = await res.json();

                    if (res.ok) {
                        pill.remove();
                        currentGroup.members = currentGroup.members.filter(m => m !== name);

                        Swal.fire({
                            icon: 'success',
                            title: 'Member Removed',
                            text: result.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: result.error || result.message || 'Failed to remove member.'
                        });
                    }

                } catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Network error or server not reachable.'
                    });
                }
            }
        });

        return pill;
    }

    function setupSuggestionInput2({ inputId, boxId, dataList, onSelect }) {

        const input = document.getElementById(inputId);
        const box = document.getElementById(boxId);

        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            const suggestions = dataList
                .filter(item => item.name.toLowerCase().includes(query))
                .slice(0, 5);

            box.innerHTML = '';

            if (suggestions.length === 0) {
                box.innerHTML = `<div class="text-danger p-2">No matches found</div>`;
                box.style.display = 'block';
                return;
            }

            suggestions.forEach(s => {
                const div = document.createElement('div');
                div.className = 'p-2 border-bottom suggestion-option';
                div.style.cursor = 'pointer';
                div.textContent = s.name;
                div.addEventListener('click', () => {
                    input.value = s.name;
                    box.innerHTML = '';
                    box.style.display = 'none';
                    //if (typeof onSelect === 'function') onSelect(s);
                });
                box.appendChild(div);
            });

            box.style.display = 'block';
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !box.contains(e.target)) {
                box.style.display = 'none';
            }
        });
    }

    const newGpMem = [];
    document.getElementById('addMemberBtn2').addEventListener('click', () => {
        const input = document.getElementById('newMemberEmail');
        const name = input.value.trim();

        if (!name) return;

        if (currentGroup.members.includes(name)) {
            Swal.fire({
                icon: 'error',
                title: 'Caution',
                text: `${name} is already in the group.`
            });
        } else {
            newGpMem.push(name);
            //currentGroup.members.push(name); // Only push name
            document.getElementById('memberPills').appendChild(createMemberPill(name));
            input.value = '';
        }
    });



    function showInvitations(invitations) {

        const existingBtn = document.getElementById('invitationBtn');
        if (existingBtn) existingBtn.remove(); // Remove previous button if any

        const btn = document.createElement('button');
        btn.id = 'invitationBtn';
        btn.className = 'btn btn-info position-relative mb-3';
        btn.type = 'button';
        btn.innerHTML = `
        Invitations
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            ${invitations.length}
        </span>
    `;

        btn.addEventListener('click', () => {

            const htmlContent = invitations.length
                ? invitations.map(inv => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${inv.inv_name}</span>
                    <div>
                        <button class="btn btn-success btn-sm me-2 approve-inv" data-id="${inv.inv_id}">Approve</button>
                        <button class="btn btn-danger btn-sm reject-inv" data-id="${inv.inv_id}">Reject</button>
                    </div>
                </div>
            `).join('')
                : '<p class="text-muted">No invitations at the moment.</p>';

            Swal.fire({
                title: 'Group Invitations',
                html: htmlContent,
                showConfirmButton: false,
                width: 500,
                didOpen: () => {
                    document.querySelectorAll('.approve-inv').forEach(button => {
                        button.addEventListener('click', async () => {
                            await respondToInvitation(button.dataset.id, 'approve');
                            Swal.close();
                            fetchAndRenderGroups(); // Refresh groups after action
                        });
                    });
                    document.querySelectorAll('.reject-inv').forEach(button => {
                        button.addEventListener('click', async () => {
                            await respondToInvitation(button.dataset.id, 'reject');
                            Swal.close();
                            fetchAndRenderGroups(); // Refresh groups after action
                        });
                    });
                }
            });
        });

        // Append the button inside the group details modal or wherever appropriate
        document.getElementById('invitationButtonContainer').appendChild(btn);

    }

    async function respondToInvitation(inviteId, action) {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${baseurl}/group-invitation/${inviteId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action }) // 'approve' or 'reject'
            });

            const result = await res.json();

            if (!res.ok) {
                console.error(result.message);
                Swal.fire('Error', result.message || result.error, 'error');
            } else {
                await Swal.fire({
                    title: 'Success',
                    text: `Invitation ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                location.reload(); // Reload after user clicks OK
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
    }




    document.getElementById('groupDetailsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const groupName = document.getElementById('groupDetailsModalLabel').textContent.trim();
        const newgroupMember = newGpMem; // assuming this is the updated members list
        const existingMem = currentGroup.members; // store the original list when modal opens

        // Check if any new member is not in the original list
        const hasNewMember = newgroupMember.some(mem => !existingMem.includes(mem));

        if (!hasNewMember) {
            Swal.fire({
                icon: 'info',
                title: 'No Changes',
                text: 'No new members added to update.'
            });
            return;
        }

        const res = await fetch(`${baseurl}/update-group`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ groupName, members: newGpMem })
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal')).hide();
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Group details updated.',
                timer: 2000,
                showConfirmButton: false
            });
            window.location.reload();
        } else {
            const error = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.message || 'Could not update group.'
            });
        }
    });


    // Fetch all users for suggestions (on load)

    document.getElementById('groupDetailsModal').addEventListener('show.bs.modal', async () => {

        allNames = await fetchAllNames(token);
        if (currentGroup.groupOwner === currentUser) {
            setupSuggestionInput2({
                inputId: 'newMemberEmail',
                boxId: 'memberSuggestionBox',
                dataList: allNames.map(u => ({ name: u.username })),
                onSelect: (user) => {
                    if (!currentGroup.members.some(m => m.name === user.name)) {
                        const pill = createMemberPill(user.name);
                        document.getElementById('memberPills').appendChild(pill);
                        currentGroup.members.push({ name: user.username });
                    }
                }
            });

            document.getElementById('newMemberEmail').style.display = 'block'; // or 'inline'/'flex' as per layout
            document.getElementById('groupdetailSubmit').style.display = 'inline-block';
            document.getElementById('addMemberBtn2').style.display = 'block';

        } else {
            document.getElementById('newMemberEmail').style.display = 'none';
            document.getElementById('groupdetailSubmit').style.display = 'none';
            document.getElementById('addMemberBtn2').style.display = 'none';
            document.getElementById('memberSuggestionBox').style.display = 'none';
        }

    });

    let selectedExpenseGroup = null;

    document.getElementById('addExpenseModal').addEventListener('shown.bs.modal', async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(baseurl + '/group-names', {
            headers: { 'Authorization': token }
        });

        const allGroups = await res.json();
        const groupData = allGroups.map(g => ({
            id: g.groupId,
            name: g.groupName
        }));

        setupSuggestionInput({
            inputId: 'expenseGroupInput',
            boxId: 'groupSuggestionBox',
            dataList: groupData,
            onSelect: (group) => {
                selectedExpenseGroup = group; // store selected group
                document.getElementById('expenseGroupInput').value = group.name;
            }
        });
    });
    document.getElementById('addExpenseModal').addEventListener('hidden.bs.modal', () => {
        // Clear input fields
        document.getElementById('expenseTitle').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('groupInput').value = '';

        // Also clear the suggestion box if you're using one
        document.getElementById('groupSuggestionBox').innerHTML = '';
        document.getElementById('groupSuggestionBox').style.display = 'none';

        selectedExpenseGroup = null;
    });

    document.getElementById('addExpenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();


        const title = document.getElementById('expenseTitle').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);

        if (!selectedExpenseGroup) {
            return Swal.fire('Error', 'Please select a valid group from suggestions.', 'warning');
        }

        const res = await fetch(baseurl + '/add-expense', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                amount,
                groupname: selectedExpenseGroup.name
            })
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addExpenseModal')).hide();
            Swal.fire('Success', 'Expense added successfully!', 'success');
            window.location.reload();
        } else {
            const error = await res.json();
            Swal.fire('Error', error.message || 'Could not add expense', 'error');
        }
    });


    fetchAndRenderGroups();



});