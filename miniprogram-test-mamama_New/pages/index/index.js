const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = false;
innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
});

innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
});

Page({
  /**
   * 页面的初始数据
   */
  data: {

    FirstRun: false,
    isRunning: true,
    step: 1,
    num: 0,
    start: -0.5 * Math.PI,
    end: 1.5 * Math.PI,
    time: null,
    n: 5,
    src: null,
    target: "pppppp",
    isplaying: true,
    id: 1,
    showModal: false,
    experience: '无',
    items: [
      { name: "yes" },
      { name: "no" }
    ]


  },
  canceltask: function () {
    this.setData({
      showModal: false,
      isRunning: false
    });
    var flag_hide = this.flag_hide;
    clearInterval(this.data.time);
    innerAudioContext.stop();
    app.globalData.target = "";
    wx.navigateBack({
      url: '/pages/taskslist/taskslist',
    })
  },
  confirmtask: function () {
    this.setData({
      showModal: false,
      isRunning: false
    });
    var flag_hide = this.flag_hide;
    clearInterval(this.data.time);
    innerAudioContext.stop();
    app.globalData.target = "";

    wx.navigateTo({
      url: '/pages/post/post-new/post-new',
    })
  },


  hideModal: function () {

    this.setData({
      showModal: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.n = app.globalData.TaskTime;
    console.log("时间传输" + options.target);
    this.setData({ target: options.target, id: options.id });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!this.data.FirstRun) {
      this.strat()
    } else {
      setData({
        FirstRun: true
      })
      return
    }
    innerAudioContext.play();
  },
  //开始时调用时间
  strat() {
    this.ringMove(this.data.start, this.data.end);
    // 创建倒计时
    this.data.time = setInterval(this.animation.bind(this.data), 1000);
  },
  //循环
  animation() {
    var showModal = this.data.showModal
    if (this.data.step <= this.data.n && this.data.isRunning) {
      var End = this.data.end
      End = End + 2 * Math.PI / this.data.n
      var Step = this.data.step + 1
      this.setData({
        end: End,
        step: Step
      })
      this.ringMove(this.data.start, this.data.end);
    } else {
      var Time = app.globalData.allTime
      var count = app.globalData.count
      Time += this.data.n
      count += 1
      app.globalData.allTime = Time
      app.globalData.count = count
      console.log("这是问题所在1111");
      var arr = getCurrentPages();
      let id = this.data.id;
      app.globalData.condition[id] = true;

      //return 0;
      console.log("这是问题所在33333");
      console.log(app.globalData.allTime, app.globalData.count)
    }
  },
  //绘图以及显示剩余时间
  ringMove(s, e) {
    var context = wx.createCanvasContext('round')
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");


    // 绘制圆环
    context.setStrokeStyle('black')
    context.beginPath()
    context.setLineWidth(3)
    context.arc(150, 150, 130, s, e, true)
    context.stroke()
    context.closePath()

    var minute = parseInt((this.data.n - this.data.num) / 60)
    if (minute < 10) {
      minute = "0" + minute
    }
    var seconds = (this.data.n - this.data.num) % 60
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    // 绘制倒计时文本

    context.beginPath()
    context.setLineWidth(1)
    context.setFontSize(40)
    context.setFillStyle('red')
    context.setTextAlign('center')
    context.setTextBaseline('middle')
    context.fillText(minute + ":" + seconds, 150, 150, 100)
    context.fill()
    context.closePath()

    context.draw()

    // 每完成一次全程绘制就+1
    this.data.num++;
  },
  // //设置完成状态
  // setcondition:function(id)
  // {
  //   var that =this;
  //   console.log("idididid111" + id);
  //   wx.getStorage({
  //     key: 'taskslist',
  //     success: function (res) {
  //       that.data.taskslist = res.data;
  //       console.log("taskslist 看看获取成功了吗" + that.data.taskslist);
  //       console.log(that.data.taskslist)
  //     },
  //     fail: function () {
  //       console.log("index taskslist 获取失败")
  //     }
  //   });
  //   console.log("idididid2222" + id);
  //   console.log("taskslist taskslist " + that.data.taskslist);
  //   that.data.taskslist[id].condition= true;
  //   wx.removeStorage({
  //     key: 'taskslist',
  //     success: function (res) {
  //       console.log("index  清除taskslist成功")
  //     },
  //   });
  //   wx.setStorage({
  //     key: 'taskslist',
  //     data: that.data.taskslist,
  //     success: function () {
  //       console.log("taskslist index 缓存设置成功")
  //     },
  //     fail: function () {
  //       console.log("tasklist index 缓存设置失败")
  //     }
  //   })
  // },
  //开关
  pause() {
    this.setData({
      isRunning: false
    })
    clearInterval(this.data.time);
    innerAudioContext.pause();
  },
  continue() {
    this.setData({
      isRunning: true
    })
    this.data.time = setInterval(this.animation.bind(this.data), 1000);
    innerAudioContext.play();
  },
  giveUp: function () {
    this.setData({
      showModal: true,
      isRunning: false
    })
    var flag_hide = this.flag_hide;
    clearInterval(this.data.time);
    innerAudioContext.stop();
    app.globalData.target = "";

  },

  shareatricle: function () {

    console.log("111");
    app.globalData.sharetarget = this.data.target;
    console.log("appsharetarget" + app.globalData.sharetarget);
    app.globalData.flag = 1;

  this.setData({
    showModal:false
  })
    wx.navigateTo({
      url: '../post/post-new/post-new',
    })
  },
  onShow: function () {
    innerAudioContext.play();
    // console.log("时间时间"+options.temptime);
    // this.data.n = options.temptime;
    // this.setData({ target:options.temptarget });
  },
  onHide: function () {
    this.giveUp();
    innerAudioContext.stop();
    clearInterval(this.data.time);
    app.globalData.TaskTime = 1500;
 
  },
  playmusic: function () {
    this.setData({ isplaying: true });
    innerAudioContext.play();
  },
  pausemusic: function () {
    this.setData({ isplaying: false });
    innerAudioContext.pause();
  },
  setexperience: function (e) {
    this.data.experience = e.detail.value;
    wx.removeStorage({
      key: 'idandexp',
      success: function (res) {
        console.log("移除成功")
      },
      fail: function () {
        console.log("移除失败")
      }
    });
    let idandexp = [{ exp: this.data.experience, id: this.data.id }];
    wx.setStorage({
      key: 'idandexp',
      data: idandexp,
      success: function () {
        console.log("idandexp添加缓存成功");
      },
      fail: function () {
        console.log("idandexp加载缓存失败");
      },
      complete: function () {
      }
    })
  }
})