from databse.db import db_cursor
class ReservationRepository:
    @staticmethod
    def create(agriculteur_id, service_id, prestataire_id, date_res, h_debut, h_fin, prix, notes):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO reservations (agriculteur_id, service_id, prestataire_id, date_reservation, 
                                        heure_debut, heure_fin, prix_total, statut, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'en attente', %s)
                ''',
                (agriculteur_id, service_id, prestataire_id, date_res, h_debut, h_fin, prix, notes),
            )
            return cur.lastrowid
        
    #pour recuperer les reservations(ranim)
    @staticmethod 
    def list_for_user(user_id, role):
        #On adapte la jointure selon qui demande la liste
        #Si prestataire:on veut voir le nom de l'agriculteur qui a réservé
        #Si agriculteur on veut voir le nom du prestataire et le titre du service
        sql = """
            SELECT r.*, s.titre AS service_titre, 
                   u.nom AS partenaire_nom, u.prenom AS partenaire_prenom
            FROM reservations r
            JOIN services s ON r.service_id = s.id
        """
        
        if role == 'prestataire':
            sql += " JOIN utilisateurs u ON r.agriculteur_id = u.id WHERE r.prestataire_id = %s"
        else:
            sql += " JOIN utilisateurs u ON r.prestataire_id = u.id WHERE r.agriculteur_id = %s"
        
        sql += " ORDER BY r.date_reservation DESC, r.heure_debut DESC"
        
        with db_cursor() as cur:
            cur.execute(sql, (user_id,))
            return cur.fetchall()
        
    #permet au prest de valider our refuser la commande (ranim) 
    @staticmethod
    def update_status(reservation_id, new_status):
        # new_status : 'confirme', 'refuse' ou 'termine'
        with db_cursor() as cur:
            cur.execute(
                'UPDATE reservations SET statut = %s WHERE id = %s',
                (new_status, reservation_id)
            )
            return cur.rowcount > 0