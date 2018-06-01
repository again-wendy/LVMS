$(document).ready(function() {
    // Code for the hero images slider on homepage
    $(".slide-container").unslider({
        arrows: {
            prev: "<a class='prev'>&#10094;</a>",
            next: "<a class='next'>&#10095;</a>"
        },
        autoplay: true,
        speed: 1200,
        delay: 8000
    });

    // Don't show mobile menu on page load
    if($(window).width() < 769) {
        $("#nav-bar .right-menu .menu-items").hide();
    }

    // Make navbar sticky when its top of screen
    $(window).bind("scroll", function() {
        var aboveNav = $("#hero-slider").height();
        var contentHeight = $("#nav-bar").height() + 96;
        if($(window).scrollTop() > aboveNav) {
            $("#nav-bar").addClass("sticky");
            $("#reasons").css("margin-top", contentHeight + "px");
        } else {
            $("#nav-bar").removeClass("sticky");
            $("#reasons").css("margin-top", "96px");
        }
    });

    if( $("#nav-bar").hasClass("sticky") ) {
        var contentHeight = $("#nav-bar").height() + 96;
        $("#reasons").css("margin-top", contentHeight + "px");
    }

    // Set height for different elements and show/hide mobile menu
    heightElements();
    heightIconBlock('why');
    $(window).resize(function() {
        heightElements();
        if($(window).width() < 769) {
            $("#nav-bar .right-menu .menu-items").hide();
        } else {
            $("#nav-bar .right-menu .menu-items").show();
        }
    });

    // Set reason to first one
    selectReason(undefined, 1);

    // Check URL for /send. Contact was sent succesfully so show the message
    if(window.location.href.indexOf("form=send") > -1) {
        $("#success-modal").fadeIn();
    }
});

// Scroll to menu item
function menuClick(name) {
    $("html, body").animate({
        scrollTop: $(name).offset().top - 120
    }, 1000);
    if($(window).width() < 769) {
        toggleMobileMenu();
    }
}

// Scroll to element in screen
function buttonClick(name) {
    $("html, body").animate({
        scrollTop: $(name).offset().top -120
    }, 1000);
}

// Scroll to right reason
function scrollToReason($event) {
    $("html, body").animate({
        scrollTop: $("#reasons").offset().top - 120
    }, 1000);
    selectReason($event);
}

// Scroll to right solution
function scrollToSolution($event) {
    $("html, body").animate({
        scrollTop: $("#solutions").offset().top - 120
    }, 1000);
}

// When page is loaded set interval to change the reasons
var reasonIndex = 2;
var reasonInterval = setInterval(function() {
    if (reasonIndex < 4) {
        selectReason(undefined, reasonIndex);
        reasonIndex += 1;
    } else {
        selectReason(undefined, 1);
        reasonIndex = 1;
    }
}, 8000);

// Set height icon-block 
function heightIconBlock(className) {
    var circleBlock = $("#reasons .block-reasons ." + className + " .icon-block");
    var circleBlockWidth = circleBlock.width();
    circleBlock.css("height", circleBlockWidth + "px");
}

// Set height of different elements
function heightElements() {
    // Set height circles in #reasons
    var circle = $("#reasons .circle");
    var circleWidth = circle.width();
    circle.css("height", circleWidth + "px");

    // Set height circles in .icon-block
    heightIconBlock('active');

    // Set all reasons same height
    var howHeight = $("#reasons .block-reasons .how").height();
    $("#reasons .block-reasons .why").css("height", howHeight + "px");
    $("#reasons .block-reasons .what").css("height", howHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");
}

// For the selectReason function
function setReasons(className) {
    $("#reasons .block-reasons ." + className).show();
    $("#reasons .block-reasons ." + className).addClass("active");
    $("#reasons .all-reasons ." + className + " .circle").addClass("active");
    $("#reasons .all-reasons ." + className + " .block-title").addClass("active");
    heightIconBlock(className);
}

// Select the right reason. When a reason is clicked, stop the interval
function selectReason($event, reason) {
    $("#reasons .block-reasons .block-reason").hide();
    $("#reasons .block-reasons .block-reason").removeClass("active");
    $("#reasons .all-reasons .column .circle").removeClass("active");
    $("#reasons .all-reasons .column .block-title").removeClass("active");
    if($event !== undefined) {
        clearInterval(reasonInterval);
        setReasons($event);
    } else if (reason !== undefined) {
        if (reason === 1) {
            setReasons('why');
        } else if (reason === 2) {
            setReasons('what');
        } else if (reason === 3) {
            setReasons('how');
        }
    } else {
        setReasons('why');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    var menu = $("#nav-bar .right-menu .menu-items");
    var icon = $("#nav-bar .right-menu .mobile-toggle .nav-icon");
    if( menu.css("display") === "none" ) {
        // open menu and change icon to cross
        menu.slideDown();
        icon.addClass("open");
    } else {
        // close menu and change icon to bars
        menu.slideUp();
        icon.removeClass("open");
    }
}

function recaptchaCallback() {
    $("#contact-submit").removeAttr("disabled");
}

function showModal(modalName) {
    $("#" + modalName + "-modal").fadeIn();
}

function closeModal(modalName) {
    $("#" + modalName + "-modal").fadeOut();
}

function closeSuccessModal() {
    $("#success-modal").fadeOut();
    setTimeout(function() {
        window.location.replace("/");
    }, 400);
}

function sendForm(event) {
    event.preventDefault();
    var data = {};
    data.name = $("#contact-form #name").val();
    data.email = $("#contact-form #email").val();
    data.subject = $("#contact-form #subject").val();
    data.msg = $("#contact-form #msg").val();

    if (grecaptcha.getResponse() != "") {
        $.ajax({
            type: "POST",
            url: "/send",
            data: data,
            dataType: "application/json"
        });
    }
}

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

(function() {
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function() {
        var result = originalAddClassMethod.apply( this, arguments );
        jQuery(this).trigger('cssClassChanged');
        return result;
    }
})();