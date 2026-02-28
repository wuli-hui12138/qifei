App({
  onLaunch() {
    this.login();
  },

  login() {
    // Attempt standard wx login to get a code, but for this mock we just use a fixed openid
    // to simulate standard WeChat login behavior
    wx.login({
      success: res => {
        // In a real app we'd send res.code to backend to exchange for openid
        // For now, we mock it by directly specifying a mock openid
        const mockOpenId = 'mock_user_' + Math.floor(Math.random() * 10000);
        // Note: For consistency across reloads, we should probably read from storage first
        let openid = wx.getStorageSync('openid') || mockOpenId;
        wx.setStorageSync('openid', openid);

        wx.request({
          url: `${this.globalData.backendUrl}/users/login?openid=${openid}`,
          method: 'POST',
          success: (res) => {
            if (res.statusCode === 200) {
              this.globalData.userInfo = res.data;
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res.data);
              }
            }
          }
        });
      }
    })
  },

  globalData: {
    userInfo: null,
    backendUrl: "http://127.0.0.1:8000"
  }
})