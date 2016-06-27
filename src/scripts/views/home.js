var tplHome = require('../templates/home.string');

// 引用公共方法
var util = require('../utils/fn.js');

SPA.defineView('home',{
  html: tplHome,

  plugins: ['delegated', {
    name: 'avalon',
    options: function (vm) {
      vm.livelist = [];
    }
  }],

  init: {
    vm: null,
    livelistArray: [],
    mySwiper: null,
    formatData:function(arr){
      var tempArr = [];
      for (var i = 0; i < Math.ceil(arr.length/3); i++) {
        tempArr[i] =[];
        tempArr[i].push(arr[3*i]);
        tempArr[i].push(arr[3*i+1]);
        tempArr[i].push(arr[3*i+2]);
      }
      return tempArr;
    }
  },

  bindActions: {
    'tap.slide': function (e, data) {
      this.mySwiper.slideTo($(e.el).index())
    },
    'goto.detail': function (e, data) {
      SPA.open('detail');
    },
    'goto.particular': function (e, data) {
      SPA.open('particular');
    }
  },

  bindEvents: {
    'beforeShow': function () {
      var that = this;

      // 获得vm对象
       this.vm = this.getVM();
       console.log(this.vm);
      $.ajax({
        //url: '/attempt/mock/livelist.json',
        url: '/api/getLivelist.php',
        type: 'get',
        data:{
          rtype: 'origin'
        },
        success: function (rs) {

          //console.log(that.formatData(rs.data));
         that.livelistArray = rs.data;
         that.vm.livelist = that.formatData(rs.data);
        }
      });
    },

    show:function () {
      var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: ".swiper-pagination",
        autoplay: 2500
      });
      //横向nav
      var navScroll = this.widgets.navScroll;
      navScroll.options.scrollX = true;
      navScroll.options.scrollY = false;


      //下拉刷新，上拉加载更多
      var that = this;
      //console.log(that)
      var scrollSize = 30;
      var myScroll = that.widgets.secScroll;
      //console.log(myScroll)
      myScroll.scrollBy(0, 0);

      var head = $('.head img'),
          topImgHasClass = head.hasClass('up');
      var foot = $('.foot img'),
          bottomImgHasClass = head.hasClass('down');
      myScroll.on('scroll', function () {
          var y = this.y,
              maxY = this.maxScrollY - y;
          if (y >= 0) {
              !topImgHasClass && head.addClass('up');
              return '';
          }
          if (maxY >= 0) {
              !bottomImgHasClass && foot.addClass('down');
              return '';
          }
      });

      myScroll.on('scrollEnd', function () {
          if (this.y >= -scrollSize && this.y < 0) {
              myScroll.scrollTo(0, -scrollSize);
              head.removeClass('up');
          } else if (this.y >= 0) {
              head.attr('src', '/attempt/images/ajax-loader.gif');
              //TODO ajax下拉刷新数据

              // $.ajax({
              //   url: '/api/getLivelist.php',
              //   data: {
              //     rtype: 'refresh'
              //   },
              //   success: function (rs) {
              //     var newArray = rs.data.concat(that.livelistArray);
              //     that.vm.livelist = that.formatData(newArray);
              //     that.livelistArray = newArray;
              //
              //     myScroll.scrollTo(0, -scrollSize);
              //     head.removeClass('up');
              //     head.attr('src', '/attempt/images/arrow.png');
              //   }
              // })
          }

          var maxY = this.maxScrollY - this.y;
          var self = this;
          if (maxY > -scrollSize && maxY < 0) {
              myScroll.scrollTo(0, self.maxScrollY + scrollSize);
              foot.removeClass('down')
          } else if (maxY >= 0) {
              foot.attr('src', '/attempt/images/ajax-loader.gif');
              // ajax上拉加载数据

              $.ajax({
                url: '/api/getLivelist.php',
                data: {
                  rtype: 'more'
                },
                success: function (rs) {
                  //console.log(that)
                  var newArray = that.livelistArray.concat(rs.data);
                  console.log(newArray);
                  that.vm.livelist = that.formatData(newArray);
                  that.livelistArray = newArray;
                  myScroll.refresh();

                  myScroll.scrollTo(0, self.y + scrollSize);
                  foot.removeClass('down');
                  foot.attr('src', '/attempt/images/arrow.png');
                }
              });
          }
      });
    }
  }
});
