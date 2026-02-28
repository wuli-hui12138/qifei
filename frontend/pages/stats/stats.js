Page({
  data: {
    activeTab: 'week',
    totalCount: 1,
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
    // Mock data for display based on the selected tab
    let chartData = [];
    let totalCount = 0;

    let weekCount = wx.getStorageSync('weekCount') || 0;

    if (this.data.activeTab === 'week') {
      totalCount = weekCount || 1;
      // Fallback example if no data
      const today = new Date().getDay();
      const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      for (let i = 0; i < 7; i++) {
        let isToday = (i + 1 === today) || (today === 0 && i === 6);
        let val = isToday ? weekCount : 0;
        chartData.push({
          label: labels[i],
          value: val,
          percent: val > 0 ? 100 : 0,
          isToday: isToday
        });
      }
    } else if (this.data.activeTab === 'month') {
      totalCount = 5;
      for (let i = 1; i <= 4; i++) {
        chartData.push({ label: `第${i}周`, value: i, percent: i * 20, isToday: i === 1 });
      }
    } else {
      totalCount = 12;
      for (let i = 1; i <= 6; i++) {
        chartData.push({ label: `${i}月`, value: i % 3, percent: (i % 3) * 30, isToday: i === 1 });
      }
    }

    this.setData({
      totalCount,
      chartData
    })
  }
})