<script>
  import { user as userStore } from "../../stores/user.js";
  import { addBookToUser } from "../../api/book.js";

  export let book; // { id, title, author, image, ... }
  let menuOpen = false;
  let saving = false;
  let error = "";
  let confirmation = ""; // message temporaire

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

      // confirmation
      confirmation = `« ${book.title} » a bien été ajouté dans ta bibliothèque !`;
      setTimeout(() => (confirmation = ""), 3000);
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
              {#if saving}
                …
              {:else if book?._status}
                ✔
              {:else}
                +
              {/if}
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

        {#if confirmation}
          <div class="confirmation-message">{confirmation}</div>
        {/if}
      </div>
    </div>
  </div>
</main>
