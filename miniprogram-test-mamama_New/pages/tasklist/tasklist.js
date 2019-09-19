// pages/tasklist/tasklist.js

const { $Message } = require('../../dist/base/index');
const app = getApp();
var tasks = [
  { name: "单击开始 长按删除", url: "/image/yundong.png", time: 1500, target: '生活有度，人生添寿。  ', color: 'ac92ec', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
  { name: "工作", url: "/image/gongzuobao.png", time: 1500, target: '真理惟一可靠的标准就是永远自相符合。', color: 'fe6471', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
  { name: "学习", url: "/image/xuexi.png", time: 1500, target: '时间是一切财富中最宝贵的财富。', color: 'f4b2a6 ', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
  { name: "思考", url: "/image/sikao.png", time: 1500, target: '世界上一成不变的东西，只有“任何事物都是在不断变化的”这条真理。 ', color: 'ecccb3', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
  { name: "写作", url: "/image/tubiaozhizuomoban-.png", time: 1500, target: '过放荡不羁的生活，容易得像顺水推舟，但是要结识良朋益友，却难如登天。', color: 'bcefd0', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
  { name: "阅读", url: "/image/yuedu.png", time: 1500, target: '理想是人生的太阳。', color: 'c3ecee', condition: false, experience: "无", givereason: "无" ,moment:'2019年4月20日'}
];
import {
  getDiffTime
} from '../../util/util.js'

// let avatar = app.globalData.g_userInfo.avatarUrl?app.globalData.g_userInfo.avatarUrl:''
const request = require('../../util/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    icon:"/images/icon/sikao.png",

    taskslist_1:[
      { name: "记录美好生活", url: "",  color: 'ac92ec', condition: false},
    ],
    
    isReal: false,
    taskname: '',
    num: 6,
    num_a:2,
    tasktime: null,
    target: '',
    where: 0,
    color: ["ac92ec", "fe6471", "f4b2a6  ", "ecccb3", "bcefd0", "c3ecee"],
    isThis:true,
    confirmcolor: "fe6471",

    taskslist: [
      { name: "单击开始 长按删除", url: "/image/yundong.png", time: 1500, target: '生活有度，人生添寿。  ', color: 'ac92ec', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
      { name: "工作", url: "/image/gongzuobao.png", time: 1500, target: '真理惟一可靠的标准就是永远自相符合。', color: 'fe6471', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "学习", url: "/image/xuexi.png", time: 1500, target: '时间是一切财富中最宝贵的财富。', color: 'f4b2a6 ', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "思考", url: "/image/sikao.png", time: 1500, target: '世界上一成不变的东西，只有“任何事物都是在不断变化的”这条真理。 ', color: 'ecccb3', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
      { name: "写作", url: "/image/tubiaozhizuomoban-.png", time: 1500, target: '过放荡不羁的生活，容易得像顺水推舟，但是要结识良朋益友，却难如登天。', color: 'bcefd0', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "阅读", url: "/image/yuedu.png", time: 1500, target: '理想是人生的太阳。', color: 'c3ecee', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' }
    ],
    select: false,
    tubiao: [
      '/image/yundong.png',
      "/image/gongzuobao.png",
      "/image/xuexi.png",
      "/image/tubiaozhizuomoban-.png",
      "/image/yuedu.png",
      "/images/icon/sikao.png",
      "/images/icon/tubiaozhizuomoban.png",
      "/images/icon/yundong.png",
      "/images/icon/hecha.png",
      "/images/icon/yuwen.png",
      "/images/icon/shuxue.png",
      "/images/icon/yingyu.png",
      "/images/icon/wuli.png",
      "/images/icon/huaxue.png",
      "/images/icon/shengwu.png",
      "/images/icon/lishi.png",
      "/images/icon/shangwang.png",
      "/images/icon/dengshan.png",
    ]

  },

  changethis:function(){
    var isThis= this.data.isThis;
    var num_a=this.data.num_a;
    if(num_a%2==0){
      num_a=num_a + 1;
    this.setData({
      isThis:false,
      num_a:num_a
    })
      this.app = getApp();
   
    }
    else if(num_a%2!=0) {
      num_a =num_a + 1
      this.setData({
        isThis: true,
        num_a: num_a
      })
     
    }

    if(num_a==10){
      this.setData({
        num_a:2
      })
    }
    console.log("isthis:"+isThis);
    console.log(num_a);
  },

  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },

  mySelect(e) {
    var icon = e.currentTarget.dataset.name
    this.setData({
      select: false,
      icon: icon
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setcondition();
    this.app = getApp();
    var that = this;
    showView: (options.showView == "true" ? true : false);
    wx.setStorage({
      key: 'idandexp',
      data: [{ id: 0, exp: "喜欢" }],
      success: function () {
        console.log("taskslist成功")
      },
      fail: function () {
        console.log("加载失败")
      }
    });
    wx.setStorage({
      key: 'num',
      data: 6,
      success: function () {
        console.log("onload num设置成功")
      },
      fail: function () {
        console.log("onload num设置失败")
      }
    })
    wx.getStorage({
      key: 'taskslist',
      success: function (res) {
        that.setData({ taskslist: res.data })
      },
    })
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
   
    this.app = getApp();
    this.app.slideupshow(this, 'slide_up1', -200, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200);
 

    // this.data.taskslist[app.globalData.id]=true;
    // this.setData();
    var tasks = [
      { name: "单击开始 长按删除", url: "/image/yundong.png", time: 1500, target: '生活有度，人生添寿。  ', color: 'ac92ec', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "工作", url: "/image/gongzuobao.png", time: 1500, target: '真理惟一可靠的标准就是永远自相符合。', color: 'fe6471', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "学习", url: "/image/xuexi.png", time: 1500, target: '时间是一切财富中最宝贵的财富。', color: 'f4b2a6 ', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日'},
      { name: "思考", url: "/image/sikao.png", time: 1500, target: '世界上一成不变的东西，只有“任何事物都是在不断变化的”这条真理。 ', color: 'ecccb3', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
      { name: "写作", url: "/image/tubiaozhizuomoban-.png", time: 1500, target: '过放荡不羁的生活，容易得像顺水推舟，但是要结识良朋益友，却难如登天。', color: 'bcefd0', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' },
      { name: "阅读", url: "/image/yuedu.png", time: 1500, target: '理想是人生的太阳。', color: 'c3ecee', condition: false, experience: "无", givereason: "无", moment: '2019年4月20日' }
    ];
    var that = this;
    var temptask = [];
    wx.getStorage({
      key: 'taskslist',
      success: function (res) {
        temptask = res.data;
        console.log("temptask" + temptask);
        for (let i = 0; i < temptask.length; i++) {
          temptask[i].condition = app.globalData.condition[i];
        }
        that.setData({ taskslist: temptask });
        console.log("onshow taskslist加载缓存成功");
      },
      fail: function () {
        console.log("onshow taskslist加载缓存失败");
        that.setData({ taskslist: tasks });
      }
    });
    wx.getStorage({
      key: 'idandexp',
      success: function (res) {
        var idandexp = res.data;
        console.log(idandexp);
        console.log("idandexp     " + idandexp[0].id);
        let temp = 0;
        let tempid = idandexp[temp].id;
        let tempexp = idandexp[temp].exp;
        console.log("tempid" + tempid);
        console.log("temptask[0]:" + temptask[0]);
        if (typeof (temptask[tempid]) != "undefined") {
          temptask[tempid].experience = tempexp;
          console.log("加载缓存成功idandexp");
        }
      },
      fail: function () {
        console.log("获取失败");
      },
      complete: function () {
      }
    });
    wx.getStorage({
      key: 'num',
      success: function (res) {
        console.log("num:" + res.data);
        var num = res.data;
        that.data.num = num;
        if (num > 0) that.setData({ isReal: false });
        console.log("num taskslist 设置成功");
      },
      fail: function () {
        console.log("num taskslist 获取失败");
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    //你可以看到，动画参数的200,0与渐入时的-200,1刚好是相反的，其实也就做到了页面还原的作用，使页面重新打开时重新展示动画
    this.app.slideupshow(this, 'slide_up1', 300, 0.1)
    //延时展现容器2，做到瀑布流的效果，见上面预览图
    setTimeout(function () {
      this.app.slideupshow(this, 'slFide_up2', 300, 0.1)
    }.bind(this), 200);
  
    var taskslist = this.data.taskslist;
    var condition = [];
    for (let i = 0; i < this.data.taskslist.length; i++) {
      condition.push(this.data.taskslist[i].condition);
    };
    wx.setStorage({
      key: 'condition',
      data: condition,
      success: function () {
        console.log("condition 设置缓存成功");
      },
      fail: function () {
        console.log("condition 设置缓存失败");
      }
    });
    wx.removeStorage({
      key: 'taskslist',
      success: function (res) {
        console.log(" onhide taskslist缓存清除成功");
      },
      fail: function () {
        console.log("onhide taskslist缓存清除失败");
      },
      complete: function () {
      }
    });
    wx.setStorage({
      key: 'taskslist',
      data: taskslist,
      success: function () {
        console.log("onhide taskslist 缓存成功");
      },
      fail: function () {
        console.log("onhide taskslist 缓存失败");
      },
      complete: function () {
      }
    });

    var unfinishtask = [];
    for (let i = 0; i < this.data.taskslist.length; i++) {
      if (this.data.taskslist[i].condition == false) {
        var temp = this.data.taskslist[i];
        unfinishtask.push(temp);
      }
    };
    wx.removeStorage({
      key: 'unfinishtask',
      success: function (res) {
        console.log("unfinishtask 缓存清除成功")
      },
      fail: function () {
        console.log("unfinishtask 缓存清除失败")
      }
    });
    wx.setStorage({
      key: 'unfinishtask',
      data: unfinishtask,
      success: function () {
        console.log("unfinishtask 添加成功");
      },
      fail: function () {
        console.log("unfinishtask 添加失败");
      }
    });
    var finishtask = [];
    for (let i = 0; i < this.data.taskslist.length; i++) {
      if (this.data.taskslist[i].condition == true) {
        var temp = this.data.taskslist[i];
        finishtask.push(temp);
      }
    };
    wx.removeStorage({
      key: 'finishtask',
      success: function (res) {
        console.log("finishtask 缓存清除成功")
      },
      fail: function () {
        console.log("finishtask 缓存清除失败")
      }
    });
    wx.setStorage({
      key: 'finishtask',
      data: finishtask,
      success: function () {
        console.log("finishtask 添加成功");
      },
      fail: function () {
        console.log("finishtask 添加失败");
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //删除

  /* ----------------------------------------------*/

  deletetask: function (e) {
    var that = this;//定义好that与this的关系
    let id = e.currentTarget.id;
    var taskslist = this.data.taskslist;
    let num1 = this.data.num;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          console.log(taskslist)
          taskslist.splice(id, 1);
          num1 = num1 - 1;
          app.globalData.condition.splice(id, 1);
          //敲黑板！！！在函数中更新数据用that传递
          that.setData({
            taskslist: taskslist,
            num: num1
          })
          wx.setStorage({
            key: 'num',
            data: num1,
            success: function () {
              console.log("num-1 成功")
            },
            fail: function () {
              console.log("num-1 失败")
            }
          })
          if (num1 == 0) {
            that.setData({ isReal: true });
            num: num1
          }

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    });

  },


  handleCancel2() {
    this.setData({
      visible2: false
    });
  },
  handleClickItem2() {
    const action = [...this.data.actions2];
    action[0].loading = true;

    this.setData({
      actions2: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action
      });
      $Message({
        content: '删除成功！',
        type: 'success'
      });
    }, 2000);
  },
  /* ----------------------------------------------*/
  //弹出框
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },

  start: function (e) {
    var that = this;//定义好that与this的关系
    let id = e.currentTarget.id;
    var n = this.data.taskslist[id].time;
    var target = this.data.taskslist[id].target;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要现在开始计时吗？',
      success: function (res) {
        if (res.confirm) {
          console.log("点击的是确定按钮")
          app.globalData.TaskTime = n;
          wx.navigateTo({
            url: '../index/index?target=' + target + '&id=' + id
          })
        }
        else if (res.cancel) {
          console.log("点击的是取消按钮")
        }
      }
    })
  },
  /**
    * 弹窗
    */


  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  canceltask: function () {
    app.globalData.TaskTime = 1500;
    this.tasktime = 1500;
    this.taskname = '无';
    this.hideModal();
  },
  /*----------------------添加按钮点击事件-------------------- */
  settaskname: function (e) {
    this.data.taskname = e.detail.value;
    console.log("设置任务名称" + this.data.taskname);
  },
  settasktime: function (e) {
    let time;
    time = e.detail.value;
    time = 60 * time;
    this.data.tasktime = time;
  },
  settarget: function (e) {
    this.data.target = e.detail.value;
    console.log("设置任务目标" + this.data.target);
  },
  gettime:function(){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日'); 
  },
  confirmtask: function () {

    this.app = getApp();

    this.app.slideupshow(this, 'slide_up1', -200, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200);


    var icon = this.data.icon;
    let num1 = this.data.num;
    let task = { name: '', time:"", url: "../../image/sikao.png", target: "生命在于学习", color: 'f4b2a6', condition: false, experience: "", givereason: "",moment:'2019年4月20日'};
    task.condition = false;
    task.name = this.data.taskname;
    console.log("任务名称" + this.data.taskname);
    task.time = this.data.tasktime;
    task.target = this.data.target;
    console.log("任务目标" + this.data.target);
    console.log("任务时间" + this.data.tasktime);
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today=Y+'年'+M+'月'+D+'日';
    task.moment=today;
    task.url = icon;
    console.log("tubiao" + icon);
    task.color = this.data.confirmcolor;

    if (task.name != null && task.time !=null && task.target !=null ) {
      num1 = num1 + 1;
      this.setData({
        taskslist: this.data.taskslist.concat(task),
        num: num1,
      });
      // app.globalData.condition.concat(task.condition);
      if (num1 > 0) {
        this.setData({ isReal: false });
      }

      this.hideModal();
     }
     else{
      wx.showToast({
        title: '请填全信息',
        image: '/images/icon/cuowutishi.png'
      })
      return;
     }

    
  },
  /*----------------------添加按钮点击事件-------------------- */
  trycolor: function (e) {
    console.log("color" + e.detail.value);
    this.setData({ confirmcolor: e.detail.value });
  },
  /**
   * 对话框确认按钮点击事件
   */

  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  hideback: function () {
    this.setData({
      showView: false
    })
  },
  setcondition: function () {
    wx.getStorage({
      key: 'condition',
      success: function (res) {
        app.globalData.condition = res.data;
        console.log("app condition 缓存加载成功");
      },
      fail: function () {
        console.log("app condition 缓存加载失败");
      }
    });
  }
})