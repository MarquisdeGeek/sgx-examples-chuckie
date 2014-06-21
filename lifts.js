/*
  lifts.js - Lift system for Chuckie Egg
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
// Lift functionality
//
function Lifts(levmgr)
{
	this.textureLift = sgx.graphics.TextureManager.get().load("images/lift");
	this.cachedLevMgr = levmgr;

	this.width = 10; // 20 pixels in mode 2
	this.height = 4;

	if (g_bIncludeDHTML) {
		this.cacheLiftStyle = new Array;
	}
	this.initialLiftPositions = new Array;
	this.liftStartPosY = new Array;
	this.liftPosX = new Array;
	this.liftPosY = new Array;
	this.liftTopPos = new Array;
	this.maxLiftOffset = this.cachedLevMgr.levelYMax;
	this.levelHasLifts = 0;
	this.numLifts = 0;

	// Construct lift image elements.
	for(var i = 0; i < (this.cachedLevMgr.maxLifts*2); ++i)
	{
		if (g_bIncludeDHTML) {
			this.cacheLiftStyle[i] = document.getElementById("lift"+i.toString()).style;
		}
		this.liftStartPosY[i] = this.cachedLevMgr.levelYMax - this.height;
		this.liftStartPosY[i] -= (i%2) ? -80 : 0;
	}


	this.Reset = function(liftPositions)
	{
		this.initialLiftPositions.length = 0;
		for(var i = 0; i < liftPositions.length; i++)
		{
			if(liftPositions[i] != -1)
				this.initialLiftPositions[this.initialLiftPositions.length] = liftPositions[i];
		}

		// Always two lifts stack on top of each other
		this.numLifts = (this.initialLiftPositions.length * 2);

		for(var i = 0; i < this.numLifts; ++i)
		{
					
			// Lift is 10 pixels wide, It should span a gap which is 16 pixels wide, so we
			// want a 3 pixel offset at each side.
			var liftOffset = (this.initialLiftPositions[i>>1]<<3) + 3; // compute offset in pixels
			this.liftPosX[i] = (liftOffset<<1);	// SGX needs this
			this.liftPosY[i] = this.liftStartPosY[i];
			
			if (g_bIncludeDHTML) {
				this.cacheLiftStyle[i].top = this.liftStartPosY[i];
				this.cacheLiftStyle[i].left = (liftOffset<<1); // Mode 2 is twice as wide.
				this.cacheLiftStyle[i].visibility = "visible";
				this.cacheLiftStyle[i].clip = "rect(" + this.liftPosY[i] + "," + (this.width<<1) + "," + this.height + ",0)"; // (top, right, bottom, left)
			}
		}

		if (g_bIncludeDHTML) {
			for(var i = this.numLifts; i < (this.cachedLevMgr.maxLifts*2); i++)
				this.cacheLiftStyle[i].visibility = "hidden";
		}
	}


	this.Update = function()
	{
		if(!this.numLifts)
			return;

		var topClip = 0;
		var bottomClip = this.height;
		var liftbottomPos = 0;
		for(var i = 0; i < this.numLifts; ++i)
		{
			--this.liftPosY[i];
			if(this.liftPosY[i] < 0)
				this.liftPosY[i] = this.maxLiftOffset;
				
			var yPos = this.liftPosY[i];
			liftBottomPos = yPos + this.height;

			// Clip the lift at the top/bottom of the screen (may be unnecessary depending on lift speed)
			topClip = (yPos < 0) ? 0 : -yPos;

			bottomClip = this.height;
			if(liftBottomPos > this.maxLiftOffset)
				bottomClip -= (liftBottomPos - this.maxLiftOffset);

			if (g_bIncludeDHTML) {
				var cacheStyle = this.cacheLiftStyle[i];
				cacheStyle.top = yPos;
				cacheStyle.clip = "rect(" + topClip + "," + (this.width<<1) + "," + bottomClip + ",0)"; // (top, right, bottom, left)
				cacheStyle = null;
			}
		}
	}
	
	this.Draw = function() {
	var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();
	var yPos,
		liftBottomPos;
	
		pSurface.setFillTexture(this.textureLift);
		
		for(var i = 0; i < this.numLifts; ++i)
		{
			pSurface.fillPoint(this.liftPosX[i], this.liftPosY[i] + SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
		}
	}
	
	this.RayLiftCollision = function(actualX, actualY)
	{
		var cacheNumYCells = this.cachedLevMgr.numYCells;
		var result = (cacheNumYCells<<3); // Bottom of the level

		// Lift collision
		if(!this.numLifts)
			return result; // Bottom of the level
			
		// Check YPos of each lift
		var minDist = 10000;// any big number
		var dist;
		for(var i = 0; i < this.numLifts; ++i)
		{
			var liftXPos = (this.initialLiftPositions[i>>1]<<3) + 3;
		
			if(actualX < liftXPos || actualX > (liftXPos + this.width))
				continue; 
					
			// Is lift above farmer?
			dist = (this.liftPosY[i] - actualY);
			if(dist < 0)
				continue;
				
			// Lift is below farmer
			if(dist < minDist)
			{
				// New closest lift.
				minDist = dist;
				result = this.liftPosY[i];
			}
		}

		return result-1;
	}
} // end of lift object
