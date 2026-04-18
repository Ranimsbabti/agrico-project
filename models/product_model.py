from databse.db import db_cursor


class ProductModel:
    @staticmethod
    def get_all(categorie=None, fournisseur_id=None, search=None, limit=20, offset=0):
        conditions = ["p.disponible = 1"]
        params = []

        if categorie:
            conditions.append("p.categorie = %s")
            params.append(categorie)
        if fournisseur_id:
            conditions.append("p.fournisseur_id = %s")
            params.append(fournisseur_id)
        if search:
            conditions.append("(p.titre LIKE %s OR p.description LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])

        where = "WHERE " + " AND ".join(conditions)
        params.extend([limit, offset])

        sql=f"""
            SELECT p.*, u.nom AS fournisseur_nom, u.prenom AS fournisseur_prenom
            FROM produits p
            LEFT JOIN utilisateurs u ON p.fournisseur_id = u.id
            {where}
            ORDER BY p.created_at DESC
            LIMIT %s OFFSET %s
        """
        with db_cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()

        '''with db_cursor() as cur:
            cur.execute(
                f"""
                SELECT p.*, u.nom AS fournisseur_nom, u.prenom AS fournisseur_prenom
                FROM produits p
                LEFT JOIN utilisateurs u ON p.fournisseur_id = u.id
                {where}
                ORDER BY p.created_at DESC
                LIMIT %s OFFSET %s
                """,
                params,
            )
            return cur.fetchall()'''

    @staticmethod
    def create(fournisseur_id, titre, categorie, description, prix, stock, disponible, image_url):
        with db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO produits (fournisseur_id, titre, categorie, description, prix, stock, disponible, image_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (fournisseur_id, titre, categorie, description, prix, stock, disponible, image_url),
            )
            return cur.lastrowid

    @staticmethod
    def get_by_id(product_id):
        with db_cursor() as cur:
            cur.execute(
                """
                SELECT p.*, u.nom AS fournisseur_nom, u.prenom AS fournisseur_prenom
                FROM produits p
                LEFT JOIN utilisateurs u ON p.fournisseur_id = u.id
                WHERE p.id = %s
                """,
                (product_id,),
            )
            return cur.fetchone()

    @staticmethod
    def update(product_id, fields):
        if not fields:
            return False

        keys = [f"{k} = %s" for k in fields.keys()]
        query = f"UPDATE produits SET {', '.join(keys)} WHERE id = %s"
        params = list(fields.values())
        params.append(product_id)

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.rowcount > 0

    @staticmethod
    def delete(product_id):
        with db_cursor() as cur:
            cur.execute("DELETE FROM produits WHERE id = %s", (product_id,))
            return cur.rowcount > 0

    @staticmethod
    def is_owner(product_id, fournisseur_id):
        with db_cursor() as cur:
            cur.execute(
                "SELECT id FROM produits WHERE id = %s AND fournisseur_id = %s",
                (product_id, fournisseur_id),
            )
            return cur.fetchone() is not None