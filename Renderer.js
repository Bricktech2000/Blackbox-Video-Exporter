Renderer = {
  render: function(data){
    //settings.log('Rendering...');
    const cameraAngle = 20;
    const cameraFOV = 70;
    const maxCurrent = 250;
    const maxPower = 3000;
    var p = settings.padding;
    var w = settings.width - p * 2;
    var h = settings.height - p * 2;
    var ctx = settings.ctx;
    var textPadding = p * 4;
    var sectionPadding = p * 4;
    var yc = p * 2;

    renderBackground();
    var rawThr = data['rcCommand[3]'];
    var thr = -(rawThr - 1000) / 1000 * 2 + 1;
    var roll = data['rcCommand[0]'] / 256 / 2;
    var pitch = -data['rcCommand[1]'] / 256 / 2;
    var yaw = -data['rcCommand[2]'] / 256 / 2;
    renderJoystick(p, yc, w / 2 - p / 2, w / 2 - p / 2, yaw, thr);
    renderJoystick(p + w / 2 + p / 2, yc, w / 2 - p / 2, w / 2 - p / 2, roll, pitch);
    yc += w / 2 + p * 1;
    renderText(p, yc, 'Throttle: ' + Math.round((rawThr - 1000) / 10), settings.font);
    yc += textPadding;
    var rssi = Math.round(data.rssi / 10);
    renderProgressBar(p, yc, w, w / 8, 'RSSI', rssi, 0, 100);
    yc += w / 8 + textPadding + p * 1 + sectionPadding;
    var vmax = (data.vbatref / 10);
    var cells = Math.round(vmax / (data.vbatmaxcellvoltage / 10));
    var vmin = (data.vbatmincellvoltage / 10) * cells;
    var vcurr = (data.vbatLatest / 10);
    renderProgressBar(p, yc, w, w / 8, 'Voltage', twoDecimals(vcurr), vmin, vmax);
    yc += w / 8 + textPadding + p * 1;
    var amps = data.amperageLatest / 100;
    renderProgressBar(p, yc, w, w / 8, 'Current', twoDecimals(amps), 0, maxCurrent);
    yc += w / 8 + textPadding + p * 1;
    var watts = vcurr * amps;
    renderProgressBar(p, yc, w, w / 8, 'Power', twoDecimals(watts), 0, maxPower);
    yc += w / 8 + textPadding + p * 1 + sectionPadding;
    var gyros = (Math.abs(data['gyroADC[0]']) + Math.abs(data['gyroADC[1]']) + Math.abs(data['gyroADC[2]'])) / 10;
    renderProgressBar(p, yc, w, w / 8, 'Angular Speed', Math.round(gyros), 0, 100);
    yc += w / 8 + textPadding + p * 1;
    var accel = (Math.abs(data['accSmooth[0]']) + Math.abs(data['accSmooth[1]']) + Math.abs(data['accSmooth[2]'])) / 500;
    renderProgressBar(p, yc, w, w / 8, 'Acceleration', Math.round(accel), 0, 100);
    yc += w / 8 + textPadding + p * 1 + sectionPadding * 2 / 3;
    var hroll = data['heading[0]'] / 2 / Math.PI * 360;
    var hpitch = data['heading[1]'] / 2 / Math.PI * 360;
    var hyaw = data['heading[2]'] / 2 / Math.PI * 360;
    renderHorizon(p, yc, w, w, hpitch - cameraAngle, hroll);


    function renderRect(x, y, w, h, r, c){
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      //ctx.stroke();
      ctx.fill();
    }
    function renderCircle(x, y, r, c){
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      //ctx.stroke();
      ctx.fill();
    }
    function renderText(x, y, text, font){
      ctx.font = font;
      ctx.fillStyle = settings.accent;
      //ctx.textBaseline = 'middle';
      ctx.textBaseline = 'top';
      ctx.fillText(text, x, y);
    }
    function renderLine(x1, y1, x2, y2, w){
      ctx.strokeStyle = settings.color;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    function renderJoystick(x, y, w, h, xv, yv){
      var thumbSize = w / 16 + h / 16;
      renderRect(x, y, w, h, settings.borderRadius, settings.background2);
      renderCircle(x + w / 2 + w * xv / 2, y + h / 2 + h * yv / 2, thumbSize, settings.color);
    }
    function renderBackground(){
      renderRect(0, 0, settings.width, settings.height, 0, settings.background);
    }
    function renderProgressBar(x, y, w, h, name, val, min, max){
      var v = Math.min(Math.max(val, min), max); //prevent out of range values
      v = (v - min) / (max - min);
      renderRect(x, y, w, h, settings.borderRadius, settings.background2);
      renderRect(x, y, v * w, h, settings.borderRadius, settings.color);
      if(name) renderText(x, y + h + p, name + ': ' + val, settings.font);
    }
    function renderHorizon(x, y, w, h, pv, rv){
      ctx.save();
      pv = pv / cameraFOV; //from -1 to 1
      pv = 2 / (1 + Math.exp(-pv * 1.25)) - 1; //bidirectionnal sigmoid
      pv = pv * h + h / 20; //pixels
      renderRect(x, y, w, h, settings.borderRadius, settings.background2);
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, settings.borderRadius, settings.background2);
      ctx.clip();
      var hypot = w / 2 - p;
      var xo = Math.cos(rv / 360 * 2 * Math.PI) * hypot;
      var yo = Math.sin(rv / 360 * 2 * Math.PI) * hypot;
      renderLine(x + w / 2 - xo, y + h / 2 - yo - pv, x + w / 2 + xo, y + h / 2 + yo - pv, w / 32);
      ctx.restore();
    }
    function twoDecimals(number){
      return Math.round(number * 100) / 100;
    }
  }
}
