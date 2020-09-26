CSVParser = {
  parse: function(text, func){
    var obj = {};
    var lines = text.split('\n');
    //
    for(var l = 0; l < 100; l++){
      var arr = lines[l].split(',');
      for(var i = 0; i < arr.length; i++){
        arr[i] = replaceBy(arr[i], /^[^"]*$/g, function(num){
          return parseFloat(num);
        });
        if(arr[i].replace) arr[i] = arr[i].replace(/^"(.*)"$/g, '$1')
      }
      console.log(arr);
      var ret = func(arr);
      obj = {...obj, ...ret};
    }
    return obj;
  }
}

function replaceBy(str, regex, func){
  match = str.match && str.match(regex);
  if(match) return func(match);
  else return str;
}
















