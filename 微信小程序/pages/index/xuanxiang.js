// pages/index/xuanxiang.js
 const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  tianjia(caidan){

wx.showModal({
  editable:true,
  placeholderText:"请输入菜名",
success: res => {
  if (res.confirm){
  //  app.globalData.caidan=(res.content)
  app.globalData.caidan.push(res.content)
 // app.globalData.caidan= Array(res.content),

 
 
  this.getcodes()
}

}
})     
},
qingkong(){
  app.globalData.caidan=Array(),
  this.getcodes()
},

getcodes(){
//  var codes;
//  codes="";
 // var random=new Array("满座","红星","手擀面","刀削面","贵州小吃","张记");
// var id = Math.ceil(Math.random()*6);
// id=id-1;


  this.setData({
    
    codes: app.globalData.caidan
  })
}



})

