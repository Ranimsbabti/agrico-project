from flask import Blueprint, request, jsonify, g
from services import auth_service
from utils.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    required_fields = ['nom', 'prenom', 'email', 'mdp', 'telephone']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Champs requis manquants"}), 400
    # S'assurer que le frontend envoie les champs requis pour l'inscription
    result, status = auth_service.register_user(data)
    return jsonify(result), status


'''@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    result, status = auth_service.login_user(data)
    return jsonify(result), status'''

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    login_id = data.get('email') or data.get('telephone')
    password = data.get('password')
    print(f"Login attempt: login_id={login_id}, password={password}")
    
    if not login_id or not password:
        return jsonify({"error": "Identifiant et mot de passe requis"}), 400

    result, status = auth_service.login_user(login_id, password)
    print(f"Login result: {result}, status: {status}")
    return jsonify(result), status

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.get_json(silent=True) or {}
    result, status = auth_service.update_profile(g.user_id, data)
    return jsonify(result), status