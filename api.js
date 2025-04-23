document.addEventListener("DOMContentLoaded", function () {
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

  }
});

