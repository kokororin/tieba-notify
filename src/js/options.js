jQuery(document).ready(function($) {

    var bg = chrome.extension.getBackgroundPage();
    $("#menu_title").text(chrome.i18n.getMessage("appName"));
    $("#version").html(bg.manifest.version);
    $("#desc").html(chrome.i18n.getMessage("description"));
    
    $('div[option="' + bg.getOption('time') + '"].time').addClass('on');

    $('.time').click(function() {
        if ($(this).hasClass('on')) {
            return false;
        }
        $('.time').removeClass('on');
        $(this).addClass('on');
        bg.setOption('time', $(this).attr('option'))
    });

});
