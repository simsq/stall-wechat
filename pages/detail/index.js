const app = getApp();
import api from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    swiperList: [], //图片列表
    stallInfo: {},
    commentList: [], //评论列表
    qiandaoText: '', //签到内容
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      stallInfo: options
    });
    that.getImages();
    that.towerSwiper('swiperList');
    that.getComment();
  },

  //获取地摊详情
  getImages: function() {
    var that = this;
    api.get("/stall/images?stallCode=" + that.data.stallInfo.stallCode, {}).then(res => {
      if (res.isSucess) {
        that.setData({
          swiperList: res.data
        });
      }
    });
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
    var that = this;
    wx.openLocation({
      latitude: parseInt(that.data.stallInfo.latitude),
      longitude: parseInt(that.data.stallInfo.longitude),
      scale: 18,
      name: '终点',
      address: that.data.stallInfo.address
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
    this.setData({
      qiandaoText: e.detail.value
    })
  },
  //保存签到数据
  qiandaoSave: function() {
    var that = this;
    that.setData({
      modalName2: ''
    })
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo;
        api.post('/stallcomment/add', {
          'reamrk': that.data.qiandaoText,
          'stallCode': that.data.stallInfo.stallCode,
          'nickName': userInfo.nickName,
          'avatarUrl': userInfo.avatarUrl,
          'gender': userInfo.gender, //性别 0：未知、1：男、2：女
          'province': userInfo.province,
          'city': userInfo.city,
          'country': userInfo.country,
        }).then(res => {
          if (res.isSuccess) {
            that.setData({
              qiandaoText: ''
            })
            wx.showToast({
              title: '签到成功+10分',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              pageIndex: 1,
              commentList: []
            })
            that.getComment();
            // that.setData({
            //   commentList:that.data.commentList.unshift({
            //     'reamrk': that.data.qiandaoText,
            //     'stallCode': that.data.stallInfo.stallCode,
            //     'nickName': userInfo.nickName,
            //     'avatarUrl': userInfo.avatarUrl,
            //     'gender': userInfo.gender
            //   })
            // })

          } else {
            wx.showToast({
              title: res.message,
              image: '../../images/error.png',
              duration: 2000
            })
          }
        })
      }
    })
  },
  //获取用户评论列表
  getComment: function() {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    const perpage = 10;
    const newlist = [];

    function parameterData() {};
    var parameterData = new parameterData();
    parameterData.PageIndex = that.data.pageIndex;
    parameterData.PageSize = 10;
    parameterData.stallCode = that.data.stallInfo.stallCode
    var url = '/stallcomment/getcommentlist';
    api.get(url, parameterData).then(res => {
      wx.hideToast();
      if (res.isSuccess) {
        if (res.data.length > 0) {
          that.setData({
            commentList: that.data.commentList.concat(res.data)
          })
        } else {
          if (that.data.pageIndex>1){
            wx.showToast({
              title: '没有数据了',
              image: '../../images/nodata.png',
            })
          }
          
        }

      }
    });
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
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getComment();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})