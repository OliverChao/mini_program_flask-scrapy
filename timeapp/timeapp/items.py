# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class TimeappItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    errorCode = scrapy.Field()

    # feedList = scrapy.Field()

    author = scrapy.Field()
    # gender = scrapy.Field()
    # author_id = scrapy.Field()
    # nickname = scrapy.Field()
    
    content = scrapy.Field()
    # article_id = scrapy.Field()
    # imageList = scrapy.Field()
    image_urls = scrapy.Field()
    images = scrapy.Field()
    image_path = scrapy.Field()
    replyList = scrapy.Field()
    

