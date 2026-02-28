const app = getApp()

Page({
  data: {
    dateStr: '',
    weekStr: '',
    greetingTitle: '凌晨好！',
    todayCount: 0,
    weekCount: 0,
    currentStatus: '贤者模式',
    currentStatusColor: '#333',
    healthTip: '今天已经起飞啦，心情不错吧~ ✨',

    // Slider state
    sliderValue: 0,
    sliderColor: '#4caf50',
    sliderHeight: 0,
    sliderTop: 0,
    isModalShowing: false
  },

  onLoad() {
    this.initDate();
    this.fetchData();
  },

  onShow() {
    this.fetchData();
  },

  onReady() {
    this.initSlider();
  },

  initDate() {
    const dates = new Date()
    const month = dates.getMonth() + 1
    const day = dates.getDate()
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dates.getDay()]
    const hour = dates.getHours()

    let greeting = '你好！'
    if (hour < 6) greeting = '凌晨好！'
    else if (hour < 12) greeting = '上午好！'
    else if (hour < 18) greeting = '下午好！'
    else greeting = '晚上好！'

    this.setData({
      dateStr: `${month}月${day}日`,
      weekStr: week,
      greetingTitle: greeting
    })
  },

  fetchData() {
    let todayCount = wx.getStorageSync('todayCount') || 0;
    let weekCount = wx.getStorageSync('weekCount') || 0;

    let currentStatus = '贤者模式';
    let currentStatusColor = '#333';
    let healthTip = '今天已经起飞啦，心情不错吧~ ✨';

    if (todayCount === 0) {
      currentStatus = '随时待命';
      healthTip = '今天还没行动哦，蓄力中~';
      currentStatusColor = '#4caf50';
    } else if (todayCount > 2) {
      currentStatus = '注意节制';
      healthTip = '一定要注意身体健康，多喝热水！';
      currentStatusColor = '#f44336';
    }

    this.setData({
      todayCount,
      weekCount,
      currentStatus,
      currentStatusColor,
      healthTip
    })
  },

  initSlider() {
    const query = wx.createSelectorQuery()
    query.select('#v-slider').boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        this.setData({
          sliderHeight: res[0].height,
          sliderTop: res[0].top
        })
      }
    })
  },

  getColor(val) {
    if (val <= 30) return '#4caf50'; // Green
    if (val <= 70) return '#ff9800'; // Yellow
    return '#f44336'; // Red
  },

  updateSlider(clientY) {
    const { sliderHeight, sliderTop } = this.data;
    if (sliderHeight === 0) return 0;

    let distance = (sliderTop + sliderHeight) - clientY;
    let percentage = Math.round((distance / sliderHeight) * 100);

    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    this.setData({
      sliderValue: percentage,
      sliderColor: this.getColor(percentage)
    });

    return percentage;
  },

  handleTouchStart(e) {
    if (this.data.isModalShowing) return;
    this.updateSlider(e.touches[0].clientY);
  },

  handleTouchMove(e) {
    if (this.data.isModalShowing) return;
    let percentage = this.updateSlider(e.touches[0].clientY);

    if (percentage === 100 && !this.data.isModalShowing) {
      this.setData({ isModalShowing: true });
      this.triggerTakeoff();
    }
  },

  handleTouchEnd(e) {
    if (!this.data.isModalShowing) {
      // Revert back
      this.resetSlider();
    }
  },

  resetSlider() {
    this.setData({
      sliderValue: 0,
      sliderColor: '#4caf50',
      isModalShowing: false
    });
  },

  triggerTakeoff() {
    wx.vibrateShort && wx.vibrateShort({ type: 'heavy' }); // Optional haptic feedback
    wx.showModal({
      title: '确认起飞',
      content: '状态满格，确定要记录一次吗？',
      success: (res) => {
        if (res.confirm) {
          this.doRecord()
        }
        this.resetSlider();
      },
      fail: () => {
        this.resetSlider();
      }
    })
  },

  doRecord() {
    let todayCount = this.data.todayCount + 1
    let weekCount = this.data.weekCount + 1
    wx.setStorageSync('todayCount', todayCount)
    wx.setStorageSync('weekCount', weekCount)
    this.fetchData()
    wx.showToast({
      title: '记录成功',
      icon: 'success'
    })
  }
})