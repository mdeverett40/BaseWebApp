function getWeather(searchQuery) {
  var url= "https://api.openweathermap.org/data/2.5/weather?q="+searchQuery+"&units=imperial&appid="+apiKey;

  $(".city").text("");
  $(".temp").text("");
  $(".error-message").text("")
 
  $.ajax(url,{success: function(data){
   console.log(data);
    $(".city").text(data.name);
    $(".temp").text(data.main.temp);
  },error: function(error){
    $(".error-message").text("An error occured")
  }})
}

function searchWeather() {
  var searchQuery = $(".search").val();
  getWeather(searchQuery);

}

$(document).ready(function(){
  getPosts();
})

function handleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
      // ...
     }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

function addMessage(postTitle,postBody){
  var postData = {
    title: postTitle,
    body: postBody
  }
  var database = firebase.database().ref("posts");

  var newPostRef = database.push();
  newPostRef.set(postData, function(error) {
    if (error) {
      // The write failed...
    } else {
      // Data saved successfully!
      window.location.reload();
    }
  });
}

function handleMessageFormSubmit(){
  var postTitle = $("#post-title").val();
  var postBody = $("#post-body").val();
  addMessage(postTitle,postBody);
  }

function getPosts() {

  return firebase.database().ref("posts").once('value').then(function(snapshot) {
    var posts = snapshot.val(); 
    console.log(posts);

    for(var postKey in posts) {
      var post = posts[postKey];
      $("#post-listing").append("<div>"+post.title+" - "+post.body+"</div>");
    }

  });

}

