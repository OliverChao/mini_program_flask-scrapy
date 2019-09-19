from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
import time
# from datetime import datetime
import pickle



app = Flask(__name__)
app.config.from_pyfile('base_setting.py')
app.config.from_pyfile('local_setting.py')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:toor@127.0.0.1/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer,primary_key=True)
    token = db.Column(db.String(100), nullable=False ,unique=True)
    avatar_url = db.Column(db.String(250),default=app.config['DEFAULT_AVATAR'])
    nickname = db.Column(db.PickleType)
    province = db.Column(db.String(50))
    city = db.Column(db.String(50))
    gender = db.Column(db.Integer,default=3)
    permission = db.Column(db.Boolean,default=True)
    user_since = db.Column(db.Integer,default=(int(time.time())))
    last_seen = db.Column(db.Integer)
    learn_time = db.Column(db.Integer,default=0)
    
    articles = db.relationship('Article', back_populates='user',cascade='all,delete-orphan')
    tasks = db.relationship('Task',cascade='save-update,merge,delete,delete-orphan')
    comments = db.relationship('Comment',back_populates='user',cascade='all,delete-orphan')

class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True)
    # title = db.Column(db.String(50), index=True)
    body = db.Column(db.PickleType)
    reading_num = db.Column(db.Integer,default=0)
    comment_num = db.Column(db.Integer,default=0)
    like_num = db.Column(db.Integer,default=0)
    # 使用python 形式的 时间戳存储 数据库
    article_since = db.Column(db.Integer,index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',back_populates='articles')
    images = db.relationship('Image',cascade='all,delete-orphan') #cascade=all
    comments = db.relationship('Comment',cascade='all,delete-orphan')

class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer,primary_key=True)
    imgurl = db.Column(db.String(150))
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))
    # fromarticle = db.relationship('Article',back_populates='image')

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer,primary_key=True)
    comment = db.Column(db.PickleType)
    comment_since = db.Column(db.Integer,default=int(time.time()))
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    user = db.relationship('User',back_populates='comments')

    
class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.PickleType)
    # task = db.Column(db.PickleType)
    time = db.Column(db.Integer)
    color = db.Column(db.String(20))
    # task_since = db.Column(db.Integer)
    url = db.Column(db.String(100))
    target = db.Column(db.PickleType)
    condition = db.Column(db.Boolean,default=False)
    experience = db.Column(db.PickleType)
    fail_reason = db.Column(db.PickleType)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))


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
    
    a2 = Article(body='Oliver will marry Annabelle. And they will have a pretty lovely child~',reading_num=12,comment_num=23,article_since='1331451234',like_num=99)

    a3 = Article(body='Oliber loves Annabelle',reading_num=12,comment_num=23,article_since='1431451234',like_num=99)
    
    a4 = Article(body='Oliver will marry Annabelle. And they will have a pretty lovely child~',reading_num=12,comment_num=23,article_since='1531451234',like_num=99)

    # t1 = Task(task='学习英语—++准备 六级！！！')
    # t2 = Task(task='学习英语—++准备 留学！！！')
    # t3 = Task(task='学习python++准备lalala！！！')
    t1 = Task(name="运动",url="http://www.pic.com",time=1500,target="生活有度，人生添寿",color="ac92ec",condition=False,experience="无",fail_reason="无")


    i1 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_42.jpg')
    i2 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_08.jpg')
    i3 = Image(imgurl='http://img.desktx.com:8089/d/file/phone/meinv/20170117/small0c57161a5b05460f2ac57f7e410d12821484635479.jpg')

    c1 = Comment(comment='you are really young boy')
    c2 = Comment(comment='you are really young girl')
    

    u1.comments.extend([c1,c2])
    
    u1.tasks.append(t1)
    a1.images.append(i1)
    a2.images.append(i2)

    a1.comments.extend([c1,c2])

    u1.articles.extend([a1,a2,a3,a4])
    db.session.add(u1) 
    db.session.add(u2) 

    db.session.add_all([a1,a2]) 
    db.session.add_all([c1,c2])
    db.session.commit()
    
    print('*'*20)

    print('create_table time ::::',time.time()-start)
    
