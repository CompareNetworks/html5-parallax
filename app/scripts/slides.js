function initSlideSpecificPlugins(domElement) {
    var verticalScroll = null;

    if (domElement.data('vertical-scrollable')) {
        verticalScroll = new IScroll(domElement.selector, {
            snap: true
        });
    }
}

function updateNavigation(slideEl, selectedSlide, owlData) {
    var leftArrow = $('footer a.left-arrow'),
        rightArrow = $('footer a.right-arrow'),
        bottomArrow = $('footer a.bottom-arrow');

    if (slideEl.data('vertical-scrollable')) {
        bottomArrow.addClass('active');
    }
    else if (bottomArrow.hasClass('active')) {
        bottomArrow.removeClass('active');
    }

    if (selectedSlide < owlData.itemsAmount) {
        rightArrow.addClass('active');
    }
    else if (rightArrow.hasClass('active')) {
        rightArrow.removeClass('active');
    }

    if (selectedSlide > 1) {
        leftArrow.addClass('active');
    }
    else if (leftArrow.hasClass('active')) {
        leftArrow.removeClass('active');
    }

}

function destroySlideContent(previousSlide, selectedSlide, bufferSize) {
    var backSlide = (previousSlide - bufferSize),
        nextSlide = (previousSlide + bufferSize),
        slideDiff = Math.abs(previousSlide - selectedSlide),
        slideList = [];

    function destroy(slideList) {
        slideList.forEach(function (slideNo) {
            $('div.slide-no-' + slideNo).empty();
        });
    }

    if (slideDiff >= 3) {
        slideList = [previousSlide, backSlide, nextSlide];
    }
    else if (selectedSlide > previousSlide) {
        slideList = slideDiff === 2 ? [backSlide, ++backSlide] : [backSlide];
    }
    else if (selectedSlide < previousSlide) {
        slideList = slideDiff === 2 ? [nextSlide, ++nextSlide] : [nextSlide];
    }

    destroy(slideList);
}

function loadSlideContent() {
    var owlData = $('div.main-slides-container').data('owlCarousel'),
        selectedSlide = parseInt(owlData.currentItem + 1), // Because owlData returns first slide as 0.
        previousSlide = parseInt(owlData.prevItem + 1),
        slideElement = $('div.slide-no-' + selectedSlide),
        bufferSize = 1;

    function addToDom(domElement) {
        if (domElement.is(':empty')) {
            domElement.load(domElement.data('content'), function(){
                // Initializing the required plugins for the slide. E.g: IScroll.
                initSlideSpecificPlugins(domElement);
            });
        }
    }

    addToDom(slideElement);

    destroySlideContent(previousSlide, selectedSlide, bufferSize);

    if (selectedSlide < owlData.itemsAmount) {
        addToDom($('div.slide-no-' + (selectedSlide + bufferSize)));
    }

    if ((selectedSlide - bufferSize) > 0) {
        addToDom($('div.slide-no-' + (selectedSlide - bufferSize)));
    }

    updateNavigation(slideElement, selectedSlide, owlData);
}

function loadChaptersInfo($title, $description) {
    $('.chapter-info h3').html($title);
    $('.chapter-info p').html($description);
}

$(document).on('onTemplateRenderComplete', function () {
    $('.main-container').malaTabs({animation: 'fade'});
    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    var $slides = $('.main-slides-container'),
        $slideThumbs = $('.slides-container'),
		$chapters = $('.chapters');

    $slideThumbs.owlCarousel({
        items: 5,
        slideSpeed: 1000,
        itemsDesktop: [1000, 5], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 5], // between 900px and 601px
        itemsTablet: [600, 5] //2 items between 600 and 0

    });
	
	$chapters.owlCarousel({
        items: 6,
        slideSpeed: 1000,
        itemsDesktop: [1000, 6], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 6], // between 900px and 601px
        itemsTablet: [600, 6] //2 items between 600 and 0

    });

    $slides.owlCarousel({
        slideSpeed: 1500,
        singleItem: true,
        autoHeight: true,
        transitionStyle: 'fade',
        addClassActive: true,
        afterMove: function () {
            loadSlideContent();
        }
    });

    // loading first slide content at the initial application launch.
    loadSlideContent();


    $('footer #main-menu-btn').click(function () {
        $('.chapter-menu').slideDown(function () {
            var selectedSlideEl = $('div.main-slider div.owl-item.active > div:first')[0],
                chapterNo = $(selectedSlideEl).data('chapter-no'),
                slideNo = $(selectedSlideEl).data('slide-no');

            $slideThumbs.trigger('owl.goTo', (slideNo - 1));
            $('footer .chapters a').removeClass('selected');
            $('footer .chapters .chapter:nth-child(' + chapterNo + ') a').addClass('selected');
            $slideThumbs.show();
        });
        return false;
    });

    $('footer .close-btn').click(function () {
        $slideThumbs.hide();
        $('.chapter-menu').slideUp();
        return false;
    });

    $('footer .chapters a').append('<div class="arrow"><div class="inner"></div></div>');
    $('footer .chapters .owl-item:first-child a').addClass('selected');
    var $firstTitle = $('footer .chapters .owl-item:first-child a').attr('data-title');
    var $firstDescription = $('footer .chapters .owl-item:first-child a').attr('data-description');

    loadChaptersInfo($firstTitle, $firstDescription);

    $('footer .chapters a').each(function () {
        var chapter = $(this);
        chapter.click(function () {
            var title = chapter.data('title'),
                description = chapter.data('description');

            $('footer .chapters a').removeClass('selected');
            chapter.addClass('selected');
            var dataId = parseInt($(this).attr('data-first-slide'));
            loadChaptersInfo(title, description);
            $slideThumbs.trigger('owl.goTo', dataId - 1);
            return false;
        });
    });

    $('.slides-container .item').click(function () {
        var slide = $(this);
        var slideNumber = parseInt(slide.attr('data-slide-id'));
        $slides.trigger('owl.jumpTo', slideNumber - 1);
        setTimeout(function () {
            $('.chapter-menu').slideUp();
            $slideThumbs.hide();
        }, 500);
        return false;
    });
});