var tplIndex = require('../templates/index.string');

SPA.defineView('index', {
  html: tplIndex,

  plugins:['delegated'],

  modules: [{
    name:'content',
    views:['home','collect','set'],
    defaultTag:'home',
    container:'.l-container'
  }],

  bindActions:{
    //设置当前 tab 高亮
    'switch.tabs':function(e,data){
      $(e.el).addClass('active').siblings().removeClass('active');
     //切换子视图
     this.modules.content.launch(data.tag);
    }
  },
  bindEvents: {
    show: function () {

    //var myScroll = new IScroll('#home-scroll');
    }
  }
});
