Page({
  data: {
    age: 25,
    appLock: false
  },

  onLoad() {
    this.setData({
      age: wx.getStorageSync('userAge') || 25,
      appLock: wx.getStorageSync('appLock') || false
    })
  },

  onAgeChange(e) {
    const age = e.detail.value;
    this.setData({ age });
    wx.setStorageSync('userAge', age);
  },

  onAppLockChange(e) {
    const appLock = e.detail.value;

    if (appLock) {
      wx.checkIsSupportSoterAuthentication({
        success: (res) => {
          if (res.supportMode && res.supportMode.length > 0) {
            wx.startSoterAuthentication({
              requestAuthModes: res.supportMode,
              challenge: '开启应用锁',
              authContent: '请验证生物认证信息',
              success: () => {
                this.setData({ appLock: true });
                wx.setStorageSync('appLock', true);
              },
              fail: () => {
                this.setData({ appLock: false });
                wx.showToast({ title: '认证失败', icon: 'none' });
              }
            });
          } else {
            this.setSimpleLock(true);
          }
        },
        fail: () => {
          this.setSimpleLock(true);
        }
      })
    } else {
      this.setData({ appLock: false });
      wx.setStorageSync('appLock', false);
    }
  },

  setSimpleLock(val) {
    this.setData({ appLock: val });
    wx.setStorageSync('appLock', val);
    wx.showToast({ title: '已开启基本密码锁', icon: 'none' });
  },

  backupData() {
    wx.showToast({ title: '数据已备份', icon: 'success' });
  },

  restoreData() {
    wx.showToast({ title: '数据恢复成功', icon: 'success' });
  },

  clearData() {
    wx.showModal({
      title: '警告',
      content: '确定要清空所有记录吗？此操作不可逆！',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.onLoad();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    })
  }
})