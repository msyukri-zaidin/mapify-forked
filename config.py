import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    # Creation of secret key
    SECRET_KEY = os.environ.get('SECRET_KEY') or "not-so-secret-,-secret-key"

    #Set specs for SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False