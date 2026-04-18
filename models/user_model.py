from dataclasses import dataclass
from typing import Optional
from databse.db import db_cursor

@dataclass
class User:
    id: Optional[int]
    nom: str
    prenom: str
    email: str
    role: str
    telephone: str
    localisation: str
    avatar: Optional[str] = None
    bio: Optional[str] = None

class UserRepository:
    @staticmethod
    def create(nom, prenom, email, mdp, role, telephone, localisation, avatar='', bio=''):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO utilisateurs (nom, prenom, email, mdp, role, telephone, localisation, avatar, bio)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''',
                (nom, prenom, email, mdp, role, telephone, localisation, avatar, bio),
            )
            return cur.lastrowid

    @staticmethod
    def get_by_id(user_id):
        with db_cursor() as cur:
            cur.execute(
                'SELECT id, nom, prenom, email, role, telephone, localisation, avatar, bio FROM utilisateurs WHERE id = %s',
                (user_id,),
            )
            return cur.fetchone()

    @staticmethod
    def find_by_email_or_phone(identifier):
        with db_cursor() as cur:
            cur.execute(
                'SELECT id, nom, prenom, email, mdp, role, telephone, localisation, avatar, bio FROM utilisateurs WHERE email = %s OR telephone = %s LIMIT 1',
                (identifier, identifier),
            )
            row = cur.fetchone()
            if row:
                return {
                    'id': row['id'],
                    'nom': row['nom'],
                    'prenom': row['prenom'],
                    'email': row['email'],
                    'mdp': row['mdp'],
                    'role': row['role'],
                    'telephone': row['telephone'],
                    'localisation': row['localisation'],
                    'avatar': row['avatar'],
                    'bio': row['bio']
                }
            return None
        
    #mise a jour du profil (ranim)
    @staticmethod
    def update(user_id, fields):
        if not fields:
            return False
        
        # Construction dynamique pour mettre à jour nom, localisation, bio, etc.
        keys = [f"{k} = %s" for k in fields.keys()]
        query = f"UPDATE utilisateurs SET {', '.join(keys)} WHERE id = %s"
        params = list(fields.values())
        params.append(user_id)

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.rowcount > 0