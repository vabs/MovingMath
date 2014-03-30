function Collection (data) {

  /**
   * The collection ID.
   *
   */
  this.id = data.id;
  
  /**
   * The collection position relative to the canvas it is drawn in.
   *
   * Indicates the upper-left hand corner.
   * In the coordinates of the canvas pixel size.
   *
   * @member position
   * @type {Array}
   */
  this.position = data.position;

  /**
   * The edge length of the boxes.
   *
   * The origin is the upper-left hand corner of the matrix.
   * In units of the canvas the boxes are drawn in (e.g. pixels).
   *
   * @member boxSize
   * @type number
   */
  this.boxSize = 40;//data.boxSize;

  this.height = 1;

  this.width = 1;

  this.selected = false;
  this.closest = false;
  this.temp = false;

  /**
   * The boxes grouped together in this collection.
   *
   * The box's coordinates are integer coordinates in a matrix.
   *
   * @member boxes
   * @type {Array}
   */
  /*if (data.boxes) {
    this.boxes = data.boxes;
  } else {
    this.boxes = [new Box({x: 0, y: 0})];
  }*/

  this.draw = function (context) {
    if (this.closest)
        context.strokeStyle = "#33ccff";
    else
        context.strokeStyle = "#000000";

    if (this.selected) // blue
        context.fillStyle = "#33ccff";
    else //purple
        context.fillStyle = "#CC66FF"
        //context.fillStyle = "#660099"

    if (this.temp)
        //context.fillStyle = "#00ff00";
        context.fillStyle = "rgba(51, 204, 255, .5)"

    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            boxX = this.position[0] + this.boxSize * (i);
            boxY = this.position[1] + this.boxSize * (j);
            context.fillRect(boxX, boxY, this.boxSize, this.boxSize);
            context.strokeRect(boxX, boxY, this.boxSize, this.boxSize);
            context.stroke();
        }
    }

    //  Write the numbers around the collection

    // Value at center
    context.font = "30px Arial";
    var center = this.center();
    var w = context.measureText(this.width * this.height).width;
    //context.fillStyle = "rgba(255, 255, 255, .5)"
    //context.fillStyle = "rgb(255, 0, 0)"
    if (this.temp && (this.width == 0 || this.height == 0))
      return;
    context.fillRect(center[0] - w/2, center[1] - 15, w, 30);
    context.fillStyle = "#000000";
    context.fillText(this.width * this.height, center[0], center[1]);

    // Numbers around edges
    // Works only adjusting temp since temp is drawn last
    context.font = "20px Arial";
    if (! ((this.temp && closestDirection == "bottom") || (this.selected && closestDirection == "top")))
      context.fillText(this.width, center[0], this.top() - 20);
    if (! ((this.temp && closestDirection == "right") || (this.selected && closestDirection == "left")))
      context.fillText(this.height, this.left() - 20, center[1]);
  }

  this.select = function () {
    this.selected = true;
  }
  this.unselect = function () {
    this.selected = false;
  }

  this.left = function () 
  {
      return this.position[0];
  }
  this.right = function () 
  {
      return this.position[0] + this.width*this.boxSize;
  }
  this.top = function () 
  {
      return this.position[1];
  }
  this.bottom = function () 
  {
      return this.position[1] + this.height*this.boxSize;
  }
  this.center = function ()
  { 
      return [(this.left() + this.right()) / 2, (this.top() + this.bottom()) / 2];
  }
}

