
function setupSuggestionInput({ inputId, boxId, dataList, onSelect }) {
  const input = document.getElementById(inputId);
  const suggestionBox = document.getElementById(boxId);

  input.addEventListener('input', () => {
    debugger;
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
  const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl, {
      backdrop: 'static',
      keyboard: false
    });
  if (!token || isTokenExpired(token)) {
    
    localStorage.clear();
    loginModal.show();
  }
    // Switch to Signup Modal
    document.getElementById('showSignup').addEventListener('click', function () {
      debugger;
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

      fetch(baseurl+'/login', {
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

      fetch(baseurl+'/signup', {
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
    document.getElementById('addExpenseBtn').addEventListener('click', function () {

      const modal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
      modal.show();
    });

    // Handle Add Expense Form submission
    // document.getElementById('addExpenseForm').addEventListener('submit', function (e) {
    //   e.preventDefault();
    //   //const loadingModal = showLoading();
    //   const title = document.getElementById('expenseTitle').value;
    //   // const description = document.getElementById('expenseDescription').value;
    //   const amount = document.getElementById('expenseAmount').value;
    //   const group = document.getElementById('expenseGroup').value;

    //   // You can make an API call here to actually save it to backend

    //   // Close modal
    //   bootstrap.Modal.getInstance(document.getElementById('addExpenseModal')).hide();

    //   // Show success alert
    //   //hideLoading(loadingModal);
    //   Swal.fire({
    //     icon: 'success',
    //     title: 'Expense Added',
    //     text: `${title} added to ${group}`,
    //     showConfirmButton: false,
    //     timer: 2000
    //   });
    //   //hideLoading(loadingModal);
    //   // Optional: reset form
    //   document.getElementById('addExpenseForm').reset();
    // });

  




});

