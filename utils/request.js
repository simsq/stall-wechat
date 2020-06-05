const app = getApp();

//  使用示例
// import api from '../../utils/api'
// import { login } from '../**/conf' // 链接注意填写正确 

// api.post(login, {
//   data: ''
// }).then(res => {
//   if () { }
// }).catch(err => {
//   wx.showToast({
//     title: err.message,
//     icon: 'none'
//   })
// })

const request = (url, options, contentType) => {
  return new Promise((resolve, reject) => {
    var token = wx.getStorageSync('ColipuEam-Token');
    //判断是自定义域名还是默认域名
    //如果包含http的话就说明是自定义域名 
    if (!(url.search('http') != -1)) {
      url = app.globalData.host + url;
    }
    wx.request({
      url: url,
      method: options.method,
      // data: options.method == 'GET' ? options.data : JSON.stringify(options.data),
      data: options.method == 'GET' ? options.data : options.data,
      header: {
        'Content-Type': contentType,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'ColipuEam-Token': token,
      },
      success(request) {
        resolve(request.data)
        // if (request.data.isSuccess) {
        //   //成功         
        //   resolve(request.data)
        // } else {
        //   if (!request.data.isSuccess) {
        //     wx.showModal({
        //       title: '系统提示',
        //       content: request.data.message,
        //       success(res) {
        //         if (res.confirm) {
        //           // wx.reLaunch({
        //           //   url: '/pages/login/index',
        //           // })
        //         } else if (res.cancel) {
        //           wx.navigateBack({
        //             delta: -1
        //           })
        //         }
        //       }
        //     })
        //   }
        //   reject(request.data)
        // }
      },
      fail(error) {
        reject(error.data)
      }
    })
  })
}

const request2 = (url, options) => {
  return new Promise((resolve, reject) => {
    var openIdvalue = wx.getStorageSync('openId');
    var token = wx.getStorageSync('access_token');
    //判断是自定义域名还是默认域名
    //如果包含http的话就说明是自定义域名 
    if (!(url.search('http') != -1)) {
      url = app.globalData.host + url;
    }
    wx.request({
      url: url,
      method: options.method,
      // data: options.method == 'GET' ? options.data : JSON.stringify(options.data),
      data: JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        // 'Access_token': 'c4308185c1f84110b68ff0a95451be22',
        'Kudi-Token': token == '' ? '' : token,
        'Kudi-OpenId': openIdvalue == '' ? '' : openIdvalue,
      },
      success(request) {
        if (request.statusCode == 200) {
          //成功         
          resolve(request.data)
        } else {
          if (!request.data.isSuccess) {
            wx.showModal({
              title: '系统提示',
              content: request.data.message,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/login/index',
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: -1
                  })
                }
              }
            })
          }
          reject(request.data)
        }
      },
      fail(error) {
        reject(error.data)
      }
    })
  })
}

const get = (url, options = {}, contentType = 'application/x-www-form-urlencoded') => {
  return request(url, {
    method: 'GET',
    data: options
  }, contentType)
}

const post = (url, options, contentType = 'application/x-www-form-urlencoded') => {
  return request(url, {
    method: 'POST',
    data: options
  }, contentType)
}

const postFromBody = (url, options, contentType = 'application/x-www-form-urlencoded') => {
  return request2(url, {
    method: 'POST',
    data: options
  }, contentType)
}

const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options
  })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, {
    method: 'DELETE',
    data: options
  })
}

module.exports = {
  get,
  post,
  put,
  remove,
  postFromBody
}