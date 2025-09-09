<main>
  <h1 class="about-title">À propos de Blabla-book</h1>

  <div class="about-container">
    <!-- Mission -->
    <div class="about-mission">
      <h2>Notre Mission</h2>
      <p class="mission-quote">"Rassembler les amoureux du livre dans une communauté bienveillante et passionnée"</p>
    </div>

    <!-- Qui sommes-nous -->
    <div class="about-section">
      <h2>Qui sommes-nous ?</h2>
      <p>Blabla-book est née de la passion commune de quelques amis bibliophiles qui souhaitaient créer un espace dédié aux amoureux de la lecture. Notre plateforme permet à chacun de gérer sa bibliothèque personnelle, de découvrir de nouveaux ouvrages et de partager ses coups de cœur littéraires.</p>
      <p>Nous croyons que la lecture est un voyage personnel mais que le partage d'expériences littéraires enrichit chaque lecteur. C'est pourquoi nous avons conçu Blabla-book comme un lieu d'échange et de découverte.</p>
    </div>

    <!-- Nos valeurs -->
    <div class="about-section">
      <h2>Nos Valeurs</h2>
      <div class="values-grid">
        <div class="value-card">
          <h3>📚 Passion</h3>
          <p>Nous partageons un amour sincère pour les livres et la lecture sous toutes ses formes.</p>
        </div>
        <div class="value-card">
          <h3>🤝 Communauté</h3>
          <p>Nous favorisons les échanges respectueux et enrichissants entre lecteurs.</p>
        </div>
        <div class="value-card">
          <h3>🆓 Accessibilité</h3>
          <p>Notre service est gratuit et accessible à tous les amoureux de la lecture.</p>
        </div>
        <div class="value-card">
          <h3>🔒 Respect</h3>
          <p>Nous protégeons vos données et respectons votre vie privée.</p>
        </div>
      </div>
    </div>

    <!-- Nos fonctionnalités -->
    <div class="about-section">
      <h2>Nos Fonctionnalités</h2>
      <div class="features-grid">
        <div class="feature-item">
          <h3>📖 Bibliothèque personnelle</h3>
          <p>Organisez vos livres lus, en cours et à lire dans votre espace personnel.</p>
        </div>
        <div class="feature-item">
          <h3>🔍 Recherche avancée</h3>
          <p>Trouvez facilement des livres par titre, auteur, genre ou mot-clé.</p>
        </div>
        <div class="feature-item">
          <h3>⭐ Avis et notes</h3>
          <p>Partagez vos impressions et découvrez les avis de la communauté.</p>
        </div>
        <div class="feature-item">
          <h3>💡 Recommandations</h3>
          <p>Recevez des suggestions personnalisées basées sur vos goûts.</p>
        </div>
        <div class="feature-item">
          <h3>📱 Interface responsive</h3>
          <p>Accédez à votre bibliothèque depuis n'importe quel appareil.</p>
        </div>
        <div class="feature-item">
          <h3>🎯 Suivi de lecture</h3>
          <p>Suivez vos progrès et vos statistiques de lecture personnelles.</p>
        </div>
      </div>
    </div>

    <!-- Notre histoire -->
    <div class="about-section">
      <h2>Notre Histoire</h2>
      <div class="history-timeline">
        <div class="timeline-item">
          <h3>2024 - L'idée</h3>
          <p>Tout a commencé autour d'un café entre amis passionnés de lecture. Nous rêvions d'un espace numérique qui allierait gestion personnelle et partage communautaire.</p>
        </div>
        <div class="timeline-item">
          <h3>2025 - Le développement</h3>
          <p>Après des mois de développement et de tests, Blabla-book voit le jour avec ses premières fonctionnalités essentielles.</p>
        </div>
        <div class="timeline-item">
          <h3>Aujourd'hui - L'aventure continue</h3>
          <p>Nous continuons d'améliorer la plateforme en écoutant les retours de notre communauté grandissante de lecteurs passionnés.</p>
        </div>
      </div>
    </div>

    <!-- Rejoignez l'aventure -->
    <div class="about-cta">
      <h2>Rejoignez l'aventure !</h2>
      <p>Que vous soyez un lecteur occasionnel ou un dévoreur de livres, Blabla-book est fait pour vous.</p>
      <div class="cta-buttons">
        <a href="register.html" class="submit-btn">Créer un compte</a>
        <a href="contact.html" class="submit-btn">Nous contacter</a>
      </div>
    </div>
  </div>

  <div class="return-home">
    <a href="index.html" class="submit-btn">Retour à l'accueil</a>
  </div>
