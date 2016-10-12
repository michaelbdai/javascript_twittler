$(document).ready(function(){
  console.log(streams);
  var passOneTweet = function(tweet, tweetID){
      var tweetLine = $('.template .tweet-line').clone();
      tweetLine.find('.user-name').html(tweet.user);
      tweetLine.find('.user-name').attr('id', tweet.user);
      var imgUrl = (window.users.indexOf(tweet.user) > 4 || window.users.indexOf(tweet.user) === -1 )? 'other-user' : tweet.user;
      tweetLine.find('.small-portrait').attr('style', 'background-image: url(\'images/' + imgUrl + '-small.jpg\')');
      tweetLine.find('.tweet-text').html( tweet.message + ' @line' + tweetID);
      tweetLine.find('.time-stamp').html(tweet.created_at.toString());
      switch (tweet.user) {
        case 'howard':
          tweetLine.attr('style', 'border: 1px solid #91111E' );
          break;
        case 'leonard':
          tweetLine.attr('style', 'border: 1px solid #725336' );
          break;
        case 'penny':
          tweetLine.attr('style', 'border: 1px solid #052D51' );
          break;
        case 'raj':
          tweetLine.attr('style', 'border: 1px solid #5D64AA' );
          break;
        case 'sheldon':
          tweetLine.attr('style', 'border: 1px solid #004F2F' );
          break;
        default:
          tweetLine.attr('style', 'border: 1px solid #1DA1F2' );
      }
    return tweetLine;
  }; //------------------end of displayOneTweet
  var loadTenTweets = function($displayLocation, stream) {
    // load ten newest tweets, beginning from latest, listed latest on top.
    // console.log(stream)
    var lengthOfCurrentStream = stream.length;
    var counter = 0;
    for (var index = lengthOfCurrentStream - 1; counter < 10 && index >= 0; index -- ){
      var tweet = stream[index];
      $displayLocation.append(passOneTweet(stream[index], index));
      counter ++;
    }
    return lengthOfCurrentStream;
  }
  var refreshTweet = function($displayLocation, stream, lengthOfPreviousStream) {
    var lengthOfCurrentStream = stream.length;
    if (lengthOfCurrentStream === lengthOfPreviousStream) return lengthOfCurrentStream;
    for (var index = lengthOfPreviousStream; index < lengthOfCurrentStream; index ++){
      var tweet = stream[index];
      $displayLocation.prepend(passOneTweet(stream[index], index));
      if ($displayLocation.children().length > 10) {
        $displayLocation.children().last().remove();
      }
    }
    return lengthOfCurrentStream;
  }
  var updateAgeOfTweet = function(currentTime){
    $('.show-age').each(function(){
      var timePassed = (currentTime.getTime() - Date.parse($(this).closest('.timing').find('.time-stamp').text()))/1000;
      var dateObj = new Date();
      var updatedAgeInSec = Math.round(timePassed) || 0;
      updatedAge = updatedAgeInSec > 60 ? (Math.floor(updatedAgeInSec / 60) + ' min old.'):(updatedAgeInSec + ' sec old.') ;
      $(this).html('');
      $(this).html(updatedAge);
    });
  };

  var autoRefreshTweet = function($displayLocation, stream, lengthOfPreviousStream){ //same argument as refresh Tweet
    if ($displayLocation.html() === '') {
      console.log('auto refresh stopped');

      return;
    }
    var lengthOfPreviousStream = refreshTweet($displayLocation, stream, lengthOfPreviousStream);
    setTimeout(autoRefreshTweet, 1000, $displayLocation, stream, lengthOfPreviousStream);
  };  
  var autoUpdateAgeOfTweet = function(){
    var currentTime = new Date();
    updateAgeOfTweet(currentTime);
    setTimeout(autoUpdateAgeOfTweet, 1000);
  }
  var $wraper = $('.tweet-wrapper');
  
  var loadPage = function(){
    $wraper.html('');
    var lengthOfPreviousStream = loadTenTweets ($wraper, streams.home);
    setTimeout(autoRefreshTweet, 3000, $wraper, streams.home, lengthOfPreviousStream)
    $('.display-portraits').children().show();
    $('.inquired-tweet-wrapper').hide();
    $('.inquired-tweet').html('');
    autoUpdateAgeOfTweet();   
  }
  loadPage();

  $(document).on('click', '.portrait, .user-name', function(){
    event.preventDefault();
    $(this).siblings().hide();  
    $wraper.html('');
    $('.inquired-tweet').html('');
    var selectedUser = $(this).attr('id');
    $('.inquired-tweet').html('')
    if (selectedUser === 'others' || window.users.indexOf(selectedUser) > 4) {
      console.log('other users');
      var stream = [{
        created_at : new Date(),
        message: 'Sorry, cannot display other users\' tweet at this moment.',
        user: 'work in progress'
      }];
    }else{ var stream = streams.users[selectedUser]}

    var lengthOfPreviousStream = loadTenTweets($('.inquired-tweet'), stream);
    $('.inquired-tweet-wrapper').show();
    autoRefreshTweet($('.inquired-tweet'), stream, lengthOfPreviousStream);
  });

  $(document).on('click', '.hide-button', function(){
    event.preventDefault();
    loadPage();
  });


  $('.add-tweet').submit(function(){
    event.preventDefault();
    var newStream = {};

    newStream.user = $('.enter-name').val();
    newStream.message = $('.enter-tweet').val();
    newStream.created_at = new Date();
    $(this)[0].reset()

    console.log(newStream);
    if (window.streams.users[newStream.user] === undefined){
      console.log('adding new user');
      window.streams.users[newStream.user] = [];
    }
    window.streams.home.push(newStream);
    window.streams.users[newStream.user].push(newStream);
    window.users.push(newStream.user)
    // window.streams.home.push(newStream);
    // window.users.push(newStream.user);
    console.log('updated global variable');
    console.log(Object.keys(streams.users));
    console.log(users);
  });


});