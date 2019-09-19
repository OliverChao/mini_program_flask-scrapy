# -*- coding: utf-8 -*-
import scrapy
import json
from timeapp.items import TimeappItem
import time

class TimingapplicationSpider(scrapy.Spider):
    name = 'timingapplication'
    allowed_domains = ['api.timing360.com']
    # start_urls = ['http://api.timing360.com/']

    def start_requests(self):
        url='http://api.timing360.com/learning-circle/recommend-feed-list'
        data = {'userKey':'c2ed722c4ceeac4fe3cae0b462c66d57',
               'userID':'2277769',
               'imei':'865224038181525',
               'brand':'vivo',
               'market':'vivo',
               'versioncode':'52',
               'timestamp':'1557424619155',
               'tailID':'0',
               'phoneModel':'vivo%20X9i',
               'os':'7.1.2',
               'nonce':'124892'}
        headers = {'User-Agent':'okhttp/3.8.1',
          'Content-Type':'application/x-www-form-urlencoded',
          # 'Authorization':'221A11C93355FBBBF4600F7CAF6FE191'
        }
        # for i in range(10):
        data['timestamp']  = str(int(time.time()))
        yield scrapy.FormRequest(url=url, formdata=data, headers=headers ,callback=self.parse)
        pass


    def parse(self, response):
        data = json.loads(response.body)

        for feed in data['feedList']:
            item  = TimeappItem()
            item['image_urls'] = []
            item['errorCode'] = data['errorCode']
            item['author'] = feed['author']
            item['content'] = feed['content']
            item['replyList'] = feed['replyList']
            imageList = feed['imageList']
            for img in imageList[:4]:
                # print(img['url'])
                item['image_urls'].append(img['shareImgUrl'])
            yield item
        # print(data)
