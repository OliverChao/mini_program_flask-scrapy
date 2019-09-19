// pages/mine/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  //背景设置
  bgsetting:function(){
    wx.navigateTo({
      url: '../setting/bg/bg',
    })
  },
  //事件源:showDialogBtn 
  onus: function () {
    this.setData({
      showModal: true
    })
  },

  //加载备份
  loadingcloud: function () {
    wx.showToast({
      title: '未设置',
    })

  },
  //清除缓存
  clearstorage: function () {
    var condition = [false, false, false, false, false, false];
    wx.removeStorage({
      key: 'taskslist',
      success: function (res) {
        console.log("setting 清除缓存taskslist成功");
        wx.showToast({
          title: '缓存清除成功',
        })
      },
      fail: function () {
        console.log("seeting 清除缓存taskslist失败");
        wx.showToast({
          title: '缓存清除失败',
        })
      },
      complete: function () {
      }
    });
    wx.removeStorage({
      key: 'condition',
      success: function (res) {
        console.log("condition 缓存请理成功")
      },
      fail: function () {
        console.log("condition 缓存请理失败")
      }
    })
    wx.setStorage({
      key: 'condition',
      data: condition,
      success: function () {
        console.log("清除缓存后 condition设置成功")
      },
      fail: function () {
        console.log("清除缓存后 condition设置失败")
      }
    })
    wx.setStorage({
      key: 'num',
      data: 6,
      success: function () {
        console.log("num  清除缓存后设置成功");
      },
      fail: function () {
        console.log("num 清除缓存后设置失败");
      }
    })
    wx.removeStorage({
      key: 'list',
      success: function (res) {
        console.log("setting  list  缓存清除成功");
      },
      fail: function () {
        console.log("setting list  缓存清除失败");
      }
    })
  }
})