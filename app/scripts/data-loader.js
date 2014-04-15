/**
 * Created by premuditha on 4/15/14.
 */

var LOAD_DATA = {

    handlerData: function (resJSON) {

        // HandelBar template for Chapter thumbnails.
        var chapterThumbnailTemplate = '{{#each chapters}} ' +
                '<li class="chapter"> ' +
                    '<a href="#chapter{{chapter_no}}" data-first-slide="{{first_slide}}">' +
                        '<img src="{{chapter_thumbnail}}">' +
                '   </a>' +
                '</li>' +
            '{{/each}}';

        // HandelBar template for Slide thumbnails.
        var slidesThumbnailTemplate = '{{#each chapters}} {{#each slides}}' +
                '<div class="item" data-slide-id="{{slide_no}}">' +
                    '<img src="{{slide_path}}">' +
                '</div>' +
            '{{/each}} {{/each}}';

        // HandelBar template for Slide.
        var slidesTemplate = '{{#each chapters}} {{#each slides}}' +
                '<div class="item">' +
                    '<img src="{{slide_path}}">' +
                '</div>' +
            '{{/each}} {{/each}}';

        var chaptersCompliedTpl = Handlebars.compile(chapterThumbnailTemplate);
        $('.chapters').html(chaptersCompliedTpl(resJSON));

        var slidesThumbCompliedTpl = Handlebars.compile(slidesThumbnailTemplate);
        $('.slides-container').html(slidesThumbCompliedTpl(resJSON));

        var slidesCompliedTpl = Handlebars.compile(slidesTemplate);
        $('.main-slides-container').html(slidesCompliedTpl(resJSON))

        $.event.trigger({type: 'onTemplateRenderComplete'});

    },

    render: function () {
        $.ajax({
            url: 'data/presentations.json',
            method: 'get',
            success: this.handlerData
        });
    }
};

$(document).ready(function () {
    LOAD_DATA.render();
});