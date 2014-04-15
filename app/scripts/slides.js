var $chapterStatus = true;
var $slideThumbs = $('.slides-container');
var $slides = $('.main-slides-container');

function menuSlideDown() {
    $('.chapter-menu').slideUp(500, function () {
        $('footer .chapter-menu').removeClass('chapter-selected');
        $('.slides-outer').slideUp();
        $('footer ul.chapters li').animate({width: '150px'}, 500);
    });
    $chapterStatus = true;
}

$(document).ready(function () {
    $('.main-container').malaTabs({animation: 'fade'});

    $slideThumbs.owlCarousel({

        items: 10,
        slideSpeed: 1000,
        itemsDesktop: [1000, 10], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 10], // between 900px and 601px
        itemsTablet: [600, 10] //2 items between 600 and 0

    });

    $slides.owlCarousel({
        slideSpeed: 1000,
        singleItem: true,
        autoHeight: true,
        transitionStyle: 'fade'
    });


    $('footer #main-menu-btn').click(function () {
        $('.chapter-menu').slideDown(function () {
        });

        return false;
    });

    $('footer .close-btn').click(function () {
        menuSlideDown();
        return false;
    });

    $('footer .chapters a').each(function () {
        var chapter = $(this);

        chapter.click(function () {
            var dataId = parseInt($(this).attr('data-first-slide'));
            if ($chapterStatus) {
                $('footer .chapter-menu').addClass('chapter-selected');
                $('footer ul.chapters li').animate({width: '100px'}, 500);
                $('.slides-outer').slideDown();
                chapter = false;
            }
            console.log(dataId);
            $slideThumbs.trigger('owl.goTo', dataId);
            return false;
        });
    });

    $('.slides-container .item').click(function () {
        var slide = $(this);
        var slideNumber = parseInt(slide.attr('data-slide-id'));
        $slides.trigger('owl.jumpTo', slideNumber - 1);
        setTimeout(function () {
            menuSlideDown();
        }, 1000);
        return false;
    });

});