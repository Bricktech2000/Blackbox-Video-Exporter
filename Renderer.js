Renderer = {
  render: function(data){
    //settings.log('Rendering...');
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
    renderJoystick(p, yc, w / 2 - p / 2, w / 2 - p / 2, data.yaw, data.thr);
    renderJoystick(p + w / 2 + p / 2, yc, w / 2 - p / 2, w / 2 - p / 2, data.roll, data.pitch);
    yc += w / 2 + p * 1;
    renderText(p, yc, 'Throttle: ' + Math.round((-data.thr + 1) * 100 / 2) + ' ' + '%', settings.font);
    yc += textPadding;
    renderProgressBar(p, yc, w, w / 8, 'RSSI', Math.round(data.rssi * 100), 0, 100, '%');
    yc += w / 8 + textPadding + p * 1 + sectionPadding;
    //console.log(data);
    renderProgressBar(p, yc, w, w / 8, 'Voltage', twoDecimals(data.volts), data.vmin, data.vmax, 'V');
    yc += w / 8 + textPadding + p * 1;
    renderProgressBar(p, yc, w, w / 8, 'Current', Math.round(data.amps), 0, maxCurrent, 'A');
    yc += w / 8 + textPadding + p * 1;
    renderProgressBar(p, yc, w, w / 8, 'Power', Math.round(data.volts * data.amps), 0, maxPower, 'W');
    yc += w / 8 + textPadding + p * 1 + sectionPadding;
    var gyros = (data.gyro0 + data.gyro1 + data.gyro2) / 10;
    renderProgressBar(p, yc, w, w / 8, 'Angular Speed', Math.round(gyros), 0, 100);
    yc += w / 8 + textPadding + p * 1;
    var accel = (data.acc0 + data.acc1 + data.acc2) / 250;
    renderProgressBar(p, yc, w, w / 8, 'Acceleration', Math.round(accel), 0, 100);
    yc += w / 8 + textPadding + p * 1 + sectionPadding * 2 / 3;
    var hroll = data.head0
    var hpitch = data.head1;
    var hyaw = data.head2;
    renderHorizon(p, yc, w, w, hpitch - settings.cameraAngle, hroll);


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
    function renderProgressBar(x, y, w, h, name, val, min, max, unit = ''){
      var v = Math.min(Math.max(val, min), max); //prevent out of range values
      v = (v - min) / (max - min);
      renderRect(x, y, w, h, settings.borderRadius, settings.background2);
      renderRect(x, y, v * w, h, settings.borderRadius, settings.color);
      if(name) renderText(x, y + h + p, name + ': ' + val + ' ' + unit, settings.font);
    }
    function renderHorizon(x, y, w, h, pv, rv){
      ctx.save();
      pv = pv / settings.cameraFOV; //from -1 to 1
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
      //https://stackoverflow.com/questions/4435170/how-to-parse-float-with-two-decimal-places-in-javascript
      return number.toFixed(2);
    }
  }
}
