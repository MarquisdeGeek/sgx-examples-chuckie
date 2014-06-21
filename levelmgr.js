/*
  levelmgr.js - Mangement of level layouts for Chuckie Egg
  Copyright (C) 2007 Mark Lomas

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

var screenWidth = 160;
var screenHeight = 256;

//
// Array of all levels.
//
var g_levelLayouts = [level1, level2, level3, level4, level5, level6, level7, level8];
var g_levelHens = [level1Hens, level2Hens, level3Hens, level4Hens, level5Hens, level6Hens, level7Hens, level8Hens];
var g_levelFarmers = [level1Farmer, level2Farmer, level3Farmer, level4Farmer, level5Farmer, level6Farmer, level7Farmer, level8Farmer];
var g_levelLifts = [level1Lift, level2Lift, level3Lift, level4Lift, level5Lift, level6Lift, level7Lift, level8Lift];

function LevelManager()
{
	//
	// Define size of playing area.
	//
	this.numXCells = 20;
	this.numYCells = 28;

	//
	// Level dimensions in pixels (excludes the score bar - 32 pixels)
	//
	this.levelXMin = 0;
	this.levelXMax = 160;
	this.levelYMin = 0;
	this.levelYMax = 224;

	this.maxHens = 8;
	this.maxLifts = 5;

	//
	// Cell types
	//
	this.blank = 0;
	this.wall = 1;
	this.grain = 2;
	this.egg = 3;
	this.ladder = 4;
	this.lift = 5;
	this.farmer = 6;
	this.hen = 7;

	this.decodeVal = function(val)
	{
		if(val == 34)
			val = 59;

		if(val == 33)
			val = -1;
		else
			val -= 35;

		return val;
	}

	this.LoadLevels = function()
	{
		if(!g_loadLevels)
			return;

		// Read from cookie.
		var cookieLevels = readCookie("levels");
		if(cookieLevels==null || cookieLevels=="")
		{
			// Populate cookie with the default level layout.
			return;
		}

		var levelData = rleDecode(asciiDecode(cookieLevels));

		// Read from cookie.
		// otherwise use default descriptions
		var offset = 0;
		for(var lev = 0; lev < 8; lev++)
		{
			var layoutData = g_levelLayouts[lev];

			for(var y = 0; y < this.numYCells; ++y)
			{
				for(var x = 0; x < this.numXCells; ++x)
				{
					layoutData[y][x] = levelData[offset];
					offset++;
				}
			}
		}

		var cookieChars = readCookie("chars");
		if(cookieChars==null || cookieChars=="")
			return;

		offset = 0;
		for(var lev = 0; lev < 8; lev++)
		{
			var henData = g_levelHens[lev];
			var liftData = g_levelLifts[lev];
			var farmerData = g_levelFarmers[lev];

			farmerData[0] = this.decodeVal(cookieChars.charCodeAt(offset));
			farmerData[1] = this.decodeVal(cookieChars.charCodeAt(offset+1));
			offset+=2;

			for(var i = 0; i < this.maxHens; i++)
			{
				henData[i][0] = this.decodeVal(cookieChars.charCodeAt(offset));
				henData[i][1] = this.decodeVal(cookieChars.charCodeAt(offset+1));
				offset+=2;
			}

			for(var i = 0; i < this.maxLifts; i++)
			{
				liftData[i] = this.decodeVal(cookieChars.charCodeAt(offset));
				offset++;
			}
		}
	}
} // end of levemgr

