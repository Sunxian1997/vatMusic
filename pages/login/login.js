/*
    登录流程
    1 收集表单数据
    2 前端验证
        验证用户信息是否合法
        前端验证通过，发送请求
    3 后端验证
        验证用户是否存在
        用户不存在直接返回，告诉前端用户不存在
        用户存在验证用户密码
        验证通过返回给前端世俗据，提示用户登录成功
*/
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: ''
    },
    // 表单数据发生该百年
    handleInput(event) {
        let {
            target: {
                id: type
            }
        } = event
        this.setData({
            [type]: event.detail.value
        })
    },
    // 登录
    async login() {
        const {
            phone,
            password
        } = this.data
        /*
        手机号验证：
            内容为空
            手机号格式手机号正确
        */
        if (!phone) return wx.showToast({
            title: '手机号不能为空',
            icon: 'none'
        })
        if (!/^1(3|4|5|6|7|8|9|)\d{9}$/.test(phone)) return wx.showToast({
            title: '请输入正确格式的手机号',
            icon: 'none'
        })
        if (!password) return wx.showToast({
            title: '密码不能为空',
            icon: 'none'
        })
        const result = await request('/login/cellphone', {
            phone,
            password,
            isLogin:true
        })
        if (result.code == 200) {
            wx.reLaunch({
              url: '/pages/personal/personal',
            })
            // 用户信息存储本地
            wx.setStorageSync('userInfo', JSON.stringify(result.profile))
            return wx.showToast({
                title: '登录成功',
                icon: 'none'
            })
        } else  {
            return wx.showToast({
                title: result.message,
                icon: 'none'
            })
        } 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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