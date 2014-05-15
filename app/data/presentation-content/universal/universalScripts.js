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
          //console.log(slideProgress);
          //Do something depending on slideProgress
        }
        var swiperProgress = swiper.progress;
        //console.log(swiperProgress);
        var modSwiperProgress = -( Math.floor(swiperProgress * 2000 ) );


        //move('.brianWave').x(modSwiperProgress).duration(300).end();
        $(".wave").css("left", "" + modSwiperProgress + "px");
        $(".hairBubble").css("left", "" + (modSwiperProgress * -.8) + "px");


        //Do something with common swiper progress
      }
    }
  });
});