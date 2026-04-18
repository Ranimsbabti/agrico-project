from models.service_model import ServiceModel

# Mise à jour avec les noms de colonnes SQL : 'titre' au lieu de 'title', 'actif' au lieu de 'is_available'
ALLOWED_FIELDS = {"titre", "description", "prix", "categorie", "actif", "unite", "disponibilite", "image_url"}

def get_services(params: dict):
    categorie = params.get("categorie")
    prestataire_id = params.get("prestataire_id")
    search = params.get("search")
    
    try:
        limit = min(int(params.get("limit", 20)), 100)
        offset = int(params.get("offset", 0))
    except ValueError:
        limit = 20
        offset = 0

    services = ServiceModel.get_all(categorie, prestataire_id, search, limit, offset)
    formatted_services = []
    for s in services:
        formatted_services.append({
            "id": f"s{s['id']}",
            "titre": s["titre"],
            "categorie": s["categorie"].lower(),
            "image": s.get("image_url") or "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
            "prix": float(s["prix"]),
            "unite": s.get("unite") or "jour",
            "rating": 4.5,
            "nbAvis": 0,
            "prestataire": f"v{s['prestataire_id']}",
            "description": s["description"],
            "disponibilite": "Disponible" if s.get("actif") == 1 else "Indisponible"
        })
    return formatted_services

def get_service(service_id: int) -> dict:
    service = ServiceModel.get_by_id(service_id)
    if not service:
        return {"error": "Service non trouvé"}, 404
    return {"service": service}, 200

def create_service(data: dict, user_id: int, user_role: str) -> dict:
    # Validation des champs requis
    titre = (data.get("titre") or "").strip()
    if not titre:
        return {"error": "Le titre est requis"}, 400

    categorie = (data.get("categorie") or "").strip()
    if not categorie:
        return {"error": "La catégorie est requise"}, 400

    description = (data.get("description") or "").strip()
    if not description:
        return {"error": "La description est requise"}, 400

    unite = (data.get("unite") or "").strip()
    if not unite:
        return {"error": "L'unité est requise"}, 400

    try:
        prix = float(data.get("prix", 0))
        if prix <= 0:
            return {"error": "Le prix doit être supérieur à 0"}, 400
    except (TypeError, ValueError):
        return {"error": "Prix invalide"}, 400

    # Validation de l'image URL (temporairement, on utilise une valeur par défaut)
    image_url = data.get("image_url") or "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"

    # Disponibilité par défaut à 1 (disponible)
    disponibilite = data.get("disponibilite", 1)
    if isinstance(disponibilite, str):
        disponibilite = 1 if disponibilite.lower() in ['true', '1', 'yes'] else 0

    # Création via le modèle adapté
    service_id = ServiceModel.create(
        prestataire_id=user_id,
        titre=titre,
        categorie=categorie,
        description=description,
        prix=prix,
        unite=unite,
        disponibilite=disponibilite,
        image_url=image_url,
        actif=1  # 1 signifie actif, 0 inactif
    )
    return {"message": "Service créé", "service_id": service_id}, 201

def update_service(service_id: int, data: dict, user_id: int, user_role: str) -> dict:
    # Vérification de propriété
    if user_role != "admin" and not ServiceModel.is_owner(service_id, user_id):
        return {"error": "Non autorisé à modifier ce service"}, 403

    # On ne garde que les champs autorisés par le schéma SQL
    fields = {k: v for k, v in data.items() if k in ALLOWED_FIELDS and v is not None}
    if not fields:
        return {"error": "Aucun champ valide fourni"}, 400

    updated = ServiceModel.update(service_id, fields)
    if not updated:
        return {"error": "Service non trouvé ou aucune modification"}, 404
    return {"message": "Service mis à jour"}, 200

def delete_service(service_id: int, user_id: int, user_role: str) -> dict:
    if user_role != "admin" and not ServiceModel.is_owner(service_id, user_id):
        return {"error": "Non autorisé à supprimer ce service"}, 403

    deleted = ServiceModel.delete(service_id)
    if not deleted:
        return {"error": "Service non trouvé"}, 404
    return {"message": "Service supprimé"}, 200