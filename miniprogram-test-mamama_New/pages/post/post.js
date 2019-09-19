import {
  getDiffTime
} from '../../util/util.js'


const app = getApp();

const request = require('../../util/request.js');
const require_num = 3
var nowtime = parseInt(new Date().getTime() / 1000)
var islike = wx.getStorageSync('islike') ? wx.getStorageSync('islike') : {}
Page({
  data: {
    thistime: nowtime,
    page: 1,
    count: require_num,
    loadmore: true,
    posts: [],
    islike: islike,
    isFocal: true
  },

  fadongtai: function () {
    wx.navigateTo({
      url: 'post-new/post-new',
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },



  onLoad: function () {
    
    wx.login({
      success: function (res) {

        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            app.globalData.g_userInfo = res.userInfo
            wx.setStorageSync('user', res.userInfo)

          },

          fail: function (res) {
            console.log(res);
          }
        })

        wx.request({
          // url: 'http://127.0.0.1:7789/api/wxlogin',
          url: app.combineURL('wxlogin'),
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            'code': res.code,
            'userinfo': JSON.stringify(wx.getStorageSync('user'))
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.reg_code == 1) {
              app.globalData.token = res.data.token
              wx.setStorage({
                key: 'token',
                data: res.data.token,
                success: function (res) {
                  // success
                },
                fail: function () {
                  // fail
                },
                complete: function () {
                  // complete
                }
              })

            }
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

    // console.log(getDiffTime(new Date().getTime()/ 1000 ))
    // 向 网络 中 请求 5-6 个 post，组成一个posts；
    // api 可以 每次返回一个, 这样用一个post_list  循环接收,
    // 最后让 posts：post_list
    // postlist 接受 的每一个post 应该像

    this.getArticleInfo()

    this.setAniation();
  },



  showData: function () {
    console.log(this.data)
  },


  // 文章 分页 函数
  getArticleInfo: function () {
    // !!!请求 文章 函数 
    //  配合 onload ， 下拉刷新， 和 上拉加载 
    var that = this
    var url = app.combineURL('getposts')
    var token = app.globalData.token
    var data = {
      thistime: that.data.thistime,
      page: that.data.page,
      count: require_num
    }

    request.requestGetApi(url, token, data, this, function (res, sourceObj) {
      console.log('get posts return:', res)
      var contentlistTem = that.data.posts
      if (that.data.page == 1) {
        contentlistTem = []
      }

      var contentlist = res.articles_list

      // !!! 格式化 时间戳 。。 
      for (var i in contentlist) {
        try {
          contentlist[i].article_info.article_since = getDiffTime(contentlist[i].article_info.article_since)
        } catch (error) {}
        try {
          // console.log(contentlist[i].comment_info)
          // comments = contentlist[i].comment_info
          for (var j in contentlist[i].comment_info) {
            contentlist[i].comment_info[j].comment_info.comment_since = getDiffTime(contentlist[i].comment_info[j].comment_info.comment_since)
          }
        } catch (error) {}
      }

      if (res.count < that.data.count) {
        that.setData({
          posts: contentlistTem.concat(contentlist),
          loadmore: false
        })
      } else {
        that.setData({
          posts: contentlistTem.concat(contentlist),
          loadmore: true,
          page: that.data.page + 1
        })
      }

      wx.setStorage({
        key: 'posts',
        data: (that.data.posts)
      })




    }, this.failFunPosts)

  },


  setAniation: function () {
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out'
    })
    this.animationUp = animationUp
  },


    // 点赞 喜欢
  onUpTap: function (event) {
    // var newData = this.dbPost.up();
    var token = app.globalData.token
    if(!token){
      // 没有评论 不能 点赞 喜欢 ， 给提示
      wx.showToast({
        title: '未登入！，请登录后使用',
        image: '/images/icon/cuowutishi.png'
      })
      return ;
    }
    var that = this
    var new_post_list = that.data.posts
    var postid = event.currentTarget.dataset.postid


    var op = -1
    var source_num = -1
    var i;
    for (i in this.data.posts) {
      if (this.data.posts[i].article_info.id == postid) {
        source_num = this.data.posts[i].article_info.like_num
        break
      }
    }

    console.log('postid : ', postid)
    if (islike[postid]) {
      new_post_list[i].article_info.like_num = source_num - 1
      new_post_list[i].article_info.islike = false
      islike[postid] = false
      op = 0
    } else {
      new_post_list[i].article_info.like_num = source_num + 1
      new_post_list[i].article_info.islike = true
      islike[postid] = true
      op = 1
    }
    this.setData({
      posts: new_post_list,
      islike: islike
    })

    wx.setStorage({
      key: 'islike',
      data: islike,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

    // 更新 喜欢数目（ 更新服务器数据库）
    this.getChangeLikeNum(postid, op)

  },


  getChangeLikeNum: function (postid, op) {
    var token = app.globalData.token
    var url = app.combineURL('update/like_num')
    var data = {
      postid: postid,
      operation: op
    }
    if (op != 0 && op != 1) {
      console.log('like-num-change function op error')
      return;
    }

    request.requestGetApi(url, token, data, this, function (res, sourceObj) {
      var code = res.code
      console.log(res)
      if (code != 1) {
        // failed to change like_num
        console.log('failed to change like_num')
      }

    })


  },


  onPullDownRefresh() {
    // this.declearpost()
    // 解决 返回 造成持续刷新 问题
    var flush_nowtime = new Date().getTime() / 1000

    this.setData({
      page: 1,
      loadmore: true,
      thistime: flush_nowtime
    })

    this.getArticleInfo()
    wx.stopPullDownRefresh()

  },

  // !important 需要添加 动画 
  onReachBottom: function () {
    console.log('reach the bottom')
    if (!this.data.loadmore) {
      wx.showToast({
        title: "No more posts"
      })
    } else {
      this.getArticleInfo()
    }
  },



  onShow() {
    this.app = getApp();

    this.app.slideupshow(this, 'slide_up1', -200, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200);
  },
  onHide() {
    this.app = getApp();

    this.app.slideupshow(this, 'slide_up1', 200, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 200, 1)
    }.bind(this), 200);
  },
  

  testpost: function () {

    let nowtime = parseInt(new Date().getTime() / 1000)
    let url = app.combineURL('post')
    let token = app.globalData.token
    if(!token){
      // 未登入 ，提示 
      //  ....
      wx.showToast({
        title: '未登入',
        image: '/images/icon/cuowutishi.png'
      })
      return ;
    }
    // let token = 'b6f8027da6d99e167aa5f0aeb5d14b99e1cbede5'
    // let token = 'eaef9606e57a313b94b40bf2f51c6add582ad085'
    let params = {
      'articleinfo': JSON.stringify({
        'body': 'Oliver loves Annabelle~\nOliver loves Annabelle~\nOliver loves Annabelle~\nOliver loves Annabelle~\nOliver loves Annabelle~\nOliver loves Annabelle~\n',
        'article_since': nowtime
      }),
      imgurls: JSON.stringify(['https://www.oliverlovesannabelle.club/static/girl.jpg', 'https://www.oliverlovesannabelle.club/static/thumb-1920-771947.jpg'])
    }
    request.requestPostApi(url, token, params, this, function (res, sourceObj) {
      console.log(res)
      console.log(res.code)
    })


  },

  test_get_post: function () {
    // console.log(this.thistime)
    // console.log(thistime)
    var that = this
    var url = app.combineURL('getpost')
    //'http://127.0.0.1:7789/api/getposts'

    var data = {
      thistime: that.data.thistime,
      page: 1,
      count: 3,
      test: 'sd'
    }

    request.requestGetApi(url, '', data, this, function (res, sourceObj) {
      console.log(res)
    })

  },


  getUserInfo: function () {
    wx.login({
      success: function (r) {
        console.log('code', r.code)
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },



  declare_post: function () {
    wx.navigateTo({
      url: 'post-new/post-new'
    })
  },

  onTapToDetail(event) {
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);

    // wx.navigateTo({
    //   url: 'post-comment/post-comment?id=' + postId,
    // },)
    var that = this
    wx.navigateTo({
      url: 'post-comment/post-comment?id=' + postId,
      success: function (res) {

        var url = app.combineURL('update/reading_num')
        var token = app.globalData.token
        
        if(!token){
          // 没有 token ， 不添加 读数
          wx.showToast({
            title: '登入后使用',
            image: '/images/icon/cuowutishi.png'
          })
          return ; 
        }
        var params = {
          'postid' : postId
        }
        var _posts = that.data.posts
        request.requestPostApi(url, token, params, this, function (res, sourceObj){
          // console.log('res:reading_num',res)
          // that.setData({
            
          // })
          for(var i in _posts){
            if(_posts[i].article_info.id == postId){
              _posts[i].article_info.reading_num += 1
              break
            }
          }
          that.setData({
              posts:_posts
          })

          wx.setStorage({
            key: 'posts',
            data: that.data.posts,
            success: function(res){
              // success
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })

        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },

  comment: function (event) {
    var isFocal = this.data.isFocal
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);
    isFocal = true;
    wx.navigateTo({
      url: 'post-comment/post-comment?id=' + postId
      //  + '&isfocal=' + isFocal

    })
  },

  // target 和currentTarget
  // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
  // target这里指的是image，而currentTarget指的是swiper
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: "post-comment/post-comment?id=" + postId
    })
  },

})