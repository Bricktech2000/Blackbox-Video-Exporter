settings.fps = 30;
settings.movingAverageDuration = .1;
settings.height = 1080;
settings.width = 1080 * 2 / 9;
settings.padding = 12;
settings.borderRadius = 12;
settings.background = '#222';
settings.background2 = '#333';
settings.color = '#f33';
settings.accent = '#fff';
settings.font = '24px arial';
settings.log = function(m){
  console.log(m);
  var div = document.createElement('div');
  div.innerText = m + '\n';
  document.body.appendChild(div);
}