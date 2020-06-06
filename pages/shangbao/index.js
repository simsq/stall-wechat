const app = getApp();
var locationConvert = require('../../utils/WSCoordinate.js')
var bmap = require('../../utils/bmap-wx.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgList: [],
    description: "",
    thisAddress: "",
    baiduLatitude: 0,
    baiduLongitude: 0,
    region: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'IVCBZ-F3N2P-Z3BDR-L3QCP-RWXFH-TOFZD'
    });
    var that = this;
    that.convertAddress();
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },

  fail: function() {
    console.log('小程序得到坐标失败')
  },
  //改变地址信息
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //获取精准地址
  convertAddress() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: function(res) {
        // that.setData({
        //   baiduLatitude: res.latitude,
        //   baiduLongitude: res.longitude
        // });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {          
            var address = addressRes.result.address;
            that.setData({
              thisAddress: address
            });
            //that.addressConveryBaiDuXY(address); 使用腾讯地图无需转换
          }
        })
      },
    })
  },

  //地址转百度坐标
  addressConveryBaiDuXY(address) {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'PEzskSTZRUQUynl6OoxaWc78EdsQ3hNO'
    });
    var fail = function(data) {
      wx.showModal({
        title: '系统提示',
        content: data,
      })
    };
    var success = function(data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        baiduLatitude: wxMarkerData[0].latitude,
        baiduLongitude: wxMarkerData[0].longitude
      });
    }
    BMap.geocoding({
      address: address,
      fail: fail,
      success: success
    });
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '地摊王',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //保存用户上报数据
  save: function() {
    var that = this;
    var imgList = that.data.imgList;
    wx.login({
      success(res) {
        if (res.code) {
          //请后台换取OpenId
        }
      }
    })
    // wx.getUserInfo({
    //   success: function(res) {
    //     debugger;
    //   }
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})