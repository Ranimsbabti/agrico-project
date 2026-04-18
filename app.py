'''import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

print(f"--- DEBUG: Python cherche ici : {current_dir} ---")
print(f"--- DEBUG: Contenu du dossier : {os.listdir(current_dir)} ---")

from flask import Flask
from flask_cors import CORS

# ESSAI D'IMPORTATION SÉCURISÉ
try:
    from database.db import db_cursor
    print("--- DEBUG: Le dossier 'database' a été trouvé ! ---")
except ImportError as e:
    print(f"--- DEBUG: Erreur d'import : {e} ---")

# Tes Blueprints
from controllers.auth_controller import auth_bp
# ... (le reste de ton code)

from controllers.auth_controller import auth_bp
from controllers.product_controller import products_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(products_bp, url_prefix='/products')

@app.route('/')
def test():
    return {"status": "success", "message": "Serveur Agrico actif !"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)'''

import sys
import os
from flask import Flask
from flask_cors import CORS

# Ajout du chemin pour éviter les erreurs d'import
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import des Blueprints
from controllers.auth_controller import auth_bp
from controllers.product_controller import products_bp
from controllers.order_controller import orders_bp
from controllers.service_controller import services_bp
from controllers.reservation_controller import reservations_bp
from controllers.user_controller import users_bp

app = Flask(__name__)
# On autorise CORS pour que ton Frontend (React/Vue/Flutter) puisse communiquer avec l'API
CORS(app)


# Enregistrement de tous les modules Agrico
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(products_bp, url_prefix='/products')
app.register_blueprint(orders_bp, url_prefix='/orders')
app.register_blueprint(services_bp, url_prefix='/services')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(reservations_bp, url_prefix='/reservations')

@app.route('/')
def home():
    return {
        "status": "success", 
        "message": "Bienvenue sur l'API Agrico !",
        "version": "1.0.0"
    }, 200

if __name__ == "__main__":
    # On lance le serveur
    app.run(debug=True, host='0.0.0.0', port=5000)