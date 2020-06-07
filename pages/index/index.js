const app = getApp();
import api from '../../utils/request';
const defaultScale = 13;
var mapId = 'myMap';
var bottomHeight = 0;
var windowHeight = 0;
var windowWidth = 0;
var resultData = []
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    //地图高度
    mapHeight: 0,
    //标注点
    markers: [],
    //默认缩放级别
    scale: defaultScale,
    //默认当前坐标
    longitude: '',
    latitude: '',
    //中心指针
    controls: [],
    //显示窗户
    IsShow: false,
    SearchKey: '',
  },
  onLoad: function(options) {
    this.getAllRemark();
  },

  onShow: function() {
    var that = this;
    //判断用户是否同意了授权，如果没有就弹出授权窗口
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            IsShow: true
          })
        }
      }
    })
    this.changeMapHeight();
    this.requestLocation();
  },
  //关闭弹出框
  hideModal: function() {
    this.setData({
      IsShow: false
    })
  },

  //获取所有地摊
  getAllRemark() {
    var that = this;
    api.get("/stall/list?SearchKey=" + that.data.SearchKey).then(res => {
      if (res.isSuccess) {
        // that.setData({
        resultData = res.data
        that.createMarker();
        // })
      }
    });
  },
  markertap: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../project/detail/detail?id=' + e.markerId,
    })
  },
  //拖动地图时触发
  regionchange: function(res) {
    if (res.type == "end") {
      this.getCenterLocation();
    }
  },
  //构建maker点
  createMarker: function() {
    var that = this;
    var currentMarker = [];
    var markerList = [];
    resultData.forEach(item => {
      markerList.push({
        id: item.code,
        latitude: item.latitude,
        longitude: item.longitude,
        width: 40,
        height: 40,
        iconPath: '../../images/index/biaoji.png',
        // callout: {
        //   content: item.projectName,
        //   padding: 10,
        //   display: 'ALWAYS',
        //   textAlign: 'center',
        //   borderRadius: 10,
        //   borderColor: '#FFFFFF',
        //   borderWidth: 2,
        // }
      });
    });
    that.setData({
      markers: markerList
    })
  },

  //请求地理位置
  requestLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.moveTolocation();
      },
    })
  },


  changeMapHeight: function() {
    var that = this;
    var count = 0;
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight;
        windowWidth = res.windowWidth;
        //创建节点选择器
        var query = wx.createSelectorQuery();
        var query = wx.createSelectorQuery();
        query.select('#bottom-layout').boundingClientRect()
        query.exec(function(res) {
          bottomHeight = res[0].height;
          that.setMapHeight();
        })
      },
    })
  },

  setMapHeight: function(params) {
    var that = this;
    that.setData({
      mapHeight: (windowHeight - bottomHeight) + 'px'
    })
    var controlsWidth = 40;
    var controlsHeight = 48;
    //设置中间部分指针
    // that.setData({
    //   controls: [{
    //     id: 1,
    //     iconPath: '../../images/index/shaokao.png',
    //     position: {
    //       left: (windowWidth - controlsWidth) / 2,
    //       top: (windowHeight - bottomHeight) / 2 - controlsHeight * 3 / 4,
    //       width: controlsWidth,
    //       height: controlsHeight
    //     },
    //     clickable: true
    //   }]
    // })
  },
  // 得到中心点坐标
  getCenterLocation: function() {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.getCenterLocation({
      success: function(res) {
        console.log('getCenterLocation----------------------->');
        console.log(res);
      }
    })
  },

  //移动到中心点
  moveTolocation: function() {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  //回到定位点
  selfLocationClick: function() {
    var that = this;
    //还原默认缩放级别
    that.setData({
      scale: defaultScale
    })
    //必须请求定位，改变中心点坐标
    that.requestLocation();
  },
  //上报地摊位置
  shangbao: function() {
    wx.navigateTo({
      url: '/pages/shangbao/index',
    });
  },
  //搜索查询功能
  query: function() {
    wx.showModal({
      title: '程序员提示',
      content: '拼命开发中',
    })
  },
  //打开详情页
  goDetail: function(e) {
    var that = this;
    var stallCode = e.markerId;
    var stallInfo = resultData.find(x => x.code == stallCode);
    var parameter = 'stallCode=' + stallInfo.code + '&address=' + stallInfo.address + '&latitude=' + stallInfo.latitude + '&longitude=' + stallInfo.longitude
    wx.navigateTo({
      url: '/pages/detail/index?' + parameter,
    })
  }
})