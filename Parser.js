Parser = {
  parse: async function(text){
    settings.log('Parsing...');
    await sleep(1);
    var dataHeader;
    const headerMap = {
      'time': val => ({key: 'time', val: val}),
      'rcCommand[0]': val => ({key: 'roll', val: val / 256 / 2}),
      'rcCommand[1]': val => ({key: 'pitch', val: val / 256 / 2}),
      'rcCommand[2]': val => ({key: 'yaw', val: val / 256 / 2}),
      'rcCommand[3]': val => ({key: 'thr', val: -val / 1000 * 2 + 3}),
      'rssi': val => ({key: 'rssi', val: val / 1000}),
      'vbatLatest': val => ({key: 'volts', val: val / 10}),
      'amperageLatest': val => ({key: 'amps', val: val / 100}),
      'gyroADC[0]': val => ({key: 'gyro0', val: Math.abs(val)}),
      'gyroADC[1]': val => ({key: 'gyro1', val: Math.abs(val)}),
      'gyroADC[2]': val => ({key: 'gyro2', val: Math.abs(val)}),
      'accSmooth[0]': val => ({key: 'acc0', val: Math.abs(val)}),
      'accSmooth[1]': val => ({key: 'acc1', val: Math.abs(val)}),
      'accSmooth[2]': val => ({key: 'acc2', val: Math.abs(val)}),
      'heading[0]': val => ({key: 'head0', val: val / 2 / Math.PI * 360}),
      'heading[1]': val => ({key: 'head1', val: val / 2 / Math.PI * 360}),
      'heading[2]': val => ({key: 'head2', val: val / 2 / Math.PI * 360}),
    };
    const headerStart = 'loopIteration';
    var obj = CSVParser.parse(text, function(obj, arr){
      if(arr[0] == headerStart){
        dataHeader = arr;
        obj.data = [];
        var vmax = (obj.vbatref / 10);
        var cells = Math.round(vmax / (obj.vbatmaxcellvoltage / 10));
        var vmin = (obj.vbatmincellvoltage / 10) * cells;
        obj.vmax = vmax;
        obj.cells = cells;
        obj.vmin = vmin;
        return;
      }
      if(dataHeader){
        item = {};
        for(var h = 0; h < dataHeader.length; h++){
          var mapped = headerMap[dataHeader[h]];
          mapped = mapped && mapped(arr[h]);
          if(mapped) item[mapped.key] = mapped.val;
        }
        obj.data.push(item);
      }else obj[arr[0]] = arr[1]; //arr.slice(1);
    });
    //console.log(text);
    return obj;
  }
}
