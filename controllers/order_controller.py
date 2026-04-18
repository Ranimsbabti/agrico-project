from flask import Blueprint, request, jsonify, g
from services import order_service
from utils.auth_middleware import token_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
@token_required
def create_order():
    data = request.get_json(silent=True) or {}
    # Le service utilisera g.user_id comme agriculteur_id
    result, status = order_service.create_order(data, g.user_id, g.user_role)
    return jsonify(result), status

@orders_bp.route('/orders', methods=['GET'])
@token_required
def list_orders():
    # Récupère les commandes selon si l'utilisateur est fournisseur ou agriculteur
    result, status = order_service.list_orders(g.user_id, g.user_role)
    return jsonify(result), status

@orders_bp.route('/orders/<int:order_id>/decision', methods=['PATCH'])
@token_required
def decide_order(order_id):
    data = request.get_json(silent=True) or {}
    # Statuts SQL : 'en attente', 'confirmé', 'refusé', 'livré'
    result, status = order_service.update_order_status(order_id, data.get('status'), g.user_id, g.user_role)
    return jsonify(result), status

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order_detail(order_id):
    result, status = order_service.get_order_by_id(order_id, g.user_id, g.user_role)
    return jsonify(result), status