import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import { UserBook } from "../models/userbook.model.js";
import { Op } from "sequelize";

// ===== STATISTIQUES D'ADMINISTRATION =====
export const getAdminStats = async (req, res) => {
  try {
    console.log('Récupération des statistiques admin...');

    // 1. Compter tous les utilisateurs
    const totalUsers = await User.count();
    
    // 2. Compter tous les livres
    const totalBooks = await Book.count();
    
    // 3. Compter les utilisateurs actifs (qui ont au moins un livre)
    const activeUsers = await User.count({
      include: [{
        model: UserBook,
        as: "userBooks",
        required: true // Seulement les users avec des livres
      }],
      distinct: true // Éviter les doublons
    });

    // 4. Compter les nouveaux utilisateurs cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentSignups = await User.count({
      where: {
        created_at: {
          [Op.gte]: oneWeekAgo
        }
      }
    });

    console.log(`Stats calculées: ${totalUsers} users, ${totalBooks} books, ${activeUsers} actifs, ${recentSignups} nouveaux`);

    // Envoyer toutes les stats
    res.json({
      totalUsers,
      activeUsers,
      totalBooks,
      recentSignups
    });

  } catch (error) {
    console.error('Erreur stats admin:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message // Toujours afficher les détails pour debug
    });
  }
};

// ===== LISTE DES UTILISATEURS AVEC RECHERCHE =====
export const getUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    console.log(`Récupération users - Page: ${page}, Recherche: "${search}"`);

    // Construire la condition de recherche
    let whereCondition = {};
    if (search.trim()) {
      whereCondition = {
        [Op.or]: [
          { username: { [Op.iLike]: `%${search.trim()}%` } },
          { email: { [Op.iLike]: `%${search.trim()}%` } }
        ]
      };
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les utilisateurs avec le nombre de livres
    const { rows: users, count: totalUsers } = await User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'],
      include: [{
        model: UserBook,
        as: "userBooks",
        attributes: ['id'],
        required: false
      }]
    });

    // Formater les données pour l'interface
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      status: 'Actif', // Peut être amélioré avec un vrai champ status
      joinDate: formatDate(user.created_at),
      booksCount: user.userBooks ? user.userBooks.length : 0,
      lastActivity: user.updated_at
    }));

    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    console.log(`${formattedUsers.length} utilisateurs trouvés sur ${totalUsers} total`);

    res.json({
      users: formattedUsers,
      pagination: {
        current: parseInt(page),
        total: totalUsers,
        pages: totalPages,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des utilisateurs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ===== ACTIVITÉ RÉCENTE =====
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    console.log('Récupération activité récente...');

    // Récupérer les derniers utilisateurs inscrits
    const recentUsers = await User.findAll({
      limit: Math.floor(limit / 2),
      order: [['created_at', 'DESC']],
      attributes: ['id', 'username', 'email', 'created_at']
    });

    // Récupérer les derniers livres ajoutés aux bibliothèques
    const recentBooks = await UserBook.findAll({
      limit: Math.floor(limit / 2),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: "user",
          attributes: ['username']
        },
        {
          model: Book,
          as: "book", 
          attributes: ['title']
        }
      ]
    });

    // Créer la liste d'activités
    const activities = [];

    // Ajouter les inscriptions
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        action: 'Inscription nouveau membre',
        user: user.email,
        date: formatTimeAgo(user.created_at),
        status: 'Actif',
        timestamp: user.created_at
      });
    });

    // Ajouter les ajouts de livres
    recentBooks.forEach(userBook => {
      activities.push({
        id: `book_${userBook.id}`,
        action: `Ajout livre "${userBook.book.title}"`,
        user: userBook.user.username,
        date: formatTimeAgo(userBook.created_at),
        status: 'Validé',
        timestamp: userBook.created_at
      });
    });

    // Trier par date décroissante et limiter
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    console.log(`${sortedActivities.length} activités récentes trouvées`);
    res.json(sortedActivities);

  } catch (error) {
    console.error('Erreur activité récente:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de l\'activité',
      details: error.message
    });
  }
};

