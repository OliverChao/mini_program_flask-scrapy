from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
import time
# from datetime import datetime
import pickle


class Application(Flask):
    def __init__(self, import_name, static_path=None, static_url_path=None, static_folder='static', template_folder='templates', instance_path=None, instance_relative_config=False, root_path=None):
        super().__init__(import_name, static_path=static_path, static_url_path=static_url_path, static_folder=static_folder, template_folder=template_folder, instance_path=instance_path, instance_relative_config=instance_relative_config, root_path=root_path)

        self.config.from_pyfile('local_setting.py')
        # db.init_app(self)


app = Flask(__name__)
app.config.from_pyfile('local_setting.py')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:toor@127.0.0.1/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer,primary_key=True)
    token = db.Column(db.String(100), nullable=False ,unique=True)
    avatar_url = db.Column(db.String(250))
    nickname = db.Column(db.PickleType)
    province = db.Column(db.String(50))
    city = db.Column(db.String(50))
    gender = db.Column(db.Integer,default=3)
    permission = db.Column(db.Boolean,default=True)
    user_since = db.Column(db.Integer,default=(int(time.time())))
    last_seen = db.Column(db.Integer)

    articles = db.relationship('Article', back_populates='user')
    tasks = db.relationship('Task',cascade='save-update,merge')


class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True)
    # title = db.Column(db.String(50), index=True)
    body = db.Column(db.Text)
    reading_num = db.Column(db.Integer)
    comment_num = db.Column(db.Integer)
    like_num = db.Column(db.Integer)
    # 使用python 形式的 时间戳存储 数据库
    article_since = db.Column(db.Integer,index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',back_populates='articles')
    images = db.relationship('Image',cascade='save-update,merge,delete') #cascade=all
    comments = db.relationship('Comment',cascade='delete')


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer,primary_key=True)
    imgurl = db.Column(db.String(150))
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))
    # fromarticle = db.relationship('Article',back_populates='image')


class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer,primary_key=True)
    comment = db.Column(db.Text)
    comment_since = db.Column(db.Integer,default=int(time.time()))
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))


class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer,primary_key=True)
    task = db.Column(db.String(200))
    task_since = db.Column(db.Integer)
    uer_id = db.Column(db.Integer,db.ForeignKey('user.id'))


if __name__ =='__main__':
    import time
    start  = time.time()
    db.drop_all()
    db.create_all()
    end1 = time.time()-start
    print('create_table time ::::',end1)
    start = time.time()
    u1 = User(token='b6f8027da6d99e167aa5f0aeb5d14b99e1cbede5',avatar_url="https://wx.qlogo.cn/mmopen/vi_32/gvquf5kIpnoWutBlMqwuXVVVbG7Jiajvs0uj3mdCFGb1n83464ib8oQQTmfvk4du1ItQMBUbLMiaQaC0esuWhWEicw/132",nickname='『天亮了🌙说晚安づ', province='Shandong',city='Zibo',gender=1)

    u2 = User(token='eaef9606e57a313b94b40bf2f51c6add582ad085',avatar_url="https://wx.qlogo.cn/mmopen/vi_32/gvquf5kIpnoWutBlMqwuXVVVbG7Jiajvs0uj3mdCFGb1n83464ib8oQQTmfvk4du1ItQMBUbLMiaQaC0esuWhWEicw/132",nickname='test1', province='Beijing',city='Beijing',gender=2)


    a1 = Article(body='Oliber loves Annabelle',reading_num=12,comment_num=23,article_since='1231451234',like_num=99)
    
    a2 = Article(body='Oliver will marry Annabelle. And they will have a pretty lovely child~',reading_num=12,comment_num=23,article_since='1531451234',like_num=99)

    t1 = Task(task='学习英语—++准备 六级！！！')
    t2 = Task(task='学习英语—++准备 留学！！！')
    t3 = Task(task='学习python++准备lalala！！！')


    i1 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_42.jpg')
    i2 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_08.jpg')
    i3 = Image(imgurl='http://img.desktx.com:8089/d/file/phone/meinv/20170117/small0c57161a5b05460f2ac57f7e410d12821484635479.jpg')

    c1 = Comment(comment='you are really young boy')
    c2 = Comment(comment='you are really young girl')
    
    u1.tasks.extend([t1,t2,t3])
    a1.images.append(i1)
    a2.images.append(i2)

    a1.comments.extend([c1,c2])
    a2.user = u1
    a1.user = u1
    db.session.add(u1) 
    db.session.add(u2) 
    # db.session.add_all([i1,i2,i3]) 
    db.session.add_all([a1,a2]) 
    db.session.add_all([c1,c2])
    db.session.commit()

    print('*'*20)

    print('create_table time ::::',time.time()-start)
    