CSVParser = {
  parse: function (text, func) {
    let obj = {};
    const lines = text.split('\n');
    for (let l = 0; l < lines.length / 1; l++) {
      let arr = lines[l].split(',');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = replaceBy(arr[i], /^[^"]*$/g, function (num) {
          const float = parseFloat(num);
          if (isNaN(float)) return num;
          return float;
        });
        if (arr[i].replace) arr[i] = arr[i].replace(/^"(.*)"$/g, '$1');
      }
      func(obj, arr);
    }
    return obj;
  },
};

function replaceBy(str, regex, func) {
  match = str.match && str.match(regex);
  if (match) return func(match);
  else return str;
}
