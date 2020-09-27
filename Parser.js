Parser = {
  parse: async function(text){
    settings.log('Parsing...');
    await sleep(1);
    var dataHeader;
    var obj = CSVParser.parse(text, function(obj, arr){
      if(arr[0] == 'loopIteration'){
        dataHeader = arr;
        obj.data = [];
        return;
      }
      if(dataHeader){
        item = {};
        for(var h = 0; h < dataHeader.length; h++)
          item[dataHeader[h]] = arr[h];
        obj.data.push(item);
      }else obj[arr[0]] = arr[1]; //arr.slice(1);
    });
    //console.log(text);
    return obj;
  }
}
