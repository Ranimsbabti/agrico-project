from flask import Blueprint, jsonify
from databse.db import db_cursor

users_bp = Blueprint("users", __name__)

@users_bp.route('/vendeurs', methods=['GET'])
def list_vendeurs():
    with db_cursor() as cur:
        cur.execute(
            "SELECT id, nom, prenom, email, role, telephone, localisation, avatar, bio FROM utilisateurs WHERE role IN (%s, %s)",
            ("fournisseur", "prestataire"),
        )
        users = cur.fetchall()

    formatted = {}
    for u in users:
        formatted[f"v{u['id']}"] = {
            "id": f"v{u['id']}",
            "nom": f"{u['prenom'].capitalize()} {u['nom'].capitalize()}",
            "avatar": u.get("avatar") or "https://i.pravatar.cc/80",
            "localisation": u.get("localisation") or "Tunisie",
            "telephone": f"+216 {u.get('telephone') or ''}",
            "email": u.get("email") or "",
            "bio": u.get("bio") or "Prestataire agricole expérimenté.",
            "nbAvis": 0
        }
    return jsonify(formatted), 200
