var app = getApp()
const request = require('../../../util/request.js')
import {
  getDiffTime
} from '../../../util/util.js'

const require_num = 3
var nowtime = parseInt(new Date().getTime() / 1000)

Page({
  data: {
    useKeyboardFlag: true,
    keyboardInputValue: '',
    sendMoreMsgFlag: false,
    chooseFiles: [],
    deleteIndex: -1,


    postid: -1,
    post: null,
    comments: [],
    page: 1,
    count: require_num,
    loadmore: true,
    thistime: nowtime
  },
  onLoad: function (options) {
    // console.log('  on load time....   ')
    var postid = parseInt(options.id);
    var nowtime = parseInt(new Date().getTime() / 1000)
    var that = this
    this.setData({
      postid: postid,
      thistime: nowtime
    })
    wx.getStorage({
      key: 'posts',
      success: function (res) {
        console.log('res.data: ', res.data)
        var post_list = res.data
        for (var i in post_list) {
          if (post_list[i].article_info.id == postid) {
            that.setData({
              post: post_list[i]
            })
            console.log('that.data.post: ', that.data.post)
            break;
          }
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

    this.gerCommentInfo(postid)
    // this.addReadingTimes();
    // this.setMusicMonitor();
    // this.initMusicStatus();

  },
  //图片预览
  tapImage: function (e) {
    // console.log('tapImage:::',e)
    var imgurl = e.currentTarget.dataset.imgurl
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [imgurl],
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
  },


  gerCommentInfo: function (postid) {
    var that = this
    // 向 服务器 请求 数据 ， 
    var url = app.combineURL('one_post_info')
    var token = ''
    var data = {
      postid: postid,
      thistime: that.data.thistime,
      page: that.data.page,
      count: require_num
    }

    request.requestPostApi(url, token, data, this, function (res, sourceObj) {
      console.log('res::::', res)
      var contentlistTem = that.data.comments
      var contentlist = res

      if (res.code == 404) {}
      // 格式化 时间
      for (var i in res) {
        try {
          res[i].comment_info.comment_since = getDiffTime(res[i].comment_info.comment_since)
        } catch (error) {}
      }

      var count = res.length

      if (count < that.data.count) {
        that.setData({
          comments: contentlistTem.concat(contentlist),
          loadmore: false
        })
      } else {
        that.setData({
          comments: contentlistTem.concat(contentlist),
          loadmore: true,
          page: that.data.page + 1
        })
      }
      // that.setData({
      //   comments: res
      // })
    })

  },


  //预览图片
  previewImg: function (event) {
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
      //获取图片在图片数组中的序号
      imgIdx = event.currentTarget.dataset.imgIdx,
      //获取评论的全部图片
      imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },



  // 获取用户输入
  bindCommentInput: function (event) {
    var val = event.detail.value;
    this.data.keyboardInputValue = val;
  },


  // 提交用户评论
  submitComment: function (event) {
    var token = app.globalData.token
    if(!token){
      // 没有有效 token ， 不能发表评论 ， 给提示
      return;
    }
    var that = this
    var one_comment_info = {}
    var userinfo = app.globalData.g_userInfo
    
    let pages =  getCurrentPages()
    
    var curPage = pages.pop()    // 当前页
    var prePage = pages.pop()    // 父 页
    console.log('prePage data',prePage.data)

    if (that.data.keyboardInputValue ==  '' || undefined || null) {

      wx.showToast({
        title: '不能发送空内容',
        image: '/images/icon/cuowutishi.png'
      })
      return;
    }

    if (userinfo == undefined) {
      userinfo = wx.getStorageSync('user')
      if (!userinfo) {
        wx.showToast({
          title: '未获取身份信息不能发送评论'
        })
        return;
      }
    }
    var nowtime = parseInt(new Date().getTime() / 1000)
    userinfo.nickname = userinfo.nickName
    userinfo.avatar_url = userinfo.avatarUrl
    one_comment_info.user_info = userinfo

    one_comment_info.comment_info = {}
    one_comment_info.comment_info.comment = that.data.keyboardInputValue
    one_comment_info.comment_info.comment_since = getDiffTime(nowtime)


    var url = app.combineURL('update/commentinfo')
    var data = {
      comment: that.data.keyboardInputValue,
      comment_since: nowtime,
      postid: that.data.postid
    }

    


    request.requestPostApi(url, token, data, this, function (res, sourceObj) {
      console.log(res)
      var source_comments = that.data.comments

      source_comments.unshift(one_comment_info)
      // var nowtime = 
      var _comment_num = that.data.post.article_info.comment_num
      that.setData({
        comments: source_comments,
        thistime: nowtime+1,
        'post.article_info.comment_num':_comment_num+1
      })
      
      var _postid =  that.data.postid
      var _post_list = prePage.data.posts
      for (var i in _post_list){
          if(_post_list[i].article_info.id == _postid){
            _post_list[i].article_info.comment_num = _comment_num+1
            // prePage.setData({
            //   'posts[i].article_info.comment_num': nowtime+1
            // })
            break
          }
      }
      prePage.setData({
              'posts': _post_list
            })
      
      wx.setStorage({
        key: 'posts',
        data: prePage.data.posts,
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

      //this.showCommitSuccessToast();
    })

    //显示操作结果
    //重新渲染并绑定所有评论
    //this.bindCommentData();
    //恢复初始状态
    this.resetAllDefaultStatus();
  },

  //评论成功
  showCommitSuccessToast: function () {
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
  },

  // !important 需要添加 动画 
  onReachBottom: function () {
    var postid = this.data.postid
    console.log('reach the bottom')
    if (!this.data.loadmore) {
      wx.showToast({
        title: "No more posts"
      })
    } else {
      this.gerCommentInfo(postid)
    }
  },

  onHide:function(){
    var nowtime = parseInt(new Date().getTime() / 1000)
    this.setData({
      thistime: nowtime
    })
  },

  onShow:function(){
    // var nowtime = parseInt(new Date().getTime() / 1000)
    // this.setData({
    //   thistime: nowtime
    // })
    // var postid = this.data.postid

    // this.gerCommentInfo(postid)
  },

  bindCommentData: function () {
    var comments = this.dbPost.getCommentData();
    // 绑定评论数据
    this.setData({
      comments: comments
    });
  },

  //将所有相关的按钮状态，输入状态都回到初始化状态
  resetAllDefaultStatus: function () {
    //清空评论框
    this.setData({
      keyboardInputValue: '',
      sendMoreMsgFlag: false
    });
  },


  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },


  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    var leftCount = 3 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    console.log(leftCount)
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        // 可以分次选择图片，但总数不能超过3张
        console.log(res)
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      }
    })
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      });
    }, 500)
  },


  playAudio: function (event) {
    var url = event.currentTarget.dataset.url,
      that = this;

    //暂停当前录音
    if (url == this.data.currentAudio) {
      wx.pauseVoice();
      this.data.currentAudio = ''
    }

    //播放录音
    else {
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        complete: function () {
          //只有当录音播放完后才会执行
          that.data.currentAudio = '';
          console.log('complete')
        },
        success: function () {
          console.log('success')
        },
        fail: function () {
          console.log('fail')
        }
      });
    }
  }

})