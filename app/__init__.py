from flask import Flask
from config import TestConfig, Config, ProductionConfig
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
import os


app = Flask(__name__)
if os.getenv('FLASK_ENV') == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'

if __name__ == "__main__":
    app.run(host='0.0.0.0')
    
from app import routes, models
