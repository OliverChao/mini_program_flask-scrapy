import json
import time
import hashlib
import requests
from collections import defaultdict
from retrying import retry
from application import app,db
from models import User,Task,Article,Image,Comment


def gen_article(articles):
    # d = {}
    for item in articles:
        d = {}
        d['article_id'] = item.id
        d['content'] = item.body
        d['minicontent'] = d['content'][:100]
        d['comment_num'] = item.comment_num
        d['like_num'] = item.like_num
        d['reading_num'] = item.reading_num
        d['article_since'] = item.article_since
        d['images'] = [i.imgurl for i in item.images]
        yield d

def gen_img(images):
    for item in images:
        yield item.imgurl

# get token and session_key
@retry(stop_max_attempt_number=3)
def httpSendMsgToWX(code):
    login_url = "https://api.weixin.qq.com/sns/jscode2session?appid={}&secret={}&js_code={}&grant_type=authorization_code".format(app.config['APP_ID'],app.config['APP_SECRET'],code)
    app.logger.info('login_url:{}'.format(login_url))
    response = requests.get(login_url,timeout=3)
    content  = response.text
    return json.loads(content)



def registerFunction(userBaseInfo,token):
    if not userBaseInfo:
        return -1
    u = User()
    u.token = token
    u.avatar_url = userBaseInfo.get('avatarUrl',app.config['DEFAULT_AVATAR'])
    u.province = userBaseInfo.get('province','')
    u.city = userBaseInfo.get('city','')
    u.user_since = time.time()
    u.last_seen = userBaseInfo.get('last_seen',time.time())
    u.nickname = userBaseInfo.get('nickName','')
    u.gender = userBaseInfo.get('gender',3)
    tasks = userBaseInfo.get('tasks','')
    
    # tasks:[{task:content,task_since:task_since},]

    if tasks:
        for task in tasks:
            t = Task(task=task.task,task_since=task.task_since)
            u.tasks.append(t)
    
    db.session.add(u)
    db.session.commit()
    return 1



def gen_infoFromArticle(articles):
    # 生成器 ， 传给 前端 post 应该有的 信息 ：
    #              1.article      2.user    3.images
    # ps: 没有 生成 评论信息，当用户点击文章时，用户凭借 文章id  来后台换取评论信息
   
    for  item in articles:
        d = defaultdict(dict)
        # flag 保证 数据的 完整性
        d['flag'] = 1
        try:
            d['article_info']['body'] = item.body
            d['article_info']['reading_num'] = item.reading_num
            d['article_info']['comment_num'] = item.comment_num
            d['article_info']['like_num'] =item.like_num
            d['article_info']['article_since'] = item.article_since
            d['article_info']['id'] = item.id
            comment_gen =gen_getCommentinfo(item.comments)
            if len(item.comments) <=3:
                d['comment_info'] = list(comment_gen) 
            else:
                d['comment_info'] = [next(comment_gen) for _ in range(3)]

                # gen_getCommentinfo(item.comments) 

            d['user_info'] = getUserinfo(item.user)
            d['img_info'] = getImginfo(item.images)
        except AttributeError as e:
            d['flag'] = 0
            d['errmsg'] = e
            
        yield d

def getUserinfo(user):
    # 传入 ：  user：u
    d = {}
    d['avatar_url'] = user.avatar_url
    d['nickname'] = user.nickname
    d['province'] = user.province
    d['city'] = user.city
    d['gender'] = user.gender
    d['permission'] = user.permission
    d['learn_time'] = user.learn_time
    return d

def getImginfo(images):
    # 传入：  images：[img,img,img] => Image 类对象 列表 
    l=[]
    for img in images:
        d={}
        d['imgurl'] = img.imgurl
        l.append(d)
    return l

def gen_getCommentinfo(comments):
    # 传入：  comments：[comments,comments,comments] => Comment 对向列表
    for item in comments:
        d = defaultdict(dict)
        d['flag'] = 1
        try:
            d['comment_info']['comment'] = item.comment
            d['comment_info']['comment_since'] = item.comment_since
            d['user_info'] = getUserinfo(item.user)
            
        except AttributeError as e:
            d['flag'] = 0
            d['errmsg'] = e
        yield d


def getUserbyToken(token):
    if not token:
        return None
    u = User.query.filter_by(token=token).first()
    if u is None:
        return  None    
    return u


def gen_formArticleList(task_list):
    for item in task_list:
        yield Task(task=item.task,task_since=item.task_since)


def gen_formImageList(img_list):
    for item in img_list:
        yield Image(imgurl=item)




# return a Task  =>>  item is a dict (from miniprogram "json" ) 
def form_task(tasklist):
    for item in tasklist:
        try:
            t1 = Task(name=item['name'],url=item['url'],time=item['time'],target=item['target'],color=item['color'],condition=item.get('condition',False),experience=item['experience'],fail_reason=item['givereason'])
        except Exception as e:
            app.logger.error(e)
            yield None
        else:
            yield t1

def use_taskclass_form_tasklist(tasks):
    for item in tasks:
        d = {}
        try:
            d['name'] = item.name
            d['url'] = item.url
            d['time'] = item.time
            d['target'] = item.target
            d['color'] = item.color
            d['condition'] = item.condition
            d['experience'] = item.experience
            d['givereason'] = item.fail_reason 
        except:
            yield None
        else:
            yield d
