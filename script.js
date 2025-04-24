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
        let current = "";
        // Verificar si estamos cerca del final de la página para activar "contacto"
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + window.innerHeight+20;
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
        const scrollPos = window.scrollY + headerHeight + 20;

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
});
