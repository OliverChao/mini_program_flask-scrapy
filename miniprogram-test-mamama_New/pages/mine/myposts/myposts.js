
import {
  getDiffTime
} from '../../../util/util.js'

// import utils;
const app = getApp();
// const jinrishici = require('../../utils/jinrishici.js');
// const { $Message } = require('../../dist/base/index');
const request = require('../../../util/request.js');
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
    islike:islike,
    isFocal:true
  },

  // 大哥，，你不要这么设变量把。。。。  我看了好一会，是什么意思
  fadongtai:function(){
    wx.navigateTo({
      url: '/pages/post/post-new/post-new',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },



  // 删除函数
  delete_post:function(event){

    var postId = event.currentTarget.dataset.postId
    console.log('this is delete function,and postid is :', postId)
    var that = this
    var url = app.combineURL('user/delete_post')
    var token = app.globalData.token
    var data = {
      postid: postId
    }

    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')


          request.requestPostApi(url, token, data, this, function (res, sourceObj) {
            if (res.code === 1) {
              console.log('delete successfully~')
              var posts = that.data.posts

              for (var i in posts) {
                if (posts[i].article_info.id === postId) {
                  posts.splice(i, 1)
                  break
                }
              }

              that.setData({
                posts: posts
              })
            }
            else {
              console.log('failed to delete...')
            }
          })

        } else {
          console.log('用户点击取消')
          return;
        }

      }
    })

  },

  
