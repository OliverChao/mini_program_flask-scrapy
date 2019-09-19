import os
import json
import time
# 把 user 的 openid  hash 一下  成 token
import hashlib
import random
import requests
from collections import defaultdict
from flask import Blueprint,jsonify,request
from models import User,Task,Article,Image,Comment
from application import app,db
from collections import defaultdict
from functions import *
from sqlalchemy import and_


api = Blueprint('api',__name__)

@api.route('/')
def index():
    return 'mini_api 0.1'

# 微信登入 ， 入库 openid（token）
@api.route('/wxlogin',methods=['POST','GET'])
def login():
    values = request.values
    app.logger.info((values.get('userinfo')))
    userBaseInfo = json.loads(values.get('userinfo','""'))
    code = (values.get('code',''))
    app.logger.info('code:{}'.format(code))
    app.logger.info(type(code))
    if not code: 
        return jsonify({
            'reg_code':-1,
            'errmsg':"lack code"
        })
    userOpenidAndSession = httpSendMsgToWX(code)
    app.logger.info(userOpenidAndSession)
    try:
        openid = userOpenidAndSession['openid']
    except:
        return jsonify({
            'reg_code':-1,
            'errmsg':"lack code"
        })
    token = hashlib.sha1(openid.encode('utf8')).hexdigest()

    sendMsg = {'reg_code':1}
    sendMsg['token'] = token
    u = User.query.filter_by(token=token).first()
    if u is None:
        reg_code = registerFunction(userBaseInfo,token)
        sendMsg['reg_code'] = reg_code
    # return jsonify(values.get('userinfo'))
    # return jsonify(u.nickname)
    return jsonify(sendMsg)

# 此 路由 需要 重新 写  获取 task 函数 失效， 
@api.route('/update/user',methods=['POST','GET'])
def userupdate():
    # 更新 tasks (考虑加 一下  加上 学习时 间数 ， 生成 学习报告 功能)  
    # 更新 learn time 
    # {token:**,tasks:[{task:**,task_since:**},   ],userinfo:{learn_time:**}}
    values = request.values
    token = request.headers.get('token','')

    u = getUserbyToken(token)
    if u in None:
        return jsonify({
            'code':404,
            'errmsg':'no token'
        })

    tasks = values.get('tasks','')
    if tasks:
        # 
        u.tasks.extend(gen_formArticleList(tasks))
        db.session.commit()

# 更改 文章 信息， =》》 like_num,  reading_num ...  
@api.route('/update/like_num',methods=['POST','GET'])
def likeNumInfoUpdate():
    values = request.values
    postid = int(values.get('postid',0))
    # 0: sub   ;   1: add
    op = int(values.get('operation',-1))  
    if op!=1 and op!=0:
        return jsonify({
            'code':-1,
            'errmsg':'illegal  operation'
        })
    # num = a.like_num
    a = Article.query.get(postid)
    if a is None:
        return jsonify({
            'code':-1,
            'errmsg':"don't have this article"
        })
    if op == 1:
        a.like_num +=1
    else:
        a.like_num -=1

    db.session.commit()

    return jsonify({
        'code':1,
        'msg':'change like_num successfully'
    })

@api.route('/update/reading_num',methods=['POST'])
def readingNumInfoUpdate():
    values = request.values
    postid = int(values.get('postid',-1))
    if(postid == -1):
        return jsonify({
            'code':-1,
            'errmsg':'no postid'
        })
    a = Article.query.get(postid)
    if a is None:
        return jsonify({
            'code':-1,
            'errmsg':"don't have this article"
        })

    a.reading_num += 1
    db.session.commit()
    return jsonify({
        'code':1,
        'msg':'change like_num successfully'
    })


# comment
@api.route('/update/commentinfo',methods=['POST','GET'])
def commentInfoUpdate():
    values = request.values
    comment_body = values.get('comment')
    comment_since = values.get('comment_since')
    token = request.headers.get('token','')
    postid = values.get('postid')
    if not token:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })
    u = getUserbyToken(token)
    if u is None:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })
    a = Article.query.get(postid)
    app.logger.info('article id:: {}'.format(a.id))
    if a is None:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })

    c = Comment(comment=comment_body,comment_since=comment_since)
    db.session.add(c)
    u.comments.append(c)
    a.comments.append(c)
    a.comment_num += 1
    # c.user = u
    db.session.commit()
    return jsonify({
        'code':1,
        'msg':'add a comment successfully'
    })

