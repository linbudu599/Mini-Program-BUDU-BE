import { Base64 } from "js-base64"

const app = getApp()


Page({
  onGetToken() {
    // code？
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:8760/v1/token',
            method: "POST",
            data: {
              account: res.code,
              type: 100
            },
            success: (res) => {
              const code = res.statusCode.toString()
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token)
              }
            }
          })
        }
      },
    })
  },

  onVerifyToken() {
    wx.request({
      url: 'http://localhost:8760/v1/token/verify',
      method: "POST",
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  onGetLatest() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/classic/latest',
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  encode() {
    const token = wx.getStorageSync('token');
    const encoded = Base64.encode(token + ":")
    return 'Basic ' + encoded
  }

})
