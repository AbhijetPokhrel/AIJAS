let View = {}


View.TRANSLATE_X = 1;
View.TRANSLATE_Y = 2;
View.ROTATE = 3;
View.ALPHA = 4;
View.SCALE = 5;


class Animation {

}

var ACTIVE_ANIMATION = {};//this variable stores the currently being played animation
Animation.INFINIT = -1;


module.exports = {
    View, Animation, ACTIVE_ANIMATION
}
