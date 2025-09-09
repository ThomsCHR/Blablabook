// ===== FONCTIONNALITÉ COLLECTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Fonction de filtrage des livres - mise à jour pour .book
    function filterBooks(category) {
        const books = document.querySelectorAll('.book');
        
        books.forEach(book => {
            book.classList.add('fade-out');
            
            setTimeout(() => {
                if (category === 'all') {
                    book.style.display = 'flex';
                } else {
                    const bookCategory = book.getAttribute('data-category');
                    if (bookCategory === category) {
                        book.style.display = 'flex';
                    } else {
                        book.style.display = 'none';
                    }
                }
                
                if (book.style.display !== 'none') {
                    book.classList.remove('fade-out');
                    book.classList.add('fade-in');
                }
            }, 150);
            
            setTimeout(() => {
                book.classList.remove('fade-in', 'fade-out');
            }, 450);
        });
    }

    // Gestion des boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les livres
            const category = this.getAttribute('data-filter');
            filterBooks(category);
        });
    });

    // Gestion des boutons "Ajouter à ma bibliothèque"
    function handleAddToLibrary(button, bookTitle) {
        // Animation du bouton
        button.textContent = '✓ Ajouté !';
        button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        button.style.borderColor = '#27ae60';
        button.style.color = 'white';
        button.disabled = true;

        // Afficher la notification
        showNotification('"' + bookTitle + '" ajouté à votre bibliothèque !');
        
        // Réinitialiser le bouton après 3 secondes
        setTimeout(() => {
            button.textContent = '+ Ajouter';
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
            button.disabled = false;
        }, 3000);
    }

    // Fonction pour afficher les notifications
    function showNotification(message) {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Afficher avec animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Masquer après 4 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Ajouter les événements aux boutons d'ajout - CORRIGÉ pour .book
    const addButtons = document.querySelectorAll('.add-to-library-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Utiliser .book au lieu de .book-container
            const book = this.closest('.book');
            const bookTitle = book.querySelector('strong').textContent;
            handleAddToLibrary(this, bookTitle);
        });
    });

    // Initialiser avec tous les livres visibles
    filterBooks('all');
});

// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
        });

        mobileMenuClose.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
        });

        // Fermer le menu en cliquant sur l'overlay
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
        });
    }
});