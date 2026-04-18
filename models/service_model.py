from databse.db import db_cursor

class ServiceModel:
    @staticmethod
    def get_all(categorie=None, prestataire_id=None, search=None, limit=20, offset=0):
        # Utilisation de 'actif' au lieu de 'is_available'
        conditions = ["s.actif = 1"]
        params = []

        if categorie:
            conditions.append("s.categorie = %s")
            params.append(categorie)
        if prestataire_id:
            conditions.append("s.prestataire_id = %s")
            params.append(prestataire_id)
        if search:
            conditions.append("(s.titre LIKE %s OR s.description LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])

        where = "WHERE " + " AND ".join(conditions)
        params.extend([limit, offset])

        with db_cursor() as cur:
            cur.execute(
                f"""
                SELECT s.*, u.nom AS prestataire_nom, u.prenom AS prestataire_prenom
                FROM services s
                LEFT JOIN utilisateurs u ON s.prestataire_id = u.id
                {where}
                ORDER BY s.created_at DESC
                LIMIT %s OFFSET %s
                """,
                params,
            )
            return cur.fetchall()

    @staticmethod
    def get_by_id(service_id):
        with db_cursor() as cur:
            cur.execute(
                """
                SELECT s.*, u.nom AS prestataire_nom, u.prenom AS prestataire_prenom
                FROM services s
                JOIN utilisateurs u ON s.prestataire_id = u.id
                WHERE s.id = %s
                """,
                (service_id,),
            )
            return cur.fetchone()

    @staticmethod
    def create(prestataire_id, titre, categorie, description, prix, unite, disponibilite, image_url, actif=1):
        with db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO services (prestataire_id, titre, categorie, description, prix, unite, disponibilite, actif, image_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (prestataire_id, titre, categorie, description, prix, unite, disponibilite, actif, image_url),
            )
            return cur.lastrowid

    @staticmethod
    def is_owner(service_id, user_id):
        with db_cursor() as cur:
            cur.execute(
                "SELECT id FROM services WHERE id = %s AND prestataire_id = %s",
                (service_id, user_id),
            )
            return cur.fetchone() is not None
        
    #ranim
    @staticmethod
    def update(service_id, fields):
        if not fields:
            return False
        
        # Construction dynamique des colonnes à mettre à jour
        keys = [f"{k} = %s" for k in fields.keys()]
        query = f"UPDATE services SET {', '.join(keys)} WHERE id = %s"
        params = list(fields.values())
        params.append(service_id)

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.rowcount > 0
        
    #ranim
    @staticmethod
    def delete(service_id):
        with db_cursor() as cur:
            cur.execute("DELETE FROM services WHERE id = %s", (service_id,))
            return cur.rowcount > 0