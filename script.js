document.addEventListener('DOMContentLoaded', function() {
    // Marcar "sobre-mí" como sección activa por defecto
    const defaultActiveLink = document.querySelector('.nav-links a[href="#sobre-mi"]');
    if (defaultActiveLink) {
        
        defaultActiveLink.classList.add("active");
    }

    const sections = document.querySelectorAll("#sobre-mi, #proyectos, #mis-videojuegos, #contacto");
    const navLinks = document.querySelectorAll(".nav-links a");
    const headerHeight = document.querySelector('.navbar').offsetHeight;

    function updateActiveSection() {
        // Verificar si estamos cerca del final de la página para activar "contacto"
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        const bottomThreshold = scrollHeight - 50; // 50px desde el final
        
        // Si estamos cerca del final, activar solo la sección de contacto
        if (scrollPosition >= bottomThreshold) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#contacto") {
                    link.classList.add("active");
                }
            });
            return; // Salir de la función para no ejecutar el resto
        }
        
        // Para otras posiciones de scroll, usar la lógica normal
        let current = "";
        const scrollPos = window.scrollY + headerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Modificamos la condición para ser más precisa
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        // Si encontramos una sección activa, actualizar los enlaces del menú
        if (current) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${current}`) {
                    link.classList.add("active");
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveSection);

    // Toggle menú hamburguesa para móvil
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
    });

    // Cerrar menú al hacer clic en un enlace (en móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1023) { // Cambiado de 768 a 1023 para coincidir con tu media query
                navLinksContainer.classList.remove('show');
            }
        });
    });
    // --- NOVELA VISUAL ---
    let currentScene = 'start';

    const scenes = {
        start: {
            speaker: 'Joandev',
            dialog: 'Se Bienvenido a mi historia interactiva. Descubre mi camino en el desarrollo de videojuegos y el análisis de datos.',
            choices: [
                { text: 'Historia videojuegos', scene: 'games' },
                { text: 'Historia Big Data', scene: 'data' },
                { text: 'Mis habilidades', scene: 'skills' }
            ]
        },
        games: {
            speaker: 'Joandev',
            dialog: 'Mi camino comenzó con la creación de videojuegos, una pasión que surgio a raíz de jugar videojuegos y sí, mirar ciertas mecanicas con disgusto me hizo experimentar y adentrarme en este mundo el cual considero es muy divertido.',
            choices: [{ text: 'Volver a inicio', scene: 'start' }]
        },
        data: {
            speaker: 'Joandev',
            dialog: 'Mi fascinación por analizar cosas viene desde pequeño que siempre me ha gustado mucho buscar el por qué de las cosas y eso me ha llevado hasta este punto al adentrarme en este mundo.',
            choices: [{ text: 'Volver a inicio', scene: 'start' }]
        },
       skills: {
    speaker: 'Joandev',
    dialog: 'Actualmente tengo conocimientos básicos en Python, SQL y con el desarrollo de videojuegos he estado experimentando con Godot Engine desde hace un tiempo, usando su lenguaje similar a Python, llamado GDScript. Continuaré profundizando en todas estas herramientas.',
    choices: [{ text: 'Volver a inicio', scene: 'start' }]
}
    };

    function showScene(sceneKey) {
        currentScene = sceneKey;
        const scene = scenes[sceneKey];
        const vn = document.getElementById('visual-novel');
        const container = document.getElementById('vn-current-scene');
        const name = container.querySelector('.vn-name');
        const dialog = container.querySelector('.vn-text');
        const choicesContainer = container.querySelector('.vn-choices');

        vn.classList.remove('hidden');
        name.textContent = scene.speaker;
        dialog.textContent = scene.dialog;
        choicesContainer.innerHTML = '';

        // Botones de elección
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('vn-choice-btn');
            button.textContent = choice.text;
            button.onclick = () => vnNavigate(choice.scene);
            choicesContainer.appendChild(button);
        });

        // Mostrar botón "Salir del juego" solo en el inicio
        if (sceneKey === 'start') {
            const exitButton = document.createElement('button');
            exitButton.classList.add('vn-choice-btn');
            exitButton.textContent = 'Salir del juego';
            exitButton.onclick = () => {
                vn.classList.add('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            choicesContainer.appendChild(exitButton);
        }
    }

    function vnNavigate(sceneKey) {
        showScene(sceneKey);
    }

    const startButton = document.querySelector(".start-btn");
    if (startButton) {
        startButton.addEventListener("click", function () {
            document.getElementById('visual-novel').classList.remove("hidden");
            showScene('start');
        });
    }

    updateActiveSection();
    
    // ----- FORMULARIO DE CONTACTO -----
    // Código para inicializar EmailJS y gestionar el formulario
    try {
        // Inicializar EmailJS con tu clave pública
        // IMPORTANTE: Reemplaza 'TU_CLAVE_PUBLICA' con tu clave pública real de EmailJS
        emailjs.init('XHBKzeEZTP0LnoRDF');
        
        // Referencia al formulario
        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const formStatus = document.getElementById('form-status');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        
        if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Deshabilitar el botón mientras se procesa
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Obtener los valores de los campos
        const mensaje = document.getElementById('mensaje').value;
        const email_from = document.getElementById('email-from').value;

        // Validar que los campos no estén vacíos
        if (!mensaje || !email_from) {
            alert("Por favor, completa todos los campos.");
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensaje';
            return; // Salir de la función si hay campos vacíos
        }

        // Preparar los parámetros para EmailJS
        const templateParams = {
            mensaje: mensaje,
            email_from: email_from
        };

        // Enviar el correo usando EmailJS
        emailjs.send('service_oul4shn', 'template_yciv6kn', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Manejo de éxito
            }, function(error) {
                console.error('Error al enviar el mensaje:', error);
                // Manejo de error
            });
    });
       }         
                // Enviar el correo usando EmailJS
                // IMPORTANTE: Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con tus IDs reales
                emailjs.send('service_oul4shn', 'template_yciv6kn', templateParams)
                  .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Mostrar mensaje de éxito
                    formStatus.classList.remove('hidden');
                    successMessage.classList.remove('hidden');
                    errorMessage.classList.add('hidden');
                    
                    // Resetear el formulario
                    contactForm.reset();
                    
                    // Habilitar el botón de nuevo
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar mensaje';
                    
                    // Ocultar el mensaje después de unos segundos
                    setTimeout(() => {
                      formStatus.classList.add('hidden');
                    }, 5000);
                  }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Mostrar mensaje de error
                    formStatus.classList.remove('hidden');
                    errorMessage.classList.remove('hidden');
                    successMessage.classList.add('hidden');
                    
                    // Habilitar el botón de nuevo
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar mensaje';
                  });
            });
        }
    } catch (e) {
        console.error('Error al inicializar el formulario de contacto:', e);
    }
});
