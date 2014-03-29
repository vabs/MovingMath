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

  this.height = 2;

  this.width = 2;

  this.selected = false;
  this.closest = false;

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
    {
        //context.strokeStyle = "#33ccff";
        context.strokeStyle = "#33ccff";
    }
    else
    {
        context.strokeStyle = "#000000";
    }

    if (this.selected)
    {
        context.fillStyle = "#33ccff";
    }
    else
    {
        context.fillStyle = "#660099"
    }
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
      return this.position + this.height*this.boxSize;
  }
}

