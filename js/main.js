var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function loadContent(target, page, callback){
    $("#" + target).load(page+".html",callback);
}
function changeMainContent(page,callback){
    loadContent('includedContent',page,callback);
}
function navigateTo(page){
    $('[id^="puremenuitem-"]').removeClass('menu-item-divided pure-menu-selected');
    $('[id^="puremenuitem-' + page + '"]').addClass('menu-item-divided pure-menu-selected');
    changeMainContent(page,function(){
      var menuLink = document.getElementById('menuLink');
      disableResponsiveMenu();
      initJQueryTabs();
    });
    
    //update query str 
    window.location.hash = page;
}
 $(function(){
    loadContent('navigationContent','menu',function(){
    	
    	var requested=getUrlParameter('start');
    	var hash = window.location.hash;
    	
    	if(hash){
    		navigateTo(hash.replace("#",""));
    		return;
    	}
    	if(requested){
    		navigateTo(requested);
    		return;
    	} else {
        	navigateTo('main');
        	return;
    	}
    });
 });

function initJQueryTabs(){
   $(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
}