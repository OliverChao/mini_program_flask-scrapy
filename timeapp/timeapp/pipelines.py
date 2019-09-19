# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
from scrapy.pipelines.images import ImagesPipeline
from scrapy import Request
from scrapy.exceptions import DropItem
from .models.define_db import *
import time
import hashlib
import random
from .utils import *

class MyImagesPipeline(ImagesPipeline):
    def get_media_requests(self, item, info):
        # return [Request(x) for x in item.get(self.images_urls_field, [])]
        for x in item.get(self.images_urls_field, []):
            yield Request(x)

    def file_path(self, request, response=None, info=None):
        return super().file_path(request, response=None, info=None)
        # return [Request(x) for x in item.get(self.images_urls_f


class TimeappPipeline(object):
    def process_item(self, item, spider):
        if(not item['errorCode']==0):
            raise DropItem('errorCode is illegal')
        return item

class MysqlSavePipeline(object):
    # 入库 mysql
#     def open_spider(self, spider):
#         pass

#     def close_spider(self,spider):
#         pass
    
    def process_item(self, item, spider):
        article_since = int(time.time()) - random.randint(60,480)
        content = item['content']
        articleObj = Article(body=content, article_since=article_since)
        commentObjs = form_commentObj_from_list(item['replyList'])
        imageObjs = form_imageObj_from_list(item['images'])

        author = item['author']
        u  = check_or_create(author)
        combindRelation(u, articleObj, commentObjs, imageObjs)
        
        # author = item['author']
        # # create token 
        # str_token   =   str(author['id'])
        #  #+ str(time.time()) + str(random.random())
        # token = hashlib.sha1(str_token.encode('utf8')).hexdigest()
        # u = getUserbyToken(token)
        # if u is None:
        #     userinfo = {}
        #     userinfo['avatarUrl'] = author['avatar']
        #     # userinfo['province']   =  author
        #     # userinfo['city']   =  author
        #     # userinfo['user_since']   =  author
        #     # userinfo['last_seen']   =  author
        #     userinfo['nickname']   =  author['nickname']
        #     userinfo['gender']   = 0  if  author['gender']=='female' else 1
        #     registerFunction(userinfo, token, articleObj, commentObjs,imageObjs)
        # else:
        #     combindRelation(u, articleObj, commentObjs, imageObjs)

        return item
