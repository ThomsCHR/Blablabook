<script>
  import { onMount } from "svelte";
  import {
    adminStats,
    adminUsers,
    recentActivity,
    activeSection,
    fetchAdminStats,
    fetchUsers,
    fetchRecentActivity,
    deleteUser as apiDeleteUser,
    toggleUserStatus as apiToggleUserStatus,
  } from "../stores/admin.js";
  import AdminGuard from "../components/AdminGuard.svelte";
  import Notification from "../components/Notification.svelte";

  let currentSection = "dashboard";
  let searchQuery = "";
  let filteredUsers = [];

  // État des notifications
  let notification = {
    show: false,
    message: "",
    type: "success",
  };

  // Fonction pour afficher une notification
  function showNotification(message, type = "success") {
    notification = {
      show: true,
      message,
      type,
    };
  }

  // Abonnement aux stores
  $: stats = $adminStats;
  $: users = $adminUsers;
  $: activity = $recentActivity;

  // Filtrage des utilisateurs
  $: {
    if (searchQuery) {
      filteredUsers = $adminUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filteredUsers = $adminUsers;
    }
  }

  // Navigation entre les sections
  function showSection(section) {
    currentSection = section;
    activeSection.set(section);
  }

  // Chargement des données d'administration
  onMount(async () => {
    let hasAnyError = false;
    let errorMessages = [];

    // Charger les statistiques
    try {
      await fetchAdminStats();
      console.log("✅ Statistiques chargées avec succès");
    } catch (error) {
      console.error("❌ Erreur stats:", error);
      errorMessages.push("Statistiques");
      hasAnyError = true;
    }

    // Charger les utilisateurs
    try {
      await fetchUsers();
      console.log("✅ Utilisateurs chargés avec succès");
    } catch (error) {
      console.error("❌ Erreur users:", error);
      errorMessages.push("Utilisateurs");
      hasAnyError = true;
    }

    // Charger l'activité récente
    try {
      await fetchRecentActivity();
      console.log("✅ Activité récente chargée avec succès");
    } catch (error) {
      console.error("❌ Erreur activity:", error);
      errorMessages.push("Activité récente");
      hasAnyError = true;
    }

    // Afficher une notification seulement si TOUTES les requêtes ont échoué
    if (hasAnyError) {
      if (errorMessages.length === 3) {
        showNotification(
          "Erreur lors du chargement de toutes les données d'administration",
          "error"
        );
      } else {
        showNotification(
          `Certaines données n'ont pas pu être chargées: ${errorMessages.join(", ")}`,
          "warning"
        );
      }
    } else {
      showNotification(
        "Données d'administration chargées avec succès",
        "success"
      );
    }
  });

  async function deleteUser(userId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      const success = await apiDeleteUser(userId);
      if (success) {
        showNotification("Utilisateur supprimé avec succès", "success");
      } else {
        showNotification(
          "Erreur lors de la suppression de l'utilisateur",
          "error"
        );
      }
    }
  }

  async function toggleUserStatus(userId) {
    const user = $adminUsers.find((u) => u.id === userId);
    if (user) {
      const newStatus = user.status === "Actif" ? "Inactif" : "Actif";
      const success = await apiToggleUserStatus(userId, newStatus);
      if (success) {
        showNotification(
          `Statut de ${user.name} changé vers ${newStatus}`,
          "success"
        );
      } else {
        showNotification("Erreur lors du changement de statut", "error");
      }
    }
  }
</script>

<svelte:head>
  <title>Blabla-book - Administration</title>
</svelte:head>

<AdminGuard>
  <main>
    <div class="admin-dashboard">
      <!-- Sidebar navigation -->
      <aside class="admin-sidebar">
        <h3>Administration</h3>
        <nav class="admin-nav">
          <button
            class="admin-nav-item {currentSection === 'dashboard'
              ? 'active'
              : ''}"
            on:click={() => showSection("dashboard")}
          >
            📊 Tableau de bord
          </button>

          <button
            class="admin-nav-item {currentSection === 'users' ? 'active' : ''}"
            on:click={() => showSection("users")}
          >
            👥 Utilisateurs
          </button>
        </nav>
      </aside>

      <!-- Main content area -->
      <div class="admin-content">
        {#if currentSection === "dashboard"}
          <!-- Dashboard Section -->
          <div id="dashboard-section" class="admin-section">
            <div class="admin-header">
              <h2>Tableau de bord</h2>
            </div>

            <!-- Statistiques -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{stats.totalUsers || "0"}</div>
                <div class="stat-label">Utilisateurs Total</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">{stats.activeUsers || "0"}</div>
                <div class="stat-label">Utilisateurs Actifs</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">{stats.totalBooks || "0"}</div>
                <div class="stat-label">Livres Total</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">{stats.totalBooksInLibraries || "0"}</div>
                <div class="stat-label">Livres en Bibliothèques</div>
              </div>
            </div>

            <!-- Recent activity -->
            <h4 style="color: #2c3e50; margin-bottom: 1rem">
              Activité récente
            </h4>
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {#each $recentActivity as activityItem (activityItem.id)}
                  <tr>
                    <td>{activityItem.action}</td>
                    <td>{activityItem.user}</td>
                    <td>{activityItem.date}</td>
                    <td
                      ><span class="status-badge status-active">Actif</span></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        {#if currentSection === "users"}
          <!-- Users Section -->
          <div id="users-section" class="admin-section">
            <div class="admin-header">
              <h2>Gestion des utilisateurs</h2>
            </div>

            <div class="filter-section">
              <h4>Filtres</h4>
              <div class="filter-controls">
                <input
                  type="text"
                  class="filter-input"
                  placeholder="Rechercher un utilisateur..."
                  bind:value={searchQuery}
                />
                <select class="filter-input">
                  <option>Tous les statuts</option>
                  <option>Actifs</option>
                  <option>Inactifs</option>
                  <option>Suspendus</option>
                </select>
                <button class="action-btn">Rechercher</button>
              </div>
            </div>

            <table class="admin-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Inscription</th>
                  <th>Livres</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each filteredUsers as user (user.id)}
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joinDate}</td>
                    <td>{user.booksCount || 0}</td>
                    <td>
                      <span
                        class="status-badge status-{user.status.toLowerCase()}"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button
                          class="action-btn edit"
                          on:click={() => toggleUserStatus(user.id)}
                          title={user.status === "Actif"
                            ? "Désactiver"
                            : "Activer"}
                        >
                          Modifier
                        </button>
                        <button
                          class="action-btn delete"
                          on:click={() => deleteUser(user.id)}
                          title="Supprimer"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  </main>
</AdminGuard>

<!-- Composant de notification -->
<Notification
  bind:show={notification.show}
  message={notification.message}
  type={notification.type}
/>

<style>
</style>
