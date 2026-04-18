from models.reservation_model import ReservationRepository
from models.service_model import ServiceModel

def create_reservation(data: dict, user_id: int, user_role: str):
    if user_role!='agriculteur':
        return{'error':'Seuls les agriculteurs peuevent réserver'},403
    
    service_id = data.get('service_id')
    if not service_id:
        return {'error':'ID du service manquant'},400
    
    service = ServiceModel.get_by_id(service_id)
    if not service:
        return {'error': 'Service non trouvé'}, 404
    
    date_res=data.get('date_reservation')
    h_debut=data.get('heure_debut')
    h_fin=data.get('heure_fin')

    if not all([date_res ,h_debut,h_fin]):
        return {'error':'Date , heure de debut et fin sont requises'},400
    quantite=float(data.get('quantite',1))
    calcul_prix_total=float(service['prix']) * quantite

    try:
        res_id = ReservationRepository.create(
            agriculteur_id=user_id,
            service_id=service_id,
            prestataire_id=service['prestataire_id'],
            date_reservation=data.get('date_reservation'), #YYYY-MM-DD
            heure_debut=data.get('heure_debut'), #front traja3 format HH:MM ou HH:MM:SS
            heure_fin=data.get('heure_fin'),
            prix_total=calcul_prix_total, #!!!!!!!!!!!!!!!!!!
            statut='en attente',
            notes=(data.get('notes') or "").strip()
        )
        return {'message':'reservation effectuée avec succées',"reservation_id":res_id},201
    except Exception as e:
            return {'error': 'Erreur lors de la création de la réservation'},500
    
def list_reservations(user_id: int, user_role: str):
        reservations = ReservationRepository.get_all_by_user(user_id, user_role)
        return {"reservations": reservations}, 200

def update_status(reservation_id: int, new_status: str, user_id: int, user_role: str):
    res = ReservationRepository.get_by_id(reservation_id)
    if not res:
        return {"error": "Réservation introuvable"}, 404

    if new_status in ['confirme', 'refuse'] and user_role != 'prestataire':
        return {"error": "Seul le prestataire peut valider cette action"}, 403
    
    if new_status == 'annule' and user_role != 'agriculteur':
        return {"error": "Seul l'agriculteur peut annuler sa réservation"}, 403

    success = ReservationRepository.update_status(reservation_id, new_status)
    if success:
        return {"message": f"Statut mis à jour : {new_status}"}, 200
    return {"error": "Échec de la mise à jour"}, 500

def get_by_id(reservation_id: int, user_id: int, user_role: str):
    res = ReservationRepository.get_by_id(reservation_id)
    if not res:
        return {"error": "Réservation non trouvée"}, 404
    
    #vérifier que l'utilisateur est lié à cette réservation
    if user_role == 'agriculteur' and res['agriculteur_id'] != user_id:
        return {"error": "Accès non autorisé"}, 403
    if user_role == 'prestataire' and res['prestataire_id'] != user_id:
        return {"error": "Accès non autorisé"}, 403
        
    return {"reservation": res}, 200