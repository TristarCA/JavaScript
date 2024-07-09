"use strict";
// from tutorialspoint.com

// Version 1 - No Call Back
// Alert displays early
$(document).ready( () => {

   $("#right").click(function(){
      $("div").animate({left: '450px'}, 1000, function(){
            alert("I have reached to the right");
         }
      );
   });

   $("#left").click(function(){
      $("div").animate({left: '0px'}, 1000, 
         function(){
            alert("I have reached to the left");
         }
      );
   });

   $("#up").click(function(){
      $("div").animate({top: '0px'}, 1000, 
         function(){
            alert("I have reached to the up");
         }
      );
   });

   $("#down").click(function(){
      $("div").animate({top: '450px'}, 1000, function(){
            alert("I have reached to the down");
         }
      );
   });

});


