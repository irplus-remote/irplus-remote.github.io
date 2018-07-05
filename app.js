//console.log("app.js loaded");
function switchPage(page) {
    //console.log("switch page");
    $(".contentDiv").empty();
    $(".contentDiv").append("<div data-include='" + page + "'></div>");
    processIncludes();
}

function processIncludes() {
    //console.log("processIncludes");
    $("[data-include]").each(function () {
        var that = $(this);
        that.load(that.attr('data-include'), function () {
            that.contents().unwrap();
        });
    });
}

function doCommonGSearches(el){
    var autogvalue = el.val();
    var gurl = 'https://www.google.com?#q=';
     window.open(gurl + autogvalue + '+discrete ir codes', '_blank');
     window.open(gurl + autogvalue + '+rmdu', '_blank');
     window.open(gurl + autogvalue + '+remotecentral', '_blank');
     window.open(gurl + autogvalue + '+lirc', '_blank');
     window.open(gurl + autogvalue + '+ict', '_blank');
     window.open(gurl + autogvalue + '+pronto hex', '_blank');
}

function pageLoaded(){
    //console.log("pageLoaded");
    var hash = window.location.hash;
    if (hash !== undefined && hash !== "") {
        switchPage(hash.replace("#", "") + ".html");
    } else {
        processIncludes();
    }
}

$(window).on('hashchange', function(e) {
    //collapse the responsive navbar after clicking a link
    $('.navbar-collapse').collapse('hide');
    //load content
    pageLoaded();
});
 
$(function () {
    pageLoaded();
});
