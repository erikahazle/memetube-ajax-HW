function appendItems(item) {
  $('main').append('<div class="video-page">' +
        '<iframe src="' + item.url + '" class="video-page-vid"></iframe>' +
        '<div>' +
          '<a href="/videos/' + item.id + '" class="video-link">' + item.title + '</a>' +
        '</div></div>')
}

function newVideoForm() {
  $.ajax({
    type: 'GET',
    url: '/videos/new',
    dataType: 'json'
  }).done(function(data) {
    $('main').empty();
    $('main').append('<h2>Add a new video</h2>' +
    '<form>' +
      '<input type="text" name="title" placeholder="Enter title">' +
      '<input type="text" name="description" placeholder="Description...">' +
      '<input type="text" name="url" placeholder="Video URL">' +
      '<input type="text" name="genre" placeholder="Genre">' +
      '<input type="submit">' +
    '</form>');
  })
}

function loadVideos(e) {

  $.ajax({
    type: 'GET',
    url: '/videos',
    dataType: 'json'
  }).done(function(data) {
    $('main').empty();
    $('main').append('<h1>Videos</h1>');
    $.each(data, function(index, item) {  
      appendItems(item);
    })
  })
}

function createNewVideo(e) {
  e.preventDefault();
  var title = $('input[name="title"]').val();
  var description = $('input[name="description"]').val();
  var url = $('input[name="url"]').val();
  var genre = $('input[name="genre"]').val();
  $.ajax({
    type: 'POST',
    url: '/videos',
    dataType: 'json',
    data: { title: title, description: description, url: url, genre: genre }
  }).done(function(data) {
    $('main').empty();
    loadVideos();
  })
}


$(document).ready(function() {
  // variables


  // event listeners
  $('#video-link').on('click', loadVideos);
  $('#new-video-link').on('click', newVideoForm);
  $('main').on('submit', 'form', createNewVideo);
  $('main').on('click', '.video-link', displayVideo)
})