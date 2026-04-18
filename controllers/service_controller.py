from flask import Blueprint, request, jsonify, g
from services import service_service
from utils.auth_middleware import token_required, roles_required

services_bp = Blueprint("services", __name__)

@services_bp.route("/tous_services", methods=["GET"])
def list_services():
    # Le service renvoie un tableau formaté compatible avec le frontend
    services = service_service.get_services(request.args)
    return jsonify(services), 200

@services_bp.route("/<int:service_id>", methods=['GET'])
def get_service(service_id):
    # Public : Détails d'un service spécifique
    result, status = service_service.get_service(service_id)
    return jsonify(result), status

@services_bp.route("", methods=['POST'])
@token_required
@roles_required('prestataire', 'admin')
def create_service():
    data = request.get_json(silent=True) or {}
    # g.user_id sera utilisé comme prestataire_id
    result, status = service_service.create_service(data, g.user_id, g.user_role)
    return jsonify(result), status  

@services_bp.route("/<int:service_id>", methods=["PUT"])
@token_required
def update_service(service_id):
    data = request.get_json(silent=True) or {}
    result, status = service_service.update_service(service_id, data, g.user_id, g.user_role)
    return jsonify(result), status


@services_bp.route("/<int:service_id>", methods=["DELETE"])
@token_required
def delete_service(service_id):
    result, status = service_service.delete_service(service_id, g.user_id, g.user_role)
    return jsonify(result), status