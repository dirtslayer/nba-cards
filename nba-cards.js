var stage;
var card_width;
var card_height;
var card_padding;
var left_pad;
var top_pad;

var init = function() {
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('orientationchange', resizeCanvas, false);


  stage = new createjs.Stage("demoCanvas");
  createjs.Touch.enable(stage);
  stage.mouseMoveOutside = true;
  var nbaspriteSheet;
  nbaspriteSheet = new createjs.SpriteSheet(nbasprite);

  var row = 1;
  var col = 1;
  var leftpad = 50;
  var toppad = 100;
  var colwidth = 160;
  var rowheight = 110;
  var ncol = 4;
  for (var sprite in nbasprite.animations) {
    if (sprite === 'nba') {
      continue;
    }
    var newsprite = new createjs.Sprite(nbaspriteSheet, sprite);
    newsprite.name = sprite;
    newsprite.gotoAndStop(sprite);
    newsprite.regX = 75;
    newsprite.regY = 50;
    newsprite.scaleX = 1.5;
    newsprite.scaleY = 1.5;
    newsprite.x = leftpad + 75 + ((col - 1) * colwidth);
    newsprite.y = toppad + ((row - 1) * rowheight);
    newsprite.flipped = false;
    newsprite.offsetx = 10000;
    newsprite.offsety = 10000;
    newsprite.first_press = true;
    newsprite.on("pressmove", sprite_on_pressmove, null, false, newsprite);
    newsprite.on("pressup", sprite_on_pressup, null, false, newsprite);
    stage.addChild(newsprite);
    stage.update();
    col++;
    if (col > ncol) {
      col = 1;
    }
    row = (col == 1) ? row + 1 : row;
  }
  createjs.Ticker.addEventListener("tick", handleTick);
  resizeCanvas();
};

var sprite_on_pressmove = function(evt, s) {
  debug('sprite pressmove s.offsetx:' + s.offsetx + ' ' + evt);
  if (s.first_press) {
    s.first_press = false;
    s.offsetx = evt.stageX - evt.currentTarget.x;
    s.offsety = evt.stageY - evt.currentTarget.y;
    s.origX = evt.currentTarget.x;
    s.origY = evt.currentTarget.y;
    stage.setChildIndex(s,stage.children.length - 1);
  }
  evt.currentTarget.x = evt.stageX - s.offsetx;
  evt.currentTarget.y = evt.stageY - s.offsety;
  stage.update();
};

var flip = function(s) {
  //debug('flip');
  createjs.Tween.get(s).to({scaleX:0}, 200).call(handleComplete);
  function handleComplete() {
    createjs.Tween.get(s).to({scaleX:1},200);
    if ( s.flipped ) {
      s.gotoAndStop(s.name);
      s.flipped = false;
    } else {
      s.gotoAndStop('nba');
      s.flipped = true;
    }
  }
};

// press up can happen without a press move - it is a click
var sprite_on_pressup = function(evt, s) {
  // if we havent moved from first pressmove flip the card
  debug('sprite press up s:' + s);
  if (s.first_press) {
    debug('click');
    flip(s);
    return;
  }
  var dx = Math.abs(s.origX - s.x);
  var dy = Math.abs(s.origY - s.y);
  var closeenough = ((dx + dy) < 6);
  if (closeenough) {
    debug('close');
    flip(s);
  }
  s.first_press = true;
};


var debug = function(str) {
  //var de = document.getElementById('debug');
  //de.innerHTML = str;
  console.log(str);
};


var handleTick = function(event) {
  // Actions carried out each tick (aka frame)
  //console.log('tick');
  stage.update();
  if (!event.paused) {
    // Actions carried out when the Ticker is not paused.
  }
};


function request_full_screen() {
    var
      el = document.documentElement
    , rfs =
           el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
    ;
    rfs.call(el);
}

function resizeCanvas() {
        var ce = document.getElementById('demoCanvas');

        ce.width = window.innerWidth; 
        ce.height = window.innerHeight;
        
        var target_ratio = (ce.height * 10.0) / (ce.width * 10.0);
        var nrows = 0;
        var ncols = stage.children.length;

        var row_width = ncols * (card_width + card_padding) + left_pad;
        var col_height = nrows * (card_height + card_padding) + top_pad;

        var prev_target = (nrows * 10.0) / (ncols * 10.0); 
       
/*        do {

        } while ( prev_target < cur_target 
*/
        stage.update();
}
