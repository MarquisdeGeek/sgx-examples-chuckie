/*
  levelstate.js - Level state management for Chuckie Egg
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

//
// Manages the visible state of a level.
//
function LevelState(levmgr)
{
	this.cachedLevMgr = levmgr;
	this.textureList = new Array();

	// Array of images to load for the level
	this.imageFiles = [ "blank", "wall", "grain", "egg", "ladder" ];

	// No currently loaded level yet.
	this.layout = null;
	
	// Load graphics
	this.imageCache = new Array;
	for(var i = 0; i < this.imageFiles.length; ++i) 
	{ 
		this.imageCache[i] = new Image; 
		this.imageCache[i].src = "images/" + this.imageFiles[i] + ".gif"; 
		this.textureList[i] = sgx.graphics.TextureManager.get().load("images/" + this.imageFiles[i]);
	} 

	// Initialise cells for level layout.
	this.levelStyleCache = new Array;
	for(var y = 0; y < this.cachedLevMgr.numYCells; ++y)
	{
		this.levelStyleCache[y] = new Array;
		for(var x = 0; x < this.cachedLevMgr.numXCells; ++x)
			this.levelStyleCache[y][x] = null;
	}
	
	this.ClearLevel = function()
	{
		var topLevelDiv = document.getElementById("maindiv");
		var levDiv = document.getElementById("levelDiv");
		if(levDiv != null)
			topLevelDiv.removeChild(levDiv);
	}
	
	this.Reset = function(layoutState)
	{
		// Does not do an array copy, just makes a reference to the player's level layout.
		this.layout = layoutState;
	    
		// Clear the existing layout.
		this.ClearLevel();
	    
		//
		// Set positions of the eggs and grain for the current player.
		// 
		var topLevelDiv = document.getElementById("maindiv");
		var levDiv = document.createElement("DIV");
		levDiv.id = "levelDiv";
		levDiv.style.position = "absolute";
		levDiv.style.width = this.cachedLevMgr.levelXMax<<1;
		levDiv.style.height = this.cachedLevMgr.levelYMax;
		levDiv.style.backgroundColor = "#000000";
		topLevelDiv.appendChild(levDiv);
		
		for(var y = 0; y < this.cachedLevMgr.numYCells; ++y)
		{
			var row = this.levelStyleCache[y];
			var imageRow = layoutState[y];
			for(var x = 0; x < this.cachedLevMgr.numXCells; ++x)
			{
				if(imageRow[x] == this.cachedLevMgr.blank)
					continue;
			    
				var newElem = document.createElement("IMG");
				newElem.src = this.imageCache[imageRow[x]].src;
				newElem.style.position = "absolute";
				newElem.style.left = x<<4;
				newElem.style.top = y<<3;
				
				if (g_bIncludeDHTML) {
					newElem.style.visibility = "hidden";
					levDiv.appendChild(newElem);
				}
				
				row[x] = newElem.style;
			}
		}
	}
	
	// Used to erase an egg or grain when collected by the farmer
	this.ClearCellAt = function(x, y)
	{
		this.layout[y][x] = 0;
		this.levelStyleCache[y][x].visibility = "hidden";
	}

	this.Draw = function() {
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();

		for(var y = 0; y < this.cachedLevMgr.numYCells; ++y)
		{
			var row = this.levelStyleCache[y];
			var imageRow = this.layout[y];
			for(var x = 0; x < this.cachedLevMgr.numXCells; ++x)
			{
				if(imageRow[x] == this.cachedLevMgr.blank)
					continue;
					
				var tile = imageRow[x];
				pSurface.setFillTexture(this.textureList[tile]);
				pSurface.setFillTextureRegion(0);
				pSurface.fillPoint(x<<4, (y<<3) + SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
				
			}
		}

	}
	
} // end of Level object

