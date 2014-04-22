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

function loadSlideNotes() {
    var selectedSlideEl = $('div.main-slider div.owl-item.active > div:first')[0],
        slideNoteEl = $('footer #slide-notes'),
        scroll = null;

    slideNoteEl.empty();
    slideNoteEl.load($(selectedSlideEl).data('slide-notes'), function () {
        scroll = new IScroll('#slide-notes', {
            scrollbars: true,
            shrinkScrollbars: 'scale'
        });
        setTimeout(function () {
            // Refreshing the IScroll after the DOM manipulation.
            scroll.refresh();
        }, 1000);
    });
}

function openItem(itemId) {
  macs.viewAsset(
    itemId.toString()
  );
}

function loadRelatedDocuments () {
    var selectedSlideEl = $('div.main-slider div.owl-item.active > div:first')[0],
        chapterNumber = $(selectedSlideEl).data('chapter-no'),
        slideNumber = $(selectedSlideEl).data('slide-no'),
        relatedDocumentFolderId = $(selectedSlideEl).data('related-docs-folder-id');

    var divId = getDivId (chapterNumber, slideNumber, relatedDocumentFolderId);
    $('#related-documents').children().hide();

    if ($('div[id^='+divId+']').length > 0) {
        $( "#"+divId ).show();
    }
    else{
        macs.getFolderAssets(
        relatedDocumentFolderId.toString(),
        function(data) {
          if (data) {
            var divContent = null;
            divContent = "<div id = "+divId+">";
            divContent += "<ul class='related_doc'>";

                $.each(data['children'], function( index, item_id ) {
                var resultArray = getItemInfo(item_id);
                  if (resultArray['isFolder']) {
                    divContent += "<li class='related-doc-item' data_item_id='"+item_id+"'>" ;
                    divContent += " <a href='#''>"

                    divContent += "<img src='data/presentation-content/chapter_1/slide_1/thumbnail.gif' height='50' width='50'>"
                    divContent += "</img>";
                    divContent += "<span>" ;
                    divContent += resultArray['title'];
                    divContent += "</span>" ;

                    divContent += " </a>";
                    divContent += "</li>" ;
                  }
                });

            divContent += "</ul>";    
            divContent += "</div>";

            $( "#related-documents" ).append( divContent );
          }  
        },
        function (error) {
        }
      );
    }
}

function getDivId (chapterNumber, slideNumber, related_docs_folder_id) {
    return 'div_'+chapterNumber.toString()+'_'+slideNumber.toString()+'_'+related_docs_folder_id.toString();
}

function getItemInfo(item_id) {
    var success = false;
    var title = null;
    var indexArray = new Array();
    macs.getRequiredAssetDetails(
      item_id,
      ["itemTypeId","title"],
      function (data) {
        if (data) {
            var itemTypeId = parseInt(data.itemTypeId);
             if (itemTypeId == 3) {
                   success = false;
             }else{
                   success = true;
                   title = data.title;
             }

        }else{
             success = false;
        }
      },
      function (error) {
          success = false;
      }
    );

    indexArray['isFolder'] = success;
    indexArray['title'] = title;

    return indexArray;
}

$(document).on('onTemplateRenderComplete', function () {
    $('.main-container').malaTabs({animation: 'fade'});
    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    var $slides = $('.main-slides-container'),
        $slideThumbs = $('.slides-container'),
		$chapters = $('.chapters'),
		$innerCss = '',
		$windowHeight = $(window).height() - 50;
		
	$innerCss += '<style type="text/css">'
				+ '.main-slides-container #wrapper .page{'
				+ 'height:' + $windowHeight + 'px'
				+ '}'
				+ '</style>';
	
	$('.main-container').append($innerCss);

    $slideThumbs.owlCarousel({
        items: 5,
        slideSpeed: 1000,
        itemsDesktop: [1000, 5], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 5], // between 900px and 601px
        itemsTablet: [600, 5], //2 items between 600 and 0
        lazyLoad : true
    });
	
	$chapters.owlCarousel({
        items: 6,
        slideSpeed: 1000,
        itemsDesktop: [1000, 6], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 6], // between 900px and 601px
        itemsTablet: [600, 6], //2 items between 600 and 0
        lazyLoad : true
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
                slideThumb = $('footer div.slides-outer div.owl-item div.item'),
                chapterNo = $(selectedSlideEl).data('chapter-no'),
                slideNo = $(selectedSlideEl).data('slide-no');

            $('footer .chapters a').removeClass('selected');
            slideThumb.removeClass('slide-selected');
            $('footer div.chapters div.chapter a').eq(chapterNo-1).addClass('selected');
            $slideThumbs.trigger('owl.goTo', (slideNo - 1));
            slideThumb.eq(slideNo - 1).addClass('slide-selected');
            $slideThumbs.fadeIn();
			$('.owl-wrapper-outer',$chapters).fadeIn();
			loadSlideNotes();
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
        var slideThumb = $('footer div.slides-outer div.owl-item div.item');
        $slides.trigger('owl.jumpTo', slideNumber - 1);
        slideThumb.removeClass('slide-selected');
        slide.addClass('slide-selected');
        setTimeout(function () {
            $('.chapter-menu').slideUp();
            $slideThumbs.hide();
        }, 500);
        return false;
    });

    $('footer #slide-notes-button').click( function() {
        loadSlideNotes();
    });

    $('footer #related-doc-button').click( function() {
        loadRelatedDocuments();
    });

    $( "body" ).delegate( ".related-doc-item", "click", function() {
        var itemId = $(this).attr('data_item_id');
        openItem(itemId);
    });

    document.addEventListener('touchmove', function (e) {
        var container = $('.chapter-menu');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $slideThumbs.hide();
            $('.owl-wrapper-outer', $chapters).hide();
            $('.chapter-menu').slideUp();
        }
    });

});