(function ($) {
    //noinspection JSHint
    var defaults = {
        animation: 'fade', //fade or none
        fistTabId: '',  // ID of the first tab. Example: '#tab1'. Default ''
        buttonContainer: '.tab-buttons ul', // CSS Class of tab button Container
        tabContainer: '.tab-contents', // CSS Class of Tab contents Container
        selectedClass: 'selected-tab' // CSS class for selected tab button
    };

    var tabs = {
        init: function (opts, $thisContainer) {
            var $buttonContainer = $(opts.buttonContainer, $thisContainer);
            var $tabContainer = $(opts.tabContainer, $thisContainer);

            tabs.createContent(opts, $buttonContainer, $tabContainer);

            $('li a', $buttonContainer).each(function () {
                $(this).click(function () {
                    var that = $(this);
                    $('li', $buttonContainer).removeClass(opts.selectedClass);
                    that.parent().addClass(opts.selectedClass);
                    tabs.loadContent(opts, that, $buttonContainer, $tabContainer);
                    return false;
                });
            });
        },
        createContent: function (opts, $buttonContainer, $tabContainer) {
            $('> div', $tabContainer).addClass('tab').hide();
            if (opts.fistTabId === '') {
                $('.tab:first-child', $tabContainer).addClass('active-tab').show();
                $('li:first-child', $buttonContainer).addClass(opts.selectedClass);
            }
            else {
                $(opts.fistTabId, $tabContainer).addClass('active-tab').show();
                $('li', $tabContainer).each(function () {
                    if ($(this).attr('href') === opts.fistTabId) {
                        $(this).addClass(opts.selectedClass);
                    }
                });
            }


        },
        loadContent: function (opts, $this, $buttonContainer, $tabContainer) {
            var idToLoad = $this.attr('href');
            $($tabContainer).each(function () {
                if (opts.animation === 'fade') {
                    $(this).find('.tab:visible').removeClass('active-tab').fadeOut('fast', function () {
                        $(this).parent().find(idToLoad).addClass('active-tab').fadeIn();
                    });
                }
                else {
                    $(this).find('.tab:visible').removeClass('active-tab').hide();
                    $(this).parent().find(idToLoad).addClass('active-tab').show();
                }
            });
        }

    };

    $.fn.malaTabs = function (options) {
        var opts = $.extend(defaults, options);
        var thisContainer = $(this);
        tabs.init(opts, thisContainer);
    };
})(jQuery);