var page = require('page');
var template = require('./template');
var request = require('superagent');
var header = require('../header');
var axios = require('axios');
var Webcam = require('webcamjs');
var picture = require('../picture-card');

page('/', header, asyncLoad, function(ctx, next){
	var main = document.getElementById('main-container');
	main.innerHTML = ''
	main.appendChild(template(ctx.pictures));
	
	const picturePreview = $('#picture-preview');
	const camaraInput = $('#camara-input');
	const cancelPicture = $('#cancelPicture');
	const shootButton = $('#shoot');
	const uploadButton = $('#uploadButton');

	function reset(){
		picturePreview.addClass('hide');
		cancelPicture.addClass('hide');
		uploadButton.addClass('hide');
		shootButton.removeClass('hide');
		camaraInput.removeClass('hide');
	}

	cancelPicture.click(reset);

	$('.modal-trigger').leanModal({
		ready: function(){
			Webcam.attach('#camara-input');
			shootButton.click((ev) => {
				Webcam.snap((data_uri) => {
					picturePreview.html(`<img src="${data_uri}"/>`);
					picturePreview.removeClass('hide');
					cancelPicture.removeClass('hide');
					uploadButton.removeClass('hide');
					shootButton.addClass('hide');
					camaraInput.addClass('hide');
					uploadButton.off('click');
					uploadButton.click(() => {
						const pic =	{
							url: data_uri,
							likes: 0,
							liked: false,
							createdAt: +new Date(),
							user: {
								username: 'jsalvatierra',
								avatar: 'https://i.ytimg.com/vi/7j0KtbJsOyE/maxresdefault.jpg' 
							},
						}
						$('#picture-cards').prepend(picture(pic));
					})
				});
			})
		},
		complete: function(){
			Webcam.reset();
			reset();
		}
	})
	/*$('.modal').modal(
   	 {
   	 ready: function(modal, trigger)
   			 { // Callback for Modal open. Modal and trigger parameters available.
				Webcam.attach('#camara-input');
   			 },
 		 complete: function()
 				 {
					Webcam.reset();
 				 } // Callback for Modal close
   	 }
    );*/
})

function loadPictures(ctx, next){
	request
		.get('/api/pictures')
		.end(function(err, res){
			if (err) return console.log(err)

			ctx.pictures = res.body;
			next();
		})
}

function loadPicturesAxios(ctx, next){
	axios
		.get('/api/pictures')
		.then(function(res){
			ctx.pictures = res.data;
			next();
		})
		.catch(function(err){
			console.log(err)
		})
}

function loadPicturesFetch(ctx, next){
	fetch('/api/pictures')
		.then(function(res){
			return res.json();
		})
		.then(function(pictures){
			ctx.pictures = pictures;
			next();
		})
		.catch(function(err){
			console.log(err)
		})
}

async function asyncLoad(ctx, next){
	try {
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());
		next();
	} catch (error) {
		return console.log(error);
	}
}