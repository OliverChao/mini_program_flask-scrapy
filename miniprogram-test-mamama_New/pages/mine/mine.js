//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
 
  },

  myposts:function(){
    wx.navigateTo({
      url: '../mine/myposts/myposts'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  test_log: function () {

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

  onShow: function(){
    this.app = getApp();

    this.app.slideupshow(this, 'slide_up1', -400, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -400, 1)
    }.bind(this), 200);

  },

  onHide:function(){
    this.app = getApp();

    this.app.slideupshow(this, 'slide_up1', 400,0.5 )
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 400, 0.5)
    }.bind(this), 200);
  },

  

  onLoad: function () {
    
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    this.getUserInfo();

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
  },
  getUserInfo: function () {
    this.setData({
      userInfo:app.globalData.userInfo,
      hasUserInfo: true
    })
  },
  gofuture:function()
  {
    wx.navigateTo({
      url: '../mine/future/future',
    })
  },
  resttask:function()
  {
    wx.navigateTo({
      url: '../mine/unfinish/unfinish',
    })
  },
  finishtask:function()
  {
    wx.navigateTo({
      url: '../mine/finish/finish',
    })
  },
  communiacate:function()
  {
    //跳转到其他应用
  },
  setting:function()
  {
    wx.navigateTo({
      url: '../mine/setting/setting',
    })
  }
})