# 发表文章路由
@api.route('/post',methods=['POST','GET'])
def post():
    # 用户发表 文章 路由 
    # {token:'',articleinfo:{body:'',article_since:''},imgurls:[]}
    values = (request.values)
    # values = json.loads(values)
    # app.logger.info(json.loads(values.get('articleinfo')))
    # return jsonify({'state':'test'})
    token = request.headers.get('token','')
    # app.logger.info(token)
    # app.logger.info(json.loads(token))
    # app.logger.info(type(json.loads(token)))

    # 获取 poster
    u = getUserbyToken(token)

    if u is None:
        return jsonify({
            'code':404,
            'errmsg':'not token'
        })
    try:
        articleinfo = json.loads(values.get('articleinfo'))
        t = Article(body=articleinfo['body'],article_since=articleinfo['article_since'])
    except :
        return jsonify({
            'code':404,
            'errmsg':'article error'
        })

    imgurls = json.loads(values.get('imgurls','""'))
    app.logger.info(imgurls)
    if  len(imgurls):
        imgs = list(gen_formImageList(imgurls))
        t.images.extend(imgs)

    u.articles.append(t)

    try:
        db.session.commit()
    except :
        return jsonify({
            'code':404,
            'errmsg':'article error'
        })

    # 返回 一个  post id  
    return jsonify({
        'code':1,
        'msg':'post success',
        'post_id': t.id 
    })


@api.route('/upload/imags',methods=['POST','GET'])
def upload_img():
    # basedir = os.path.abspath(os.path.dirname(__file__))
    # 保存在 /static/uploadimg/  文件夹下
    
    basedir = app.config['UPLOAD_FOLDER']
    img_file = request.files.get('img')
    token = request.headers.get('token','')
    img_suffix = request.values.get('suffix','jpg')
    u = getUserbyToken(token)
    if u is None or u.permission == 0:
        return jsonify({
            'code':404,
            'errmsg':'illegel operation, no this user or this user is discarded'
        })
    
    dir_name = hashlib.md5(token.encode('utf8')).hexdigest()
    user_dir_name = os.path.join(basedir,dir_name) + '/'

    if not os.path.exists( user_dir_name ):
        os.makedirs(user_dir_name)
    
    file_name = hashlib.md5(
        (token+str(time.time())+str(random.random())).encode('utf8')
    ) .hexdigest()
    img_path = user_dir_name + file_name + '.' + img_suffix
    # save_path = './static/uploadimgs/' + file_name + '.' + img_suffix
    # 微信 上传图片， 会过滤 文件，所以 后端没有 必要 在做 文件扩展名过滤
    # app.logger.info('img_path',img_path)
    img_file.save(img_path)

    # url  =>>>  static code  not a good idea
    img_url = 'https://www.oliverlovesannabelle.club/static/uploadimgs/' + dir_name +'/'+ file_name + '.' + img_suffix

    return jsonify({
        'code':1,
        'msg':'upload success',
        'path':img_url
    })

# def combineRelation(user=None,articles=None,images=None,tasks=None):
# 文章 分页， 获取文章   (不需要 token)
@api.route('/getposts',methods=['POST','GET'])
def getposts():
    # 从数据库 中 去筛选 posts
    # 要解决  请求分页时 ，更新 article 数据库 造成的 数据混乱和分页混乱
    # 初步 解决方法 ： 设置 filter 卡一下时间戳的 条件， 用时间戳，比较容易实现 时间的 筛选
    # Article.query.filter(Article.article_since < 传来的 时间戳)
    # app.logger.info(request.headers)
    values = request.values
    # 数据库 时间戳存的是 数值, 前端传来的 也是 数值，但是 数据库，在比较是，会强制转换类型
    thistime = int(float(values.get('thistime',0)))
    wantGetPage =int( values.get('page'))
    # app.logger.info((values.get('test')))
    wantGetCount = int(values.get('count',0))

    # 卡时间 分页书库，因为，新添加的  数据 时间戳 总会大于 前端 是的 时间戳，能保证此时数据库 是 不容易 更改的
    paginatio = Article.query.filter(Article.article_since <= thistime).order_by(Article.article_since.desc()).paginate(wantGetPage,wantGetCount,False)
    app.logger.info(paginatio.pages)
    articles = paginatio.items
    send_post_info = {}
    send_post_info['articles_list'] = [i for i in gen_infoFromArticle(articles) if i['flag']]

    send_post_info['count'] = len(articles)
    send_post_info['total'] = paginatio.total

    return jsonify(send_post_info)


