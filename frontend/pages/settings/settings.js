const app = getApp()

Page({
  data: {
    userInfo: {
      avatar: '',
      nickname: '',
      region: '',
      age: ''
    }
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo || { avatar: '', nickname: '', region: '', age: '' }
    })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'userInfo.avatar': avatarUrl
    });
  },

  onNicknameInput(e) {
    const nickname = e.detail.value;
    this.setData({
      'userInfo.nickname': nickname
    });
  },

  onRegionInput(e) {
    const region = e.detail.value;
    this.setData({
      'userInfo.region': region
    });
  },

  onAgeChange(e) {
    const age = e.detail.value;
    this.setData({
      'userInfo.age': age
    });
  },

  saveUserInfo() {
    if (!app.globalData.userInfo || !app.globalData.userInfo.id) {
      wx.showToast({ title: '未登录', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中' });
    wx.request({
      url: `${app.globalData.backendUrl}/users/${app.globalData.userInfo.id}`,
      method: 'PUT',
      data: this.data.userInfo,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          app.globalData.userInfo = res.data;
          wx.showToast({ title: '保存成功', icon: 'success' });
        } else {
          wx.showToast({ title: '保存失败', icon: 'error' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'error' });
      }
    });
  }
})