// 图片预览
  tapImage:function(e){
    // console.log('tapImage:::',e)
    var imgurl = e.currentTarget.dataset.imgurl
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls:[imgurl] ,
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
  },



  onLoad: function () {
    // console.log(getDiffTime(new Date().getTime()/ 1000 ))
    // 向 网络 中 请求 5-6 个 post，组成一个posts；
    // api 可以 每次返回一个, 这样用一个post_list  循环接收,
    // 最后让 posts：post_list
    // postlist 接受 的每一个post 应该像
    /*[  {
        token:'',
        articleinfo:{
          body:,
          minibody:,
          reading_num:,
          comment_num:,
          like_num:,
          // 把时间戳改成像  几分钟前，，刚刚，，，昨天，，，等等 格式。
          post_time:
        },
        imginfo:{
          imgurl:
        }},
      ]*/
    this.getArticleInfo()
    // this.setData(data)
    // console.log(this.data)
    // 微信自带Loading效果
    // wx.showLoading({
    //   title: '加载中',
    // })


    // var dbPost = new DBPost();
    // this.setData({
    //   postList: dbPost.getAllPostData(),
    // });
    // console.log(newFunction(), this.data.postList)

    this.setAniation();
  },



  showData: function () {
    console.log(this.data.posts)
  },


  // 文章 分页 函数
  getArticleInfo: function () {
    // !!!请求 文章 函数 
    //  配合 onload ， 下拉刷新， 和 上拉加载 
    var that = this
    var url = app.combineURL('user/posts')
    var token = app.globalData.token
    var data = {
      thistime: that.data.thistime,
      page: that.data.page,
      count: require_num
    }

    request.requestGetApi(url, token, data, this, function (res, sourceObj) {
      console.log('get posts return:' ,res)
      var contentlistTem = that.data.posts
      if (that.data.page == 1) {
        contentlistTem = []
      }

      var contentlist = res.articles_list
      // var cache_posts = wx.getStorageSync('posts')
      // // var need_remove
      // if (cache_posts){
      //   for (var i in contentlist){
      //     for (var j in cache_posts){
  
      //       if(contentlist[i].article_info.id===cache_posts[j].article_info.id){
      //         contentlist[i].article_info.like_num = cache_posts[j].article_info.like_num
      //       }
      //     }
      //   }
      // }
      // for(let j in cache_posts){
      //   for(let prop in cache_posts[j]){
      //       if(prop!=''||cache_posts[j][prop]!=''){
      //           newArr.push(cache_posts[j]);
      //       }
      //   }
      // };

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

  onUpTap: function (event) {
    // var newData = this.dbPost.up();
    var that = this
    var new_post_list = that.data.posts
    var postid = event.currentTarget.dataset.postid


    var op = -1
    var source_num = -1
    var i ;
    for (i in this.data.posts) {
      if (this.data.posts[i].article_info.id == postid){
           source_num = this.data.posts[i].article_info.like_num
           break
      }
    }

    console.log('postid : ', postid)
    if(islike[postid]){
      new_post_list[i].article_info.like_num = source_num - 1
      new_post_list[i].article_info.islike = false
      islike[postid]= false
      op = 0
    }
    else{
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
  


    // for (var i in this.data.posts) {

    //   new_post_list[i].article_info.islike = this.data.posts[i].article_info.islike ? true : false

    //   var source_num = this.data.posts[i].article_info.like_num
    //   if (this.data.posts[i].article_info.id == postid) {
    //     if (new_post_list[i].article_info.islike) {
    //       new_post_list[i].article_info.like_num = source_num - 1
    //       new_post_list[i].article_info.islike = false
    //       op = 0
    //     } else {
    //       new_post_list[i].article_info.like_num = source_num + 1
    //       new_post_list[i].article_info.islike = true
    //       op = 1
    //     }
    //     this.setData({
    //       posts: new_post_list
    //     })

    //     wx.setStorage({
    //       key: 'posts',
    //       data: that.data.posts,
    //       success: function(res){
    //         // success
    //       },
    //       fail: function() {
    //         // fail
    //       },
    //       complete: function() {
    //         // complete
    //       }
    //     })
        
    //     // console.log(this.data.posts[i].article_info.id)
    //   }
    // }

    // 更新 喜欢数目（ 更新服务器数据库）
    this.getChangeLikeNum(postid,op)
    // this.animationUp.scale(2).step();
    // this.setData({
    //   animationUp: this.animationUp.export()
    // })
    // setTimeout(function () {
    //   this.animationUp.scale(1).step();
    //   this.setData({
    //     animationUp: this.animationUp.export()
    //   })
    // }.bind(this), 300);
  },


  getChangeLikeNum:function(postid,op){
    var url = app.combineURL('update/like_num')
    var data ={
      postid:postid,
      operation:op
    }
    if (op!=0 && op!= 1){
      console.log('like-num-change function op error')
      return ;
    }

    request.requestGetApi(url,'', data, this,function(res, sourceObj){
      var code = res.code
      console.log(res)
      if(code!=1){
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

  },

  testpost: function () {

    let nowtime = parseInt(new Date().getTime() / 1000)
    let url = app.combineURL('post')
    // let token = app.globalData.token
    let token = 'b6f8027da6d99e167aa5f0aeb5d14b99e1cbede5'
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

    // wx.request({
    //   url: 'http://127.0.0.1:7789/api/post',
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'token': 'b6f8027da6d99e167aa5f0aeb5d14b99e1cbede5',
    //   },
    //   method:'POST',
    //   data: {
    //       'articleinfo': JSON.stringify({
    //       'body': 'IIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLEIIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLEIIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLEIIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLEIIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLEIIIIII LOVES LOVES LOVES LOVES ANNABELLEANNABELLEANNABELLEANNABELLE',
    //       'article_since': nowtime
    //     }),
    //     imgurls: []
    //   },

    //   success:  (res) =>{
    //     console.log(res.data)
    //     console.log(typeof res.data)
    //     console.log(res.data.code)
    //   }
    // })

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

    // wx.request({
    //   url: 'http://127.0.0.1:7789/api/getposts',
    //   data: {
    //     thistime: that.data.thistime,
    //     page:1,
    //     count:3,
    //     test:'sd'
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: (res)=>{
    //     // success
    //     console.log(that.thistime)
    //     console.log(res.data)
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //   }
    // })

  },

  test_log: function () {
    wx.login({
      success: function (res) {
        // let code = res.code
        // console.log('code:',code)   
        // request.requestGetApi()
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
            if (res.data.reg_code == 1)
              app.globalData.token = res.data.token
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
      url: '/pages/post/post-new/post-new'
    })
  },

  onTapToDetail(event) {
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);

    wx.navigateTo({
      url: '/pages/post/post-comment/post-comment?id=' + postId,
    })
  },

  comment:function(event){
    var isFocal = this.data.isFocal
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);
    isFocal=true;
    wx.navigateTo({
      url: '/pages/post/post-comment/post-comment?id=' + postId
      //  + '&isfocal=' + isFocal

    })
  },

  // target 和currentTarget
  // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
  // target这里指的是image，而currentTarget指的是swiper
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: "/pages/post/post-comment/post-comment?id=" + postId
    })
  },

})




