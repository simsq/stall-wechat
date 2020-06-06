// pages/ranking/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRankList();
  },

  //获取排名数据
  getRankList() {
    var that = this;
    var data = [];
    for (var i = 0; i < 20; i++) {
      data.push({
        'name': '阿强哥' + i,
        'icon': 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg',
        'detail': '光顾过150个地摊，命运不断让他们相遇'
      });
      that.setData({
        rankList: data
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})