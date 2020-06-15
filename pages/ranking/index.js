// pages/ranking/index.js
import api from '../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    rankInfo: [],
    isHidden: true,
    imageUrl: '',
    template: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  getRanks() {
    var that = this;
    api.get("/integral/getranking").then(res => {
      if (res.isSuccess) {
        that.setData({
          rankInfo: res.data
        })
      }
    });

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

  onImgOK: function(e) {
    this.setData({
      isHidden: false
    });
    this.setData({
      imageUrl: e.detail.path
    })
    wx.hideLoading();
  },
  onImgErr: function(e) {
    console.log(e)
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
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '系统提示',
            content: '请授权小程序获取您的头像',
          })
        }
      },

    })
    //获取用户基础信息
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo
        })
        that.getRanks();
      }
    })
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
  // 保存图片
  saveImg(e) {
    var that = this;
    let url = e.currentTarget.dataset.imageurl;
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.showModal({
                    title: '提示',
                    content: '获取权限成功,再次点击图片即可保存',
                    showCancel: false,
                  })
                }
              })
              // wx.openSetting({
              //   success(settingdata) {
              //     if (settingdata.authSetting['scope.writePhotosAlbum']) {
              //       wx.showModal({
              //         title: '提示',
              //         content: '获取权限成功,再次点击图片即可保存',
              //         showCancel: false,
              //       })
              //     } else {
              //       wx.showModal({
              //         title: '提示',
              //         content: '获取权限失败，将无法保存到相册哦~',
              //         showCancel: false,
              //       })
              //     }
              //   },
              //   fail(failData) {
              //     console.log("failData", failData)
              //   },
              //   complete(finishData) {
              //     console.log("finishData", finishData)
              //   }
              // })
            }
          })
        } else {
          // 已经授权了
          that.saveImg1(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  saveImg1(url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            this.hideModal();
            wx.showModal({
              title: '提示',
              content: '保存成功,快去相册查看吧',
              showCancel: false,
            })
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  //分享生成海报
  share: function() {
    var min = 1;
    var max = 5;
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;

    var min1 = 100;
    var max1 = 300;
    var rand1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;

    wx.showLoading({
      title: '精心制作中',
    })
    var that = this;
    var userInfo = that.data.userInfo;
    var moban = {
      width: '750rpx',
      height: '1334rpx',
      background: 'https://sh-res-prd.oss-cn-shanghai.aliyuncs.com/cip/share/' + rand + '.jpg',
      views: [{
          type: 'image',
          url: userInfo.avatarUrl,
          css: {
            borderRadius: '100%',
            width: '130rpx',
            height: '130rpx',
            left: '75rpx',
            top: '70rpx',
          },
        },

        {
          type: 'text',
          text: '大数据分析计算出',
          css: {
            fontWeight: 'bold',
            color: '#ffffff',
            top: '500rpx',
            left: '50rpx',
            fontSize: '30rpx',
          },
        },
        {
          type: 'text',
          text: userInfo.nickName,
          css: {
            fontWeight: 'bold',
            color: '#eaa320',
            top: '550rpx',
            left: '110rpx',
            fontSize: '40rpx',
          },
        }, {
          type: 'text',
          text: '在2020年将会吃遍全球',
          css: {
            fontWeight: 'bold',
            color: '#ffffff',
            top: '610rpx',
            left: '80rpx',
            fontSize: '30rpx',
          },
        }, {
          type: 'text',
          text: rand1.toString(),
          css: {
            fontWeight: 'bold',
            color: '#eaa320',
            left: '180rpx',
            top: '660rpx',
            fontSize: '40rpx',
          },
        },
        {
          type: 'text',
          text: '家地摊',
          css: {
            fontWeight: 'bold',
            color: '#ffffff',
            left: '270rpx',
            top: '665rpx',
            fontSize: '30rpx',
          },
        },
        {
          type: 'text',
          text: userInfo.nickName,
          css: {
            fontWeight: 'bold',
            color: '#ffffff',
            left: '325rpx',
            top: '95rpx',
            align: 'center',
            fontSize: '45rpx',
          },
        },
        {
          type: 'image',
          url: 'https://sh-res-prd.oss-cn-shanghai.aliyuncs.com/cip/share/code.png',
          css: {
            top: '1110rpx',
            left: '510rpx',
            width: '200rpx',
            height: '200rpx',
          },
        },
        {
          type: 'text',
          text: "微信搜索地摊摆摊",
          css: {
            fontWeight: 'bold',
            color: '#ffffff',
            top: '1220rpx',
            left: '190rpx',
            align: 'center',
            fontSize: '35rpx',
          },
        },
      ],
    }
    that.setData({
      template: moban
    })
  },
  hideModal: function() {
    this.setData({
      isHidden: true
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})