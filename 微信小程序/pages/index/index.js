// index.js
// 获取应用实例
var cs=1;
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  xuanxiang(){
wx.navigateTo({
  url: '/pages/index/xuanxiang',
})
  },

  chi(){
   
if (cs<4) {
      this.getcode(),
      wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 500//持续的时间
     }),
     cs=cs+1
} else { 
   wx.showModal({
  title: '一天天的',
  content: '你咋这么挑呢',
  success: function (res) {
    if (res.confirm) {//这里是点击了确定以后
      console.log('用户点击确定')
    } else {//这里是点击了取消以后
      console.log('用户点击取消')
    }
  }
}),

cs=0
}
  },
  getcode(){
    var codede;
    codede="";
  //  var timestamp =Date.parse(new Date());
  //  var n = timestamp *1000;
  //  var date = new Date(n);
  //  var s =date.getSeconds();
 //   var random=new Array("满座","红星","手擀面","刀削面","贵州小吃","张记");
  //  var id = Math.floor(s/6);

   var id = Math.ceil(Math.random()*app.globalData.caidan.length);
  id=id-1;
   codede = app.globalData.caidan[id];
  
    this.setData({
      //code: code
      code:codede
    })
  }


})

