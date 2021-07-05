import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        index: '',
        recommendList: []
    },
    async getRecommendList() {
        // ➢ 说明: 该接口用于获取给用户的每日推荐数据
        // ➢ 接口地址: /recommend/songs
        // ➢ 请求方式: GET
        // ➢ 参数说明: 无 ➢ 调用例子: /recommend/songs
        // ➢ 注意事项: ◼ 需要登录，携带 cookie
        const result = await request('/recommend/songs')
        this.setData({
            recommendList: result.data.dailySongs
        })
    },
    // 跳转至songDetail页面
    toSongDetail(event) {
        let {
            song,
            index
        } = event.currentTarget.dataset;
        this.setData({
            index
        })
        // 路由跳转传参： query参数
        wx.navigateTo({
            // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
            // url: '/pages/songDetail/songDetail?songPackage=' + JSON.stringify(songPackage)
            url: '/pages/songDetail/songDetail?musicId=' + song.id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 判断当前是否有用户登录
        if (!wx.getStorageSync('userInfo')) {
            wx.showToast({
                title: '请先登录',
                icon: "none",
                success: () => {
                    //   跳转到登录页面
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                }
            })
        }
        // 更新日期的状态数据
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        this.getRecommendList()
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