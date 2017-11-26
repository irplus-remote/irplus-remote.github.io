function sendEmail(){
    var s1 = "binarymode.";
    var s2 = "android";
    var s3 = "gmail.com";
    location.href = "mailto:"+s1+s2+"@"+s3;
}
function doCommonGSearches(){
    var autogvalue = document.getElementById('autogoogle').value;
    var gurl = 'https://www.google.com?#q=';
     window.open(gurl + autogvalue + '+discrete ir codes', '_blank');
     window.open(gurl + autogvalue + '+rmdu', '_blank');
     window.open(gurl + autogvalue + '+remotecentral', '_blank');
     window.open(gurl + autogvalue + '+lirc', '_blank');
     window.open(gurl + autogvalue + '+ict', '_blank');
     window.open(gurl + autogvalue + '+pronto hex', '_blank');
}

function reloadIframe() {
    $('#osmIframe')[0].src = $('#osmIframe')[0].src;
}

function changeContentDiv(anchor) {
    var index = $(".topnavanchor").index(anchor);
    $(".contentDiv").hide();
    $(".contentDiv").eq(index).show();
    $(".topnavanchor").removeClass("topnavActive");
    $(anchor).addClass("topnavActive");
    closeMenu();
}
/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleMenu() {
    if ($(".topnav").hasClass("responsive")) {
        closeMenu();
    } else {
        openMenu();
    }
}

function closeMenu() {
    $(".topnav").removeClass("responsive");
    $(".topnavspacer").show();
}

function openMenu() {
    $(".topnav").addClass("responsive");
    $(".topnavspacer").hide();
}

$(window).resize(function() {
    closeMenu();
});

$(document).ready(function() {
    var hash = window.location.hash;
    console.log(hash);
    var pagetoshow = 0;
    if(hash !== undefined){
        if(hash === "#codes"){
            pagetoshow = 1;
        }
        if(hash === "#layouting"){
            pagetoshow = 2;
        }
        if(hash === "#infrared"){
            pagetoshow = 3;
        }
        if(hash === "#audio"){
            pagetoshow = 4;
        }
        if(hash === "#network"){
            pagetoshow = 5;
        }
        if(hash === "#trouble"){
            pagetoshow = 6;
        }
        if(hash === "#beta"){
            pagetoshow = 7;
        }
        if(hash === "#contact"){
            pagetoshow = 8;
        }
    }
    

    $(".contentDiv").hide();
    //show first ct
    $(".contentDiv").eq(pagetoshow).show();
    $(".topnavanchor").eq(pagetoshow).addClass("topnavActive");
    $(".topnavanchor").click(function(){
        changeContentDiv(this);
    });
   
});