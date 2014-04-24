var itemTypes = fileTypes.initItemTypes(),
    verticalScroll = null;

function initSlideSpecificPlugins(domElement) {
    if (domElement.data('vertical-scrollable')) {
        var topArrow = $('footer a.top-arrow'),
            bottomArrow = $('footer a.bottom-arrow');

        $('.vertical-scroll-slide', domElement).swiper({
            mode: 'vertical',
            slidesPerView: 1,
            onSlideChangeEnd: function (swiper) {
                verticalScroll = swiper;
                if (swiper.activeIndex > 0) {
                    topArrow.addClass('active');
                    if (swiper.activeIndex === (swiper.slides.length - 1)) {
                        bottomArrow.removeClass('active');
                    }
                    else {
                        bottomArrow.addClass('active');
                    }
                }
                else {
                    topArrow.removeClass('active');
                    bottomArrow.addClass('active');
                }
            }
        });
    }
}

function updateNavigation(slideEl, selectedSlide, swiperData) {
    var leftArrow = $('footer a.left-arrow'),
        rightArrow = $('footer a.right-arrow'),
        bottomArrow = $('footer a.bottom-arrow');

    if (verticalScroll) {
        verticalScroll.swipeTo(0, 1);
    }

    if (slideEl.data('vertical-scrollable')) {
        bottomArrow.addClass('active');
    }
    else if (bottomArrow.hasClass('active')) {
        bottomArrow.removeClass('active');
    }

    if (selectedSlide < swiperData.slides.length) {
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

function loadSlideContent(swiperData) {
    var selectedSlide = (swiperData.activeIndex + 1), // Because swiperData returns first slide as 0.
        previousSlide = (swiperData.previousIndex + 1),
        slideElement = $('div.slide-no-' + selectedSlide),
        bufferSize = 1;

    function addToDom(domElement) {
        if (domElement.is(':empty')) {
            domElement.load(domElement.data('content'), function () {
                // Initializing the required plugins for the slide. E.g: IScroll.
                initSlideSpecificPlugins(domElement);
            });
        }
    }

    addToDom(slideElement);

    destroySlideContent(previousSlide, selectedSlide, bufferSize);

    if (selectedSlide < swiperData.slides.length) {
        addToDom($('div.slide-no-' + (selectedSlide + bufferSize)));
    }

    if ((selectedSlide - bufferSize) > 0) {
        addToDom($('div.slide-no-' + (selectedSlide - bufferSize)));
    }

    updateNavigation(slideElement, selectedSlide, swiperData);
}

function loadChaptersInfo($title, $description) {
    $('.chapter-info h3').html($title);
    $('.chapter-info p').html($description);
}

function loadSlideNotes() {
    var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.swiper-slide-active')[0],
        slideNoteEl = $('footer #slide-notes'),
        scroll = null;

    slideNoteEl.empty();
    slideNoteEl.load($(selectedSlideEl).data('slide-notes'), function (responseText, textStatus) {
        if (textStatus !== 'error') {
            scroll = new IScroll('#slide-notes', {
                scrollbars: true,
                shrinkScrollbars: 'scale'
            });
            setTimeout(function () {
                // Refreshing the IScroll after the DOM manipulation.
                scroll.refresh();
            }, 1000);
        }
        else {
            slideNoteEl.html('<div class="sn-availability"><p class="sn-availability-message">Slide notes are not available.</p></div>');
        }
    });
}

function openItem(itemId) {
    macs.viewAsset(itemId.toString(),
        function () {}
    );
}

function getDivId(chapterNumber, slideNumber, relatedDocsFolderId) {
    return 'div_' + chapterNumber.toString() + '_' + slideNumber.toString() + '_' + relatedDocsFolderId.toString();
}

function getIconImagePath (iconName, fileType) {
    var iconImagePath = null;
    if (iconName !== null) {
        var fullPath = window.location.pathname;
        var pathComponentsArray = fullPath.split('/');
        var removedString = pathComponentsArray[pathComponentsArray.length - 2]+'/'+pathComponentsArray[pathComponentsArray.length - 1];
        var documentPath = fullPath.replace(removedString,'');
        iconImagePath = documentPath.concat(iconName+'.png');
    }
    else{
        iconImagePath = 'images/fileTypes/' + itemTypes[fileType] + '_default_thumbnail.png';
    }

    return iconImagePath;
}

function getItemInfo(itemId) {
    var success = false;
    var title = null;
    var fileType = null;
    var iconImageName = null;
    var itemDescription = '';
    var indexArray = [];
    macs.getRequiredAssetDetails(
        itemId,
        ['itemTypeId', 'title', 'fileType','iconImageName','itemDescription'],
        function (data) {
            if (data) {
                // alert(JSON.stringify(data)); 
                var itemTypeId = parseInt(data.itemTypeId);
                if (itemTypeId === 3) {
                    success = false;
                } else {
                    success = true;
                    title = data.title;
                    fileType = data.fileType;

                    if (data.itemDescription) {
                        itemDescription = data.itemDescription;
                    }
                    
                    if (data.iconImageName && data.iconImageName !== 'Not available') {
                        iconImageName = data.iconImageName;
                    }
                }

            } else {
                success = false;
            }
        },
        function (error) {
            console.log(error);
            success = false;
        }
    );

    indexArray.isNotFolder = success;
    indexArray.title = title;
    indexArray.fileType = fileType;
    indexArray.iconImageName = iconImageName;
    indexArray.itemDescription = itemDescription;

    return indexArray;
}

function trancateTitle(title) {
    var length = 10;
    if (title.length > length) {
        title = title.substring(0, length) + '...';
    }
    return title;
}

function loadRelatedDocuments() {
    var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.swiper-slide-active')[0],
        chapterNumber = $(selectedSlideEl).data('chapter-no'),
        slideNumber = $(selectedSlideEl).data('slide-no'),
        relatedDocumentFolderId = $(selectedSlideEl).data('related-docs-folder-id');

    var divId = getDivId(chapterNumber, slideNumber, relatedDocumentFolderId);
    $( '#no_items_found' ).remove();
    $('#related-documents').children().hide();

    if ($('div[id^=' + divId + ']').length > 0) {
        $('#' + divId).show();
    }
    else {
        macs.getFolderAssets(
            relatedDocumentFolderId.toString(),
            function (data) {
                if (data) {
                    var assetsContain = false;
                    var divContent = null;
                    divContent = '<div id = ' + divId + '>';
                    divContent += '<ul class="related-doc">';

                    $.each(data.children, function (index, itemId) {
                        var resultArray = getItemInfo(itemId);
                        if (resultArray.isNotFolder) {
                            assetsContain = true;
                            var imagePath = getIconImagePath(resultArray.iconImageName, resultArray.fileType);
                            divContent += '<li class="related-doc-item" data_item_id="' + itemId + '">';
                            divContent += '<a href="#">';

                            divContent += '<img src="' + imagePath + '">';
                            divContent += '</img>';
                            divContent += '<span class="title">';
                            divContent += trancateTitle(resultArray.title);
                            divContent += '</span>';

                            divContent += '<span class="description">';
                            divContent += resultArray.itemDescription;
                            divContent += '</span>';

                            divContent += '</a>';
                            divContent += '</li>';
                        }
                    });

                    if (!assetsContain){
                        divContent += '<div class = "no-items-found" id = "no_items_found">No Related Documents found.</div>';
                    }

                    divContent += '</ul>';
                    divContent += '</div>';

                    $('#related-documents').append(divContent);
                    $.event.trigger({type: 'onRelatedDocumentsRenderComplete'});
                }
            },
            function () {
                $('#related-documents').append('<div class = "no_items_found" id = "no_items_found">No Related Documents found.</div>');
            }
        );
    }
}

function loadFirstTab() {
    var $tabContainer = $('.chapter-menu'),
        $tabButtons = $('.tab-buttons', $tabContainer),
        $tabContents = $('.tab-contents', $tabContainer);

    $('.tab', $tabContents).removeClass('active-tab').hide();
    $('.tab:first-child', $tabContents).addClass('active-tab').show();
    $('ul li', $tabButtons).removeClass('selected-tab');
    $('ul li a#menu-button', $tabButtons).parent().addClass('selected-tab');

}

function scrollEnable(divId) {
    var scroll = new IScroll('#' + divId, {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        click: true
    });

    setTimeout(function () {
        scroll.refresh();
    }, 1000);
}

$(document).on('onRelatedDocumentsRenderComplete', function () {
    $('.related-doc-item').click(function () {
        var itemId = $(this).attr('data_item_id');
        openItem(itemId);
    });

    scrollEnable('related-documents');
});

$(document).on('onTemplateRenderComplete', function () {
    $('.main-container').malaTabs({animation: 'fade'});
    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    var swiperObj = null,
        $slides = $('.swiper-container'),
        $slideThumbs = $('.slides-container'),
        $chapters = $('.chapters'),
        $innerCss = '',
        $windowHeight = $(window).height() - 50;

    $innerCss += '<style type="text/css">' +
        '.main-slides-container #wrapper .page{' +
        'height:' + $windowHeight + 'px' +
        '}' +
        '</style>';

    $('.main-container').append($innerCss);

    $slideThumbs.owlCarousel({
        items: 5,
        slideSpeed: 1000,
        scrollPerPage: true,
        pagination: false,
        itemsDesktop: [1000, 5],
        itemsDesktopSmall: [900, 5],
        itemsTablet: [600, 5]
    });

    $chapters.owlCarousel({
        items: 6,
        slideSpeed: 1000,
        scrollPerPage: true,
        pagination: false,
        itemsDesktop: [1000, 6],
        itemsDesktopSmall: [900, 6],
        itemsTablet: [600, 6]
    });

    $slides.swiper({
        mode: 'horizontal',
        onSlideChangeEnd: function (swiper) {
            loadSlideContent(swiper);
            swiperObj = swiper;
        },
        onFirstInit: function (swiper) {
            loadSlideContent(swiper);
            swiperObj = swiper;
        }
    });

    $('footer #main-menu-btn').click(function () {
        $('.chapter-menu').slideDown(function () {
            var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.swiper-slide-active')[0],
                slideThumb = $('footer div.slides-outer div.owl-item div.item'),
                chapterNo = $(selectedSlideEl).data('chapter-no'),
                slideNo = $(selectedSlideEl).data('slide-no'),
                selectedChapter = $('footer div.chapters div.chapter a').eq(chapterNo - 1);

            $('footer .chapters a').removeClass('selected');
            slideThumb.removeClass('slide-selected');
            selectedChapter.addClass('selected');
            loadChaptersInfo(selectedChapter.data('title'), selectedChapter.data('description'));
            $slideThumbs.trigger('owl.goTo', (slideNo - 1));
            $chapters.trigger('owl.goTo', (chapterNo - 1));
            slideThumb.eq(slideNo - 1).addClass('slide-selected');
            $slideThumbs.fadeIn();
            $('.owl-wrapper-outer', $chapters).fadeIn();
        });
        return false;
    });

    $('footer .close-btn').click(function () {
        $slideThumbs.hide();
        $('.chapter-menu').slideUp(function () {
            loadFirstTab();
        });
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
        var slide = $(this),
            slideNumber = parseInt(slide.data('slide-id')),
            chapterNo = parseInt(slide.data('chapter-no')),
            slideThumb = $('footer div.slides-outer div.owl-item div.item'),
            selectedChapter = $('footer div.chapters div.chapter a').eq(chapterNo - 1);


        $('footer .chapters a').removeClass('selected');
        selectedChapter.addClass('selected');
        loadChaptersInfo(selectedChapter.data('title'), selectedChapter.data('description'));
        $chapters.trigger('owl.goTo', (chapterNo - 1));
        swiperObj.swipeTo(slideNumber - 1, 1);
        slideThumb.removeClass('slide-selected');
        slide.addClass('slide-selected');
        return false;
    });

    $('footer #slide-notes-button').click(function () {
        loadSlideNotes();
    });

    $('footer #related-doc-button').click(function () {
        loadRelatedDocuments();
    });

    document.addEventListener('touchmove', function (e) {
        var container = $('.chapter-menu');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $slideThumbs.hide();
            $('.owl-wrapper-outer', $chapters).hide();
            $('.chapter-menu').slideUp(function () {
                loadFirstTab();
            });
        }
    });

});