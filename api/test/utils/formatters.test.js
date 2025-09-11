import { describe, it, expect } from 'vitest';
import { formatDate, formatTimeAgo } from '../../utils/formatters.js';

// ===== TESTS DES FONCTIONS DE FORMATAGE =====

describe('formatDate', () => {
  it('devrait formater une date en format francais', () => {
    // creation d'une date specifique
    const date = new Date('2024-03-15T10:20:30Z');

    // PREPARER : formater la date
    const resultat = formatDate(date);

    // VERIFIER : le resultat doit etre au format francais
    expect(resultat).toBe('15/03/2024');
  });

  it('devrait fonctionner avec une date actuelle', () => {
    // ARRANGE 
    const maintenant = new Date();

    // ACT
    const resultat = formatDate(maintenant);

    // ASSERT : Pour verifier que ca contient des chiffres
    expect(resultat).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe('formatTimeAgo', () => {
    it('devrait afficher "À l\'instant" pour maintenant', () => {
      // ARRANGE
      const maintenant = new Date();

      // ACT
      const resultat = formatTimeAgo(maintenant);

      // ASSERT
      expect(resultat).toBe("À l\'instant");
    });
    it('devrat afficher "Il y a 5 min" pour 5 minutes', () => {
      // ARRANGE
      const maintenant = new Date();
      const ilYa5Minutes = new Date(maintenant.getTime() - 5 * 60 * 1000);

      // ACT
      const resultat = formatTimeAgo(ilYa5Minutes);

      // ASSERT
      expect(resultat).toBe("Il y a 5 min");
    });

    it('devrait afficher "Il y a 2h" pour 2 heures', () => {
      // ARRANGE
      const maintenant = new Date();
      const ilYa2Heures = new Date(maintenant.getTime() - 2 * 60 * 60 * 1000);

      // ACT
      const resultat = formatTimeAgo(ilYa2Heures);

      // ASSERT
      expect(resultat).toBe("Il y a 2h");
    });

    it('devrait afficher "Il y a 3j" pour 3 jours', () => {
      // ARRANGE
      const maintenant = new Date();
      const ilYa3Jours = new Date(maintenant.getTime() - 3 * 24 * 60 * 60 * 1000);

      // ACT
      const resultat = formatTimeAgo(ilYa3Jours);

      // ASSERT
      expect(resultat).toBe("Il y a 3j");
    });

    it('devrait afficher la date complete pour il y a plus d\'une semaine', () => {
      // ARRANGE
      const maintenant = new Date();
      const ilYa10Jours = new Date(maintenant.getTime() - 10 * 24 * 60 * 60 * 1000);

      // ACT
      const resultat = formatTimeAgo(ilYa10Jours);

      // ASSERT la date doit etre au format DD/MM/YYYY
      expect(resultat).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
});

