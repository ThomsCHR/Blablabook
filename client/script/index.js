
//  GESTION DU MENU MOBILE 
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Ouvrir le menu mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
            setTimeout(() => {
                mobileMenu.classList.add('active');
            }, 10);
        });
    }

    // Fermer le menu mobile
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenuOverlay.classList.remove('active');
        }, 300);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Fermer en cliquant sur l'overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }

    //  GESTION DU FORMULAIRE DE RECHERCHE MOBILE 
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    let isExpanded = false;

    // Clic sur le bouton loupe
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isExpanded) {
                // Agrandir le formulaire
                mobileSearchForm.classList.add('expanded');
                isExpanded = true;
                // Focus sur l'input après l'animation
                setTimeout(() => {
                    mobileSearchInput.focus();
                }, 400);
            } else {
                // Si déjà agrandi, effectuer la recherche ou fermer si vide
                const searchTerm = mobileSearchInput.value.trim();
                if (searchTerm) {
                    // Effectuer la recherche
                    console.log('Recherche mobile:', searchTerm);
                    // Ici vous pourrez ajouter la logique de recherche
                } else {
                    // Fermer si le champ est vide
                    closeMobileSearch();
                }
            }
        });
    }

    // Fonction pour fermer la recherche mobile
    function closeMobileSearch() {
        mobileSearchForm.classList.remove('expanded');
        mobileSearchInput.value = '';
        mobileSearchInput.blur();
        isExpanded = false;
    }

    // Gestion de la touche Entrée dans le champ de recherche
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    console.log('Recherche mobile (Entrée):', searchTerm);
                    // Ici vous pourrez ajouter la logique de recherche
                    closeMobileSearch();
                }
            }
        });

        // Fermer si on clique en dehors du champ (perte de focus)
        mobileSearchInput.addEventListener('blur', function() {
            // Délai pour permettre de cliquer sur la loupe
            setTimeout(() => {
                if (isExpanded && this.value.trim() === '') {
                    closeMobileSearch();
                }
            }, 150);
        });
    }

    // Gestion de la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isExpanded) {
                closeMobileSearch();
            }
            if (mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        }
});

// ===== GESTION DES LIENS "VOIR TOUT" =====
    // Ajouter les event listeners aux liens "voir tout"
    const voirToutLinks = document.querySelectorAll('.voir-tout');
    voirToutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Trouver la section correspondante
            const sectionHeader = this.parentElement;
            const carouselContainer = sectionHeader.nextElementSibling;
            const bookRow = carouselContainer.querySelector('.book-row');
            
            if (bookRow) {
                const sectionId = bookRow.id;
                toggleView(sectionId);
            }
        });
    });
});

// ===== FONCTION POUR BASCULER ENTRE VUE CAROUSEL ET VUE ÉTENDUE =====
function toggleView(sectionId) {
    const bookRow = document.getElementById(sectionId);
    if (!bookRow) return;
    
    const carouselContainer = bookRow.parentElement;
    const carouselButtons = carouselContainer.querySelectorAll('.carousel-btn');
    const sectionHeader = carouselContainer.previousElementSibling;
    const voirToutBtn = sectionHeader.querySelector('.voir-tout');
    
    if (bookRow.classList.contains('expanded')) {
        // Retour au mode carousel
        bookRow.classList.remove('expanded');
        voirToutBtn.textContent = 'voir tout';
        
        // Masquer les livres supplémentaires (s'ils existent)
        const hiddenBooks = bookRow.querySelectorAll('.book.hidden-book');
        hiddenBooks.forEach(book => {
            book.style.display = 'none';
        });
        
        // Réafficher les boutons de carousel sur desktop
        if (window.innerWidth > 768) {
            carouselButtons.forEach(btn => {
                btn.style.display = 'block';
            });
        }
    } else {
        // Mode étendu
        bookRow.classList.add('expanded');
        voirToutBtn.textContent = 'voir moins';
        
        // Afficher tous les livres (y compris ceux masqués ou chargés dynamiquement)
        loadAllBooks(sectionId);
        
        // Masquer les boutons de carousel
        carouselButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

// ===== FONCTION POUR CHARGER TOUS LES LIVRES =====
function loadAllBooks(sectionId) {
    const bookRow = document.getElementById(sectionId);
    if (!bookRow) return;

    // Ici, logique pour charger tous les livres depuis la base de données qui récupère les livres


    // Pour l'instant, on affiche simplement les livres déjà présents mais masqués : à effacer quand la logique de chargement sera en place
    const hiddenBooks = bookRow.querySelectorAll('.book.hidden-book, .book[style*="display: none"]');
    hiddenBooks.forEach(book => {
        book.style.display = 'flex';
        book.classList.remove('hidden-book');
    });
}

// ===== FONCTION POUR CRÉER UN ÉLÉMENT LIVRE (optionnelle) =====
function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    bookDiv.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <p>${book.title}</p>
    `;
    return bookDiv;
}

// ===== CAROUSEL DESKTOP (fonction existante) =====
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = 200; // Pixels Ã  faire dÃ©filer
    
    if (direction === 1) {
        // Scroll vers la droite
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    } else {
        // Scroll vers la gauche
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ===== GESTION DU REDIMENSIONNEMENT DE LA FENÊTRE =====
window.addEventListener('resize', function() {
    // Réinitialiser l'affichage des boutons selon la taille d'écran
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    if (window.innerWidth <= 768) {
        // Mobile : toujours masquer les boutons
        carouselButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    } else {
        // Desktop : réafficher seulement si pas en mode étendu
        document.querySelectorAll('.book-row').forEach(row => {
            if (!row.classList.contains('expanded')) {
                const container = row.parentElement;
                const buttons = container.querySelectorAll('.carousel-btn');
                buttons.forEach(btn => {
                    btn.style.display = 'block';
                });
            }
        });
    }
});

// ===== FONCTIONNALITÉ "VOIR TOUT"  AJOUT IA =====
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les liens "voir tout"
    const voirToutLinks = document.querySelectorAll('.voir-tout');
    
    voirToutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Trouver la section parente
            const section = this.closest('.library-section');
            const bookRow = section.querySelector('.book-row');
            const carouselContainer = section.querySelector('.carousel-container');
            const carouselButtons = carouselContainer.querySelectorAll('.carousel-btn');
            
            // Toggle entre mode carousel et mode grille
            if (bookRow.classList.contains('expanded')) {
                // Retour au mode carousel
                bookRow.classList.remove('expanded');
                this.textContent = 'voir tout';
                
                // Réafficher les boutons du carousel
                carouselButtons.forEach(btn => {
                    btn.style.display = 'block';
                });
                
                // Scroll vers le haut de la section
                section.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
            } else {
                // Passage au mode grille étendu
                bookRow.classList.add('expanded');
                this.textContent = 'voir moins';
                
                // Masquer les boutons du carousel
                carouselButtons.forEach(btn => {
                    btn.style.display = 'none';
                });
            }
        });
    });
});
