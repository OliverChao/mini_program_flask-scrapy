from scrapy.cmdline import execute
import sys
import os
# print(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# execute('scrapy crawl timingapplication -o data2.json'.split())
execute('scrapy crawl timingapplication'.split())
