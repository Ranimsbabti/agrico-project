from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import UserRepository
from utils.auth_middleware import generate_token

ALLOWED_ROLES = {'agriculteur', 'fournisseur', 'prestataire', 'admin'}
PROFILE_FIELDS = {'nom', 'prenom', 'email', 'telephone', 'localisation', 'bio'}

'''def register_user(data: dict):
    nom = (data.get('nom') or '').strip()
    prenom = (data.get('prenom') or '').strip()
    email = (data.get('email') or '').strip() or None

    phone = (data.get('telephone') or '').strip() or None
    if phone and len(phone) > 8:
        return {'error': 'Le numéro de téléphone est trop long (max 8)'}, 400
    
    password = data.get('password') or ''
    
    role = (data.get('role') or 'agriculteur').strip().lower()
    if role not in ALLOWED_ROLES:
        return {'error': 'Rôle invalide'}, 400
    
    loc = (data.get('localisation') or '').strip() or None

    if not nom or not prenom:
        return {'error': 'Le nom et le prénom sont requis'}, 400
    if not email and not phone:
        return {'error': 'Email ou téléphone requis'}, 400
    if len(password) < 6:
        return {'error': 'Mot de passe trop court'}, 400
    
    pwd_hash = generate_password_hash(password)

    try:
        user_id = UserRepository.create(
            nom=nom, prenom=prenom, email=email, mdp=pwd_hash, 
            role=role, telephone=phone, localisation=loc
        )
        return {'message': 'Utilisateur créé', 'user_id': user_id}, 201
    except Exception as e:
        #Si l'email ou le téléphone existe déjà (contrainte unique en sql)
        return {'error': 'Cet email ou ce numéro de téléphone est déjà utilisé'}, 409
    '''

import mysql.connector
from werkzeug.security import generate_password_hash


def register_user(data):
    try:
        # 1. Extraction des données du dictionnaire 'data' 
        nom = data.get('nom')
        prenom = data.get('prenom')
        email = data.get('email')
        telephone = data.get('telephone')
        password = data.get('mdp') # Le mot de passe envoyé par le front [cite: 7]
        
        # 2. Validation de base
        if not all([nom, prenom, email, telephone, password]):
            return {"error": "Tous les champs obligatoires doivent être remplis"}, 400

        # 3. Hashage du mot de passe pour la sécurité
        # Il est fortement déconseillé de stocker le mot de passe en clair
        hashed_password = generate_password_hash(password)

        # 4. Connexion à la base de données (A adapter selon votre configuration)
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="agrico"
        )
        cursor = db.cursor()

        # 5. Vérification si l'email existe déjà
        cursor.execute("SELECT id FROM utilisateurs WHERE email = %s", (email,))
        if cursor.fetchone():
            return {"error": "Cet email est déjà utilisé"}, 409

        # 6. Insertion des données
        # Note : On fournit des chaînes vides pour 'avatar' et 'bio' car ils sont 'NOT NULL'
        query = """
            INSERT INTO utilisateurs 
            (nom, prenom, email, mdp, telephone, role, avatar, bio, is_agriculteur, is_prestataire, is_fournisseur) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            nom, 
            prenom, 
            email, 
            hashed_password, 
            telephone, 
            'membre', # Rôle par défaut
            '',       # Avatar vide par défaut
            '',       # Bio vide par défaut
            1, 1, 1   # Valeurs par défaut selon votre schéma
        )

        cursor.execute(query, values)
        db.commit()

        cursor.close()
        db.close()

        return {"message": "Utilisateur créé avec succès !"}, 201

    except Exception as e:
        return {"error": str(e)}, 500

#ranim
def login_user(login_identifier, password):
    #On récupère l'utilisateur complet (avec le mdp pour vérifier) , on verifie le mdp
    user_data = UserRepository.find_by_email_or_phone(login_identifier)

    if not user_data:
        return {"error": "Utilisateur non trouvé"}, 404

    if not check_password_hash(user_data['mdp'], password):
        return {"error": "Mot de passe incorrect"}, 401
    
    #ngeneriw token bch il assure eli l user yo93od connected
    token=generate_token(user_data['id'],user_data['role'])

    del user_data['mdp'] 
    return {
        "message": "Connexion réussie",
        "user": user_data,  # On peut renvoyer les infos sans risque
        "token": token  #On inclut le token dans la réponse
    }, 200

def update_profile(user_id, data):
    updatable_fields = {k: v for k, v in data.items() if k in PROFILE_FIELDS}
    if not updatable_fields:
        return {"error": "Aucun champ valide à modifier"}, 400
        
    success = UserRepository.update(user_id, updatable_fields)
    if success:
        return {"message": "Profil mis à jour"}, 200
    return {"error": "Erreur lors de la mise à jour"}, 500