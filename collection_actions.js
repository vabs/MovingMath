
var collections = [];

//  Creates a new 1x1 collection at the specified canvas position
function makeCollectionAt(canvasPosition) {
  var col = new Collection({
    position: canvasPosition
  });
  collections.push(col);
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
    for (var i = 0; i < collections.length; i++)
    {
        var c = collections[i];
        if (selectedCollection.height == c.height)
        {
            var xdist = selectedCollection.left() - c.right();
            var ydist = Math.abs(selectedCollection.top() - c.top());
            if (xdist > -10 && xdist < 15 && ydist < 30)
            {
                nearest = c;
                nearestDist = xdist;
                break;
            }
        }
    }
    if (nearest != closestCollection)
    {
        if (closestCollection)
            closestCollection.closest = false;
        closestCollection = nearest;
        if (closestCollection)
            closestCollection.closest = true;
    } 

}

function stopDrag() {
    selectedCollection.unselect();
    if (closestCollection)
    {
        closestCollection.width += selectedCollection.width;
        closestCollection.closest = false;
        var temp = collections.pop();
        var i = collections.indexOf(selectedCollection);
        collections[i] = temp;
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
