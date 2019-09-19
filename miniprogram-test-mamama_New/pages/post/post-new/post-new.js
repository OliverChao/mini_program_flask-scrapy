// pages/post/post-new/post-new.js
const app = getApp()
import {
  getDiffTime
} from '../../../util/util.js'

// let avatar = app.globalData.g_userInfo.avatarUrl?app.globalData.g_userInfo.avatarUrl:''
const request = require('../../../util/request.js');
// var post_imgs = []
// var return_server_imgs = []
var curPage = null
var prePage = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // post_info   用户直接可以在 post页看到 自己刚才发布的 article
    post_info: {
      article_info: {
        article_since: -1,
        // 把 默认 字 绑在这里来
        body: '',
        comment_num: 0,
        like_num: 0,
        reading_num: 0,
        id: -1,

      },
      flag : 0,

      user_info: {
        permission: true,
        avatar_url: '',
        province: '',
        city: '',
        gender: '',
        learn_time: 0,
        nickname: '',
      },
      img_info: [],

      comment_info: []
    },

    chooseFiles: [],
    resFiles: [],
    deleteIndex: -1,
  },

  zhushi:function(){
    wx.showToast({
      title: '努力优化中------',
    })
  },

   // 最终 发表 函数 ， 可以实现  同步  问题  核心代码函数之一
   psot_all: function () {
    var that = this
    // console.log(successFun)
    // return new Promise(function (resolve, reject) {
      // var fileList = new Array()
    var token = app.globalData.token
    if(!token){
      // 没有 token， 不能发表，给提示
      return ;
    }
     if (that.data.post_info.article_info.body == '' || undefined || null) {
       wx.showToast({
         title: '不能发送空内容',
         image: '/images/icon/cuowutishi.png'
       })
       return;
     }

      if(!this.data.chooseFiles.length){
        that.postart()
        return 
      }
      for (var i in curPage.data.chooseFiles) {
        var path = curPage.data.chooseFiles[i]
        wx.uploadFile({
          url: app.combineURL('upload/imags'),
          filePath: path,
          name: 'img', //这里根据自己的实际情况改
          formData: {
            'imgIndex': i,
            'suffix': path.substring(path.length - 3)
          },
          header: {
            "Content-Type": "multipart/form-data",
            // 'token'   标志    用户
            // token: 
            'token': token
          },
          success: (res) => {
            var res_data = JSON.parse(res.data)
            // return_server_imgs.push(res_data.path)
            let img_info = {imgurl:res_data.path}
            curPage.data.resFiles.push(res_data.path)
            curPage.data.post_info.img_info.push(img_info)
            // fileList[i] = res_data.path
            console.log(res)
            if(curPage.data.resFiles.length==curPage.data.chooseFiles.length){
              console.log('now ... command.....')
              // 
              that.postart()
              // 
              console.log(curPage.data.resFiles)
            }
          },
          fail: (res) => {
            // failed  receives
            console.log(res)
          },
          complete: () => {

          }
        })
      }

  },


  // 测试函数 ，显示  选择的图片和 服务器返回的图片
  showimgsdata: function () {
    console.log('choose_imgs', this.data.chooseFiles)
    console.log('resFiles', this.data.resFiles)
    console.log('img_info', this.data.post_info.img_info)

  },

  // 测试函数  随时改，随时看数据
  testdata_function:function(){
    console.log(curPage.data.post_info)
    console.log(prePage.data)
  },





  // 绑定文章数据
  bindDetail: function (e) {
    this.setData({
      'post_info.article_info.body':e.detail.value
    })
    // this.data.post_info.article_info.body = e.detail.value
    console.log(this.data.post_info.article_info.body)
  },



  // 服务器返回函数， 同步 核心代码 函数  之一
  postart: function () {

    // let first_page = currentPages[currentPages.length - 2]
    let allpost = prePage.data.posts
    let nowtime = parseInt(new Date().getTime() / 1000)
    let that = this
    this.setData({
      'post_info.article_info.article_since': getDiffTime(nowtime)
    })
    
    // this.data.post_info.article_info.article_since = nowtime
    // allpost.unshift(this.data.post_info)

    // console.log('after', allpost)
    // 必须 同步 上传到 服务器 后，才跳转。
    // 上传到 服务器 ，返回给 本 文章 一个 id 
    let url = app.combineURL('post')
    // let token = app.globalData.token
    let token = app.globalData.token
    if(!token){
      return ;
    }
    let params = {
      'articleinfo': JSON.stringify({
        'body': that.data.post_info.article_info.body,
        'article_since': nowtime
      }),
      // 选择 图片  功能  设置。。
      imgurls: JSON.stringify(that.data.resFiles)
    }
    request.requestPostApi(url, token, params, this, function (res, sourceObj) {

      console.log(res)
      // 给 文章 赋值  
      that.setData({
        'post_info.article_info.id':res.post_id
      })
      // that.data.post_info.article_info.id = res.post_id
      // 提交 成功， 设 flag 为 1
      that.setData({
        'flag': 1
      })

      allpost.unshift(that.data.post_info)      

      prePage.setData({
        posts: allpost,
        thistime: nowtime,
        page: 1
      })

      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function (res) {
          prePage.onLoad()
          console.log('back    >>>&&   send data to server')
        },

        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })

      console.log(res.code)
    }, function (res, sourceObj) {
      wx.showToast({
        title: '提交失败，请重新提交',
        icon: ''
      })

    })



  },


  onLoad: function (options) {
    // 获取页面
    

    // 获取 用户信息，这里 可能要 完善 
    let user = wx.getStorageSync('user')

    if (!user) {
      wx.getUserInfo({
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


    // 设置  user_info 
    this.setData({
      'post_info.user_info': {
        permission: true,
        avatar_url: user.avatarUrl,
        province: user.province,
        city: user.city,
        gender: user.gender,
        learn_time: 0,
        nickname: user.nickName
      },
      // sharetarget: app.globalData.sharetarget,
      // flag: app.globalData.flag
    })

    // console.log("postnew" + this.data.sharetarget);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let pages =  getCurrentPages()
    // curPage = pages.pop()
    // prePage = pages[pages.length - 2]
    // console.log('pages',pages)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 完成  状态页 
    let pages =  getCurrentPages()
    console.log('pages',pages)
  
    curPage = pages.pop()    // 当前页
    prePage = pages.pop()    // 父 页
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.sharetarget = '今天完成了许多任务';
    app.globalData.flag = 0;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // post_imgs = []
    // return_server_imgs = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // 下面的 
  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    var leftCount = 4 - imgArr.length;
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
})