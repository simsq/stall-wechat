const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    stallId: 0, //地摊ID    
    swiperList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      stallId: options.stallId
    });
    that.towerSwiper('swiperList');
  },

  // 初始化towerSwiper
  towerSwiper(name) {
    this.data.swiperList.push({
      id: 1,
      type: 'image',
      url: 'https://pic.colipu.com/pmspic/ItemPicture/20002/20025/20170/49887/Original/49887_6984102.jpg/DetailBig'
    });
    this.data.swiperList.push({
      id: 2,
      type: 'image',
      url: 'https://pic.colipu.com/pmspic/ItemPicture/20004/20046/20301/36539/Original/36539_5748373.jpg/DetailBig'
    });

    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  //导航
  daohang: function() {
    var self = this;
    wx.openLocation({
      latitude: 31.188301443809667,
      longitude: 121.43679594938776,
      scale: 18,
      name: '终点',
      address: '上海市徐汇区古美路1528号'
    })
  },
  //签到
  qiandao: function(e) {
    var code = e.currentTarget.dataset.code;
    this.setData({
      modalName2: 'show'
    })
  },
  //签到内容
  textareaAInput2: function(e) {
    console.log(e.detail.value);
  },
  //邀请ta内容
  textareaAInput: function(e) {
    console.log(e.detail.value);
  },

  //约ta
  yueta: function(e) {
    this.setData({
      modalName: 'show'
    })
  },
  hideModal: function() {
    this.setData({
      modalName: '',
      modalName2: ''
    })
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