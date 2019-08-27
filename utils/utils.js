function convertToStarsArray(starts) {
  var num = starts.toString().substring(0, 1)
  var sed = starts.toString().substring(1)
  var array = []
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else if (i < sed && sed > num) {
      array.push(2)
    } else {
      array.push(0)
    }
  }
  return array
}

function http(url,callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json' // 默认值
    },
    success(res) {
      callBack(res.data)
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http:http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}