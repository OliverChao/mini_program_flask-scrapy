App({
  //渐入，渐出实现 
  show: function (that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //滑动渐入渐出
  slideupshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //向右滑动渐入渐出
  sliderightshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    var storageData = wx.getStorageSync('postList');
    if (!storageData) {
      var dataObj = require("data/data.js")
      // wx.clearStorageSync();
      wx.removeStorageSync('postList')
      wx.setStorageSync('postList', dataObj.postList);
    }
    this.globalData.token  = wx.getStorageSync('token')
    if(!this.globalData.token)
    {
        this.globalData.token = ''

    }
    // this._getUserInfo();
    // wx.login();
  },
  _getUserInfo: function () {
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage) {
      var that = this;
      wx.login({
        success: function (r) {
          console.log('code', r.code)
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.g_userInfo = res.userInfo
              wx.setStorageSync('user', res.userInfo)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
    else {
      this.globalData.g_userInfo = userInfoStorage;
    }
  },
  combineURL: function (path) {

    return this.globalData.URL + path
  },
  globalData: {
    userInfo: null,
    count: 0,
    TaskTime: 1500,
    allTime: 0,
    target: "mama",
    sharetarget:"好多目标",
    flag:0,
    condition: [false,false,false,false,false,false],

  // 111111111111111111111111111
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "http://t.yushu.im",
    g_userInfo: null,
    g_header: 'application/x-www-form-urlencoded',
    token: '',
    URL: "https://www.oliverlovesannabelle.club/api/"



  }
})