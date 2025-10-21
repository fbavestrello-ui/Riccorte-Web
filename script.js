document.addEventListener("DOMContentLoaded", function() {

    // ===================================================================
    //  DECLARACIÓN DE CONSTANTES
    // ===================================================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const header = document.querySelector('.header');
    
    // --- Login Elements ---
    const loginBtn = document.getElementById('login-btn');
    const loginSection = document.getElementById('login-section');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const loginUsernameInput = document.getElementById('username'); // From login form
    const loginPasswordInput = document.getElementById('password'); // From login form

    // --- Register Elements ---
    const registerBtn = document.getElementById('register-btn');
    const registerSection = document.getElementById('register-section');
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');
    const regUsernameInput = document.getElementById('reg-username');
    const regPasswordInput = document.getElementById('reg-password');
    const regConfirmPasswordInput = document.getElementById('reg-confirm-password');

    // --- Formulario de Agendar ---
    const genderSelect = document.getElementById("gender");
    const serviceSelect = document.getElementById("service");
    const bookingForm = document.getElementById("booking-form");
    const dateInput = document.getElementById("date");

    // --- Portfolio Overlay ---
    const portfolioOverlay = document.getElementById('portfolio-overlay');
    const openPortfolioButtons = document.querySelectorAll('a[href="#galeria"], .cta-center a');
    const closePortfolioBtn = document.getElementById('close-portfolio');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // --- Carrusel ---
    const track = document.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');

    // --- Animación de Scroll ---
    const hiddenElements = document.querySelectorAll('.hidden');

    // ===================================================================
    //  DEFINICIÓN DE FUNCIONES
    // ===================================================================

    function showNotification(message, type = "success", duration = 5000) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.className = `notification show ${type === 'error' ? 'error' : 'success'}`;
        setTimeout(() => {
            notification.className = 'notification';
        }, duration);
    }
    
    const openPortfolio = () => {
        portfolioOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closePortfolio = () => {
        portfolioOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // ===================================================================
    //  EVENT LISTENERS
    // ===================================================================

    // --- Lógica de la Navbar Responsive ---
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // --- Lógica del Header con Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // --- Lógica del Formulario de Agendar ---
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute('min', today);
    const services = {
        hombre: [{ name: "Corte Fade & Textura", price: "$20.000" }, { name: "Perfilado de Barba", price: "$12.000" }, { name: "Corte Rizado & Degradado", price: "$28.000" }],
        mujer: [{ name: "Corte & Brushing", price: "$30.000" }, { name: "Balayage & Ondas", price: "$75.000" }, { name: "Hidratación Profunda", price: "$25.000" }]
    };
    genderSelect.addEventListener("change", () => {
        const selectedGender = genderSelect.value;
        serviceSelect.innerHTML = '<option value="">Seleccionar servicio...</option>';
        if (selectedGender && services[selectedGender]) {
            services[selectedGender].forEach(service => {
                const option = document.createElement("option");
                option.value = service.name;
                option.textContent = `${service.name} (${service.price})`;
                serviceSelect.appendChild(option);
            });
        }
    });
    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        if (name && service && date && time) {
            const confirmationMessage = `¡Reserva confirmada, ${name}! Te esperamos el ${date} a las ${time}.`;
            showNotification(confirmationMessage);
            bookingForm.reset();
            serviceSelect.innerHTML = '<option value="">Primero selecciona el tipo</option>';
        } else {
            showNotification("Por favor, completa todos los campos.", 'error');
        }
    });

    // --- Lógica de la Animación de Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, { threshold: 0.1 });
    hiddenElements.forEach((el) => observer.observe(el));

    // --- Lógica del Portfolio Overlay ---
    openPortfolioButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openPortfolio();
        });
    });
    closePortfolioBtn.addEventListener('click', closePortfolio);
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'todo' || filter === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Lógica del Carrusel de la Galería ---
    let currentIndex = 0;
    const slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
    
    const moveToSlide = (targetIndex) => {
        track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
        currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 4) { // Asumiendo que se muestran 4 a la vez
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    // --- Login/Register Functionality ---
    loginBtn.addEventListener('click', () => {
        loginSection.style.display = loginSection.style.display === 'none' ? 'block' : 'none';
        registerSection.style.display = 'none'; // Hide register form if login is shown
    });

    registerBtn.addEventListener('click', () => {
        registerSection.style.display = registerSection.style.display === 'none' ? 'block' : 'none';
        loginSection.style.display = 'none'; // Hide login form if register is shown
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;

        loginMessage.textContent = ''; // Clear previous messages

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message, 'success');
                loginSection.style.display = 'none'; // Hide login form on success
                if (data.role === 'admin') {
                    window.location.href = '/admin.html'; // Redirect to admin page
                } else {
                    showNotification('Bienvenido, ' + username + '!', 'success');
                    // Optionally redirect regular users to a user dashboard or hide forms
                    loginSection.style.display = 'none';
                    registerSection.style.display = 'none';
                }
            } else {
                loginMessage.textContent = data.message || 'Error de inicio de sesión.';
                showNotification(data.message || 'Error de inicio de sesión.', 'error');
            }
        } catch (error) {
            console.error('Error during login fetch:', error);
            loginMessage.textContent = 'Error de conexión con el servidor.';
            showNotification('Error de conexión con el servidor.', 'error');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = regUsernameInput.value;
        const password = regPasswordInput.value;
        const confirmPassword = regConfirmPasswordInput.value;

        registerMessage.textContent = ''; // Clear previous messages

        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            showNotification('Las contraseñas no coinciden.', 'error');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message + ' Ahora puedes iniciar sesión.', 'success');
                registerForm.reset();
                registerSection.style.display = 'none'; // Hide register form on success
                loginSection.style.display = 'block'; // Show login form
            } else {
                registerMessage.textContent = data.message || 'Error de registro.';
                showNotification(data.message || 'Error de registro.', 'error');
            }
        } catch (error) {
            console.error('Error during registration fetch:', error);
            registerMessage.textContent = 'Error de conexión con el servidor.';
            showNotification('Error de conexión con el servidor.', 'error');
        }
    });

});