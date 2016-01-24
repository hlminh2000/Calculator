


$(document).ready(() => {
  var twitchApiUrl = "https://api.twitch.tv/kraken/";
  var usernameSet = ["thomasballinger", "ESL_SC2", "OgamingSC2", "freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb",  "brunofin", "comster404", "noobs2ninjas", "beohoff"]; // "brunofin", "comster404", ...
  var streamObjectSet;

  //initialize streamObjectSet and presents all of them to the main div
  setData(twitchApiUrl, usernameSet).then(dataSet => {
    streamObjectSet = dataSet.map((data, index) => createObject(data, index));
    presentAll(streamObjectSet);
    console.log(dataSet);
  });



  // changes look of tabs when clicked
  $('.browse_item').click(function(){
    $('.browse_item').removeClass("browse_item-active");
    $(this).addClass("browse_item-active");
  })
  // handles click event for "all" tab
  $('.browse_item_all').on('click', function(){
    showAll();
  })
  // handles click event for "online" tab
  $('.browse_item_online').on('click', function(){
    showOnline();
  })
  // handles click event for "offline" tab
  $('.browse_item_offline').on('click', function(){
    showOffline();
  })



  // handles click event on channel content
  $('body').on('click', '.channel_content', function(){
    showInformation(this.id, streamObjectSet);
    // console.log(this.id);
  });

});





clearList = () => {
  document.getElementById('channelList').innerHTML = "";
}

presentAll = (streamObjectSet) => {
  streamObjectSet.forEach((streamObjec) => {
    document.getElementById('channelList').innerHTML += streamObjec.listHTML;
  });
  $('.channel').removeClass("channel-hidden");
}

showAll = () => {
  $('.channel').removeClass("channel-hidden");
}

showOnline = () => {
  $('.channel-online').removeClass("channel-hidden");
  $('.channel-offline').addClass("channel-hidden");
  console.log("yo")
}

showOffline = () => {
  $('.channel-offline').removeClass("channel-hidden");
  $('.channel-online').addClass("channel-hidden");
  console.log("yo")
}


showInformation = (id, streamObjectSet) => {
  document.getElementById('right_col').innerHTML = "";
  document.getElementById('right_col').innerHTML += streamObjectSet[id].informationHTML;
}



createObject = (data, index) =>{
  var listHTML = "";
  if(data.statusCode == 200){
    listHTML = document.getElementById("channelForm").innerHTML;
    listHTML = listHTML.replace("#channelID", index);
    listHTML = listHTML.replace("%channelName", data.channel.display_name);
    listHTML = listHTML.replace("%imageSrc", data.channel.logo == null? "https://cdn1.iconfinder.com/data/icons/simple-icons/2048/twitch-2048-black.png" : data.channel.logo)
    if(data.stream.stream != null){
      listHTML = listHTML.replace("%status", data.channel.status.split(" ").slice(0, 5) + "...")
      listHTML = listHTML.replace(".statusClass", "channel-online")
      // console.log(data.channel.logo)
    }
    else{
      listHTML = listHTML.replace("%status", "offline")
      listHTML = listHTML.replace(".statusClass", "channel-offline")
    }
  }
  else {
    listHTML = listHTML.replace("#channelID", index);
    listHTML = listHTML.replace("%status", "user was removed")
  }


  var informationHTML = "";
  if(data.statusCode == 200){
    informationHTML = document.getElementById("channelInformationForm").innerHTML;
    informationHTML = informationHTML.replace("#channelID", index);
    informationHTML = informationHTML.replace("%channelName", data.channel.display_name);
    informationHTML = informationHTML.replace("%followers", data.channel.followers);
    informationHTML = informationHTML.replace("%imageSrc", data.channel.logo == null? "https://cdn1.iconfinder.com/data/icons/simple-icons/2048/twitch-2048-black.png" : data.channel.logo)
    if(data.stream.stream != null){
      informationHTML = informationHTML.replace("%status", "online")
      informationHTML = informationHTML.replace(".statusClass", "channel-online")
      // console.log(data.channel.logo)
    }
    else{
      informationHTML = informationHTML.replace("%status", "offline")
      informationHTML = informationHTML.replace(".statusClass", "channel-offline")
    }
    informationHTML = informationHTML.replace("%joinedDate", data.channel.created_at.slice(0, 10));
    informationHTML = informationHTML.replace("%updateDate", data.channel.updated_at.slice(0, 10));
    informationHTML = informationHTML.replace("%url", data.channel.url);
  }
  else {
    informationHTML = informationHTML.replace("#channelID", index);
    informationHTML = informationHTML.replace("%status", "user was removed")
  }



  return {
    id:               index,
    listHTML:         listHTML,
    informationHTML:  informationHTML,
    original:         data
  };
}



setData = (apiUrl, keySet) => {
  return new Promise((resolve, reject) => {
    keySet.reduce((dataSet, key, index, keySetSelf) => {
      StreamAjaxCall(apiUrl, key).then((data) => {
        dataSet.push(data);
        if(dataSet.length == keySetSelf.length)
          resolve(dataSet);
      });
      return dataSet;
    }, []);
  });
}



StreamAjaxCall = (apiUrl, key) => {
  return new Promise((resolve, reject) => {
    var stream;
    var streamXhr = new XMLHttpRequest();
    streamXhr.open('GET', apiUrl + "streams/" + key, true);
    streamXhr.onreadystatechange = () => {
      if (streamXhr.readyState == 4 && streamXhr.status == 200) {
        stream = JSON.parse(streamXhr.responseText);
        ChannelAjaxCall(apiUrl, key).then((channel) => {
          resolve({statusCode: 200, channel: channel, stream: stream});
        });
      }
      else if(streamXhr.status == 422){
        resolve({statusCode: 422, channel: key, stream: "N/A"});
      }
    }
    streamXhr.send();
  })
}



ChannelAjaxCall = (apiUrl, key) => {
  return new Promise((resolve, reject) => {
    var channelData = new XMLHttpRequest();
    channelData.open('GET', apiUrl + "channels/" + key, true);
    channelData.onreadystatechange = () => {
      if (channelData.readyState == 4 && channelData.status == 200) {
        resolve(JSON.parse(channelData.responseText));
      }
      else if(channelData.status == 422){
        resolve([422, key]);
      }
    }
    channelData.send();
  })
}
