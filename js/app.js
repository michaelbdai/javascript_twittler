$(document).ready(function(){
  var $wraper = $('.tweet-wrapper');
  $wraper.html('');
  var displayTweet = function(streams, users, lengthOfPreviousTweet){
    var lengthOfPreviousTweet = lengthOfPreviousTweet || 0;
    // console.log(streams);
    // console.log(users);
    var currentLengthOfTweet = streams.home.length;
    if (currentLengthOfTweet === lengthOfPreviousTweet) return currentLengthOfTweet;
    for (var index = lengthOfPreviousTweet; index < currentLengthOfTweet ; index ++ ){
      var tweet = streams.home[index];
      var $tweet = $('<div></div>');
      $tweet.text('@' + tweet.user + ': ' + tweet.message);
      $tweet.prependTo($wraper);
      if (lengthOfPreviousTweet !== 0) {
        // $wraper.children().last().remove();
        $wraper.children().last().hide();
      }
    }
    return currentLengthOfTweet;
  }; //------------------end of displayTweet
  var lengthOfPreviousTweet = displayTweet (streams, users);
  var refreshTweet = function(){
    lengthOfPreviousTweet = displayTweet (streams, users, lengthOfPreviousTweet);
    setTimeout(refreshTweet, 1000);
  };
  refreshTweet();




});