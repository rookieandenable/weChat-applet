var detailData = require('../../../data/posts-data')
var app = getApp()

Page({
  data: {
    isPlayMusic: false,
  },
  onLoad: function(options) {
    // postId从其他页面点击传递的对应相对详情页面的id值
    var postId = options.id;
    this.data.collectionId = postId;
    var postData = detailData.posts_data[postId]

    this.setData({
      postData
    })

    // var colletion_data = {
    //   "1":ture,
    //   "2":false,
    //   "3":ture
    //   ........
    // }
    //缓存实现收藏功能
    var colData = wx.getStorageSync("key")
    if (colData) {
      var colData = colData[postId]
      this.setData({
        collection: colData
      })
    } else {
      var colData = {}
      colData[postId] = false
      wx.setStorageSync("key", colData)
    }

    this.onSetMusic();
    var g_musicData = app.globalData.g_isPlayMusic
    if (g_musicData && app.globalData.g_currentMusicPostId == postId) {
      this.setData({
        isPlayMusic: true
      })
    }
  },

  // 全局监听音乐开启和暂停
  onSetMusic: function() {
    var that = this
    wx.onBackgroundAudioPlay(function() {
      app.globalData.g_isPlayMusic = true
      app.globalData.g_currentMusicPostId = that.data.collectionId //哪一个音乐在播放
      that.setData({
        isPlayMusic: true,
      })
    })
    wx.onBackgroundAudioPause(function() {
      app.globalData.g_isPlayMusic = false
      app.globalData.g_currentMusicPostId = null
      that.setData({
        isPlayMusic: false,
      })
    })
  },
  onCollectionTap: function() {
    // colData是一个key值对象,post_col拿到的是一个布尔值
    var colData = wx.getStorageSync("key")
    var post_col = colData[this.data.collectionId]
    post_col = !post_col
    colData[this.data.collectionId] = post_col
    this.onShowToast(colData, post_col)
    // this.onShowModal(colData, post_col)
    // wx.setStorageSync("key", colData)
    // this.setData({
    //   collection: post_col
    // })
  },
  onShowToast: function(colData, post_col) {
    wx.setStorageSync("key", colData)
    this.setData({
      collection: post_col
    })
    wx.showToast({
      title: post_col ? "收藏成功" : "取消收藏",
      duration: 1000,
      mask: true,
      icon: "success"
    })
  },

  onShowModal: function(colData, post_col) {
    var that = this
    wx.showModal({
      title: '文章收藏',
      content: post_col ? '收藏成功' : '取消收藏',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success: function(res) {
        if (res.confirm) { //用户点击确定按钮是res.confirm为true
          wx.setStorageSync("key", colData)
          that.setData({
            collection: post_col
          })
        }
      }
    })
  },

  onShareTap: function() {
    var itemList = [
      "分享到微信好友",
      "分享到微信朋友圈",
      "分享到微博",
      "分享到QQ",
    ];
    wx.showActionSheet({
      itemColor: '#405f80',
      itemList: itemList,
      success(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '由于微信小程序暂时不支持分享功能-fail',
        })
      },
      fail(res) {
        wx.showModal({
          title: '取消分享',
          content: '这是一个明智的选择-success',
        })
      }
    })
  },

  onMusicTap: function() {
    isPlayMusic = this.data.isPlayMusic
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    var postsData = detailData.posts_data
    var postId = this.data.collectionId
    var postMusic = postsData[postId]
    if (isPlayMusic) {
      backgroundAudioManager.pause()
      var isPlayMusic = false
      this.setData({
        isPlayMusic
      })
    } else {
      backgroundAudioManager.title = postMusic.music.title
      backgroundAudioManager.epname = '此时此刻'
      backgroundAudioManager.singer = '许巍'
      backgroundAudioManager.coverImgUrl = postMusic.music.coverImg
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = postMusic.music.url
      var isPlayMusic = true
      this.setData({
        isPlayMusic
      })
    }
  }

})