var stage;

var init = function() {
  stage = new createjs.Stage("demoCanvas");
  createjs.Touch.enable(stage);
  stage.mouseMoveOutside = true;
  var nbaspriteSheet;
  nbaspriteSheet = new createjs.SpriteSheet(nbasprite);
  var nbalogo = new createjs.Sprite(nbaspriteSheet);
  nbalogo.visible = false;
  nbalogo.regX = 75;
  nbalogo.regY = 50;
  nbalogo.x = 75;
  nbalogo.y = 50;
  nbalogo.gotoAndStop('nba');
  var row = 1;
  var col = 1;
  var leftpad = 50;
  var toppad = 50;
  var colwidth = 160;
  var rowheight = 110;
  var ncol = 4;
  for (var sprite in nbasprite.animations) {
    if (sprite === 'nba') {
      continue;
    }
    var newsprite = new createjs.Sprite(nbaspriteSheet, sprite);
    newsprite.name = sprite;
    newsprite.regX = 75;
    newsprite.regY = 50;
    newsprite.x = leftpad + 75 + ((col - 1) * colwidth);
    newsprite.y = toppad + ((row - 1) * rowheight);
    //	newsprite.back = nbalogo.clone();
    //	newsprite.back.x = newsprite.x;
    //	newsprite.back.y = newsprite.y;
    newsprite.flipped = false;
    //		newsprite.back.visible = false;
    //		newsprite.back.back = 'undefined';
    newsprite.offsetx = 10000;
    newsprite.offsety = 10000;
    newsprite.first_press = true;
    newsprite.on("pressmove", sprite_on_pressmove, null, false, newsprite);
    newsprite.on("pressup", sprite_on_pressup, null, false, newsprite);
    stage.addChild(newsprite);
    //		stage.addChild(newsprite.back);
    stage.update();
    col++;
    if (col > ncol) {
      col = 1;
    }
    row = (col == 1) ? row + 1 : row;
  }
  createjs.Ticker.addEventListener("tick", handleTick);
};

var sprite_on_pressmove = function(evt, s) {
  debug('sprite pressmove s.offsetx:' + s.offsetx + ' ' + evt);
  if (s.first_press) {
    s.first_press = false;
    s.offsetx = evt.stageX - evt.currentTarget.x;
    s.offsety = evt.stageY - evt.currentTarget.y;
    s.origX = evt.currentTarget.x;
    s.origY = evt.currentTarget.y;
  }
  evt.currentTarget.x = evt.stageX - s.offsetx;
  evt.currentTarget.y = evt.stageY - s.offsety;
  //	s.back.x = evt.currentTarget.x;
  //	s.back.y = evt.currentTarget.y;
  stage.update();
};

var flip = function(s) {
  //debug('flip');
};

// press up can happen without a press move - it is a click
var sprite_on_pressup = function(evt, s) {
  // if we havent moved from first pressmove flip the card
  debug('sprite press up s:' + s);
  if (s.first_press) {
    debug('click');
    return;
  }
  var dx = Math.abs(s.origX - s.x);
  var dy = Math.abs(s.origY - s.y);
  var closeenough = ((dx + dy) < 6);
  if (closeenough) {
    debug('close');
  }
  s.first_press = true;
};


var debug = function(str) {
  var de = document.getElementById('debug');
  de.innerHTML = str;
};


var handleTick = function(event) {
  // Actions carried out each tick (aka frame)
  //console.log('tick');
  stage.update();
  if (!event.paused) {
    // Actions carried out when the Ticker is not paused.
  }
};
