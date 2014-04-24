(function (w, d) {

	var ITEM_TYPE_NAMES = 
	{
	    'PDF'		: 'pdf',
	    'LINK'		: 'weblink',
	    'VIDEO'		: 'video',
	    'AUDIO'		: 'audio',
	    'IMAGE'		: 'image',
	    'CSV'		: 'csv',
	    'EXCEL'		: 'excel',
	    'PPT'		: 'ppt',
	    'TEXT'		: 'text',
	    'WORD'		: 'word',
	    'ZIP'		: 'app',
	    'BUY'		: 'buy',
	    'EXTERNAL'	: 'external',
	    'KEYNOTE' 	:'keynote',
	    'EPUB'		:'epub',
	    'IBOOKS'	:'ibooks'
	};

    var api = {
        initItemTypes: function () {
            var itemsTypes = [];
            itemsTypes.pdf = ITEM_TYPE_NAMES.PDF;
            itemsTypes.link = ITEM_TYPE_NAMES.LINK;
            itemsTypes.mp4 = ITEM_TYPE_NAMES.VIDEO;
            itemsTypes.mpv = ITEM_TYPE_NAMES.VIDEO;
            itemsTypes['3gp'] = ITEM_TYPE_NAMES.VIDEO;
            itemsTypes.mov = ITEM_TYPE_NAMES.VIDEO;
            itemsTypes.m4v = ITEM_TYPE_NAMES.VIDEO;
            itemsTypes.aac = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.aif = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.aiff = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.aifc = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.caf = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.mp3 = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.m4a = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.m4r = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.au = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.wav = ITEM_TYPE_NAMES.AUDIO;
            itemsTypes.yuv = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.thm = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.psdimage = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.psd = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.bmp = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.gif = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.tif = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.png = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.jpg = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.jpeg = ITEM_TYPE_NAMES.IMAGE;
            itemsTypes.csv = ITEM_TYPE_NAMES.CSV;
            itemsTypes.xlw = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xltx = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xltm = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlt = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlsx = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlsm = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlsb = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xls = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlm = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xll = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlc = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlb = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xlam = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xla = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xl = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.xar = ITEM_TYPE_NAMES.EXCEL;
            itemsTypes.pptx = ITEM_TYPE_NAMES.PPT;
            itemsTypes.ppt = ITEM_TYPE_NAMES.PPT;
            itemsTypes.txt = ITEM_TYPE_NAMES.TEXT;
            itemsTypes.dotx = ITEM_TYPE_NAMES.WORD;
            itemsTypes.dotm = ITEM_TYPE_NAMES.WORD;
            itemsTypes.dot = ITEM_TYPE_NAMES.WORD;
            itemsTypes.docm = ITEM_TYPE_NAMES.WORD;
            itemsTypes.cnv = ITEM_TYPE_NAMES.WORD;
            itemsTypes.asd = ITEM_TYPE_NAMES.WORD;
            itemsTypes.wll = ITEM_TYPE_NAMES.WORD;
            itemsTypes.wbk = ITEM_TYPE_NAMES.WORD;
            itemsTypes.docx = ITEM_TYPE_NAMES.WORD;
            itemsTypes.doc = ITEM_TYPE_NAMES.WORD;
            itemsTypes.zip = ITEM_TYPE_NAMES.ZIP;
            itemsTypes.buy = ITEM_TYPE_NAMES.BUY;
            itemsTypes.external = ITEM_TYPE_NAMES.EXTERNAL;
            itemsTypes.key = ITEM_TYPE_NAMES.KEYNOTE;
            itemsTypes.epub = ITEM_TYPE_NAMES.EPUB;
            itemsTypes.ibooks = ITEM_TYPE_NAMES.IBOOKS;

            return itemsTypes;
        }
    };

    w.fileTypes = api;

})(window, document);