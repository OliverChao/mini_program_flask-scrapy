from api import api as api_blueprint
from application import app

app.register_blueprint(api_blueprint,url_prefix='/api')
