
from collections import UserDict
from timeapp.models.define_db import *
class ObjectDict(UserDict):
    def __init__(self, *args, **kwargs):
        super(ObjectDict, self).__init__(*args, **kwargs)

    # def __str__(self):

    def __getattr__(self, name):
        try:
            value =  self[name]
        except KeyError as e:
            raise KeyError('your dict don\'t have this key')            
        if isinstance(value, dict):
            value = ObjectDict(value)  
        if isinstance(value, list):
            l = []
            for item in value:
                if isinstance(item, dict):
                    l.append(ObjectDict(item))
                else:
                    l.append(item)
            return l           
        return value

if __name__ == '__main__':
    print(db)
    # d = {'name':'Oliver','age':'21','sports':['rap','jump','basketball']}
    # d = ObjectDict(d)
    # print(d.sports)