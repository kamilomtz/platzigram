var page = require('page');
var template = require('./template')

page('/signin', function(ctx, next){
	var main = document.getElementById('main-container');
	main.innerHTML = '';
	main.appendChild(template);
})