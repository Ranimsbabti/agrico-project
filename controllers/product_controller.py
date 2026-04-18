from flask import Blueprint, request, jsonify, g
from models.product_model import ProductModel
from services import product_service
from utils.auth_middleware import token_required

products_bp = Blueprint("products", __name__)

@products_bp.route("/tous_produits", methods=["GET"])
def list_products():
    # Le service filtrera par 'categorie' (SQL) au lieu de 'category_id'
    result, status = product_service.get_products(request.args)
    return jsonify(result), status

@products_bp.route("/tousProduits", methods=["GET"])
def get_produits():
    products = ProductModel.get_all()
    
    formatted_produits = []
    for p in products:
        disponible_value = p.get("disponible")
        formatted_produits.append({
            "id": f"p{p['id']}",
            "titre": p["titre"],
            "categorie": p["categorie"].lower(),
            "image": p.get("image_url") or "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
            "prix": float(p["prix"]),
            "rating": 4.5,
            "nbAvis": 0,
            "fournisseur": f"v{p['fournisseur_id']}",
            "stock": int(p["stock"]),
            "disponible": str(disponible_value) == "1",
            "description": p["description"]
        })
    return jsonify(formatted_produits)

@products_bp.route("/<int:product_id>", methods=['GET'])
def get_product(product_id):
    result, status = product_service.get_product(product_id)
    return jsonify(result), status

@products_bp.route("", methods=['POST'])
@token_required
def create_product():
    data = request.get_json(silent=True) or {}
    result, status = product_service.create_product(data, g.user_id, g.user_role)
    return jsonify(result), status

@products_bp.route("/<int:product_id>", methods=["PUT"])
@token_required
def update_product(product_id):
    data = request.get_json(silent=True) or {}
    result, status = product_service.update_product(product_id, data, g.user_id, g.user_role)
    return jsonify(result), status

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(product_id):
    result, status=product_service.delete_product(product_id, g.user_id)
    return jsonify(result),status
   
