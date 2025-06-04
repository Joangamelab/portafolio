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
    
    // ----- FORMULARIO DE CONTACTO MEJORADO -----
    function initializeContactForm() {
        // Verificar si EmailJS está disponible
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS no está cargado. Asegúrate de incluir el script de EmailJS en tu HTML.');
            return;
        }

        try {
            // CONFIGURACIÓN IMPORTANTE: Reemplaza estos valores con los tuyos
            const EMAILJS_CONFIG = {
                publicKey: 'XHBKzeEZTP0LnoRDF',    // Tu clave pública de EmailJS
                serviceId: 'service_lgsk7yd',        // Tu Service ID
                templateId: 'template_3my7z1o'       // Tu Template ID
            };

            // Inicializar EmailJS
            emailjs.init(EMAILJS_CONFIG.publicKey);
            
            // Referencias a elementos del DOM
            const contactForm = document.getElementById('contact-form');
            const submitBtn = document.getElementById('submit-btn');
            const formStatus = document.getElementById('form-status');
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');
            
            // Verificar que todos los elementos existan
            if (!contactForm) {
                console.error('No se encontró el formulario con ID "contact-form"');
                return;
            }

            if (!submitBtn) {
                console.error('No se encontró el botón con ID "submit-btn"');
                return;
            }

            // Validación de campos
            function validateForm(formData) {
                const errors = [];
                
                if (!formData.email || formData.email.trim() === '') {
                    errors.push('El email es requerido');
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    errors.push('El formato del email no es válido');
                }
                
                if (!formData.mensaje || formData.mensaje.trim() === '') {
                    errors.push('El mensaje es requerido');
                } else if (formData.mensaje.trim().length < 10) {
                    errors.push('El mensaje debe tener al menos 10 caracteres');
                }
                
                return errors;
            }

            // Mostrar mensajes de estado
            function showMessage(type, message) {
                if (!formStatus) return;
                
                formStatus.classList.remove('hidden');
                
                if (type === 'success') {
                    if (successMessage) {
                        successMessage.textContent = message;
                        successMessage.classList.remove('hidden');
                    }
                    if (errorMessage) {
                        errorMessage.classList.add('hidden');
                    }
                } else if (type === 'error') {
                    if (errorMessage) {
                        errorMessage.textContent = message;
                        errorMessage.classList.remove('hidden');
                    }
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                }
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 5000);
            }

            // Manejador del envío del formulario
            contactForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                // Obtener datos del formulario
                const formData = {
                    email: document.getElementById('email-from')?.value || '',
                    mensaje: document.getElementById('mensaje')?.value || ''
                };
                
                // Validar formulario
                const validationErrors = validateForm(formData);
                if (validationErrors.length > 0) {
                    showMessage('error', validationErrors.join('. '));
                    return;
                }
                
                // Deshabilitar botón y mostrar estado de carga
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                try {
                    // Preparar parámetros para el template
                    const templateParams = {
                        from_email: formData.email,
                        message: formData.mensaje,
                        from_name: formData.email.split('@')[0], // Usar parte del email como nombre
                        to_name: 'Joandev', // Tu nombre
                        reply_to: formData.email
                    };
                    
                    // Enviar email
                    const response = await emailjs.send(
                        EMAILJS_CONFIG.serviceId,
                        EMAILJS_CONFIG.templateId,
                        templateParams
                    );
                    
                    console.log('Mensaje enviado exitosamente:', response);
                    
                    // Mostrar mensaje de éxito
                    showMessage('success', '¡Mensaje enviado correctamente! Te responderé pronto.');
                    
                    // Resetear formulario
                    contactForm.reset();
                    
                } catch (error) {
                    console.error('Error al enviar mensaje:', error);
                    
                    let errorMsg = 'Error al enviar el mensaje. ';
                    
                    if (error.status === 400) {
                        errorMsg += 'Verifica la configuración del servicio.';
                    } else if (error.status === 401) {
                        errorMsg += 'Error de autenticación. Verifica tu clave pública.';
                    } else if (error.status === 404) {
                        errorMsg += 'Servicio o template no encontrado.';
                    } else {
                        errorMsg += 'Inténtalo de nuevo más tarde.';
                    }
                    
                    showMessage('error', errorMsg);
                    
                } finally {
                    // Rehabilitar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar mensaje';
                }
            });
            
            console.log('Formulario de contacto inicializado correctamente');
            
        } catch (error) {
            console.error('Error al inicializar el formulario de contacto:', error);
        }
    }

    // Inicializar el formulario cuando se cargue EmailJS
    // Si EmailJS ya está disponible, inicializar inmediatamente
    if (typeof emailjs !== 'undefined') {
        initializeContactForm();
    } else {
        // Si no, esperar a que se cargue
        window.addEventListener('load', initializeContactForm);
    }
});
