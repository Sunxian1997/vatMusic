import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList:[]
  },
  async getPlaceholderContent() {
    /*
    ➢ 说明: 该接口用于获取默认搜索关键字显示在搜索框中
    ➢ 接口地址: /search/default
    ➢ 请求方式: GET
    ➢ 参数说明: 无 ➢ 调用例子: /search/default
    */
    const result = await request('/search/default')
    this.setData({
      placeholderContent: result.data.showKeyword
    })
  },
  async getHotList() {
    /*
    热搜榜接口
    ➢ 说明: 该接口用于获取热搜数据
    ➢ 接口地址： /search/hot/detail
    ➢ 请求方式: GET
    ➢ 参数说明: 无 ➢ 调用示例： /search/hot/detail
    */
    const result = await request('/search/hot/detail')
    this.setData({
      hotList: result.data
    })
  },
  async getSearchList(keywords) {
    /*
   3.13 搜索接口
    ➢ 说明: 该接口用于根据用户输入的内容进行模糊匹配搜索
    ➢ 接口地址: /search
    ➢ 请求方式: GET
    ➢ 必选参数 keywords: 用户搜索关键词
    ➢ 可选参数: limit 返回数量，默认为 30
    ➢ 调用示例: /search?keywords=海阔天空&limit=10
    */
    //  函数节流
    if (isSend) return
    isSend = true
    const result = await request('/search', {
      keywords,
      limit: 10
    })
    this.setData({
      searchList: result.result.songs,
      historyList:Array.from(new Set([keywords,...this.data.historyList]))
    })
    wx.setStorageSync('searchHistory', this.data.historyList)
    setTimeout(() => {
      isSend = false
    }, 300);
  },
  // 读取历史记录
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory')
    if(!historyList) return
    this.setData({
      historyList
    })
  },

  handleInput(event) {
    const keywords = event.detail.value.trim()
    this.setData({
      searchContent: keywords
    })
    if (!keywords) {
      this.setData({
        searchList: []
      })
      return
    }
    this.getSearchList(keywords)
  },
  deleteHistoryList(){
      // 移除本地的历史记录缓存
      wx.removeStorageSync('searchHistory');
      this.setData({
        historyList:[]
      })
  },
  clearSearchContent(){
    this.setData({
      searchContent:""
    })
  },
  clearSingeleHistoryItem(event){
    const {index} =event.currentTarget.dataset
    this.setData({
      historyList:this.data.historyList.filter((item,itemIndex)=>itemIndex!=index)
    })
    wx.setStorageSync('searchHistory', this.data.historyList)
  },
  backTo(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchHistory()
    this.getPlaceholderContent()
    this.getHotList()
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