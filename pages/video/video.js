import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [],
        videoList: [],
        videoUpdateTime: [],
        navId: '',
        currentlyPlayingVideoVid: '',
        isTriggered: false
    },
    // 切换标签事件
    async changeNav(event) {
        const {
            currentTarget: {
                dataset: {
                    id: navId
                }
            }
        } = event
        this.setData({
            // 右移0位  强制转换成Number类型
            /*
            console.log(3>>>2)
            先转成2进制
            0000 0011
            右移两位后
            0000 0011
              0000 0011
              0000 00  后面的两位数11不要了
            0000 0000  前面空缺的用0补齐
            所以 console.log(3>>>2)输出为 0
            */
            navId: navId >>> 0,
            // 重置viedoList  为了界面友好
            videoList: []
        })
        // 显示正在加载  需要主动去关闭
        wx.showLoading({
            title: '正在加载',
        })
        // 重新拉取视频信息
        await this.getVideoList(this.data.navId)
    },
    async getVideoGroupList() {
        /*
        获取视频标签数据
        ➢ 说明: 该接口用于获取视频导航标签列表数据
        ➢ 接口地址: /video/group/list
        ➢ 请求方式: GET
        ➢ 参数说明: 无 ➢ 调用例子: /video/group/list
        */
        const result = await request('/video/group/list')
        this.setData({
            videoGroupList: result.data.slice(0, 14),
            navId: result.data[0].id
        })
    },
    async getVideoList(navId) {
        /*
        获取视频标签下对应的视频数据
        ➢ 说明: 该接口用于获取导航标签对应的视频列表数据
        ➢ 接口地址: /video/group
        ➢ 请求方式: GET
        ➢ 必选参数: id: videoGroup 的 id
        ➢ 调用例子: /video/group?id=9104
        ➢ 注意事项: ◼ 需要先登录
        */
        const result = await request('/video/group', {
            id: navId
        })
        wx.hideLoading()
        this.setData({
            videoList: result.datas,
            isTriggered: false
        })
    },
    handlePlay(event) {
        const {
            currentTarget: {
                id
            }
        } = event
        /*
         点击播放回调
         1 再点击播放事件中找到上一个播放的视频
         2 在播放新视频之前关闭上一个正在播放的视频
         */
        // 找到上一个视频的实例对象
        this.data.currentlyPlayingVideoVid != id && this.videoContext && this.videoContext.stop()
        // 确保点击播放的视频和当前播放的视频不是 同一个视频
        this.setData({
            currentlyPlayingVideoVid: id,
        })
        // 创建video标签实例对象
        this.videoContext = wx.createVideoContext(id)
        // 判断当前视频 之前是否有播放过的记录  从而从历史时间段开始播放
        let {
            videoUpdateTime
        } = this.data
        let videoItem = videoUpdateTime.find(item => item.vid == id)
        if (videoItem) this.videoContext.seek(videoItem.currentTime)
        // 自动播放  会出现两个视频声音同事出现的问题
        this.videoContext.play()
    },
    handleTimeupdate(event) {
        let videoTimeObj = {
            vid: event.currentTarget.id,
            currentTime: event.detail.currentTime
        }
        let {
            videoUpdateTime
        } = this.data
        let videoItem = videoUpdateTime.find(item => {
            return item.vid == videoTimeObj.vid
        })
        if (videoItem) {
            videoItem.currentTime = event.detail.currentTime
        } else {
            videoUpdateTime = [...videoUpdateTime, videoTimeObj]
        }
        this.setData({
            videoUpdateTime
        })
    },
    handleEnded(event) {
        console.log('handleEndedevent', event.currentTarget.id);
        let {
            videoUpdateTime
        } = this.data
        videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid == event.currentTarget.id), 1)
        this.setData({
            videoUpdateTime,
            currentlyPlayingVideoVid: ''
        })
    },
    async handleRefreshh() {
        await this.getVideoList(this.data.navId)
    },
    handleToLower() {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getVideoGroupList()
        await this.getVideoList(this.data.navId)
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
        console.log('页面的下拉动作');
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('页面上拉触底');
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ({from,target}) {
        if(from=='button'){
            return {
                title:target.dataset.videoitem.title,
                page: '/pages/video/video'
              }
        }
    }
})