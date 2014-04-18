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
        selectedSlide = parseInt(owlData.currentItem + 1), // Because owlData returns first slide as 0.
        previousSlide = parseInt(owlData.prevItem + 1),
        slideElement = $('.slide-no-' + selectedSlide),
        slideContent = slideElement.data('content'),
        bufferSize = 1;

    slideElement.load(slideContent);

    if ((previousSlide !== (selectedSlide + bufferSize)) && (previousSlide !== (selectedSlide - bufferSize))) {
        $('.slide-no-' + previousSlide).empty();
        console.log('removed slide ' + previousSlide);
    }

    if (selectedSlide < owlData.itemsAmount) {
        var nextSlideElement = $('.slide-no-' + (selectedSlide + bufferSize));

        if (nextSlideElement.is(':empty')) {
            console.log('loading next');
            nextSlideElement.load(nextSlideElement.data('content'));
        }
    }

    if ((selectedSlide - bufferSize) > 0) {
        var previousSlideElement = $('.slide-no-' + (selectedSlide - bufferSize));

        if (previousSlideElement.is(':empty')) {
            console.log('loading previous');
            previousSlideElement.load(previousSlideElement.data('content'));
        }
    }
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