var tplDetail = require('../templates/particular.string');

SPA.defineView('particular', {
  html: tplDetail,

  plugins: ['delegated', {
    name: 'avalon',
    options: function (vm) {
      vm.navlist = [];
    }
  }],

  init: {
    vm: null,
    navlistArray: [],
    mySwiper: null,
    formatData:function(arr){
      //console.log(arr);
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
    'back': function () {
      this.hide(); 
    }
  },

  bindEvents: {
    'beforeShow': function () {
      var that = this;
      // 获得vm对象
       that.vm = that.getVM();
       //console.log(that);
       $.ajax({
           url: '/api/getNavlist.php',
           //url:"/attempt/mock/navlist.json",
           type: 'get',
           data:{
             rtype: 'origin'
           },
           success: function (rs) {
             //console.log(rs);
             // console.log(that.formatData(rs.data));
            that.navlistArray = rs.data;
            that.vm.navlist = that.formatData(rs.data);
          }

       });
    },

    'show':function () {

      //横向nav
      var listScroll = this.widgets.listScroll;
      listScroll.options.scrollX = true;
      listScroll.options.scrollY = false;


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
              //   url: '/api/getNavlist.php',
              //   data: {
              //     rtype: 'refresh'
              //   },
              //   success: function (rs) {
              //     var newArray = rs.data.concat(that.navlistArray);
              //     that.vm.navlist = that.formatData(newArray);
              //     that.navlistArray = newArray;
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
                url: '/api/getNavlist.php',
                data: {
                  rtype: 'more'
                },
                success: function (rs) {
                  //console.log(that)
                  var newArray = that.navlistArray.concat(rs.data);
                  console.log(newArray);
                  that.vm.navlist = that.formatData(newArray);
                  that.navlistArray = newArray;
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
