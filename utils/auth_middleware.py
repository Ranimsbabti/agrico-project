"""
JWT authentication middleware.
Provides `token_required` decorator and optional role guards.
"""
import jwt
from functools import wraps 
from flask import request, jsonify, g, current_app 
import datetime
import functools
from flask import request, jsonify, g

SECRET_KEY="AGRICO_2026_SECRET_KEY"

def generate_token(user_id, role):
    """Génère un token JWT."""
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    """Décode le token JWT."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except:
        return None
    






















def token_required(f):
    """Decorator: validates Bearer JWT and sets g.user_id / g.user_role."""

    @functools.wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token manquant ou malformé"}), 401

        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expiré"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token invalide"}), 401

        g.user_id = payload["user_id"]
        g.user_role = payload["role"]
        return f(*args, **kwargs)

    return decorated















def roles_required(*roles):
    """Decorator factory: restricts endpoint to specific roles (use after token_required)."""

    def decorator(f):
        @functools.wraps(f)
        def decorated(*args, **kwargs):
            if g.get("user_role") not in roles:
                return jsonify({"error": "Accès refusé"}), 403
            return f(*args, **kwargs)

        return decorated

    return decorator
