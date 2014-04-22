(function(w, d) {
    var api = {
        initApi : function(success, failure) {
            dispatch("initApi", {}, success, failure);
        },
     
        printAsset : function(id, success, failure) {
            dispatch("printAsset", {assetId : id}, success, failure);
        },
        emailAsset : function(id, success, failure) {
            dispatch("emailAsset", {assetId : id}, success, failure);
        },
        viewAsset : function(id, success, failure) {
            dispatch("viewAsset", {assetId : id}, success, failure);
        },
        getAsset : function(id,success,failure) {
            dispatch("getAssetDetails", {assetId : id}, success, failure);
        },
        getRequiredAssetDetails: function(id,details,success,failure) {
            dispatch("getRequiredAssetDetails", {assetId : id, assetDetails : details}, success, failure);
        },
        getFolderAssets : function(id,success,failure) {
            dispatch("getFolderAssets", {assetId : id}, success, failure);
        },
        getAssetPath : function(id,success,failure) {
            dispatch("getAssetPath", {assetId : id}, success, failure);
        },
        trackSection : function(sectionName, success, failure) {
            var args = {"eVar17":sectionName, "events":"event14"};
            trackEvent(args, success, failure);
        },
        emailMessage : function(emailJSON, success, failure)
        {
            dispatch("emailMesssage", emailJSON, success, failure);
        },
        getLocation : function(success, failure)
        {
            dispatch("getLocation", {}, success, failure);
        },
        getStatesForLocationData : function(locationObj, success, failure)
        {
            dispatch("getStatesForLocationData", locationObj, success, failure);
        },
        readFileAtPath : function(assetFilePath, success, failure)
        {
            dispatch("readFileAtPath", assetFilePath, success, failure);
        },
        convertHTMLToPDF : function(htmlString, success, failure)
        {
            dispatch("convertHTMLToPDF", htmlString, success, failure);
        },
        getPathForConvertedPDFFileFromHTML : function(htmlString, success, failure)
        {
            dispatch("getPathForConvertedPDFFileFromHTML", htmlString, success, failure);
        },
        getOfflineLinksForAssets : function(assetslist, success, failure)
        {
            dispatch("getOfflineLinksForAssets", {assets : assetslist}, success, failure);
        },
        saveFile : function(fileObject, success, failure)
        {
            dispatch("saveFile", fileObject, success, failure);
        },
        emailWithMultipleAssets : function(emailObject, success, failure)
        {
            dispatch("emailWithMultipleAssets", emailObject, success, failure);
        },
        getCommand : function(key) {
            var cmd = _commands[key];
            return JSON.stringify(cmd);
        },
        
        callback : function(key, success, result) {
            var cmd = _commands[key];
            if(success) {
                cmd.success(result);
            }
            else {
                cmd.failure(result);
            }
            delete _commands[key];
        }
    };
 
    var _commands = {};
    var _commandId = 0;
 
    function trackEvent(args, success, failures) {
        dispatch("trackEvent", args, success, failures);
    }

    function dispatch(command, args, successCallback, faliureCallback) {
        var key = "n" + (++ _commandId);
        var commandObject = {cmd : command, args : args, success : successCallback, failure : faliureCallback};
        _commands[key] = commandObject;
        notify(key);
    }
 
    function notify(key) {
        var iframe = d.createElement("IFRAME");
        iframe.setAttribute("src", "macs://" + key);
        d.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
    }

    var state = {
        getKeyPath : function (path) {
            var pathComponentsArray = path.split("/");
            return pathComponentsArray[pathComponentsArray.length - 2];
        },

        createCookie : function (key, value) {
            var date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
            document.cookie = key + "=" + value + expires + "; path=/";
        },

        readCookie : function (key) {
            var nameEQ = key + "=";
            var ca = document.cookie.split(";");

            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }

            return "";
        },

        eraseCookie : function (key) {
            state.createCookie(key, "");
        }
    };

    w.macs = api;
    w.macs.cookieManager = state;
 
})(window, document);