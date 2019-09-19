from application import app,db 
import pymysql
import time
# from datetime import datetime


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(100), nullable=False ,unique=True)
    avatar_url = db.Column(db.String(250),default=app.config['DEFAULT_AVATAR'])
    nickname = db.Column(db.PickleType)
    province = db.Column(db.String(50))
    city = db.Column(db.String(50))
    gender = db.Column(db.Integer,default=3)
    permission = db.Column(db.Boolean,default=True)
    #  
    learn_time = db.Column(db.Integer,default=0)

    # 使用 db.DateTime() 来存储 时间 ，，改用 时间戳( 10位 不记秒 )  pandas
    # member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    # last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    # 使用 时间戳 存储 用户 创建 和 最后 使用时间
    user_since = db.Column(db.Integer,default=(int(time.time())))
    last_seen = db.Column(db.Integer)

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

# class Task(db.Model):
#     __tablename__ = 'task'
#     id = db.Column(db.Integer,primary_key=True)
#     task = db.Column(db.PickleType)
#     task_since = db.Column(db.Integer)
#     # task_state = db.Column(db.Boolean,default=False)
#     uer_id = db.Column(db.Integer,db.ForeignKey('user.id'))

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
    pass
    # db.drop_all()

        # db.create_all()
    # import time
    # start  = time.time()
    # db.drop_all()
    # db.create_all()
    # end1 = time.time()-start
    # print('create_table time ::::',end1)
    # start = time.time()
    # u1 = User(openid='wajdkasjdawfada',avatar_url="https://wx.qlogo.cn/mmopen/vi_32/gvquf5kIpnoWutBlMqwuXVVVbG7Jiajvs0uj3mdCFGb1n83464ib8oQQTmfvk4du1ItQMBUbLMiaQaC0esuWhWEicw/132",nickname='『天亮了说晚安づ', province='Shandong',city='Zibo')

    # a1 = Article(body='Oliber loves Annabelle',reading_num=12,comment_num=23,article_since='1231451234',like_num=99)
    
    # a2 = Article(body='Oliver will marry Annabelle. And they will have a pretty lovely child~',reading_num=12,comment_num=23,article_since='1531451234',like_num=99)

    # t1 = Task(task='学习英语—++准备 六级！！！')
    # t2 = Task(task='学习英语—++准备 留学！！！')
    # t3 = Task(task='学习python++准备lalala！！！')


    # i1 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_42.jpg')
    # i2 = Image(imgurl='http://img.article.pchome.net/00/29/20/31/pic_lib/wm/Sakura_08.jpg')
    # i3 = Image(imgurl='http://img.desktx.com:8089/d/file/phone/meinv/20170117/small0c57161a5b05460f2ac57f7e410d12821484635479.jpg')

    # c1 = Comment(comment='you are really young boy')
    # c2 = Comment(comment='you are really young girl')
    
    # u1.tasks.extend([t1,t2,t3])
    # a1.images.append(i1)
    # a2.images.append(i2)

    # a1.comments.extend([c1,c2])
    # a2.user = u1
    # a1.user = u1
    # db.session.add(u1) 
    # # db.session.add_all([i1,i2,i3]) 
    # db.session.add_all([a1,a2]) 
    # db.session.add_all([c1,c2])
    # db.session.commit()

    # print('*'*20)

    # print('create_table time ::::',time.time()-start)
    