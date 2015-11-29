$(document).ready(function() {
    var bg = chrome.extension.getBackgroundPage();
    var tieba = bg.tieba;
    var numbers = tieba.numbers;
    var links = tieba.links;

    var items = ['fans', 'replyme', 'feature', 'atme', 'recycle'];
    for (var i = 0; i < items.length; i++) {
        setNumber(items[i], numbers[i]);
        setLink(items[i], links[i]);
    }


    function setNumber(id, number) {
        var button = $('#' + id);
        var text = button.html();
        button.html(text.replace('{$}', number));
    }

    function setLink(id, url) {
        $(document).on('click', '#' + id, function() {
            chrome.tabs.create({
                "url": url
            });
        });
    }
});
