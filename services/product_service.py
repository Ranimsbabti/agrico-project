from models.product_model import ProductModel

ALLOWED_FIELDS = {"titre", "description", "prix", "stock", "categorie", "disponible", "image_url"}

def create_product(data: dict, user_id: int, user_role: str):

    titre = (data.get("titre") or "").strip()
    if not titre:
        return {"error": "Le titre est requis"}, 400
    if len(titre)>100:
        titre=titre[:100]

    try:
        prix=float(data.get("prix",0))
        stock=int(data.get("stock",0))
    except(ValueError,TypeError):
        return{'error':"le prix et le stock doivent etre des nombres valides"},400
    

    product_id = ProductModel.create(
        fournisseur_id=user_id,
        titre=titre,
        categorie=(data.get("categorie") or "")[:100],
        description=data.get("description") or "",
        prix=prix,
        stock=stock,
        disponible=1,
        image_url=data.get("image_url") or ""
    )
    return {"message": "Produit créé", "product_id": product_id}, 201

def get_products(args):
    categorie = args.get('categorie')
    search = args.get('search')
    
    try:
        limit = int(args.get('limit', 20))
        offset = int(args.get('offset', 0))
    except ValueError:
        limit, offset = 20, 0

    products = ProductModel.get_all(
        categorie=categorie, 
        search=search, 
        limit=limit, 
        offset=offset
    )
    
    return {"products": format_products(products)}, 200

def format_products(products):
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
    return formatted_produits


def get_product(product_id):
    product = ProductModel.get_by_id(product_id)
    if not product:
        return {"error": "Produit non trouvé"}, 404

    formatted = format_products([product])[0]
    return formatted, 200


def update_product(product_id, data, user_id, user_role):
    if not ProductModel.is_owner(product_id, user_id):
        return {"error": "Accès non autorisé ou produit inexistant"}, 403

    update_data = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    
    if not update_data:
        return {"error": "Aucune donnée valide à modifier"}, 400

    if "prix" in update_data:
        try:
            update_data["prix"] = float(update_data["prix"])
        except ValueError:
            return {"error": "Prix invalide"}, 400

    success = ProductModel.update(product_id, update_data)
    
    if success:
        return {"message": "Produit mis à jour avec succès"}, 200
    return {"error": "Erreur lors de la mise à jour"}, 500

#ranim

def delete_product(product_id,user_id):
    if not ProductModel.is_owner(product_id,user_id):
        return {"error":"acces non autorisé ou produit inexistent"},403
    success=ProductModel.delete(product_id)
    if success:
        return{"message":"produit supprime avec succes"},200
    return {"error":"Erruer lors de la supression"},500