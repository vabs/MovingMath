
var collections = [];

//  Creates a new 1x1 collection at the specified canvas position
function makeCollectionAt(canvasPosition) {
  var col = new Collection({
    position: canvasPosition
  });
  collections.push(col);
  return col;
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
var tempCollection = null;

function moving()
{
    return dragging || multiplying;
}


function startDrag(canvasPosition)
{
    if (multiplying)
        return;
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
    console.log("updating..." + dragging + "  " + multiplying);
    if (dragging)
        updateAddition(position);
    else if (multiplying)
        updateMultiplication(position);
}

function updateAddition(position)
{
    console.log("in addition :(((");
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

function stopDrag() 
{
    if (dragging)
        endAddition();
    else if (multiplying)
        endMultiplication();
}

function endAddition()
{
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
            var b = closestCollection.width;
            var a = selectedCollection.width;
            writeMath(a + " + " + b + " = " + (a+b));
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

function startMultiply(position)
{
    if (dragging)
        return;
    console.log("starting to multiply");
    var c = collectionAt(position);
    if (c && c != selectedCollection)
    {
        console.log("and actually chose a collection!");
        if (selectedCollection)
            selectedCollection.unselect();
        c.select();
        console.log(c);
        multiplying = true;
        selectedCollection = c;
        // move to the end of the list, for drawing purposes
        var i = collections.indexOf(selectedCollection);
        arraySwap(collections, i, collections.length - 1);


        tempCollection = makeCollectionAt(selectedCollection.position.slice(0));
        tempCollection.height = 0;
        tempCollection.width = 0;
        tempCollection.temp = true;
    }
}


function updateMultiplication(position)
{
    console.log("updating multipliction");
    console.log(multiplying);
    var left = selectedCollection.left() - position[0];
    var right = position[0] - selectedCollection.right();
    var top = selectedCollection.top() - position[1];
    var bottom = position[1] - selectedCollection.bottom();

    console.log(left + " " + right + " " + top + " " + bottom);

    if (right > 0 && right > top && right > bottom)
    {
        console.log("to the right!");
        closestDirection = "right";
        tempCollection.position = selectedCollection.position.slice(0);
        tempCollection.position[0] = selectedCollection.right();
        tempCollection.height = selectedCollection.height;
        tempCollection.width = 2;
    }
    else if (left > 0 && left > top && left > bottom)
    {
        closestDirection = "left";
        console.log("to the left!");    
        tempCollection.position = selectedCollection.position.slice(0);
        tempCollection.position[0] -= 80;
        tempCollection.height = selectedCollection.height;
        tempCollection.width = 2;
    }
    else if (top > 0 && top > right && top > left)
    {
        console.log("to the top!");
        closestDirection = "top";
        tempCollection.position = selectedCollection.position.slice(0);
        tempCollection.position[1] -= 80;
        tempCollection.width = selectedCollection.width;
        tempCollection.height = 2;
    }
    else if (bottom > 0 && bottom > right && bottom > left)
    {
        console.log("to the bottom!");    
        closestDirection = "bottom";
        tempCollection.position = selectedCollection.position.slice(0);
        tempCollection.position[1] = selectedCollection.bottom();
        tempCollection.width = selectedCollection.width;
        tempCollection.height = 2;
    }
}

function endMultiplication()
{
    multiplying = false;
    selectedCollection.unselect();
    t = collections.indexOf(tempCollection);
    collections[t] = collections[collections.length - 1];
    collections.pop();
    if (closestDirection == "right")
        selectedCollection.width += tempCollection.width;
    else if (closestDirection == "bottom")
        selectedCollection.height += tempCollection.height;
    else if (closestDirection == "left")
    {
        selectedCollection.width += tempCollection.width;
        selectedCollection.position[0] = tempCollection.position[0];
    }
    else if (closestDirection == "top")
    {
        selectedCollection.height += tempCollection.height;
        selectedCollection.position[1] = tempCollection.position[1];
    }

    tempCollection = null;
    selectedCollection = null;
}

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
