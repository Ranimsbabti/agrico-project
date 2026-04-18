from databse.db import db_cursor


class CommandesRepository:
    @staticmethod
    def create(fournisseur_id, agriculteur_id, produit_id, quantite, prix_total, statut='en attente'):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO commandes (fournisseur_id, agriculteur_id, produit_id, quantite, prix_total, statut)
                VALUES (%s, %s, %s, %s, %s, %s)
                ''',
                (fournisseur_id, agriculteur_id, produit_id, quantite, prix_total, statut),
            )
            return cur.lastrowid

    @staticmethod
    def list_for_user(user_id, role):
        query = '''
            SELECT c.*, p.titre AS produit_titre,
                   u.nom AS agriculteur_nom, u.prenom AS agriculteur_prenom
            FROM commandes c
            JOIN produits p ON p.id = c.produit_id
            JOIN utilisateurs u ON u.id = c.agriculteur_id
        '''
        params = []
        if role == 'fournisseur':
            query += ' WHERE c.fournisseur_id = %s'
        else:
            query += ' WHERE c.agriculteur_id = %s'
        
        query += ' ORDER BY c.date_commande DESC'
        params.append(user_id)

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()
        
    @staticmethod
    def update_status(order_id, new_status):
    # new_status doit être 'confirme', 'refuse' ou 'livre'
        with db_cursor() as cur:
            cur.execute(
                'UPDATE commandes SET statut = %s WHERE id = %s',
                (new_status, order_id)
            )
            return cur.rowcount > 0