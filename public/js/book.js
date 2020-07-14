function burger(){
    var burger = document.getElementById('burger');
    var links = document.getElementById('links');
    var quit = document.getElementById('quit');
    burger.style.padding = '12px 12px 150vw 150vw';
    links.style.display = 'flex';
    quit.style.display = 'inline';
  }
  
  function quit(){
    var burger = document.getElementById('burger');
    var links = document.getElementById('links');
    var quit = document.getElementById('quit');
    burger.style.padding = '4px 4px';
    links.style.display = 'none';
    quit.style.display = 'none';
  }


  $('.viewButton').click(function () {
    $(this).parent().find('.toggleForm').slideToggle();
  });