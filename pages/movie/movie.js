var app = getApp()
var utils = require('../../utils/utils.js')

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchMovies: {},
    isFocus: true,
    isBlur: false,
    textValue:''
  },
  onLoad: function() {
    var inTheatersUrl = app.globalData.g_movieUrl + '/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&start=0&count=3'
    var comingSoonUrl = app.globalData.g_movieUrl + '/v2/movie/coming_soon?start=0&count=3&apikey=0b2bdeda43b5688921839c8ecb20399b'
    var top250Url = app.globalData.g_movieUrl + '/v2/movie/top250?start=0&count=3&apikey=0b2bdeda43b5688921839c8ecb20399b'
    this.getDoubanData(inTheatersUrl, 'inTheaters')
    this.getDoubanData(comingSoonUrl, 'comingSoon')
    this.getDoubanData(top250Url, 'top250')
  },
  getDoubanData: function(url, settedKey) {
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success(res) {
        that.getProcessMovieData(res, settedKey)
      },
      fail(error) {
        console.log(error.data)
      }
    })
  },
  getProcessMovieData: function(res, settedKey) {
    var movies = []
    var subjectTitle = res.data.title
    for (var idx in res.data.subjects) {
      var subject = res.data.subjects[idx]
      title = subject.title
      if (title.length >= 7) {
        var title = title.substring(0, 7) + "..."
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        imageUrl: subject.images.large,
        movieId: subject.id,
        stars: utils.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
      var readyData = {}
      readyData[settedKey] = {
        movies: movies,
        subjectTitle: subjectTitle
      }
    }
    this.setData(
      readyData,
    )
  },

  onFocus: function() {
    this.setData({
      isFocus: false,
      isBlur: true
    })
  },

  onCancel: function() {
    this.setData({
      isFocus: true,
      isBlur: false,
      searchMovies: {},
      textValue:''
    })
  },

  onBlur: function(e) {
    var text = e.detail.value
    this.data.textValue = text
    var searchUrl = 'http://t.yushu.im/v2/movie/search?q=' + text + '&apikey=0b2bdeda43b5688921839c8ecb20399b'
    this.getDoubanData(searchUrl, 'searchMovies')
  },

  onMoreMovie: function(event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'movieMore/movieMore?category=' + category,
    })
  },

  onMoivedetail:function(e) {
    var detailId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-detail?detailId=' + detailId,
    })
  }
})