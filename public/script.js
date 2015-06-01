function appendItems(item) {
  $('main').append('<div class="video-page">' +
        '<iframe src="' + item.url + '" class="video-page-vid"></iframe>' +
        '<div>' +
          '<a class="video-link" data-id=' + item.id + '>' + item.title + '</a>' +
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
  e.preventDefault();
  $.ajax({
    type: 'GET',
    url: '/videos',
    dataType: 'json'
  }).done(function(data) {
    // debugger;
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

function displayVideo(e) {
  e.preventDefault();
  var videoId = $(this).attr('data-id');
  $.ajax({
    type: 'GET',
    url: '/videos/' + videoId,
    dataType: 'json'
  }).done(function(data) {
    $('main').empty();
    $('main').append('<div><iframe src="' + data.url + '" class="show-page-vid"></iframe></div>' +
      '<p>' + data.title + '</p>' +
      '<p>' + data.genre + '</p>' +
      '<p>' + data.description + '</p>' +
      '<button class="show-buttons" id="edit-button" data-id="' + data.id + '">Edit</button>' +
      '<button class="show-buttons" id="delete-button" data-id="' + data.id + '">Delete</button>');
  })
}

function editVideoForm() {
  var videoId = $(this).attr('data-id');
  $.ajax({
    type: 'GET',
    url: '/videos/' + videoId + '/edit',
    dataType: 'json'
  }).done(function(data, response) {
    $('main').empty();
    $('main').append('<h2>Edit the video</h2>' +
      '<form>' +
        '<input type="text" name="title" value="' + data.title + '">' +
        '<input type="text" name="description" value="' + data.description + '">' +
        '<input type="text" name="url" value="' + data.url + '">' +
        '<input type="text" name="genre" value="' + data.genre +'">' +
        '<input type="submit" id="edit-submit" data-id="' + data.id + '">' +
      '</form>')
  })
}

function updateVideo(e) {
  e.preventDefault();
  var videoId = $(this).attr('data-id');
  // debugger;
  var title = $('input[name="title"]').val();
  var description = $('input[name="description"]').val();
  var url = $('input[name="url"]').val();
  var genre = $('input[name="genre"]').val();
  $.ajax({
    type: 'PUT',
    url: '/videos/' + videoId,
    dataType: 'json',
    data: { title: title, description: description, url: url, genre: genre }
  }).done(function(data) {
    $('main').prepend("<h3>You're video has been updated!</h3>");
  })
}

function deleteVideo(e) {
  var videoId = $(this).attr('data-id');
  $.ajax({
    type: 'DELETE',
    url: '/videos/' + videoId +'/delete',
    dataType: 'json'
  }).done(function(data) {
    loadVideos();
  })
}

$(document).ready(function() {
  $('#video-link').on('click', loadVideos);
  $('#new-video-link').on('click', newVideoForm);
  $('main').on('submit', 'form', createNewVideo);
  $('main').on('click', '.video-link', displayVideo);
  $('main').on('click', '#edit-button', editVideoForm);
  $('main').on('click', '#edit-submit', updateVideo);
  $('main').on('click', '#delete-button', deleteVideo);
})