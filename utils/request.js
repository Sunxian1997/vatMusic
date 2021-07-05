// 发送ajax请求
/*
1. 封装功能函数
  1 功能点明确
  2 函数内部应该保留固定代码（静态的
  3 将动态的数据提取成形参，由使用者根据滋生的情况动态的传入实参
  4 一个良好的功能函数应该设置形参的默认值（es6的形参默认值
2 封装功能组件
  1 功能点明确
  2 组件内部保留静态代码
  3 将动态的数据抽取成props参数，由使用者更具自身的情况以标签属性的形式动态的传入props数据
  4 一个良好的组件应该设置组件的必要性以及数据类型  sdad
*/
import config from './config'
export default (url, data = {}, methods = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      // url: config.mobleHost + url,
      data,
      methods,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => {
          return item.indexOf('MUSIC_U') != -1
        }) : ''
      },
      success: (res) => {
        if (data.isLogin) {
          // 如果是登录请求，将cookies存入本地
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}