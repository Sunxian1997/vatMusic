// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList: [],
    // 推荐歌曲数据
    recommendedSongList: [],
    // 获取排行榜数据
    rankingList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取banner图片
    const bannerListData = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerList: bannerListData.banners
    })
    // 获取推荐歌单数据
    const recommendedSongData = await request('/personalized', {
      limit: 30
    })
    this.setData({
      recommendedSongList: recommendedSongData.result
    })

    // 获取排行榜数据
    /*
      需求分析：
      1 需要根据idx的值获取对应的数据
      2 idx的取值范围 是0-20  我们需要0-4
      3 需要发送五次请求
    */
    let rankingDataIndex = 0
    let tempRankingList = []
    while (rankingDataIndex < 5) {
      const result = await request('/top/list', {
        idx: rankingDataIndex++
      })
      tempRankingList.push({
        name: result.playlist.name,
        // splice 会修改原数组  slice
        tracks: result.playlist.tracks.slice(0, 3),
      })
      this.setData({
        rankingList: tempRankingList
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})