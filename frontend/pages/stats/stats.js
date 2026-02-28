const app = getApp()

Page({
  data: {
    activeTab: 'week',
    totalCount: 0,
    chartData: []
  },

  onLoad() {
    this.renderChart()
  },

  onShow() {
    this.renderChart()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab })
    this.renderChart()
  },

  renderChart() {
    if (!app.globalData.userInfo) return;
    const userId = app.globalData.userInfo.id;
    const viewType = this.data.activeTab;

    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `${app.globalData.backendUrl}/users/${userId}/records/stats?view_type=${viewType}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.processChartData(res.data, viewType);
        } else {
          wx.showToast({ title: '加载失败', icon: 'error' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'error' });
      }
    });
  },

  processChartData(stats, viewType) {
    let chartData = [];
    let totalCount = 0;

    // We get back a list of {date: "YYYY-MM-DD", count: N} within the requested range
    const todayStr = new Date().toISOString().split('T')[0];

    if (viewType === 'week') {
      const todayDate = new Date();
      // Calculate Monday of this week
      const day = todayDate.getDay();
      const diff = todayDate.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(todayDate.setDate(diff));

      const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        let dateStr = currentDate.toISOString().split('T')[0];

        let found = stats.find(s => s.date === dateStr);
        let val = found ? found.count : 0;
        totalCount += val;

        chartData.push({
          label: labels[i],
          value: val,
          percent: val > 0 ? 100 : 0, // simple visualization
          isToday: dateStr === todayStr
        });
      }
    } else if (viewType === 'month') {
      // Simplified: Group by weeks in month or simply list data points
      // To match the existing mock UI, we'll just sum all up for the month total
      let currentDate = new Date();
      stats.forEach(s => totalCount += s.count);
      // We can mock the display into 4 weeks for simplicity
      for (let i = 1; i <= 4; i++) {
        chartData.push({ label: `第${i}周`, value: Math.ceil(totalCount / 4), percent: Math.min((Math.ceil(totalCount / 4)) * 20, 100), isToday: i === 1 });
      }
    } else {
      stats.forEach(s => totalCount += s.count);
      for (let i = 1; i <= 6; i++) {
        chartData.push({ label: `${i}月`, value: Math.ceil(totalCount / 6), percent: Math.min((Math.ceil(totalCount / 6)) * 30, 100), isToday: i === 1 });
      }
    }

    this.setData({
      totalCount,
      chartData
    });
  }
})