<news>

<div>{ news }</div>

var self = this;

// [3-2] ニュース襴の表示
news.on('news_update', function(data) {
  self.news = data;
  self.update();
});

</news>
