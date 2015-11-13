
/*$(function(){
  //$("#nav>li ul").hide();
  $('#nav>li').click(function() {
    $(this).children('ul').slideToggle(200); //Hides if shown, shows if hidden
  }).mouseover(function(){ $(this).addClass("a_hand") }); //Hand!
});*/



$(function(){
  //$("#nav>li ul").hide();
  $('#nav ul li ul li').click(function() {
	$(this).children().toggle(400);
  });
  
  $('#nav ul li div#dropdownLabel').click(function() {
	$(this).siblings().toggle();
  });
  
});