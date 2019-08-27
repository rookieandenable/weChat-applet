var app = getApp()
var utils = require('../../../utils/utils.js')

Page({

  data: {
    totalCount: 0,
    isEmpty: true,
    requireUrl: ''
  },

  onLoad: function(options) {
    var category = options.category
    var dataUrl = ''
    switch (category) {
      case '正在上映的电影-北京':
        dataUrl = app.globalData.g_movieUrl + '/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b'
        break;
      case '即将上映的电影':
        dataUrl = app.globalData.g_movieUrl + '/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b'
        break;
      case '豆瓣电影Top250':
        dataUrl = app.globalData.g_movieUrl + '/v2/movie/top250?apikey=0b2bdeda43b5688921839c8ecb20399b'
        break;
    }
    this.data.requireUrl = dataUrl
    wx.setNavigationBarTitle({
      title: category,
    })
    utils.http(dataUrl, this.processMovieData)
  },

  onPullDownRefresh: function() {
    var refreshUrl = this.data.requireUrl + '&start=0&count=20'
    this.data.movies = {}
    this.data.isEmpty = true
    this.data.totalCount = 0
    utils.http(refreshUrl, this.processMovieData)
    wx.showNavigationBarLoading()
  },

  processMovieData: function(moviesDouban) {
    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      if (title.length > 6) {
        title = title.substring(0, 6) + '...'
      }
      //[1,1,1,1,1,] [1,1,1,0,0]
      var temp = {
        stars: utils.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        imageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    //这里是处理新加载的数据，旧数据和新数据的拼接
    var totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onScrolltolower: function(e) {
    var nextUrl = this.data.requireUrl + '&start=' + this.data.totalCount + '&count=20'
    utils.http(nextUrl, this.processMovieData)
    wx.showNavigationBarLoading()
  },

  onMoivedetail:function(e) {
    var detialId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?detailId=' + detialId,
    })
  }
})