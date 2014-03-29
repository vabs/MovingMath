
var collections = [];

//  Creates a new 1x1 collection at the specified canvas position
function makeCollectionAt(canvasPosition) {
  var col = new Collection({
    position: canvasPosition
  });
  collections.push(col);
}

function rotateCollectionAt(canvasPosition) {
  var c = collectionAt(canvasPosition);
  if (c) {
    var center = [(c.left() + c.right()) / 2, (c.top() + c.bottom()) / 2];
    var xsize = c.right() - center[0];
    var ysize = c.bottom() - center[1];

    //  actually update the collection
    c.position[0] = center[0] - ysize;
    c.position[1] = center[1] - xsize;

    var temp = c.width;
    c.width = c.height;
    c.height = temp;
  }
}

// returns the collection at the given canvas position, if there is one
function collectionAt(position)
{
    closest = null;
    for (i = 0; i < collections.length; i++)
    {
        var c = collections[i];
        var minx = c.position[0];
        var miny = c.position[1];
        var maxx = minx + c.width * c.boxSize;
        var maxy = miny + c.height * c.boxSize;
        //console.log("position " + position[0] + "," + position[1]);
        //console.log("collection: " + minx + "," + miny + " " + maxx + "," + maxy);
        if (position[0] >= minx && position[0] <= maxx &&
                position[1] >= miny && position[1] <= maxy)
            closest = c;
    }
    return closest;
}

var dragging = false;
var closestCollection = null; // closest to the one we're dragging
var closestDirection = null;
var multiplying = false;
var selectedCollection = null;

function moving()
{
    return dragging || multiplying;
}


function startDrag(canvasPosition)
{
    var c = collectionAt(canvasPosition);
    if (c && c != selectedCollection)
    {
        if (selectedCollection)
            selectedCollection.unselect();
        c.select();
        selectedCollection = c;
        dragging = true;
        // move to the end of the list, for drawing purposes
        var i = collections.indexOf(selectedCollection);
        arraySwap(collections, i, collections.length - 1);
        //collections[i] = collections[collections.length - 1];
        //collections[collections.length - 1] = selectedCollection;
    }
}

function updateDrag(position)
{
    var dif = selectedCollection.boxSize / 2;
    selectedCollection.position = [position[0] - dif, position[1] - dif, position[2]];

    var nearest = null;
    var nearestDist = Infinity;
    var nearestDirection = null;
    for (var i = 0; i < collections.length; i++)
    {
        var c = collections[i];
        // left-right
        if (selectedCollection.height == c.height)
        {
            var xdist = Math.abs(selectedCollection.left() - c.right());
            var ydist = Math.abs(selectedCollection.top() - c.top());
            if (xdist < 15 && ydist < 30 && xdist < nearestDist)
            {
                nearest = c;
                nearestDist = xdist;
                nearestDirection = "right";
            }
            var xdist = Math.abs(c.left() - selectedCollection.right());
            if (xdist < 15 && ydist < 30 && xdist < nearestDist)
            {
                nearest = c;
                nearestDist = xdist;
                nearestDirection = "left";
            }
        }
        // top-bottom
        if (selectedCollection.width == c.width)
        {
            var xdist = Math.abs(selectedCollection.left() - c.left());
            var ydist = Math.abs(selectedCollection.bottom() - c.top());
            if (xdist < 30 && ydist < 15 && ydist < nearestDist)
            {
                nearest = c;
                nearestDist = ydist;
                nearestDirection = "top";
            }
            var ydist = Math.abs(c.bottom() - selectedCollection.top());
            if (xdist < 30 && ydist < 15 && ydist < nearestDist)
            {
                nearest = c;
                nearestDist = ydist;
                nearestDirection = "bottom";
            }
            
        }
    }
    if (nearest != closestCollection)
    {
        if (closestCollection)
            closestCollection.closest = false;
        closestCollection = nearest;
        closestDirection = nearestDirection;
        if (closestCollection)
            closestCollection.closest = true;
    } 

}

function stopDrag() {
    selectedCollection.unselect();
    if (closestCollection)
    {
        var a = closestCollection.width * closestCollection.height;
        var b = selectedCollection.width * selectedCollection.height;
        if (closestDirection == "right")
        {
            writeMath(a + " + " + b + " = " + (a+b));
            closestCollection.width += selectedCollection.width;
            closestCollection.closest = false;
            var temp = collections.pop();
            var i = collections.indexOf(selectedCollection);
            collections[i] = temp;
        }
        else if (closestDirection == "left")
        {
            writeMath(b + " + " + a + " = " + (a+b));
            selectedCollection.width += closestCollection.width;
            closestCollection.closest = false;
            var temp = collections.pop();
            var i = collections.indexOf(closestCollection);
            collections[i] = temp;
        }
        if (closestDirection == "bottom")
        {
            writeMath(a + " + " + b + " = " + (a+b));
            closestCollection.height += selectedCollection.height;
            closestCollection.closest = false;
            var temp = collections.pop();
            var i = collections.indexOf(selectedCollection);
            collections[i] = temp;
        }
        else if (closestDirection == "top")
        {
            writeMath(b + " + " + a + " = " + (a+b));
            selectedCollection.height += closestCollection.height;
            closestCollection.closest = false;
            var temp = collections.pop();
            var i = collections.indexOf(closestCollection);
            collections[i] = temp;
        }
        
    }

    dragging = false;
    selectedCollection = null;
    closestCollection = null;
  // Check for merging
}

function startMultiply() {}

function drawCollections(context) {
  for (var i = 0; i < collections.length; i++)
  {
    collections[i].draw(context);
  }
}

function arraySwap (arr, i, j)
{
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
