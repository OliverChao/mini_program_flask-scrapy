Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    addArr: [],
    style: "width: 60rpx;border-radius: 50%; text-align: center;color: #fff; background-color: #B0E2FF; margin: 0 auto;",
    id: null,
    daylist: [],
    taskname: "",
    taskadress: "",
    showModal: false,
    list: [],
    isRealtaday: false
  },
  onLoad: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
      id: this.data.isToday
    })
  },
  onShow: function () {
    var that = this;
    this.data.id = this.data.isToday;
    wx.getStorage({
      key: 'list',
      success: function (res) {
        var list = res.data;
        that.setData({ list: list });
        console.log("list 緩存獲取成功")
      },
      fail: function () {
        console.log("list  緩存獲取失敗")
      }
    })
    this.loadevent();
  },
  onUnload: function () {
    console.log("111111111111111111111")
    this.data.id = this.data.isToday;
    this.data.taskadress = null;
    this.data.taskname = null;
    var list = this.data.list;
    console.log(this.data.list);
    wx.setStorage({
      key: 'list',
      data: list,
      success: function () {
        console.log("list 緩存設置成功")
      },
      fail: function () {
        console.log("list 緩存設置失敗")
      }
    })

  },
  dateInit: function (setYear, setMonth) {
    this.data.addArr = [];
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                        //需要遍历的日历数组数据
    let arrLen = 0;                            //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                            //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5,
          style: null
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  loadday: function (e) {

    console.log(e.currentTarget.id);
    let i = 0, j = 0;
    for (i = 0; i < this.data.addArr.length; i++) {
      for (j = 0; j < this.data.dateArr.length; j++)
        if (this.data.addArr[i] == this.data.dateArr[j].isToday) {
          this.data.dateArr[j].style = "";
        }
    };
    let id = e.currentTarget.id;
    let len = this.data.addArr.length;
    this.data.addArr[len] = id;
    let dateArr = this.data.dateArr;
    for (i = 0; i < dateArr.length; i++) {
      if (dateArr[i].isToday == id) {
        dateArr[i].style = this.data.style;
        break;
      }
    }
    this.data.id = id;
    this.setData({ dateArr: dateArr, id: id });
    console.log("這是點擊id" + this.data.id);
    //this.loadevent();
  },
  loadevent: function () {
    var that = this;
    var daylist = [];
    this.setData({ daylist: daylist });
    console.log("day" + daylist)
    for (let i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].id == this.data.id) {
        daylist.push(this.data.list[i])
      }
    }
    this.setData({ daylist: daylist })
    console.log("這是daylist")
    console.log(daylist)

  },
  deleteevent: function (e) {
    var tempid = e.currentTarget.id;
    var templist = this.data.list;
    var cnt = 0;
    for (let i = 0; i < templist.length; i++) {
      if (templist[i].isToday == this.data.id) {
        cnt++;
        if (cnt == tempid) {
          templist.splice(i, 1);
          console.log("删除事件成功");
          this.setData({ list: templist });
          break;
        }
      }
    }
  },
  addevent: function () {
    // this.taskname();
    // this.taskadress();
    //this.loadevent();
    var daylist = this.data.daylist;
    var list = this.data.list;
    let task = { isToday: "1", taskname: "无", taskadress: "无" };
    var that = this;
    task.isToday = that.data.id;
    task.taskname = that.data.taskname;
    task.taskadress = that.data.taskadress;
    if (this.data.taskname != null) {
      list.push(task);
      daylist.push(task);
      this.setData({ list: list, daylist: daylist });
      console.log("this list")
      console.log(this.data.list)
      this.hideModal();
    }
    else {
      wx.showToast({
        title: '不能发送空内容',
        image: '/images/icon/cuowutishi.png'
      })
      return;
    }
  },
  taskname: function (e) {
    this.data.taskname = e.detail.value;
    console.log("任務名稱" + this.data.taskname)
  },
  taskadress: function (e) {
    this.data.taskadress = e.detail.value;
    console.log("任務地點" + e.detail.value)
  },

  hideModal: function () {
    this.setData({
      showModal: false
    })
  },

  canceltask: function () {
    this.data.taskname = null
    this.data.taskadress = null
    this.hideModal();
  },
  showDialogBtn: function () {

    this.setData({
      showModal: true
    })
  },

})
