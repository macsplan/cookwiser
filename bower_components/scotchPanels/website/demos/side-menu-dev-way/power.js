$(function() {

    var scotchPanel = $('#scotch-panel').scotchPanel({
        containerSelector: 'body',
        direction: 'right',
        duration: 300,
        transition: 'ease',
        distanceX: '70%',
        enableEscapeKey: true
        $('.toggle-panel i').removeClass('fa-bars').addClass('fa-times');
    });

    $('.toggle-panel').click(function() {
        scotchPanel.toggle();
        return false;
    });

});