@api.route('/test')
def test_post():
    page = int(request.args.get('page',1))
    articles = Article.query.filter(Article.article_since >= 1431451234).paginate(page,2,False).items
    l = [i for i in gen_infoFromArticle(articles) if i['flag']]
    return jsonify(l)


# 一个用户所有的 posts
@api.route('/user/posts')
def getallposts():
    values = request.values
    token = request.headers.get('token','')
    if not token:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })
    u = getUserbyToken(token)
    user_id = u.id
    thistime = int(float(values.get('thistime',0)))
    wantGetPage =int( values.get('page',0))
    # app.logger.info((values.get('test')))
    wantGetCount = int(values.get('count',0))

    paginateio = Article.query.filter(and_(Article.user_id==user_id,Article.article_since <= thistime)).order_by(Article.article_since.desc()).paginate(wantGetPage,wantGetCount,False)
    app.logger.info(paginateio.pages)
    articles = paginateio.items
    send_post_info = {}
    send_post_info['articles_list'] = [i for i in gen_infoFromArticle(articles) if i['flag']]

    send_post_info['count'] = len(articles)
    send_post_info['total'] = paginateio.total

    return jsonify(send_post_info)



@api.route('/user/delete_post',methods=['POST'])
def user_delete_post():
    token = request.headers.get('token','')
    if not token:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })
    u = getUserbyToken(token)
    if u is None:
        return jsonify({
            'code':-1,
            'errmsg':'illegal token'
        })

    postid = int(request.values.get('postid',0))
    article = Article.query.get(postid)
    # u.articles.remove(article)
    try:
        db.session.delete(article)
        db.session.commit()
    except :
        app.logger.info('failed to delete article : {}'.format(postid))
        return jsonify({
            'code':-1,
            'errmsg':'failed to delete'
        })

    app.logger.info('successfully delete article : {}'.format(postid))
    return jsonify({
        'code':1,
        'msg':'successfully delete'
    })


@api.route('/one_post_info',methods=['POST','GET'])
def getArticleComments():
    values = request.values
    thistime = int(float(values.get('thistime',0)))
    wantGetPage =int( values.get('page',0))
    # app.logger.info((values.get('test')))
    wantGetCount = int(values.get('count',0))
    post_id = int(request.values.get('postid'))

    article = Article.query.get(post_id)
    if article is None:
        return jsonify({
            'code':404,
            'errmsg':"don't have this article"
        })

    paginateio = Comment.query.filter(and_(Comment.article_id==article.id, Comment.comment_since<=thistime)).order_by(Comment.comment_since.desc()).paginate(wantGetPage,wantGetCount,False)
    # comments = article.comments
    comments = paginateio.items
    l = list(gen_getCommentinfo(comments))
    return  jsonify(l)


@api.route('/save/tasks',methods=['POST'])
def save_tasks():
    tasklist = json.loads(request.values.get('tasklist','[]'))
    app.logger.info(tasklist)
    token = request.headers.get('token','')
    u = getUserbyToken(token)

    if u is None:
        return jsonify({
            'code':404,
            'errmsg':'no token'
        })
    
    # old_tasks = u.tasks
    # clear all the data from the database;
    u.tasks.clear()
    u.tasks.extend(task for task in form_task(tasklist) if task is not None)
    try:
        db.session.commit()
    except :
        return jsonify({
            'code':-1,
            'errmsg':'failed ...'
        })
    else:
        return jsonify({
            'code':1,
            'msg':'successfully operation'
        })



@api.route('/load/tasks',methods=['POST'])
def load_tasks():

    token = request.headers.get('token','')
    u = getUserbyToken(token)

    if u is None:
        return jsonify({
            'code':404,
            'errmsg':'no token'
        })
    tasks = u.tasks

    tasklist = [i for i in use_taskclass_form_tasklist(tasks) if i is not None]
    try:
        db.session.commit()
    except :
        return jsonify({
            'code':-1,
            'errmsg':'failed ...'
        })
    else:
        return jsonify({
            'code':1,
            'msg':'successfully operation',
            'tasks':tasklist
        })

