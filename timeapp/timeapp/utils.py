from .models.define_db import *
import time
import random
import hashlib
import urllib.parse

basedir = 'https://www.oliverlovesannabelle.club/'+'static/spyder_data/'

def form_imageObj_from_list(img_list):
    for item in img_list:
        img_url = urllib.parse.urljoin(basedir,item['path'])
        yield Image(imgurl=img_url)


def form_commentObj_from_list(comment_list):
    for item in comment_list:
        content = item['content']
        comment_since = int(time.time()) - random.randint(360,5200)
        author = item['author']
        u = check_or_create(author)
        try:
            c = Comment(comment=content, comment_since=comment_since)
            c.user = u
        except :
            yield None
        else:
            yield c


def combindRelation(u, articleObj, commentObjs, imageObjs):
    l_com = list(commentObjs)
    articleObj.comments.extend(l_com)
    articleObj.comment_num = len(l_com)
    reading_num  = random.randint(0,162)
    articleObj.reading_num = reading_num
    articleObj.like_num = random.randint(0,reading_num)
    articleObj.images.extend(imageObjs)
    u.articles.append(articleObj)

    db.session.add(u)
    db.session.commit()
    return 


def registerFunction(userBaseInfo, token):
    if not userBaseInfo:
        return -1
    u = User()
    u.token = token
    u.avatar_url = userBaseInfo.get('avatarUrl',app.config['DEFAULT_AVATAR'])
    u.province = userBaseInfo.get('province','')
    u.city = userBaseInfo.get('city','')
    u.user_since = time.time()
    u.last_seen = userBaseInfo.get('last_seen',time.time())
    u.nickname = userBaseInfo.get('nickname','')
   
    u.gender = userBaseInfo.get('gender',2)

    # article.comments.extend(comments)
    # article.comment_num = len(comments)

    # article.images.extend(images)
    # u.articles.append(article)

    db.session.add(u)
    db.session.commit()
    return u


def check_or_create(author):
    str_token   =   str(author['id'])
        #+ str(time.time()) + str(random.random())
    token = hashlib.sha1(str_token.encode('utf8')).hexdigest()
    u = getUserbyToken(token)
    if u :
        return u
    userinfo = {}
    userinfo['avatarUrl'] = author['avatar']
    # userinfo['province']   =  author
    # userinfo['city']   =  author
    # userinfo['user_since']   =  author
    # userinfo['last_seen']   =  author
    userinfo['nickname']   =  author['nickname']
    try:
        userinfo['gender']   = 0  if  author['gender']=='female' else 1
    except KeyError as e:
        pass
    userinfo['gender'] = random.choice([0,1])
        
    u = registerFunction(userinfo, token)
    return u


def getUserbyToken(token):
    if not token:
        return None
    u = User.query.filter_by(token=token).first()
    if u is None:
        return  None    
    return u

