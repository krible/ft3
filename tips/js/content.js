var username = window.location.href.split("/");
//console.log(username);
if (username && username[3]) {
  username = username[3];
} else {
  username = 'default';
} 
console.log(username);

var source   = $("#content").html();
var template = Handlebars.compile(source);

var getContent = function(cb) {

  $.getJSON( "/tips/json/data.json?t="+ (Date.now()), function( data ) {
  if (!data[username]) {
    username = 'default';
  }
  cb(data[username]);
});
}
