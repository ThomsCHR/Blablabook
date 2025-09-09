<main>
  <div class="login-container">
    <div class="form-section">
      <form>
        <h2>Oups... on dirait que ton livre n'est pas chez nous... Veux-tu le rajouter à notre collection ?</h2>

        <div class="form-group">
          <input type="text" id="title" placeholder="Titre :" required>
        </div>

        <div class="form-group">
          <input type="text" id="author" placeholder="Auteur :" required>
        </div>

        <div class="form-group">
          <input type="text" id="genre" placeholder="Genre :">
        </div>
        
        <div class="form-group">
          <input type="file" id="img-book" accept="image/*" required style="display: none;">
          <label for="img-book" class="file-input-label">
            <span class="file-input-text">Première de couverture : Choisir un fichier</span>
          </label>
        </div>
        
        <div class="form-group">
          <input type="text" id="publication_date" placeholder="date de publication :" required>

          <div class="form-group form-group-summary">
            <textarea id="summary" placeholder="Résumé" rows="5" required></textarea>
          </div>

        </div>


        <button type="submit" class="submit-btn">Continuer</button>
      </form>
    </div>
  </div>
</main>
