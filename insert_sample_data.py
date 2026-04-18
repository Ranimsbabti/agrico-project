import mysql.connector

# Database configuration
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',  # Empty password as per config
    'database': 'agrico'
}

def insert_sample_data():
    try:
        # Connect to database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Sample users data
        users_data = [
            (1, 'Dupont', 'Jean', 'jean.dupont@email.com', 'pbkdf2:sha256:600000$ZrCMrYx0IBHWUcFn$1978b25a0cc22af0b05f3dd87d7e2e2b658a6f0cc7008d1105903dd6ca6109dc', 'prestataire', '12345678', 'Tunis', 'https://i.pravatar.cc/80?img=1', 'Prestataire agricole expérimenté avec 10 ans d\'expérience.'),
            (2, 'Martin', 'Marie', 'marie.martin@email.com', 'pbkdf2:sha256:600000$ZrCMrYx0IBHWUcFn$1978b25a0cc22af0b05f3dd87d7e2e2b658a6f0cc7008d1105903dd6ca6109dc', 'prestataire', '87654321', 'Sfax', 'https://i.pravatar.cc/80?img=2', 'Spécialiste en arrosage et irrigation moderne.'),
            (3, 'Leroy', 'Pierre', 'pierre.leroy@email.com', 'pbkdf2:sha256:600000$ZrCMrYx0IBHWUcFn$1978b25a0cc22af0b05f3dd87d7e2e2b658a6f0cc7008d1105903dd6ca6109dc', 'fournisseur', '11223344', 'Sousse', 'https://i.pravatar.cc/80?img=3', 'Fournisseur de matériel agricole de qualité.'),
            (4, 'Dubois', 'Sophie', 'sophie.dubois@email.com', 'pbkdf2:sha256:600000$ZrCMrYx0IBHWUcFn$1978b25a0cc22af0b05f3dd87d7e2e2b658a6f0cc7008d1105903dd6ca6109dc', 'fournisseur', '44332211', 'Monastir', 'https://i.pravatar.cc/80?img=4', 'Fournisseur de semences et produits phytosanitaires.')
        ]

        # Insert users
        insert_query = """
        INSERT INTO utilisateurs (id, nom, prenom, email, mdp, role, telephone, localisation, avatar, bio, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        nom=VALUES(nom), prenom=VALUES(prenom), email=VALUES(email), mdp=VALUES(mdp), role=VALUES(role),
        telephone=VALUES(telephone), localisation=VALUES(localisation), avatar=VALUES(avatar), bio=VALUES(bio)
        """

        cursor.executemany(insert_query, users_data)
        conn.commit()

        print(f"Successfully inserted/updated {cursor.rowcount} users")

        cursor.close()
        conn.close()

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    insert_sample_data()