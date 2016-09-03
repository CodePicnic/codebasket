//---------------------------------------------------------------------------
// Hello my baby, hello my honey, hello my ragtime gal
//---------------------------------------------------------------------------

$(window).load(function(){

  var folderToggler = $('.files li.folder strong a.toggler')
    , colapseFolder = $('.files li.title a.toggler')
    , folders = $('.files li.folder')

  folderToggler.on('click',function(){
    event.preventDefault()
    $(this).parent().parent().toggleClass('open')
    $(this).parent().parent().toggleClass('closed')
  })

  colapseFolder.on('click',function(){
    event.preventDefault()
    folders.removeClass('open')
    folders.addClass('closed')
  })


})

//---------------------------------------------------------------------------
// So long and thanks for all the frogs
//---------------------------------------------------------------------------
