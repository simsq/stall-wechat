const app = getApp();
import api from '../../utils/request';
import keyword from '../../utils/keyword';
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
    name: "",
    thisAddress: "",
    latitude: 0,
    longitude: 0,
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

  //地摊名字
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //描述
  textareaBInput(e) {
    this.setData({
      description: e.detail.value
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
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
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
    wx.showLoading({
      title: '拼命保存中',
    })
    var that = this;

    var check = false;
    keyword.sensitiveWords.forEach(function(v) {
      if (that.data.description.indexOf(v) > -1) {
        check = true
        return false;
      }
      if (that.data.name.indexOf(v) > -1) {
        check = true
        return false;
      }
    });

    if (check) {
      wx.showToast({
        title: '存在敏感字符',
        image: '../../images/nodata.png',
      })
      return false
    }
    api.post("/stall/add", {
      'name': that.data.name,
      'description': that.data.description,
      'thisAddress': that.data.thisAddress,
      'latitude': that.data.latitude,
      'longitude': that.data.longitude,
    }).then(res => {
      if (res.isSuccess) {
        that.saveImages(res.data);
        return false;
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '系统提示',
          content: res.message,
        })
      }
    });
  },
  saveImages: function(stallCode) {
    var that = this;
    var count = that.data.imgList.length;
    var sucessCount = 0;
    that.data.imgList.forEach(el => {
      wx.uploadFile({
        url: app.globalData.host + '/stall/addimages',
        filePath: el,
        name: 'files',
        header: {
          'code': stallCode
        },
        success: function(res) {
          sucessCount++;
          if (sucessCount == count) {
            wx.hideLoading();
            wx.showModal({
              title: '系统提示',
              content: '恭喜您上报成功，审核通过后将会在地图上展示',
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          }
        },
        fail: function(res) {

        }
      })
    });


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})