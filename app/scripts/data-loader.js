/**
 * Created by premuditha on 4/15/14.
 */

var LOAD_DATA = {

    handlerData: function (resJSON) {

        // HandelBar templates for Chapters and Slides.
        var chapterThumbnailTemplate = '{{#each chapters}}<li class="chapter"><a href="#chapter{{chapter_no}}" data-first-slide="{{first_slide}}"><img src="{{chapter_thumbnail}}"></a></li>{{/each}}';

        var chaptersCompliedTpl = Handlebars.compile(chapterThumbnailTemplate),
            chaptersHTML = chaptersCompliedTpl(resJSON);

        $('.chapters').html(chaptersHTML);

    },

    render: function () {
        $.ajax({
            url: 'http://localhost/interactive-content-navigator/app/data/presentations.json',
            method: 'get',
            success: this.handlerData
        });
    }
};

$(document).ready(function () {
    LOAD_DATA.render();
});