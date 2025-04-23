document.addEventListener("DOMContentLoaded", function () {
  function addMemberIcon(email, targetClass) {
    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      const initials = trimmedEmail.slice(0, 2).toUpperCase();
  
      const icon = document.createElement('div');
      icon.className = 'rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2';
      icon.style.width = '40px';
      icon.style.height = '40px';
      icon.textContent = initials;
  
      const container = document.querySelector(`.${targetClass}`);
      if (container) {
        container.appendChild(icon);
      }
    }
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

  function hideLoading(loadingModalInstance) {
    if (loadingModalInstance) {
      loadingModalInstance.hide();
    }
  }

  const token = localStorage.getItem('token');

  if (!token) {
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl, {
      backdrop: 'static',
      keyboard: false
    });
    loginModal.show();

    // Switch to Signup Modal
    document.getElementById('showSignup').addEventListener('click', function () {
      loginModal.hide();
      const signupModal = new bootstrap.Modal(document.getElementById('signupModal'), {
        backdrop: 'static',
        keyboard: false
      });
      signupModal.show();
    });

    // Switch back to Login Modal
    document.getElementById('showLogin').addEventListener('click', function () {
      const signupModalInstance = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
      signupModalInstance.hide();
      loginModal.show();
    });

    // Handle Login Submission
    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('Username').value;
      const password = document.getElementById('loginPassword').value;

      const loginModalEl = document.getElementById('loginModal');
      const loginModal = bootstrap.Modal.getInstance(loginModalEl);
      loginModal.hide();  // Fade out login modal

      const loadingModal = showLoading("Authenticating...");  // Show loading spinner

      fetch('https://daeadc54-e683-433b-b665-521feea298ab-00-21ewttdkpyfgy.spock.replit.dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(data => {
          hideLoading(loadingModal);  // Hide spinner

          if (data.token) {
            localStorage.setItem('token', data.token);
            location.reload();
          } else {
            alert(data.error || "Invalid Login!");
            loginModal.show();  // Show login modal back
          }
        })
        .catch(err => {
          hideLoading(loadingModal);
          alert("Something went wrong! Try again.");
          loginModal.show();
        });
    });

    document.getElementById('signupForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
      signupModal.hide();  // Fade out signup modal

      const loadingModal = showLoading("Creating user, hold on...");

      fetch('https://daeadc54-e683-433b-b665-521feea298ab-00-21ewttdkpyfgy.spock.replit.dev/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
        .then(res => res.json())
        .then(data => {
          hideLoading(loadingModal);

          if (data.token) {
            localStorage.setItem('token', data.token);
            location.reload();
          } else {
            alert(data.error || "Signup failed!");
            signupModal.show();
          }
        })
        .catch(err => {
          hideLoading(loadingModal);
          alert("Something went wrong! Try again.");
          signupModal.show();
        });
    });
    // Show modal on button click

  }

  document.getElementById('addExpenseBtn').addEventListener('click', function () {
    debugger;
    const modal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
    modal.show();
  });

  // Handle Add Expense Form submission
  document.getElementById('addExpenseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    //const loadingModal = showLoading();
    const title = document.getElementById('expenseTitle').value;
    // const description = document.getElementById('expenseDescription').value;
    const amount = document.getElementById('expenseAmount').value;
    const group = document.getElementById('expenseGroup').value;

    // You can make an API call here to actually save it to backend

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addExpenseModal')).hide();
    debugger;
    // Show success alert
    //hideLoading(loadingModal);
    Swal.fire({
      icon: 'success',
      title: 'Expense Added',
      text: `${title} added to ${group}`,
      showConfirmButton: false,
      timer: 2000
    });
    //hideLoading(loadingModal);
    // Optional: reset form
    document.getElementById('addExpenseForm').reset();
  });

  document.getElementById('joinGroupBtn').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('joinGroupModal'));
    modal.show();
  });

  document.getElementById('createGroupBtn').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('createGroupModal'));
    modal.show();
  });

  // Handle Join Group Request
  document.getElementById('joinGroupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    bootstrap.Modal.getInstance(document.getElementById('joinGroupModal')).hide();

    Swal.fire({
      icon: 'info',
      title: 'Request Sent',
      text: 'Your request to join the group has been sent!',
      timer: 2000,
      showConfirmButton: false
    });
  });

  // Handle Add Member Button
  document.getElementById('addMemberBtn').addEventListener('click', () => {
    const emailInput = document.getElementById('memberEmail');
    const email = emailInput.value.trim();

    if (email) {
      addMemberIcon(email, 'memberIcons');

    }
  });

  document.getElementById('addMemberBtn2').addEventListener('click', () => {
    debugger;
    const emailInput = document.getElementById('newMemberEmail');
    const email = emailInput.value.trim();

    if (email) {
      addMemberIcon(email, 'memberIcons2');

    }
  });

  // Handle Create Group Submission
  document.getElementById('createGroupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const groupName = document.getElementById('groupName').value.trim();
    bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();

    Swal.fire({
      icon: 'success',
      title: 'Created',
      text: `Group "${groupName}" Created!`,
      showConfirmButton: false,
      timer: 2000
    });

    // Optionally reset form
    this.reset();
    document.getElementById('memberIcons').innerHTML = '';
  });

});

