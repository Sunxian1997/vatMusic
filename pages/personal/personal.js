import request from '../../utils/request'
// 手指起始的坐标
let startY = 0
// 手指移动的左边
let moveY = 0
// 手指移动的举例
let moveDestance = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:'translateY()',
        coverTransition:'',
        userInfo:{},
        // 最近播放列表记录
        recentPlayList: []
    },
    // 跳转到登录
    toLogin(){
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    // 手指滑动事件
    handleTouchStart(event) {
        startY = event.touches[0].clientY
        this.setData({
            coverTransition:``
        })
    },
    handleTouchMove(event) {
        moveY = event.touches[0].clientY
        moveDestance = moveY - startY
        if(moveDestance<=0) return
        if(moveDestance>=80) moveDestance = 80
        this.setData({
            coverTransform:`translateY(${moveDestance}rpx)`
        })
    },
    handleTouchEnd() {
        this.setData({
            coverTransform:`translateY(${0}rpx)`,
            coverTransition:`transform 1s linear`
        })
    },
    // 展示最近播放记录
   async getUserRecentPlayList(){
        // ➢ 说明: 该接口用于获取用户最近播放记录，需要登录以后才能获取
        // ➢ 接口地址: /user/record
        // ➢ 请求方式: GET
        // ➢ 必选参数: uid : 用户 id
        // ➢ 可选参数: type : type=1 时只返回 weekData, type=0 时返回 allData
        // ➢ 调用例子: /user/record?uid=32953014&type=1
        
        const result = await request('/user/record', {
            uid:this.data.userInfo.userId,
            type:1
        })
        // 添加模板遍历时候的唯一值
        let index = 0
        result.weekData.map(item=>{
            item.id = index++
        })
        this.setData({
            recentPlayList:result.weekData.slice(0,15)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 读取用户的基本信息
        let userInfo = wx.getStorageSync('userInfo')
        if(userInfo) {
            this.setData({
                userInfo:JSON.parse(userInfo)
            })
            this.getUserRecentPlayList()
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