//授权登陆登陆
function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log(res.code);
        Post('/api/login/index',{
          code:res.code
        },function(data2){
            if(!data2.face || !data2.nick_name){
                wx.getUserInfo({
                  success: function (data) {
                     var weixinInfo =  JSON.parse(data.rawData);
                     console.log(weixinInfo);
                     Post('/api/login/bind', { //绑定用户的头像等
                       openid:data2.open_id,
                       face: weixinInfo.avatarUrl,
                       nick_name: weixinInfo.nickName,
                       sex:weixinInfo.gender
                     },function(info){
                       module.exports.that.setData({
                         userinfo:info
                       });
                        var userinfo = JSON.stringify(info);
                        wx.setStorageSync('userinfo', userinfo);
                     });
                  },fail:function(){
                    wx.showToast({
                      image: '/img/kulian.png',
                      title: '拒绝了授权',
                    })
                  }
                });
            }else{
              module.exports.that.setData({
                userinfo: data2
              });
              var userinfo = JSON.stringify(data2);
              wx.setStorageSync('userinfo', userinfo);
            }
        });
      } else {
        wx.showToast({
          image: '/img/kulian.png',
          title: '拒绝了授权',
        })
      }
    }
  });
}

//检查是否授权登陆了  不使用微信的 checksession来判断 type 等于true 的时候代表需要 SETDATA
function checkAuthLogin(type) {
  var info = wx.getStorageSync('userinfo');
  var userinfo = info ? JSON.parse(info) : {};
  if (!userinfo.open_id) return false;
  var time = Date.parse(new Date());
  //console.log(time / 1000 - userinfo.last_time );
  if(time/1000 - userinfo.last_time > 86400){
    return false;//大于一天了
  }
  if(type==true){
      module.exports.that.setData({
        userinfo: userinfo
      });
  }
  return true;
}
//检查是否手机号登陆
function checkLogin() {
  var info = wx.getStorageSync('userinfo');
  var userinfo = JSON.parse(info);
  if (!userinfo.mobile) return false;
  module.exports.that.setData({
    userinfo: userinfo
  });
  return true;
}

//获取OPENID
function getOpenId(){
  var info = wx.getStorageSync('userinfo');
  var userinfo = info ?  JSON.parse(info): {};
  if (!userinfo.open_id) return 0;
  return userinfo.open_id;
}

//定位当前的城市 会把当前的城市返回给callback
function dingWei(cityList,callback){
  var city = wx.getStorageSync('city');
  var cityinfo = city ?  JSON.parse(city) : {};
  if (!cityinfo.city_id){ //如果缓存里面解析不到城市ID
      for(var a in cityList){
          if(cityList[a].default == 1){
             cityinfo = {
               city_id: cityList[a].city_id,
               city_name:cityList[a].city_name
             };
             break;
          }
      }
      if (!cityinfo.city_id){ //标识没有定位到默认城市
        cityinfo = {
          city_id: cityList[0].city_id,
          city_name: cityList[0].city_name
        };
      }
      module.exports.setCity(cityinfo.city_id,cityinfo.city_name); 
      if (callback != undefined) {
        callback(cityinfo);
      }
  }else{
    var is_city =0;
    for (var a in cityList) {
      if (cityList[a].city_id == cityinfo.city_id) {
        cityinfo = {
          city_id: cityList[a].city_id,
          city_name: cityList[a].city_name
        };
        is_city = 1;
        break;
      }
    }
    if(is_city == 0){
      cityinfo = {
        city_id: cityList[0].city_id,
        city_name: cityList[0].city_name
      };
    }  
    module.exports.setCity(cityinfo.city_id, cityinfo.city_name); 
    if (callback != undefined) {
      callback(cityinfo);
    }
  }
}

//获取所有的城市
function  getCityList(callback){
  Post('/api/city/getCityList', {}, function (cityList){
    callback(cityList);
  });
}

function getCity(){
  var city =   wx.getStorageSync('city');
  var cityinfo = city ?  JSON.parse(city) : {};
  return cityinfo;
}

