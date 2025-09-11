<script>
  import { user as userStore } from "../../stores/user.js";
  import { addBookToUser } from "../../api/book.js";

  export let book; // { id, title, author, image, ... }
  let menuOpen = false;
  let saving = false;
  let error = "";

  function setLocalStatus(kind) {
    book = { ...book, _status: kind === "read" ? "Lu" : "À lire" };
  }

  async function setStatus(kind) {
    try {
      error = "";
      const me = $userStore;
      if (!me?.id) {
        window.location.hash = "#/login";
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "#/login";
        return;
      }

      const status_id = kind === "read" ? 1 : 2;
      saving = true;

      await addBookToUser(me.id, { title: book.title, status_id });

      setLocalStatus(kind);
      menuOpen = false;
    } catch (e) {
      console.error("[BookDetail] setStatus error:", e);
      error = e?.message || "Impossible d'ajouter ce livre.";
      alert(error);
    } finally {
      saving = false;
    }
  }
</script>

<main class="book-details-page">
  <div class="book-details-container">
    <!-- Couverture -->
    <div class="left-section">
      <div class="cover-container">
        <div
          class="cover-placeholder"
          style={book?.image
            ? `background-image:url(${book.image});background-size:cover;background-position:center;`
            : ""}
        >
          <!-- Conteneur englobant pour le menu dropdown -->
          <div
            class="book-menu"
            role="button"
            tabindex="0"
            on:mouseenter={() => (menuOpen = true)}
            on:mouseleave={() => (menuOpen = false)}
            on:keydown={(e) => e.key === "Enter" && (menuOpen = !menuOpen)}
          >
            <button
              class="book-menu-trigger"
              disabled={saving}
              title="Ajouter à ma bibliothèque"
            >
              {saving ? "…" : "+"}
            </button>
            {#if menuOpen}
              <ul class="book-menu-dropdown" role="menu">
                <li>
                  <button
                    class="book-status-btn"
                    role="menuitem"
                    on:click={() => setStatus("to_read")}
                    disabled={saving}
                  >
                    À lire
                  </button>
                </li>
                <li>
                  <button
                    class="book-status-btn"
                    role="menuitem"
                    on:click={() => setStatus("read")}
                    disabled={saving}
                  >
                    Lu
                  </button>
                </li>
              </ul>
            {/if}
          </div>
          {#if !book?.image}
            <div class="cover-label">Pas de couverture</div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Infos (pas un formulaire, juste présentation) -->
    <div class="right-section">
      <div class="book-info">
        <h1 class="book-title">{book?.title || "Titre inconnu"}</h1>
        <p class="book-author">
          de <strong>{book?.author || "Auteur inconnu"}</strong>
        </p>

        {#if book?.genres?.length}
          <p class="book-genres">
            <span class="label">Genres :</span>
            {#each book.genres as g, i}
              <span class="chip">{g.label}</span>
            {/each}
          </p>
        {/if}

        {#if book?.publication_date}
          <p class="book-year">
            <span class="label">Année :</span>
            {book.publication_date}
          </p>
        {/if}

        <div class="book-summary">
          <h2>Résumé</h2>
          <p>{book?.summary || "Aucun résumé disponible"}</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Assurez-vous que le conteneur du menu soit positionné relativement */
  .book-menu {
    position: relative;
    display: inline-block;
  }

  /* Styles pour le dropdown */
  .book-menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 120px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .book-menu-dropdown li {
    margin: 0;
    padding: 0;
  }

  .book-status-btn {
    display: block;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    color: #333;
  }

  .book-status-btn:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  .book-status-btn:disabled {
    color: #999;
    cursor: not-allowed;
  }

  .book-info {
    padding: 1.5rem 2rem;
    border-left: 3px solid #2c3e50;
  }

  .book-title {
    margin: 0;
    font-size: 1.8rem;
    color: #2c3e50;
    font-family: "Playfair Display", serif;
  }

  .book-author {
    margin: 0.2rem 0 1rem;
    font-size: 1.1rem;
    color: #34495e;
  }

  .label {
    font-weight: 600;
    color: #2c3e50;
  }

  .book-genres {
    margin: 0.5rem 0;
  }

  .chip {
    display: inline-block;
    background: #77c9dc;
    color: white;
    font-size: 0.85rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    margin-right: 0.4rem;
  }

  .book-year {
    margin: 0.5rem 0 1rem;
  }

  .book-summary h2 {
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
    color: #2c3e50;
  }

  .book-summary p {
    line-height: 1.6;
    color: #2c3e50;
  }
</style>
