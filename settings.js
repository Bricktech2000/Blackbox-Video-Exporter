settings.fps = 30;
settings.movingAverageDuration = .1;
settings.height = 900;
settings.width = 200;
settings.padding = 10;
settings.borderRadius = 10;
settings.background = '#222';
settings.background2 = '#333';
settings.color = '#f33';
settings.accent = '#fff';
settings.font = '20px arial';
settings.log = function(m){
  console.log(m);
  var div = document.createElement('div');
  div.innerText = m + '\n';
  document.body.appendChild(div);
}