//app.js

App({
  onLaunch: function() {
    //登录
    // wx.qy.login({
    //   success: res => {
    //     var url = this.globalData.host + "/User/getUserInfo?code=" + res.code;
    //     debugger;
    //     wx.request({
    //       url: url,
    //       data: {},
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success(res) {
    //         if (res.data.isSuccess) {
    //           wx.setStorageSync("ColipuEam-Token", res.data.data)
    //         }
    //       }
    //     })
    //   }
    // })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },
  globalData: {
    //host: 'http://localhost:8001/api',
    host: 'https://eamapi.colipu.com/api',
  }
})