// pages/mine/unfinish/unfinish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReal: false,
    taskslist: []
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
    var i = 0;
    var that = this;
    wx.getStorage({
      key: 'unfinishtask',
      success: function (res) {
        console.log("unfininshtask 正在获取缓存");
        console.log(res.data);
        var taskslist = res.data;
        that.setData({ taskslist: taskslist });
        //背景图加载
        if (taskslist.length > 0)
          that.setData({ isReal: false });
        else
          that.setData({ isReal: true });
      },
      fail: function () {
        console.log("unfinish 缓存加载失败");
      },
      complete: function () {
        console.log("unfinish?")
      }
    })
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

  }
})