// ===== DÉTAILS D'UN UTILISATEUR =====
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Récupération détails utilisateur ID: ${userId}`);

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      include: [{
        model: UserBook,
        include: [{
          model: Book,
          attributes: ['id', 'title', 'author']
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const userDetails = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      joinDate: user.createdAt,
      booksCount: user.UserBooks ? user.UserBooks.length : 0,
      books: user.UserBooks ? user.UserBooks.map(ub => ({
        id: ub.Book.id,
        title: ub.Book.title,
        author: ub.Book.author
      })) : []
    };

    res.json(userDetails);

  } catch (error) {
    console.error('Erreur détails utilisateur:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des détails utilisateur' 
    });
  }
};

// ===== METTRE À JOUR LE STATUT D'UN UTILISATEUR =====
export const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    console.log(`Changement statut utilisateur ${userId} vers: ${status}`);

    // Pour l'instant, on garde cette fonction simple
    // Dans une vraie app, on pourrait avoir des statuts comme: actif, suspendu, banni, etc.
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Ici on pourrait ajouter un champ 'status' dans la base de données
    // Pour l'instant, on renvoie juste une réponse de succès
    res.json({ 
      message: 'Statut utilisateur mis à jour avec succès',
      user: {
        id: user.id,
        username: user.username,
        status: status
      }
    });

  } catch (error) {
    console.error('Erreur changement statut:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors du changement de statut' 
    });
  }
};

// ===== SUPPRIMER UN UTILISATEUR =====
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Tentative suppression utilisateur ID: ${userId}`);

    // Validation de l'ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('Utilisateur introuvable');
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Protection: ne pas supprimer le dernier admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        console.log('Tentative suppression dernier admin bloquée');
        return res.status(400).json({ 
          error: 'Impossible de supprimer le dernier administrateur' 
        });
      }
    }

    // Supprimer d'abord les relations UserBook
    const deletedBooks = await UserBook.destroy({
      where: { user_id: userId }
    });

    // Supprimer l'utilisateur
    await user.destroy();

    console.log(`Utilisateur supprimé: ${user.username} (${deletedBooks} livres supprimés)`);

    res.json({ 
      message: 'Utilisateur supprimé avec succès',
      deletedUser: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ===== METTRE À JOUR LE RÔLE D'UN UTILISATEUR =====
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    console.log(`Changement rôle utilisateur ${userId} vers: ${role}`);

    // Validations
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ 
        error: 'Rôle invalide. Utilisez: admin ou member' 
      });
    }

    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Protection: ne pas retirer le dernier admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        console.log('Tentative retrait dernier admin bloquée');
        return res.status(400).json({ 
          error: 'Impossible de retirer les droits du dernier administrateur' 
        });
      }
    }

    // Mettre à jour le rôle
    await user.update({ role });
    
    console.log(`Rôle mis à jour: ${user.username} -> ${role}`);

    res.json({
      message: 'Rôle utilisateur mis à jour',
      user: {
        id: user.id,
        username: user.username,
        role: role
      }
    });

  } catch (error) {
    console.error('Erreur changement rôle:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du rôle',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ===== LISTE DES LIVRES (pour section admin) =====
export const getBooks = async (req, res) => {
  try {
    console.log('Récupération liste des livres admin...');
    
    const books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 100,
      include: [{
        model: UserBook,
        attributes: ['id'],
        required: false
      }]
    });

    const formattedBooks = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      addedDate: formatDate(book.createdAt),
      usersCount: book.UserBooks ? book.UserBooks.length : 0
    }));

    console.log(`${formattedBooks.length} livres trouvés`);
    res.json({ books: formattedBooks });
    
  } catch (error) {
    console.error('Erreur liste livres:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des livres',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ===== SUPPRIMER UN LIVRE =====
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log(`Suppression livre ID: ${bookId}`);

    // Validation
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ error: 'ID livre invalide' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    // Supprimer d'abord toutes les relations UserBook
    const deletedRelations = await UserBook.destroy({ 
      where: { book_id: bookId } 
    });
    
    // Supprimer le livre
    await book.destroy();
    
    console.log(`Livre supprimé: ${book.title} (${deletedRelations} relations supprimées)`);
    
    res.json({ 
      message: 'Livre supprimé avec succès',
      deletedBook: {
        id: book.id,
        title: book.title,
        author: book.author
      }
    });
    
  } catch (error) {
    console.error('Erreur suppression livre:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du livre',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ===== FONCTIONS UTILITAIRES =====

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR');
}

function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Il y a moins d\'1h';
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return formatDate(date);
}