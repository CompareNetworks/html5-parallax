var $chapterStatus = true;

function menuSlideDown() {
    $('.slides-outer').slideUp(100, function () {
        $('footer .chapter-menu').removeClass('chapter-selected');
        $('.chapter-menu').slideUp();
        $('footer ul.chapters li').animate({width: '150px'}, 500);
    });
    $chapterStatus = true;
}

function loadSlideContent() {
    var owlData = $('.main-slides-container').data('owlCarousel'),
        currentSlide = parseInt(owlData.currentItem + 1), // Because owl data returns first slide as 0.
        prevSlide = parseInt(owlData.prevItem + 1),
        slideEl = $('.slide-no-' + currentSlide),
        slideContent = slideEl.data('content');

    slideEl.load('data/test.html');
}

$(document).on('onTemplateRenderComplete', function () {

    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    var $slides = $('.main-slides-container');
    var $slideThumbs = $('.slides-container');

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
        transitionStyle: 'fade',
        afterMove: function () {
            loadSlideContent();
        }
    });

    // loading first slide content at the initial application launch.
    loadSlideContent();


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

            $slideThumbs.trigger('owl.goTo', dataId - 1);
            return false;
        });
    });

    $('.slides-container .item').click(function () {
        var slide = $(this);
        var slideNumber = parseInt(slide.attr('data-slide-id'));
        $slides.trigger('owl.jumpTo', slideNumber - 1);
        setTimeout(function () {
            menuSlideDown();
        }, 500);
        return false;
    });
});