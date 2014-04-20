/**
 * Created by premuditha on 4/15/14.
 */

var LOAD_DATA = {

    handlerData: function (resJSON) {

        // HandelBar template for Chapter thumbnails.
        var chapterThumbnailTemplate = '{{#each chapters}} ' +
                '<li class="chapter"> ' +
                    '<a href="#chapter{{chapter_no}}" data-first-slide="{{first_slide}}" data-title="{{chapter_title}}" data-description="{{chapter_description}}">' +
                        '<img src="{{chapter_thumbnail}}">' +
						'<span class="title"><strong>{{chapter_title}}</strong>Line 2</span>'+
                '   </a>' +
                '</li>' +
            '{{/each}}';

        // HandelBar template for Slide thumbnails.
        var slidesThumbnailTemplate = '{{#each chapters}} {{#each slides}}' +
                '<div class="item" data-slide-id="{{slide_no}}">' +
                    '<img src="{{slide_thumb}}">' +
                '</div>' +
            '{{/each}} {{/each}}';

        // HandelBar template for Slide.
        var slidesTemplate = '{{#each chapters}} {{#each slides}}' +
            '<div class="item slide-no-{{slide_no}}" style="height: 500px" data-content="{{slide_content}}" data-vertical-scrollable="{{vertical_scrollable}}"></div>' +
            '{{/each}} {{/each}}';

        var chaptersCompliedTpl = Handlebars.compile(chapterThumbnailTemplate);
        $('.chapters').html(chaptersCompliedTpl(resJSON));

        var slidesThumbCompliedTpl = Handlebars.compile(slidesThumbnailTemplate);
        $('.slides-container').html(slidesThumbCompliedTpl(resJSON));

        var slidesCompliedTpl = Handlebars.compile(slidesTemplate);
        $('.main-slides-container').html(slidesCompliedTpl(resJSON));

        $.event.trigger({type: 'onTemplateRenderComplete'});

    },

    render: function () {
        var that = this;
        $.getJSON('data/presentations.json', function(data) {
            that.handlerData(data);
        });
    }
};

$(document).ready(function () {
    LOAD_DATA.render();
});