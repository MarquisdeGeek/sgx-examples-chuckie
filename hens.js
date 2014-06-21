/*
  hens.js - Implements hen behaviour for Chuckie Egg
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
// Hen finite state automaton
//
function Hens(levmgr)
{	
	this.texture = sgx.graphics.TextureManager.get().load("images/hen");
	this.cachedLevMgr = levmgr;

	//
	// Size of hen image (48x20)
	// The hens are three MODE 2 characters wide (16x3=48)
	// The height is arbitrary and keeps the image size to a minimum
	//
	// Except for when eating, the image actually only uses 8 pixels (16 in mode 2)
	//
	this.width = 8; 
	this.height = 20;
	
	//
	// Various hen states.
	//
	this.walkRight = 0;
	this.walkLeft = 1;
	this.climbUp = 2;
	this.climbDown = 3;
	this.eatRight = 4;
	this.eatLeft = 5;

	//
	// Sequences of images for walking animation
	//
	this.walkAnimRight = [1, 2, 1, 2];
	this.walkAnimLeft = [3, 4, 3, 4];
	this.climbAnim = [7, 8, 7, 8];
	this.eatAnimLeft = [9, 10, 9]; 
	this.eatAnimRight = [5, 6, 5]; 

	this.maxHens = 8;
	this.numHensDefined = 0;
	this.intialHenPositions = 0;
		
	//
	// Random number generator for hen movement decisions
	//
	this.genRandNum = Math.random;
	
	//
	// Per hen shate.
	//
	this.henXPosition = new Array;
	this.henYPosition = new Array;
	this.henState = new Array;
	this.henCollRects = new Array;
	this.animSequence = new Array;	// Current animation keyframe for each hen.

	//
	// Resolve names of bird images and cache style objects to improve performance.
	//
	if (g_bIncludeDHTML) {
		this.domImgCache = new Array;
		this.domCache = new Array;
		for(var i = 0; i < this.maxHens; ++i)
		{
			this.domImgCache[i] = document.getElementById("hen" + i.toString());
			this.domCache[i] = this.domImgCache[i].style;
		}
	}

	this.GetHenRect = function(hen)
	{
		return this.henCollRects[hen];		
	}
	
	this.IsHenDefined = function(hen)
	{
		return (this.initialHenPositions[hen][0] != -1); // -1 is used to indicate a missing hen
	}

	this.GetNumDefinedHens = function()
	{
		return this.numHensDefined;
	}

	this.GetHenStartX = function(hen)
	{
		return (this.initialHenPositions[hen][0]<<3);
	}

	this.GetHenStartY = function(hen)
	{
		return (this.initialHenPositions[hen][1]<<3);
	}

	this.Reset = function(henPositions, numHensRequired)
	{
		var cacheHenImg = this.domCache;
		var cacheLevel = level;
		var cacheLayout = cacheLevel.layout; // cache level layout

		this.initialHenPositions = henPositions;
		this.animFrame = 0;
		this.seed = 0;
		
		//
		// Position hens according to current level and initialise state
		//
		var c = 0;
		for(var i = 0; i < numHensRequired; ++i)
		{
			if(!this.IsHenDefined(i))
				continue;
				
			this.henXPosition[c] = this.GetHenStartX(i); // Left of cell 
			this.henYPosition[c] = this.GetHenStartY(i); // Top of the cell above the platform

			var xCell = (this.henXPosition[c]>>3); 
			var yCell = ((this.henYPosition[c]+4)>>3);
			var south = cacheLayout[yCell+1][xCell];
			var north2 = cacheLayout[yCell-2][xCell];
			var canClimbUp = (north2 == this.cachedLevMgr.ladder);
			var canClimbDown = (south == this.cachedLevMgr.ladder);

			// If starting on a ladder, initialise state to climbing.
			if(canClimbUp && canClimbDown)
				this.henState[c] = (this.genRandNum() >= 0.5) ? this.climbDown : this.climbUp;
			else if(canClimbUp)
				this.henState[c] = this.climbUp;
			else if(canClimbDown)
				this.henState[c] = this.climbDown;
			else
				this.henState[c] = this.walkRight;

			this.henCollRects[c] = new Rect(this.henYPosition[c] + 8 - 4 - this.height + 4, 
			                                this.henXPosition[c] + 2 + this.width - 2, 
			                                this.henYPosition[c] + 8 - 4, // move one cell down.
			                                this.henXPosition[c] + 2); // top, right, bottom, left
			if (g_bIncludeDHTML) {
				cacheHenImg[c].left = (this.henXPosition[c]-8)<<1;
				cacheHenImg[c].top = this.henYPosition[c] - this.height + 8;
				cacheHenImg[c].clip = "rect(0,48,20,0)";   // top right bottom left
				cacheHenImg[c].visibility = "visible";
			}
			++c;
		}
		
		this.numHensDefined = c;	
		
		//
		// Make remaining hens invisible
		//
		if (g_bIncludeDHTML) {
			for(var i = c; i < this.maxHens; ++i)
				cacheHenImg[i].visibility = "hidden";
				
			cacheLayout = null;
			cacheLevel = null;
			cacheHenImg = null;
		}
	}
	
	this.DoLadderDismount = function(state, southWest, southEast)
	{
		// Always dismount, but favour dismounting to left or right based on random choice.
		var cacheWall = this.cachedLevMgr.wall;
		var canWalkLeft = (southWest == cacheWall);
		var canWalkRight = (southEast == cacheWall);
	    
		if(canWalkLeft && canWalkRight)
			return (this.genRandNum() >= 0.5) ? this.walkLeft : this.walkRight;
		else if(canWalkLeft)
			return this.walkLeft;
		else if(canWalkRight)
			return this.walkRight;	    
            
		return state;
	}
	
	this.DoLadderMount = function(state, north, south)
	{
		if(this.genRandNum() >= 0.5) // choose to climb or not
		{
		    var cacheLadder = this.cachedLevMgr.ladder;
		    var canClimbUp = (north == cacheLadder);
		    var canClimbDown = (south == cacheLadder);
		    
			if(canClimbUp && canClimbDown)
			    state = (this.genRandNum() >= 0.5) ? this.climbDown : this.climbUp;
			else if(canClimbUp)
			    state = this.climbUp;
			else if(canClimbDown)
			    state = this.climbDown;
		}
		
		return state;
    	}	
    
    	this.UpdateHenState = function(state, xPos, yPos)
    	{
		var cacheLevel = level;
		var cacheLayout = cacheLevel.layout; // cache level layout name
		var cacheWall = this.cachedLevMgr.wall;
		var cacheLadder = this.cachedLevMgr.ladder;
		var cacheGrain = this.cachedLevMgr.grain;
    
		//
		// Capture type of surrounding cells.
		//
		var xCell = (xPos>>3); 
		var yCell = ((yPos+4)>>3);
		var southWest = cacheLayout[yCell+1][xCell-1];
		var southEast = cacheLayout[yCell+1][xCell+1];
		var east = cacheLayout[yCell][xCell+1];
		var west = cacheLayout[yCell][xCell-1];
		var south = cacheLayout[yCell+1][xCell];
		var north = cacheLayout[yCell-1][xCell];
		var north2 = cacheLayout[yCell-2][xCell];
		

		if(state == this.walkRight || state == this.walkLeft)
		{		
			// Collide against edge of the screen
			if(xPos <= this.cachedLevMgr.levelXMin)
				state = this.walkRight;
			if(xPos >= (this.cachedLevMgr.levelXMax-this.width))
				state = this.walkLeft;
		}

		switch(state)
		{
			case this.walkRight:
				if((southEast != cacheWall && southEast != cacheLadder) || east == cacheWall)
					state = this.walkLeft;
				else if(east == cacheGrain)
				{
					state = this.eatRight;
					this.animFrame = 0;
				} 
   				state = this.DoLadderMount(state, north2, south);
				break;

			case this.walkLeft:
				if((southWest != cacheWall && southWest != cacheLadder) || west == cacheWall)
					state = this.walkRight;
				else if(west == cacheGrain)
				{
					state = this.eatLeft;
					this.animFrame = 0;
				} 
				state = this.DoLadderMount(state, north2, south);
				break;

			case this.climbUp:
				// If hen reaches the top or bottom of a ladder.
				if((north2 != cacheLadder))
				    state = this.climbDown;
				state = this.DoLadderDismount(state, southWest, southEast);
				break;
				
			case this.climbDown:
				if(south != cacheLadder)
				    state = this.climbUp;
				state = this.DoLadderDismount(state, southWest, southEast);
				break;
				
			case this.eatLeft:
				if(this.animFrame == 3)
					state = this.walkLeft;
				else if(this.animFrame == 1)
					cacheLevel.ClearCellAt(xCell-1, yCell);
				break;

			case this.eatRight:
				if(this.animFrame == 3)
					state = this.walkRight;
				else if(this.animFrame == 1)
					cacheLevel.ClearCellAt(xCell+1, yCell);
				break;
		};

	
		cacheLevel = cacheLayout = null;
			
		return state;			
    	}	
    
	this.Update = function()
	{
		var cacheXPos = this.henXPosition;
		var cacheYPos = this.henYPosition;
		var cacheHenState = this.henState;
		var cacheHenImg = this.domCache;

		++this.animFrame;

		var numHens = this.numHensDefined;
		for(var i = 0; i < numHens; ++i)
		{
		        // Only update hen directions for hens that are positioned centrally on a grid cell.
			if((cacheXPos[i] % 8) == 0) 
			    cacheHenState[i] = this.UpdateHenState(cacheHenState[i], cacheXPos[i], cacheYPos[i]);
			
			var cacheCollRect = this.henCollRects[i];
			switch(cacheHenState[i])
			{
				case this.walkRight:
					cacheXPos[i] += 4;
					cacheCollRect.left += 4;
					cacheCollRect.right += 4;
					this.animFrame %= 4;
					this.animSequence[i] = this.walkAnimRight[this.animFrame];
					break;
				case this.walkLeft:
					cacheXPos[i] -= 4;
					cacheCollRect.left -= 4;
					cacheCollRect.right -= 4;
					this.animFrame %= 4;
					this.animSequence[i] = this.walkAnimLeft[this.animFrame];
					break;
				case this.climbUp:
					cacheYPos[i] -= 8;
					cacheCollRect.top -= 8;
					cacheCollRect.bottom -= 8;
					this.animFrame %= 4;
					this.animSequence[i] = this.climbAnim[this.animFrame];
					break;
				case this.climbDown:
					cacheYPos[i] += 8;
					cacheCollRect.top += 8;
					cacheCollRect.bottom += 8;
					this.animFrame %= 4;
					this.animSequence[i] = this.climbAnim[this.animFrame];
					break;
				case this.eatLeft:
					this.animSequence[i] = this.eatAnimLeft[this.animFrame];					
					break;
				case this.eatRight:
					this.animSequence[i] = this.eatAnimRight[this.animFrame];					
					break;
			};

			//
			// Update image position
			//
			if (g_bIncludeDHTML) {
				var cacheHenImgStyle = cacheHenImg[i];
				var cacheAnimSeq = this.animSequence[i];
				var topOffset = ((cacheAnimSeq-1)*this.height);
				cacheHenImgStyle.left = ((cacheXPos[i]-8)<<1); // Image is padded for purpose of eat animation (hence the extra 8)
				cacheHenImgStyle.top = cacheYPos[i] - this.height + 8  - topOffset -1; // Always 1 pixel off the ground/ladders
				cacheHenImgStyle.clip = "rect(" + topOffset + ",48," + (cacheAnimSeq*this.height) + ",0)";   // top right bottom left			
				
				cacheHenImgStyle = cacheAnimSeq = null;
			}
		}
		cacheXPos = cacheYPos = cacheHenState = cacheHenImg = null;
	}


	this.Draw = function() {
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();

		var numHensRequired = this.GetNumDefinedHens();
			for(var i = 0; i < numHensRequired; ++i)
		{
			if(!this.IsHenDefined(i))
				continue;

			var cacheAnimSeq = this.animSequence[i] - 1;
			var x = (this.henXPosition[i]-8) << 1;
			var y = this.henYPosition[i] - this.height + 8;
			pSurface.setFillTexture(this.texture);

			pSurface.setFillTextureRegion(cacheAnimSeq);
			pSurface.fillPoint(x, y + SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
				/*
			
				cacheHenImg[c].left = (this.henXPosition[c]-8)<<1;
			cacheHenImg[c].top = this.henYPosition[c] - this.height + 8;
		*/
		}
	}
} // end of Hen object

