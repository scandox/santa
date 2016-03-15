(function(exports) {
  'use strict';

  /* Public API */

  var Santa = function(users) {
    if (!(this instanceof Santa)) {
      return new Santa(users);
    }
    this.users = users;
  };

  Santa.prototype.assign = function() {
    var users = this.users,
        deranged = derange(users);
 
    return users.map(function(user, index) {
	  var recipient = deranged[index];
	  return { giver: user, recipient: recipient };
    });

  };

  exports.Santa = Santa;

  /* Private implementation */

  /* Deranges an array of unique ids

	Takes an array and randomly shuffles the order of elements, such that no
	element in the new array occupies its original position

    Notes:
      *  Doesn't validate that elements in the array are unique. If non-unique
         elements are present then the derangement may appear defective.

  */
  function derange(arr) {
	
	var copyArr = arr.slice(),
		copyLen = copyArr.length,
		// Create an array with a pre-defined length and undefined values
		result = Array.apply(null, new Array(copyLen)).map(function () {}),
		newPosition;

	// If less than 2 elements return same
    if (copyLen < 2) return copyArr;

	// If 2 elements just swap and return
    if (copyLen === 3) {
      copyArr[0] = arr[1];
      copyArr[1] = arr[0];
      return copyArr;
    }

	for (var i=0; i < copyLen; i++) {
		
		/* If on last element and only last space is free then swap first and last
	       Any swap would work, since by definition the last element can be anywhere
		   but in the last position and any other element can be in the last position */
		if (i==copyLen-1 && result[result.length-1] === undefined) {
		  result[result.length-1] = result[0];
		  result[0] = copyArr[i];
		/* Otherwise just pick a random new position for the current element
		   that isn't already occupied */
		}else{  
		  do {
			newPosition = Math.random() * copyLen | 0;
		  } while (newPosition == i || result[newPosition] !== undefined);
		  result[newPosition] = copyArr[i]; 
		}
	}
	return result;
  }

})(this);
