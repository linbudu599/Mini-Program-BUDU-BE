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
              console.log(res.data)
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

  onLike() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/like',
      method: "POST",
      data: {
        art_id: 1,
        type: 100
      },
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  onDisLike() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/like/cancel',
      method: "POST",
      data: {
        art_id: 1,
        type: 100
      },
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  onGetPrev() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/classic/4/previous',
      method: "GET",
      success: (res) => {
        console.log(res.data)
      }
    })
  },
  onGetNext() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/classic/4/next',
      method: "GET",
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  onGetByTypeAndId() {
    wx.request({
      header: {
        Authorization: this.encode()
      },
      url: 'http://localhost:8760/v1/classic/100/1',
      method: "POST",
      data: {
        id: 1,
        type: 100
      },
      success: (res) => {
        console.log(res.data)
      }
    })
  },

  onGetClassicDetail() {
    wx.request({
      url: 'http://localhost:8760/v1/classic/200/2',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this.encode()
      }
    })
  },
  onGetMyFavorList() {
    wx.request({
      url: 'http://localhost:8760/v1/classic/favor',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this.encode()
      }
    })
  },
  onGetClassicFavor() {
    wx.request({
      url: 'http://localhost:8760/v1/classic/100/1/favor',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this.encode()
      }
    })
  },
  encode() {
    const token = wx.getStorageSync('token');
    const encoded = Base64.encode(token + ":")
    return 'Basic ' + encoded
  }

})
