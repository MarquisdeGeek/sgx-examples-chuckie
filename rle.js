/*
  rlejs.js - Javascript implementation of RLE encode/decode 
                    combining ASCII encoding for Chuckie Egg levels.
  Copyright (C) 2009 Mark Lomas

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// RLE decompression reference implementation
function rleDecode(data)
{
	var result = new Array;
	if(data.length == 0)
		return result;

	if((data.length % 2) != 0)
	{
		alert("Invalid RLE data");
		return;
	}

	for(var i = 0; i < data.length; i+=2)
	{
		var val = data[i];
		var count = data[i+1];
		for(var c = 0; c < count; c++)
			result[result.length] = val;
	}
	return result;
}


function asciiDecode(str)
{
	var result = new Array;
	for(var i = 0; i < str.length; ++i)
	{
		var asciiCode = str.charCodeAt(i);

		// Special case handling for semi-colons.
		if(asciiCode == 35)
			asciiCode = 59;

		if(asciiCode > 35)
		{
			// It is a blank, wall or grain cell.
			var rleValue = Math.floor((asciiCode - 36) / 30);
			var rleSequenceLength = ((asciiCode - 36) % 30) + 1;
		}
		else
		{
			// It is a 'one-off' cell such as egg, ladder, lift etc.
			var rleValue = (asciiCode - 33) + 3;
			var rleSequenceLength = 1;
		}
		result[i*2] = rleValue;	
		result[i*2 + 1] = rleSequenceLength;
	}
	return result;
}

