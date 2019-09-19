from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Server, Manager
import os

class Application(Flask):
    def __init__(self,import_name):
        super().__init__(import_name)
        self.config.from_pyfile('config/base_setting.py')

        if 'opt_config' in os.environ:
            self.config.from_pyfile('config/{env}_setting.py'.format(env=os.environ['opt_config']))
        
        else:    # this line should be removed 
            self.config.from_pyfile('config/local_setting.py')
        db.init_app(self)

db = SQLAlchemy()
app = Application(__name__)

@app.route('/')
def index():
    return 'hahah'


manager = Manager(app)
manager.add_command('runserver', Server(host=app.config['SERVER_HOST'],port=app.config['SERVER_PORT'], use_debugger=True))
