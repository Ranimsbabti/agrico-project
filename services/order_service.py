from models.order_model import CommandesRepository
from models.product_model import ProductModel

def create_order(data: dict, user_id: int, user_role: str):
    if user_role != 'agriculteur':
        return {'error': 'Seuls les agriculteurs peuvent commander'}, 403

    product_id = data.get('produit_id')
    product = ProductModel.get_by_id(product_id)
    
    if not product or not product.get('disponible'):
        return {'error': 'Produit indisponible'}, 404

    try:
        quantite = int(data.get('quantite', 1))
        prix_total = float(product['prix']) * quantite
    except (ValueError,TypeError):
        return {'error':'Quantité ou prix invalide'},400

    order_id = CommandesRepository.create(
        fournisseur_id=product['fournisseur_id'],
        agriculteur_id=user_id,
        produit_id=product['id'],
        quantite=quantite,
        prix_total=prix_total,
        statut='en attente'
    )
    return {'message': 'Commande envoyée', 'order_id': order_id}, 201