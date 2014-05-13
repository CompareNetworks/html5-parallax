/**
 * Created by premuditha on 4/15/14.
 */

(function ($, w, d, h) {

    var settings = {
        mediaPrefix: 'data/presentation-content/'
    };

    function handleData(resJSON) {
        // HandelBar template for Chapter thumbnails.
        var chapterThumbnailTemplate = '{{#each chapters}} ' +
            '<div class="item chapter"> ' +
                '<a href="#chapter{{chapter_no}}" data-first-slide="{{first_slide}}" data-title="{{chapter_title}}" ' +
                        'data-description="{{chapter_description}}">' +
                    '<span class="outer"><img src="' + settings.mediaPrefix + '{{chapter_thumbnail}}">' +
                    '<span class="title">{{chapter_title}}</span></span>' +
                '</a>' +
            '</div>' +
            '{{/each}}';

        // HandelBar template for Slide thumbnails.
        var slidesThumbnailTemplate = '{{#each chapters}} {{#each slides}}' +
            '<div class="item" data-slide-id="{{slide_no}}" data-chapter-no="{{../chapter_no}}">' +
                '<img src="' + settings.mediaPrefix + '{{slide_thumb}}">' +
            '</div>' +
            '{{/each}} {{/each}}';

        // HandelBar template for Slide.
        var slidesTemplate = '{{#each chapters}} {{#each slides}}' +
            '<div class="swiper-slide parent slide-no-{{slide_no}}" style="height: ' + (w.innerHeight - 63) + 'px" ' +
                    'data-content="' + settings.mediaPrefix + '{{slide_content}}" ' +
                    'data-slide-notes="' + settings.mediaPrefix + '{{slide_notes}}" data-slide-no="{{slide_no}}" ' +
                    'data-chapter-no="{{../chapter_no}}" data-vertical-scrollable="{{vertical_scrollable}}"' +
                    'data-related-docs-folder-id = "{{related_docs_folder}}">' +
                '<p class="loading-text">Loading...</p>' +
            '</div>' +
            '{{/each}} {{/each}}';

        var chaptersCompliedTpl = h.compile(chapterThumbnailTemplate);
        $('div.chapters').html(chaptersCompliedTpl(resJSON));

        var slidesThumbCompliedTpl = h.compile(slidesThumbnailTemplate);
        $('div.slides-container').html(slidesThumbCompliedTpl(resJSON));

        var slidesCompliedTpl = h.compile(slidesTemplate);
        $('div.main-slides-container').html(slidesCompliedTpl(resJSON));

        $.event.trigger({type: 'onTemplateRenderComplete'});
    }

    function render() {
        $.getJSON('data/presentations.json', function (data) {
            handleData(data);
        });
    }

    $(d).ready(function () {
        render();
    });

})(jQuery, window, document, Handlebars);
