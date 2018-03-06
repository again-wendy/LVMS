$(document).ready(function() {
    // Code for the hero images slider on homepage
    $(".slide-container").unslider({
        arrows: {
            prev: "<a class='prev'>&#10094;</a>",
            next: "<a class='next'>&#10095;</a>"
        },
        autoplay: true,
        delay: 5000
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

    // Set height for different elements
    heightElements();
    $(window).resize(function() {
        heightElements();
    });

    // Set reason to first one
    selectReason(undefined, 1);

    // Hide all text from solution banners
    $("#solutions .solution-banner .solution-text").hide();

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
        scrollTop: $("#solutions ." + $event).offset().top - 120
    }, 1000);
    showSolution($event);
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
}, 5000);

// Set height of different elements
function heightElements() {
    // Set height circles in #reasons
    var circle = $("#reasons .circle");
    var circleWidth = circle.width();
    circle.css("height", circleWidth + "px");

    // Set height circles in .icon-block
    var circleBlock = $("#reasons .icon-block");
    var circleBlockWidth = circleBlock.width();
    circleBlock.css("height", circleBlockWidth + "px");

    // Set all reasons same height
    var peopleHeight = $("#reasons .block-reasons .people").height();
    $("#reasons .block-reasons .profit").css("height", peopleHeight + "px");
    $("#reasons .block-reasons .planet").css("height", peopleHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");

    // If screen is bigger than 668px set top of read more btns in solution banners
    if($(window).width() > 668) {
        var btnCssTop1 = $(".solution-banner img").height() - $(".solution-banner button").height() - 35;
        $(".solution-banner button").css("top", btnCssTop1 + "px");
    }
}

// Select the right reason. When a reason is clicked, stop the interval
function selectReason($event, reason) {
    $("#reasons .block-reasons .block-reason").hide();
    $("#reasons .all-reasons .column .circle").removeClass("active");
    $("#reasons .all-reasons .column .block-title").removeClass("active");
    if($event !== undefined) {
        clearInterval(reasonInterval);
        $("#reasons .block-reasons ." + $event).show();
        $("#reasons .all-reasons ." + $event + " .circle").addClass("active");
        $("#reasons .all-reasons ." + $event + " .block-title").addClass("active");
    } else if (reason !== undefined) {
        if (reason === 1) {
            $("#reasons .block-reasons .profit").show();
            $("#reasons .all-reasons .profit .circle").addClass("active");
            $("#reasons .all-reasons .profit .block-title").addClass("active");
        } else if (reason === 2) {
            $("#reasons .block-reasons .planet").show();
            $("#reasons .all-reasons .planet .circle").addClass("active");
            $("#reasons .all-reasons .planet .block-title").addClass("active");
        } else if (reason === 3) {
            $("#reasons .block-reasons .people").show();
            $("#reasons .all-reasons .people .circle").addClass("active");
            $("#reasons .all-reasons .people .block-title").addClass("active");
        }
    } else {
        $("#reasons .block-reasons .profit").show();
        $("#reasons .all-reasons .profit .circle").addClass("active");
        $("#reasons .all-reasons .profit .block-title").addClass("active");
    }
}

// Toggle text from solution banner
function showSolution($event) {
    var text = $("#solutions ." + $event + " .solution-text");
    var btn = $("#solutions ." + $event + " button");
    if( text.css("display") === "none" ) {
        text.slideDown();
        btn.html("Close <span class='fa fa-caret-up'></span>");
    } else {
        text.slideUp();
        btn.html("Read more <span class='fa fa-caret-down'></span>");
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

// Watch for click outside modal and close modal when its opened
$(document).mouseup(function(e) {
    var modal = $("#contact-modal .modal-content");

    if($("#contact-modal").css("display") !== "none") {
        // If the target of the click is not the container nor a descendent of the container, hide it
        if(!modal.is(e.target) && modal.has(e.target).length === 0) {
            $("#contact-modal").fadeOut();
        }
    }
});
$(document).mouseup(function(e) {
    var modal = $("#success-modal .modal-content");

    if($("#success-modal").css("display") !== "none") {
        // If the target of the click is not the container nor a descendent of the container, hide it
        if(!modal.is(e.target) && modal.has(e.target).length === 0) {
            closeSuccessModal();
        }
    }
});

// Watch for key press (escape) and close modal when its opened
$(document).keydown(function(e) {
    if(e.which == 27 && $("#contact-modal").css("display") != "none") {
        event.preventDefault();
        $("#contact-modal").fadeOut();
    }
});
$(document).keydown(function(e) {
    if(e.which == 27 && $("#success-modal").css("display") != "none") {
        event.preventDefault();
        closeSuccessModal();
    }
});

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