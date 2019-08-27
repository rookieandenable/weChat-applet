var postsData = require('../../data/posts-data')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    this.setData({
      local_database:postsData.posts_data
    })
  },

  onTap: function(event) {
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

   //targent是当前的组件  currentTarget是事件的捕获
  onShowSwiper: function (event) {
    var postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})