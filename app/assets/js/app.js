$(document).ready(function() {
  console.log ('ready!');
//   $(window).scroll(function(event){
//   .removeClass(show)
//   }

// $(window).scroll(function() {    
//     var scroll = $(window).scrollTop();

//     if (scroll >= 500) {
//         $(".clearHeader").addClass("darkHeader");
//     } else {
//         $(".clearHeader").removeClass("darkHeader");
//     }
// });


// $(window).scroll(function() {    
//     var scroll = $(window).scrollTop();

//     if (scroll >= 10) {
//         $(".show").addClass("hide");
//     } else {
//         $(".show").removeClass("hide");
//     }
// });


// grab an element
var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
// initialise

 
headroom.init(); 


});

