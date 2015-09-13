
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // Uses cordova-plugin-statusbar to keep the mobile OS status bar.
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#333");

        // Enable geolocation
        navigator.geolocation.watchPosition(onSuccess, onError);
    },
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }
};

app.initialize();


// Use cordova-plugin-geolocation for GPS information
// Display information into the webview
var onSuccess = function(position) {
    $('#wherearewe').html('<pre>-You are at-\n'+
          'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n</pre>');
};

function onError(error) {
    $('#wherearewe').html('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


// Take the form and make an ajax request instead
$('#formme').submit(function(){
  var data = {"lang": $('#formme #language').val()};
  //alert(JSON.stringify(data));
  console.log("sumitting data");
  $.ajax({
    type       : "POST",
    // The server side needs the appropriate CORS rules
    // For AWS API Gateway, see http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html
    url        : "https://i5mjyjbny3.execute-api.us-west-2.amazonaws.com/prod/randomHelloWorld",
    crossDomain: true,
    beforeSend : function() {
      $.mobile.loading('show');
      $('#formme #submitbtn').prop("disabled",true);
    },
    complete   : function() {
      $.mobile.loading('hide');
      $('#formme #submitbtn').prop("disabled",false);
    },
    data       : JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType   : 'json',
    success    : function(response) {
        $('#results ul').prepend("<li>"+response[0]+"="+response[1]+"\</li>\n");
    },
    error      : function() {
        console.error("error");
        alert('Not working!');
    }
  });

  // This keeps the default POST action from firing & reloading your app
  event.preventDefault();
});
