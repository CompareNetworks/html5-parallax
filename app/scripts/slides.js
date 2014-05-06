/**
 * Created by premuditha on 5/6/14.
 */

(function ($, w, d, h) {
    var itemTypes = fileTypes.initItemTypes(),
        templates = null,
        vertScroll = null;

    templates = {
        'loadingMsg': '<p class="loading-text">Loading...</p>',
        'relatedDocTpl': '<div id = {{divId}}> ' +
            '<ul class="related-doc"> ' +
            '{{#each children}} {{#if this.isNotFolder}} ' +
            '<li class="related-doc-item" data_item_id="{{this.itemId}}"> ' +
            '<a href="#"> <img src="{{this.imagePath}}"/>' +
            '<span class="title">{{this.title}}</span>' +
            '<span class="description">{{this.description}}</span>' +
            '</a>' +
            '</li>' +
            '{{/if}}{{/each}}' +
            '</ul>' +
            '{{#unless assetsContain}}' +
            '<div class = "no-items-found" id = "no_items_found">No Related Documents found.</div>' +
            '{{/unless}}' +
            '</div>',
        'innerCss': '<style type="text/css">' +
            '.main-slides-container #wrapper .page{height:644px} .swiper-container{height:644px}' +
            '</style>'

    };

    var slideContent = {

        updateNavigation: function (slideEl, selectedSlide, swiperData) {
            var leftArrow = $('footer a.left-arrow'),
                rightArrow = $('footer a.right-arrow'),
                bottomArrow = $('footer a.bottom-arrow');

            if (vertScroll) {
                vertScroll.swipeTo(0, 1);
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

        },

        destroySlideContent: function (previousSlide, selectedSlide, bufferSize) {
            var backSlide = (previousSlide - bufferSize),
                nextSlide = (previousSlide + bufferSize),
                slideDiff = Math.abs(previousSlide - selectedSlide),
                slideList = [];

            function destroy(slideList) {
                slideList.forEach(function (slideNo) {
                    var element = $('div.slide-no-' + slideNo);
                    element.empty();
                    element.html(templates.loadingMsg);
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
        },

        initSlideSpecificPlugins: function (domElement) {
            if (domElement.data('vertical-scrollable')) {
                var topArrow = $('footer a.top-arrow'),
                    bottomArrow = $('footer a.bottom-arrow');

                $('.vertical-scroll-slide', domElement).swiper({
                    mode: 'vertical',
                    slidesPerView: 1,
                    onSlideChangeEnd: function (swiper) {
                        vertScroll = swiper;
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
        },

        loadSlideContent: function (swiperData) {
            var selectedSlide = (swiperData.activeIndex + 1), // Because swiperData returns first slide as 0.
                previousSlide = (swiperData.previousIndex + 1),
                slideElement = $('div.slide-no-' + selectedSlide),
                bufferSize = 1;

            function addToDom(domElement) {
                if (domElement[0].innerHTML === templates.loadingMsg) {
                    domElement.empty();
                    domElement.load(domElement.data('content'), function () {
                        // Initializing the required plugins for the slide. E.g: IScroll.
                        slideContent.initSlideSpecificPlugins(domElement);
                    });
                }
            }

            addToDom(slideElement);

            slideContent.destroySlideContent(previousSlide, selectedSlide, bufferSize);

            if (selectedSlide < swiperData.slides.length) {
                addToDom($('div.slide-no-' + (selectedSlide + bufferSize)));
            }

            if ((selectedSlide - bufferSize) > 0) {
                addToDom($('div.slide-no-' + (selectedSlide - bufferSize)));
            }

            slideContent.updateNavigation(slideElement, selectedSlide, swiperData);
        }

    };

    var slideNotes = {

        loadSlideNotes: function () {
            var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.parent.swiper-slide-active')[0],
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

    };

    var relatedDocs = {

        trancateTitle: function (title, length) {
            if (title.length > length) {
                title = title.substring(0, length) + '...';
            }
            return title;
        },

        openItem: function (itemId) {
            macs.viewAsset(itemId.toString(),
                function () {}
            );
        },

        scrollEnable: function (divId) {
            var scroll = new IScroll('#' + divId, {
                scrollbars: true,
                shrinkScrollbars: 'scale',
                click: true
            });

            setTimeout(function () {
                scroll.refresh();
            }, 1000);
        },

        getDivId: function (chapterNumber, slideNumber, relatedDocsFolderId) {
            return 'div_' + chapterNumber.toString() + '_' + slideNumber.toString() + '_' + relatedDocsFolderId.toString();
        },

        getItemInfo: function (itemId) {
            var success = false;
            var title = null;
            var fileType = null;
            var iconImageName = null;
            var itemDescription = '';
            var indexArray = [];
            macs.getRequiredAssetDetails(
                itemId,
                ['itemTypeId', 'title', 'fileType', 'iconImageName', 'itemDescription'],
                function (data) {
                    if (data) {
                        var itemTypeId = parseInt(data.itemTypeId);
                        fileType = data.fileType;
                        if (itemTypeId === 3 || fileType === 'zip') {
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
        },

        getIconImagePath: function (iconName, fileType) {
            var iconImagePath = null;
            if (iconName !== null) {
                var fullPath = window.location.pathname;
                var pathComponentsArray = fullPath.split('/');
                var removedString = pathComponentsArray[pathComponentsArray.length - 2] + '/' + pathComponentsArray[pathComponentsArray.length - 1];
                var documentPath = fullPath.replace(removedString, '');
                iconImagePath = documentPath.concat(iconName + '.png');
            }
            else {
                iconImagePath = 'images/fileTypes/' + itemTypes[fileType] + '_default_thumbnail.png';
            }

            return iconImagePath;
        },

        loadRelatedDocuments: function () {
            var dataSource = [];
            var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.parent.swiper-slide-active')[0],
                chapterNumber = $(selectedSlideEl).data('chapter-no'),
                slideNumber = $(selectedSlideEl).data('slide-no'),
                relatedDocumentFolderId = $(selectedSlideEl).data('related-docs-folder-id');

            $('#no-items-found').remove();
            $('#related-documents').children().hide();

            if (chapterNumber && slideNumber && relatedDocumentFolderId) {
                var divId = relatedDocs.getDivId(chapterNumber, slideNumber, relatedDocumentFolderId);
                if ($('div[id^=' + divId + ']').length > 0) {
                    $('#' + divId).show();
                }
                else {
                    macs.getFolderAssets(
                        relatedDocumentFolderId.toString(),
                        function (data) {
                            if (data) {
                                dataSource.divId = divId;
                                dataSource.assetsContain = false;
                                var children = [];
                                var chidrenCount = 0;
                                $.each(data.children, function (index, itemId) {
                                    var resultArray = relatedDocs.getItemInfo(itemId);
                                    children.push([]);
                                    children[chidrenCount].isNotFolder = resultArray.isNotFolder;

                                    if (resultArray.isNotFolder) {
                                        dataSource.assetsContain = true;
                                        var imagePath = relatedDocs.getIconImagePath(resultArray.iconImageName, resultArray.fileType);
                                        children[chidrenCount].itemId = itemId;
                                        children[chidrenCount].imagePath = imagePath;
                                        children[chidrenCount].title = relatedDocs.trancateTitle(resultArray.title, 20);
                                        children[chidrenCount].description = resultArray.itemDescription;
                                        chidrenCount++;
                                    }
                                });
                                dataSource.children = children;

                                var chaptersCompliedTpl = h.compile(templates.relatedDocTpl);
                                $('#related-documents').append(chaptersCompliedTpl(dataSource));
                                $.event.trigger({type: 'onRelatedDocumentsRenderComplete'});
                            }
                        },
                        function () {
                            $('#related-documents').append('<div class = "no-items-found" id = "no-items-found">No Related Documents found.</div>');
                        }
                    );
                }
            } else {
                $('#related-documents').append('<div class = "no-items-found" id = "no-items-found">No Related Documents found.</div>');
            }
        }

    };

    var mainMenu = {

        loadFirstTab: function () {
            var $tabContainer = $('.chapter-menu'),
                $tabButtons = $('.tab-buttons', $tabContainer),
                $tabContents = $('.tab-contents', $tabContainer);

            $('.tab', $tabContents).removeClass('active-tab').hide();
            $('.tab:first-child', $tabContents).addClass('active-tab').show();
            $('ul li', $tabButtons).removeClass('selected-tab');
            $('ul li a#menu-button', $tabButtons).parent().addClass('selected-tab');

        },

        loadChaptersInfo: function ($title, $description) {
            $('.chapter-info h3').html($title);
            $('.chapter-info p').html($description);
        }
    };

    $(d).on('onTemplateRenderComplete', function () {
        console.log('s');

        var mainContainer = $('div.main-container'),
            slideThumbs = $('div.slides-container'),
            chapters = $('div.chapters'),
            slides = $('div.swiper-container'),
            swiperObj = null,
            index = 0;

        // Initializing mala-tabs to the main container.
        mainContainer.malaTabs({
            animation: 'fade'
        });

        mainContainer.append(templates.innerCss);

        slideThumbs.owlCarousel({
            items: 5,
            slideSpeed: 1000,
            scrollPerPage: true,
            pagination: false,
            navigation: true,
            rewindNav: false,
            itemsDesktop: [1000, 5],
            itemsDesktopSmall: [900, 5],
            itemsTablet: [600, 5]
        });

        chapters.owlCarousel({
            items: 6,
            slideSpeed: 1000,
            scrollPerPage: true,
            pagination: false,
            itemsDesktop: [1000, 6],
            itemsDesktopSmall: [900, 6],
            itemsTablet: [600, 6]
        });

        slides.swiper({
            speed: 300,
            mode: 'horizontal',
            queueEndCallbacks: true,
            onSlideChangeEnd: function (swiper) {
                index = swiper.activeIndex;
                slideContent.loadSlideContent(swiper);
                swiperObj = swiper;
            },
            onFirstInit: function (swiper) {
                index = swiper.activeIndex;
                slideContent.loadSlideContent(swiper);
                swiperObj = swiper;
            },
            /**
             * The default 'onSlideChangeEnd' callback function of Swiper does not work when the user swipes multiple slides
             * quickly. Hence the 'onSetWrapperTransform' callback has used to handel such situation manually.,
             **/
            onSetWrapperTransform: function (swiper) {
                setTimeout(function () {
                    if (index !== swiper.activeIndex) {
                        index = swiper.activeIndex;
                        slideContent.loadSlideContent(swiper);
                        swiperObj = swiper;
                    }
                }, 2000);
            }
        });

        $('footer #main-menu-btn').click(function () {
            var selectedSlideEl = $('div.main-container div.swiper-wrapper div.swiper-slide.parent.swiper-slide-active')[0],
                slideThumb = $('footer div.slides-outer div.owl-item div.item'),
                chapterNo = $(selectedSlideEl).data('chapter-no'),
                slideNo = $(selectedSlideEl).data('slide-no'),
                selectedChapter = $('footer div.chapters div.chapter a').eq(chapterNo - 1);

            $('footer .chapters a').removeClass('selected');
            slideThumb.removeClass('slide-selected');
            selectedChapter.addClass('selected');
            mainMenu.loadChaptersInfo(selectedChapter.data('title'), selectedChapter.data('description'));
            slideThumbs.trigger('owl.goTo', (slideNo - 1));
            chapters.trigger('owl.goTo', (chapterNo - 1));
            slideThumb.eq(slideNo - 1).addClass('slide-selected');
            $('.owl-wrapper-outer', chapters).show();
            $('.swipe-overlay').show();
            move('.chapter-menu')
                .set('bottom', '0')
                .duration(400)
                .end(function () {});
            return false;
        });

        $('footer .close-btn').click(function () {
            $('.swipe-overlay').hide();
            move('.chapter-menu')
                .set('bottom', '-473px')
                .duration(400)
                .end(function () {
                    mainMenu.loadFirstTab();
                });
            return false;
        });

        $('footer .chapters a').append('<div class="arrow"></div>');
        $('footer .chapters .owl-item:first-child a').addClass('selected');
        var firstTitle = $('footer .chapters .owl-item:first-child a').attr('data-title');
        var firstDescription = $('footer .chapters .owl-item:first-child a').attr('data-description');

        mainMenu.loadChaptersInfo(firstTitle, firstDescription);

        $('footer .chapters a').each(function () {
            var chapter = $(this);
            chapter.click(function () {
                var title = chapter.data('title'),
                    description = chapter.data('description');

                $('footer .chapters a').removeClass('selected');
                chapter.addClass('selected');
                var dataId = parseInt($(this).attr('data-first-slide'));
                mainMenu.loadChaptersInfo(title, description);
                slideThumbs.trigger('owl.goTo', dataId - 1);
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
            mainMenu.loadChaptersInfo(selectedChapter.data('title'), selectedChapter.data('description'));
            chapters.trigger('owl.goTo', (chapterNo - 1));
            swiperObj.swipeTo(slideNumber - 1, 1);
            slideThumb.removeClass('slide-selected');
            slide.addClass('slide-selected');
            return false;
        });

        $('footer #slide-notes-button').click(function () {
            slideNotes.loadSlideNotes();
        });

        $('footer #related-doc-button').click(function () {
            relatedDocs.loadRelatedDocuments();
        });

        d.addEventListener('touchmove', function (e) {
            var container = $('.chapter-menu');
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $('.owl-wrapper-outer', chapters).hide();
                $('.swipe-overlay').hide();
                move('.chapter-menu')
                    .set('bottom', '-473px')
                    .duration(400)
                    .end(function () {
                        mainMenu.loadFirstTab();
                    });
            }
        });

        d.ontouchmove = function (e) {
            e.preventDefault();
        };
    });

    $(d).on('onRelatedDocumentsRenderComplete', function () {
        $('.related-doc-item').click(function () {
            var itemId = $(this).attr('data_item_id');
            relatedDocs.openItem(itemId);
        });

        relatedDocs.scrollEnable('related-documents');
    });

})(jQuery, window, document, Handlebars);