</main>

<style>
  /* ===== STYLES POUR LA PAGE "À PROPOS" ===== */

/* Titre principal de la page */
.about-title {
  color: #2c3e50;
  margin: 2rem 0;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 600;
}

/* Conteneur principal du contenu */
.about-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto 2rem;
  max-width: 800px;
}

/* Section mission */
.about-mission {
  text-align: center;
  margin-bottom: 3rem;
}

.about-mission h2 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.6rem;
}

.mission-quote {
  font-size: 1.2em;
  font-style: italic;
  color: #5a6c7d;
}

/* Sections générales */
.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  color: #34495e;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  border-bottom: 2px solid #d4ebf2;
  padding-bottom: 0.5rem;
}

/* Grille des valeurs */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.value-card {
  text-align: center;
  padding: 1.5rem;
  background: rgba(44, 62, 80, 0.05);
  border-radius: 12px;
}

.value-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* Grille des fonctionnalités */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-item h3 {
  color: #5a6c7d;
  margin-bottom: 0.5rem;
}

/* Timeline historique */
.history-timeline {
  border-left: 4px solid #2c3e50;
  padding-left: 2rem;
  margin-left: 1rem;
}

.timeline-item {
  margin-bottom: 2rem;
}

.timeline-item h3 {
  color: #5a6c7d;
  margin-bottom: 0.5rem;
}

/* Section CTA - CORRIGÉE POUR LE RESPONSIVE */
.about-cta {
  text-align: center;
  margin: 3rem auto 2rem;
  padding: 2rem;
  background: rgba(44, 62, 80, 0.05);
  border-radius: 12px;
}

.about-cta h2 {
  color: #34495e;
  margin-bottom: 1rem;
}

.cta-buttons {
  display: flex;
  flex-direction: column; /* Affichage en colonne par défaut */
  gap: 1rem;
  align-items: stretch; /* Étire les boutons pour qu'ils prennent toute la largeur */
  margin-top: 1.5rem;
  width: 100%; /* Prend toute la largeur disponible */
}

.cta-buttons .submit-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 25px;
  text-align: center;
  width: 100%; /* Prend toute la largeur disponible */
  box-sizing: border-box; /* Inclut le padding dans la largeur totale */
  margin: 0; /* Supprime les marges indésirables */
}

/* Bouton de retour */
.return-home {
  text-align: center;
  margin: 2rem auto;
  max-width: 300px;
}

.return-home .submit-btn {
  width: 100%;
  box-sizing: border-box;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  main {
    padding: 0 1rem;
  }

  .about-container {
    padding: 1.5rem;
    margin: 0;
  }

  .about-title {
    font-size: 1.8rem;
  }

  /* Grilles en une seule colonne */
  .values-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  /* Timeline ajustée */
  .history-timeline {
    border-left: 2px solid #2c3e50;
    padding-left: 1rem;
  }

  /* Boutons CTA en colonne (déjà défini par défaut, mais renforcé) */
  .cta-buttons {
    flex-direction: column !important; /* Force la colonne */
    align-items: stretch !important; /* Étire les boutons */
  }

  .cta-buttons .submit-btn {
    width: 100% !important; /* Prend toute la largeur */
    max-width: none !important; /* Supprime toute limitation */
  }

  /* Bouton "Retour à l'accueil" */
  .return-home {
    margin: 1.5rem auto;
  }

  .return-home .submit-btn {
    width: 100%;
    max-width: 300px;
  }
}

</style>