import os
basedir = os.path.abspath(os.path.dirname(__file__))
from pathlib import Path
from dotenv import load_dotenv

class Config(object):
    #API key
    GOOGLE_API_KEY = 'AIzaSyD_DLfNKMBcpJQfngDNUIinbMoGCJxveNc'

    # Creation of secret key
    SECRET_KEY = '\xeff\xfb\x8d\x13%\xf9\x85\x8b\x19\x90h\x0c\xd9[\xb1\x9e\xc5Y\x1bD\xd52\x0b'

    #Set specs for SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(object):
    #API key
    GOOGLE_API_KEY = 'AIzaSyAPKuskUUyGRgJFuTiuhqnxl98p_2UuOuY'

    # Creation of secret key
    SECRET_KEY = '\xeff\xfb\x8d\x13%\xf9\x85\x8b\x19\x90h\x0c\xd9[\xb1\x9e\xc5Y\x1bD\xd52\x0b'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'Tests/test.db')