//设置当前的城市
function setCity(city_id,city_name){
    var city = {
        city_id:city_id,
        city_name:city_name
    };
    var cityinfo = JSON.stringify(city);
    wx.setStorageSync('city',cityinfo);
}


//获取日期
function getDateStr(AddDayCount,type) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();

  if (m<10){
    m = "0" +m;
  }
  if(d<10){
    d = "0"+d;
  }
  if(type==1){
    return m + "月" + d+"日";
  }
  return y + "-" + m + "-" + d;
} 

//获得选择的开始结束时间日期
function getBgEndDate(){
    var date = wx.getStorageSync('wxb_bg_end_date');
   // console.log(date);
    var bg_date = getDateStr(0);
    //console.log(bg_date);
    if(date){
       var dateobj = JSON.parse(date); 
       console.log(dateobj.bg_date);
       console.log(bg_date);
       if (dateobj.bg_date && dateobj.bg_date >= bg_date){
          return  dateobj;
       } 
    } 
    var dateobj = {
      day:2,
      day2:1,
      bg_date: getDateStr(0),
      end_date: getDateStr(1),
      bg_date1: getDateStr(0,1),
      end_date1: getDateStr(1,1),
    };
    return dateobj;
}
//全部用POST
function Post(api, params, callback) {
  if (!module.exports.globalData.apiurl) {
    wx.getExtConfig({
      success: function (res) {
        module.exports.globalData = res.extConfig;
        PostMain(api, params, callback);
      }
    })
  } else {
    PostMain(api, params, callback);
  }
}

function PostMain(api, params, callback) {
  var apiurl = module.exports.globalData.apiurl + api + '?appid=' + module.exports.globalData.appid
    + '&appkey=' + module.exports.globalData.appkey;
  wx.request({
    url: apiurl,
    data: params,
    method: 'POST',
    dataType: 'json',
    success: function (data) {
      console.log(data);
      //wx.hideLoading();
      switch (data.data.code) {
        case 100:
          break;
        case 101:
          break;
        case 200:
          callback(data.data.data);
          break
        default:
          console.log(data.data.msg);
          wx.showToast({
            image: '/img/kulian.png',
            title: data.data.msg,
          })
          break;
      }
    },
    fail: function (data) {
      wx.hideLoading();
      wx.showToast({
        title: '请求接口超时',
      })
    }
  })
}


//上传图片 
// param img 图片；
function fileupload(mdl = '', callback) {
  var datas = [];
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      wx.showLoading({
        title: '图片上传中..',
      })
      wx.uploadFile({
        url: module.exports.globalData.apiurl + '/api/upload/upload', //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'mdl': mdl
        },
        
        success: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '上传成功',
          });
          var data = JSON.parse(res.data);//你大爷的强制返回字符串；强制转json
          callback(data.data);
        },
        fail: function (res) {
          wx.showToast({
            title: '图片上传中',
          });
        }
      });
    }
  });

}

//检查商户的登录情况 登录状态返回CODE 
function getStoreCode(){
  var info = wx.getStorageSync('storeinfo');
  var storeinfo = info ? JSON.parse(info) : {};
  if (!storeinfo.code) return false;
  var time = Date.parse(new Date());
  if (time/1000 - storeinfo.last_time > 86400) {
    return false;//大于一天了
  }
  return storeinfo.code;
}

function setStoreCode(code){
    var store = {
      code:code,
      last_time:Date.parse(new Date())/1000
    };
    wx.setStorageSync('storeinfo', JSON.stringify(store));
    return true;
}

module.exports = {
  login: login,
  checkAuthLogin: checkAuthLogin,
  checkLogin: checkLogin,
  getOpenId: getOpenId,
  dingWei: dingWei,
  setCity: setCity,
  getCityList: getCityList,
  getCity: getCity,
  getBgEndDate: getBgEndDate,
  getStoreCode: getStoreCode,
  setStoreCode: setStoreCode,
  fileupload: fileupload,
  Post: Post,
  globalData: [],
  that: null,
  lock: 0,//用于其他的锁定
}
