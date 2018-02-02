/* eslint-disable */
var maze_locale = {lc:{"ar":function(n){
  if (n === 0) {
    return 'zero';
  }
  if (n == 1) {
    return 'one';
  }
  if (n == 2) {
    return 'two';
  }
  if ((n % 100) >= 3 && (n % 100) <= 10 && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 100) >= 11 && (n % 100) <= 99 && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"en":function(n){return n===1?"one":"other"},"bg":function(n){return n===1?"one":"other"},"bn":function(n){return n===1?"one":"other"},"ca":function(n){return n===1?"one":"other"},"cs":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n == 2 || n == 3 || n == 4) {
    return 'few';
  }
  return 'other';
},"da":function(n){return n===1?"one":"other"},"de":function(n){return n===1?"one":"other"},"el":function(n){return n===1?"one":"other"},"es":function(n){return n===1?"one":"other"},"et":function(n){return n===1?"one":"other"},"eu":function(n){return n===1?"one":"other"},"fa":function(n){return "other"},"fi":function(n){return n===1?"one":"other"},"fil":function(n){return n===0||n==1?"one":"other"},"fr":function(n){return Math.floor(n)===0||Math.floor(n)==1?"one":"other"},"ga":function(n){return n==1?"one":(n==2?"two":"other")},"gl":function(n){return n===1?"one":"other"},"he":function(n){return n===1?"one":"other"},"hi":function(n){return n===0||n==1?"one":"other"},"hr":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"hu":function(n){return "other"},"id":function(n){return "other"},"is":function(n){
    return ((n%10) === 1 && (n%100) !== 11) ? 'one' : 'other';
  },"it":function(n){return n===1?"one":"other"},"ja":function(n){return "other"},"ko":function(n){return "other"},"lt":function(n){
  if ((n % 10) == 1 && ((n % 100) < 11 || (n % 100) > 19)) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 9 &&
      ((n % 100) < 11 || (n % 100) > 19) && n == Math.floor(n)) {
    return 'few';
  }
  return 'other';
},"lv":function(n){
  if (n === 0) {
    return 'zero';
  }
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  return 'other';
},"mk":function(n){return (n%10)==1&&n!=11?"one":"other"},"mr":function(n){return n===1?"one":"other"},"ms":function(n){return "other"},"mt":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n === 0 || ((n % 100) >= 2 && (n % 100) <= 4 && n == Math.floor(n))) {
    return 'few';
  }
  if ((n % 100) >= 11 && (n % 100) <= 19 && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"nl":function(n){return n===1?"one":"other"},"no":function(n){return n===1?"one":"other"},"pl":function(n){
  if (n == 1) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || n != 1 && (n % 10) == 1 ||
      ((n % 10) >= 5 && (n % 10) <= 9 || (n % 100) >= 12 && (n % 100) <= 14) &&
      n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"pt":function(n){return n===1?"one":"other"},"ro":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n === 0 || n != 1 && (n % 100) >= 1 &&
      (n % 100) <= 19 && n == Math.floor(n)) {
    return 'few';
  }
  return 'other';
},"ru":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"sk":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n == 2 || n == 3 || n == 4) {
    return 'few';
  }
  return 'other';
},"sl":function(n){
  if ((n % 100) == 1) {
    return 'one';
  }
  if ((n % 100) == 2) {
    return 'two';
  }
  if ((n % 100) == 3 || (n % 100) == 4) {
    return 'few';
  }
  return 'other';
},"sq":function(n){return n===1?"one":"other"},"sr":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"sv":function(n){return n===1?"one":"other"},"ta":function(n){return n===1?"one":"other"},"te":function(n){return n===1?"one":"other"},"th":function(n){return "other"},"tr":function(n){return n===1?"one":"other"},"uk":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"ur":function(n){return n===1?"one":"other"},"vi":function(n){return "other"},"zh":function(n){return "other"}},
c:function(d,k){if(!d)throw new Error("MessageFormat: Data required for '"+k+"'.")},
n:function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: '"+k+"' isn't a number.");return d[k]-(o||0)},
v:function(d,k){maze_locale.c(d,k);return d[k]},
p:function(d,k,o,l,p){maze_locale.c(d,k);return d[k] in p?p[d[k]]:(k=maze_locale.lc[l](d[k]-o),k in p?p[k]:p.other)},
s:function(d,k,p){maze_locale.c(d,k);return d[k] in p?p[d[k]]:p.other}};
(window.blockly = window.blockly || {}).maze_locale = {
"at":function(d){return "at"},
"atFlower":function(d){return "at flower"},
"atHoneycomb":function(d){return "at honeycomb"},
"avoidCowAndRemove":function(d){return "avoid the cow and remove 1"},
"collect":function(d){return "collect"},
"collectiblePresent":function(d){return "there is some treasure"},
"collectorCollectTooltip":function(d){return "Collect an item"},
"collectorCollectedEverything":function(d){return "Congratulations! You collected "+maze_locale.p(d,"count",0,"en",{"one":"the item","other":"all "+maze_locale.n(d,"count")+" items"})+"!"},
"collectorCollectedNothing":function(d){return "Keep coding! You need to collect as many of the items as you can."},
"collectorCollectedSome":function(d){return "Great work! You collected "+maze_locale.p(d,"count",0,"en",{"one":"1 item","other":maze_locale.n(d,"count")+" items"})+"!"},
"collectorCollectedNotEnough":function(d){return "Keep coding! You need to collect at least "+maze_locale.p(d,"goal",0,"en",{"one":"1 item","other":maze_locale.n(d,"goal")+" items"})+"."},
"collectorCollectedTooMany":function(d){return "That space doesn't have enough items for me to collect."},
"collectorTooManyBlocks":function(d){return "You can only use "+maze_locale.v(d,"blockLimit")+" blocks. Take a look at your code and try again!"},
"continue":function(d){return "Continue"},
"corn":function(d){return "corn"},
"cornTooltip":function(d){return "Harvest some corn"},
"didNotCollectAllCrops":function(d){return "Make sure you don't leave any crops behind!"},
"didNotCollectEverything":function(d){return "Make sure you don't leave any nectar or honey behind!"},
"didNotPlantEverywhere":function(d){return "Make sure you plant something in every soil patch!"},
"dig":function(d){return "remove 1"},
"digTooltip":function(d){return "remove 1 unit of dirt"},
"dirE":function(d){return "E"},
"dirN":function(d){return "N"},
"dirS":function(d){return "S"},
"dirW":function(d){return "W"},
"doCode":function(d){return "do"},
"elseCode":function(d){return "else"},
"emptyCropError":function(d){return "That crop is all gone."},
"fill":function(d){return "fill 1"},
"fillN":function(d){return "fill "+maze_locale.v(d,"shovelfuls")},
"fillSquare":function(d){return "fill square"},
"fillStack":function(d){return "fill stack of "+maze_locale.v(d,"shovelfuls")+" holes"},
"fillTooltip":function(d){return "place 1 unit of dirt"},
"finalLevel":function(d){return "Congratulations! You have solved the final puzzle."},
"flowerEmptyError":function(d){return "The flower you're on has no more nectar."},
"get":function(d){return "get"},
"goal":function(d){return "goal"},
"has":function(d){return "has"},
"haslettuce":function(d){return "there is lettuce"},
"hascorn":function(d){return "there is corn"},
"haspumpkin":function(d){return "there are pumpkins"},
"heightParameter":function(d){return "height"},
"holePresent":function(d){return "there is a hole"},
"honey":function(d){return "make honey"},
"honeyAvailable":function(d){return "honey"},
"honeyTooltip":function(d){return "Make honey from nectar"},
"honeycombFullError":function(d){return "This honeycomb does not have room for more honey."},
"ifCode":function(d){return "if"},
"ifFlowerTooltip":function(d){return "If there is a flower/honeycomb in the specified direction, then do some actions."},
"ifInRepeatError":function(d){return "You need an \"if\" block inside a \"repeat\" block. If you're having trouble, try the previous level again to see how it worked."},
"ifOnlyFlowerTooltip":function(d){return "If there is a flower in the specified direction, then do some actions."},
"ifPathAhead":function(d){return "if path ahead"},
"ifTooltip":function(d){return "If there is a path in the specified direction, then do some actions."},
"ifelseFlowerTooltip":function(d){return "If there is a flower/honeycomb in the specified direction, then do the first block of actions. Otherwise, do the second block of actions."},
"ifelseTooltip":function(d){return "If there is a path in the specified direction, then do the first block of actions. Otherwise, do the second block of actions."},
"insufficientHoney":function(d){return "You need to make the right amount of honey."},
"insufficientNectar":function(d){return "You need to collect the right amount of nectar."},
"lettuce":function(d){return "lettuce"},
"lettuceTooltip":function(d){return "Harvest some lettuce"},
"make":function(d){return "make"},
"moveBackward":function(d){return "move backward"},
"moveEastTooltip":function(d){return "Move me east one space."},
"moveForward":function(d){return "move forward"},
"moveForwardTooltip":function(d){return "Move me forward one space."},
"moveNorthTooltip":function(d){return "Move me north one space."},
"moveSouthTooltip":function(d){return "Move me south one space."},
"moveTooltip":function(d){return "Move me forward/backward one space"},
"moveWestTooltip":function(d){return "Move me west one space."},
"nectar":function(d){return "get nectar"},
"nectarRemaining":function(d){return "nectar"},
"nectarTooltip":function(d){return "Get nectar from a flower"},
"nextLevel":function(d){return "Congratulations! You have completed this puzzle."},
"no":function(d){return "No"},
"noPathAhead":function(d){return "path is blocked"},
"noPathLeft":function(d){return "no path to the left"},
"noPathRight":function(d){return "no path to the right"},
"notAtFlowerError":function(d){return "You can only get nectar from a flower."},
"notAtHoneycombError":function(d){return "You can only make honey at a honeycomb."},
"numBlocksNeeded":function(d){return "This puzzle can be solved with %1 blocks."},
"pathAhead":function(d){return "path ahead"},
"pathLeft":function(d){return "if path to the left"},
"pathRight":function(d){return "if path to the right"},
"pick":function(d){return "pick"},
"pilePresent":function(d){return "there is a pile"},
"plant":function(d){return "plant"},
"plantInNonSoilError":function(d){return "I can only plant something in fresh soil."},
"plantTooltip":function(d){return "Plant a sprout"},
"pumpkin":function(d){return "pumpkin"},
"pumpkinTooltip":function(d){return "Harvest a pumpkin"},
"putdownTower":function(d){return "put down tower"},
"removeAndAvoidTheCow":function(d){return "remove 1 and avoid the cow"},
"removeN":function(d){return "remove "+maze_locale.v(d,"shovelfuls")},
"removePile":function(d){return "remove pile"},
"removeSquare":function(d){return "remove square"},
"removeStack":function(d){return "remove stack of "+maze_locale.v(d,"shovelfuls")+" piles"},
"repeatCarefullyError":function(d){return "To solve this, think carefully about the pattern of two moves and one turn to put in the \"repeat\" block.  It's okay to have an extra turn at the end."},
"repeatUntil":function(d){return "repeat until"},
"repeatUntilBlocked":function(d){return "while path ahead"},
"repeatUntilFinish":function(d){return "repeat until finish"},
"soil":function(d){return "soil"},
"sprout":function(d){return "sprout"},
"step":function(d){return "Step"},
"totalHoney":function(d){return "total honey"},
"totalNectar":function(d){return "total nectar"},
"turnLeft":function(d){return "turn left"},
"turnRight":function(d){return "turn right"},
"turnTooltip":function(d){return "Turns me left or right by 90 degrees."},
"uncheckedCloudError":function(d){return "Make sure to check all clouds to see if they're flowers or honeycombs."},
"uncheckedPurpleError":function(d){return "Make sure to check all purple flowers to see if they have nectar"},
"whileMsg":function(d){return "while"},
"whileTooltip":function(d){return "Repeat the enclosed actions until finish point is reached."},
"word":function(d){return "Find the word"},
"wrongCropError":function(d){return "I can't harvest that crop from here."},
"yes":function(d){return "Yes"},
"youSpelled":function(d){return "You spelled"}};