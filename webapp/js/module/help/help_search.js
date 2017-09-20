'use strict'
require('css_path/help/help.css')

var searchPage = {
    init : function(){
      this.empty();

    },
    empty : function(){
            var search = $('#search');
            if(search.val()==""){
                $('.icon-empty').on('click', function(){
                    search.val('');
                })
            }else{
                return false;
            }

    }
}



$(function(){
  searchPage.init();
})
