//Created by Jason Roy on 5/15/14
$(function () {
  $(document).on({
    onProgressChange: function(event) {
      {
        var swiper = event.horizontalSwiperObj;
        //Plugin adds "progress" property to each slide and common "progress" property for swiper
        for (var i = 0; i < swiper.slides.length; i++) {
          var slide = swiper.slides[i];
          var slideProgress = slide.progress;
          //Do something depending on slideProgress
        }
        var swiperProgress = swiper.progress;
        //Do something with common swiper progress
      }
    }
  });
});