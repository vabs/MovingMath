
/**
 * Handles interpreting input data as a cursor.
 *
 * @class Cursor
 * @abstract
 * @classdesc
 * The Cursor class represents an interaction device such as a Leap or a Mouse.
 */

var Cursor = exports.Cursor = function() {
  var pointable_id;

  this.leapToCursor = function(frame) {
    if (frame.pointables.length == 0)
      return null;

    var pointable = frame.pointable(pointable_id);
    if (!pointable.valid)
      pointable = frame.pointables[0];
    var normalizedPosition = frame.interactionBox.normalizePoint(pointable.tipPosition, true);

    return normalizedPosition;
  };

  this.mouseToCursor = function(event) {
    window.normalizedX = event.clientX / document.width;
    window.normalizedY = event.clientY / document.height;
  };
  window.onmousemove = mouseToCursor;

};
