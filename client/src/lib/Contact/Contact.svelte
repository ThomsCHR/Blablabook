<main>
  <h1 class="contact-title">Contactez-nous</h1>

  <div class="contact-container">
    <div class="contact-grid">
      <div class="contact-info">
        <h2>Nos coordonnées</h2>

        <div class="info-item">
          <h3>📍 Adresse</h3>
          <p>Blabla-book SARL<br>
          XXX Rue des Livres<br>
          75000 Paris, France</p>
        </div>

        <div class="info-item">
          <h3>📞 Téléphone</h3>
          <p><a href="tel:+33123456789" class="contact-link">+33 1 XX XX XX XX</a></p>
        </div>

        <div class="info-item">
          <h3>✉️ Email</h3>
          <p><a href="XXX" class="contact-link">XXX@blabla-book.fr</a></p>
        </div>

        <div class="info-item">
          <h3>🕒 Horaires d'ouverture</h3>
          <p>Lundi - Vendredi : 9h00 - 9h02<br>
          Samedi : 9H00 - 9H01<br>
          Dimanche : Fermé</p>
        </div>
      </div>
      <div class="contact-form">
        <h2>Envoyez-nous un message</h2>

        <form class="form-container">
          <div class="form-group">
            <label for="name">Nom complet *</label>
            <input type="text" id="name" name="name" required>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="subject">Sujet *</label>
            <select id="subject" name="subject" required>
              <option value="">Choisissez un sujet</option>
              <option value="question">Question générale</option>
              <option value="bug">Signaler un bug</option>
              <option value="suggestion">Suggestion d'amélioration</option>
              <option value="partenariat">Proposition de partenariat</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" rows="5" required placeholder="Décrivez votre demande..."></textarea>
          </div>

          <button type="submit" class="submit-btn">Envoyer le message</button>
        </form>
      </div>
    </div>
  </div>

  <div class="return-home">
    <a href="#/" class="submit-btn">Retour à l'accueil</a>
  </div>
</main>