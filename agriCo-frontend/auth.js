document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js loaded');
  // Password visibility toggle
  const toggleBtn = document.getElementById('togglePwd');
  const pwdInput  = document.getElementById('password');
  const eyeIcon   = document.getElementById('eyeIcon');

  if (toggleBtn && pwdInput && eyeIcon) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = pwdInput.type === 'password';
      pwdInput.type  = isHidden ? 'text' : 'password';
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
      toggleBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
    });
  }

  // Signup form submission handler
  const signupBtn = document.getElementById('submitBtn');

  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      // Get form elements
      const firstname = document.getElementById('firstname');
      const lastname  = document.getElementById('lastname');
      const email     = document.getElementById('email');
      const phone     = document.getElementById('phone');
      const password  = document.getElementById('password');
      const cgu       = document.getElementById('cgu');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Clear previous errors
      [firstname, lastname, email, phone, password].forEach(el => {
        if (el) el.style.border = '';
      });
      if (cgu) cgu.style.outline = '';

      // Validation
      if (!firstname || !firstname.value.trim()) {
        if (firstname) firstname.style.border = '1.5px solid red';
        alert("Le prénom est requis.");
        return;
      }

      if (!lastname || !lastname.value.trim()) {
        if (lastname) lastname.style.border = '1.5px solid red';
        alert("Le nom est requis.");
        return;
      }

      if (!email || !email.value.trim()) {
        if (email) email.style.border = '1.5px solid red';
        alert("L'email est requis.");
        return;
      }

      if (!emailRegex.test(email.value.trim())) {
        if (email) email.style.border = '1.5px solid red';
        alert("L'email n'est pas valide.");
        return;
      }

      if (!password || !password.value.trim()) {
        if (password) password.style.border = '1.5px solid red';
        alert("Le mot de passe est requis.");
        return;
      }

      if (!cgu || !cgu.checked) {
        if (cgu) cgu.style.outline = '2px solid red';
        alert("Veuillez accepter les CGU.");
        return;
      }

      // Prepare data for backend
      const userData = {
        nom: lastname.value.trim(),
        prenom: firstname.value.trim(),
        email: email.value.trim(),
        telephone: phone.value.trim(),
        mdp: password.value.trim(),
        role: 'membre',
        avatar: '',
        bio: ''
      };

      // Send to backend
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
          alert("Inscription réussie !");
          window.location.href = 'login.html';
        } else {
          alert("Erreur: " + (result.error || "Échec de l'inscription"));
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Impossible de contacter le serveur.");
      }
    });
  }

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      if (!email || !email.value.trim()) {
        if (email) email.style.border = '1.5px solid red';
        alert("L'email est requis.");
        return;
      }

      if (!password || !password.value.trim()) {
        if (password) password.style.border = '1.5px solid red';
        alert("Le mot de passe est requis.");
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.value.trim(),
            password: password.value.trim()
          })
        });

        const result = await response.json();
        console.log("Login response:", result);
        console.log("User object details:", JSON.stringify(result.user, null, 2));
        if (response.ok) {
          alert("Connexion réussie !");
          if (result.token) {
            localStorage.setItem('authToken', result.token);
            console.log("Token saved:", result.token);
          }
          if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
            console.log("User saved to localStorage:", result.user);
            console.log("localStorage.user after save:", localStorage.getItem('user'));
            if (result.user.role) {
              localStorage.setItem('userRole', result.user.role);
              console.log("Role saved:", result.user.role);
            }
          } else {
            console.warn("No user data in response!");
          }
          console.log("All localStorage items:", {
            user: localStorage.getItem('user'),
            token: localStorage.getItem('authToken'),
            role: localStorage.getItem('userRole')
          });
          console.log("Redirecting to index.html");
          window.location.href = 'index.html';
        } else {
          alert("Erreur: " + (result.error || "Échec de la connexion"));
        }
      } catch (error) {
        console.error("Erreur login :", error);
        alert("Impossible de contacter le serveur pour la connexion.");
      }
    });
  }
});



