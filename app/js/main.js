$(document).ready(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".header");
    var $menu = $(".main-menu");
    var utms = parseGET();
    var headerHeight = 57;
    var $hamburger = $(".hamburger");
    var isPodarok = true;

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    if($wnd.width() < 992) {
        headerHeight = 105;
    }

    $wnd.scroll(function() { onscroll(); });

    var onscroll = function() {
        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        if($wnd.scrollTop() > 0) {
            $header.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
        }

        var scrollPos = $wnd.scrollTop() + headerHeight;

        $menu.find(".link").each(function() {
            var link = $(this);
            var id = link.attr('href');
            
            if(id.length > 1 && id.charAt(0) == '#' && $(id).length > 0) {
                var section = $(id);
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

    onscroll();

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $("input[type=tel]").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    }); 

    $("input:required, textarea:required").keyup(function() {
        var $this = $(this);
        if($this.attr('type') != 'tel') {
            checkInput($this);
        }
    });

    $(document).on('closing', '.remodal', function (e) {
      $(this).find(".input, .textarea").removeClass("error");
      var form = $(this).find("form");
      if(form.length > 0) {
        form[0].reset();
      }
    });

    $(".ajax-submit").click(function(e) {        
        var $form = $(this).closest('form');
        var $requireds = $form.find(':required');
        var formValid = true;

        $requireds.each(function() {
            $elem = $(this);

            if(!$elem.val() || !checkInput($elem)) {
                $elem.addClass('error');
                formValid = false;
            }
        });

        if(formValid) {

            var $data = $form.serializeArray();
            var $answer1, $answer2, $answer3, $result;
    
            for (var i = 0; i < $data.length; i++) {
              switch ($data[i].name) {
                case "Ответ1":
                  $answer1 = $data[i].value;
                  break;
                case "Ответ2":
                  $answer2 = $data[i].value;
                  break;
                case "Ответ3":
                  $answer3 = $data[i].value;
                  break;          
              }
            }
    
            if ($answer1 == "Магазин / супермаркет" && $answer3 == "Да") {
              $result = "shop-market-sklad";
            }
            else if ($answer1 == "Магазин / супермаркет" && $answer3 == "Нет") {
              $result = "shop-market";  
            }
            else if ($answer1 == "Бутик" && $answer3 == "Нет") {
              $result = "butik";
            }
            else if ($answer1 == "Бутик" && $answer3 == "Да") {
              $result = "butik-sklad";
            }
            else if ($answer1 == "Аптека") {
              $result = "apteka";
            }
            else if ($answer1 == "Кафе / ресторан") {
              $result = "cafe-restoran";
            }
    
            window.sessionStorage.setItem("result", $result);  
            
            if(Object.keys(utms).length === 0) {
              utms['utm'] = "Прямой переход";
            } 

            for(var key in utms) {
              var input = document.createElement("input");
              input.type = "hidden";
              input.class = "utm-element";
              input.name = key;
              input.value = utms[key];
              $form[0].appendChild(input);
            }
        } else {
          e.preventDefault();
        }
    });

    $("#uznat_rezultat_i_obratnyi_zvonok").click(function() {
      $("#hiddenButton").val("Да");
      isPodarok = true;
    });

    $("#uznat_rezultat").click(function() {
      $("#hiddenButton").val("Нет");
      isPodarok = false;
    });

    $("#page-form").submit(function() {
      if(isPodarok) {
        setTimeout(function() {
          window.location = "/result.html";
        }, 1000);
      }
    });


    $(".perehod").click(function() {
       var $show = $("#" + $(this).data("show"));
       var $hide = $("#" + $(this).data("hide"));
       $show.removeClass("hide");
       $hide.addClass("hide");
    });

    console.log(window.location);

    if(window.location.pathname == "/result.html") {
      var $id = window.sessionStorage.getItem("result");
      $("#" + $id).removeClass("hide");
    }
   

});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    
function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};