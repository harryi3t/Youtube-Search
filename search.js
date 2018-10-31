/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var defaultSort = true;
var titleSort = false;
var dateSort = false;
var Ascending = true;
var Descending = false;
function filter(){
    document.getElementById("myDropdown").classList.toggle("show");
}
function onSortByName(){
    defaultSort = false;
    titleSort = true;
    dateSort = false;
}
function onSortByDate(){
    defaultSort = false;
    titleSort = false;
    dateSort = true;
}
function onSortByDefault(){
    defaultSort = true;
    titleSort = false;
    dateSort = false;
}
function selectAscending(){
    Ascending = true;
    Descending = false;
}
function selectDescending(){
    Ascending = false;
    Descending = true;
}

function setButtons(q,nextToken,prevToken){
    var prev = '<div class = "button-container">'+'<button id="prev-button" class="button-class" data-token="'+prevToken+'" data-query="'+q+'"'+'onclick="prevpage();">Prev Page</button></div>';
    var next = '<div class = "button-container">'+'<button id="next-button" class="button-class" data-token="'+nextToken+'" data-query="'+q+'"'+'onclick="nextpage();">Next Page</button></div>';
    var output;
    if(!prevToken){
        output = next;
    }
    else{
        output=prev+next;    
    }
    return output;
}
function search() {
  var q = $('#query').val();
  backSearch(q);
}
function backSearch(q,token){
    $('#search-container').empty();
    $('#pageSwap').empty();
    var data; 
    if(!token){
       data = {
         part : "snippet",
         q : q,
         type : "video",
         videoCaption : "closedCaption",
         key : "AIzaSyA3udnm5kV2lkw-6BnU6-9DvqNGtwuzHAg"
     };
    }
    else{
        data = {
         part : "snippet",
         q : q,
         pageToken : token,
         type : "video",
         videoCaption : "closedCaption",
         key : "AIzaSyA3udnm5kV2lkw-6BnU6-9DvqNGtwuzHAg"
     };

    }
    $.get("https://www.googleapis.com/youtube/v3/search",data,function(response) {
        console.log(response);
        var nextPageToken = response.nextPageToken;
        var prevPageToken = response.prevPageToken;
        var arr = [];
        $.each(response.items,function(i,item){
            arr.push(item);
        });
        if(titleSort){
            arr.sort(comparatorTitle);
        }
        else if(dateSort){
            arr.sort(comparatorDate);
        }
        $.each(arr,function(i,item){
            var output = getDivElement(item);
            $("#search-container").append(output);
        });
        var buttons = setButtons(q,nextPageToken,prevPageToken);
        $("#pageSwap").append(buttons);
    });
}
function comparatorDate(one,two){
    if(Ascending){
        return one.snippet.publishedAt<two.snippet.publishedAt?-1:1;
    }
    return two.snippet.publishedAt<one.snippet.publishedAt?-1:1;
}
function comparatorTitle(one,two){
    if(Ascending){
        return one.snippet.title<two.snippet.title ? -1:1;
    }
    return two.snippet.title<one.snippet.title?-1:1;
}
function getDivElement(item){
    var id = item.id.videoId;
    var title = item.snippet.title;
    var desc = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;
    var videoLink = "https://www.youtube.com/watch?v="+id;
    var result = '<li>'+
            '<div class ="imgresult">'+
            '<img src="'+thumb+'">'+
            '</div>'+
            '<div class="textresult">'+
            '<h3><a href="'+videoLink+'">'+ title+'</a></h3>'+
            '<small>'+'<span class="channelTitle">'+channelTitle+'</span>'+'            '+videoDate+'</small>'+
            '<p>'+desc+'</p>'+
            '</div>'+
            '</li>'+
            '<div class="clearfix"></div>'+
            '';
    return result;     
}
function prevpage(){
  var token = $('#prev-button').data('token');
  var q = $('#prev-button').data('query');
  backSearch(q,token);
}
function nextpage() {
  var token = $('#next-button').data('token');
  var q = $('#next-button').data('query');
  backSearch(q,token);
}
