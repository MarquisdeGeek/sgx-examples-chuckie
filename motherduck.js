/*
  motherduck.js - Motherduck behaviour for Chuckie Egg
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
// Mother duck definition
//
function MotherDuck(levmgr)
{
	this.textureNormal = sgx.graphics.TextureManager.get().load("images/motherduck");
	this.textureCaged = sgx.graphics.TextureManager.get().load("images/motherduck_caged");

	// Cache level dimensions
	this.levelXMin = levmgr.levelXMin+5;
	this.levelYMin = levmgr.levelYMin;
	this.levelXMax = levmgr.levelXMax-5;
	this.levelYMax = levmgr.levelYMax-21;

	//
	// Dimensions of motherduck image.
	//
	this.width = 16;
	this.height = 24;
	this.halfWidth = this.width>>1;
	this.halfHeight = this.height>>1;
	this.quaterWidth = this.width>>2;
	this.quaterHeight = this.height>>2;
	
	//
	// Precomputed values for screen boundry collision
	//
	this.minXPos = (this.levelXMin + this.halfWidth);
	this.maxXPos = (this.levelXMax - this.halfWidth);
	this.minYPos = (this.levelYMin + this.halfHeight);
	this.maxYPos = (this.levelYMax - this.halfHeight);

	// Damping/spring force attraction

	// horizontal recoil recoil displacement over time (sampled every 8 frames)
	// 0	(t=0)
	// 10	(t=8)
	// 18	(t=16)
	// 24	(t=24)
	// 28	(t=32)
	// 30	(t=40)
	// 30	(t=48)
	// 28	(t=56)
        // 24	(t=64)
        // 18	(t=72)
        // 10	(t=80)
        // 0	(t=88)

	// Maximum horizontal velocity is 5 pixels per update (8 frames worth) in the X
	this.maxXVel = 5;

	// Maximum vertical velocity is 5 pixels per update (8 frames worth) in the Y
	this.maxYVel = 5;


	// Caged position of motherduck
	this.xStartPos = (4 + this.halfWidth);
	this.yStartPos = (19 + this.halfHeight);

	this.rect = new Rect();

	// Motherduck's state
	this.xPos = this.xStartPos;
	this.yPos = this.yStartPos;
	this.xAccel = 1;
	this.yAccel = 1;
	this.xVel = 0;
	this.yVel = 0;
	this.animFrameOffset = 0;
	this.freed = 0;
	
	if (g_bIncludeDHTML) {
		this.domCacheImg = document.getElementById("motherDuckImage");
		this.domCacheStyle = this.domCacheImg.style;
	}
	
	this.Reset = function(freed)
	{
		//
		// Reset motherduck state
		//
		this.xPos = this.xStartPos;
		this.yPos = this.yStartPos;
		this.xAccel = this.yAccel = 1;
		this.xVel = this.yVel = 0;
		this.animFrameOffset = 0;

		if (g_bIncludeDHTML) {
			var cacheDomImgStyle = this.domCacheStyle;
			this.freed = freed;
			if(this.freed)
				this.domCacheImg.src = "images/motherduck.gif";
			else
				this.domCacheImg.src = "images/motherduck_caged.gif";		

			cacheDomImgStyle.top = this.yPos - this.halfHeight;
			cacheDomImgStyle.left = ((this.xPos - this.halfWidth)<<1);
		}
		
		cacheDomImgStyle = 0;
		this.Update();
	}
	
	this.ScreenBoundryCollide = function()
	{
		// Initialise motherduck collision rectangle.
		this.rect.left = this.xPos - this.halfWidth;
		this.rect.right = this.xPos + this.halfWidth;
		this.rect.bottom = this.yPos + this.halfHeight;
		this.rect.top = this.yPos - this.halfHeight;
	
		//
		// Collide against edge of the screen
		//
		if(this.rect.left < this.levelXMin)
		{
			this.xPos += 5 + (this.levelXMin - this.rect.left);
			this.xVel = -this.xVel;
		} 
		else if(this.rect.right > this.levelXMax)
		{
			this.xPos -= 5 + (this.rect.right - this.levelXMax); //this.maxXPos; 
			this.xVel = -this.xVel;
		}
		
		if(this.rect.top < this.levelYMin)
		{
			this.yPos += 5 + (this.levelYMin - this.rect.top);// this.minYPos; 
			this.yVel = -this.yVel;
		}
		else if(this.rect.bottom > this.levelYMax) 
		{
			this.yPos -= 5 + (this.rect.bottom - this.levelYMax);//this.maxYPos;
			this.yVel = -this.yVel;
		}
	}
	
	this.GetRect = function()
	{
		if(this.freed)
		{
			// Initialise farmer motherduck rectangle.
			// Reduce the rectangle in size to match original game.
			this.rect.left = this.xPos - this.quaterWidth;
			this.rect.right = this.xPos + this.quaterWidth;
			this.rect.bottom = this.yPos + this.quaterHeight;
			this.rect.top = this.yPos - this.quaterHeight;
		}
		else
		{
			// Impossible rectangle to collide with.
			this.rect.left = this.rect.top = 1;
			this.rect.right = this.rect.bottom = -1;
		}
	
		return this.rect;
	}
		
	this.Update = function(farmerXPos, farmerYPos)
	{
		var cacheDomImgStyle = this.domCacheStyle;

		//
		// Chuckie anim changes every 8th frame.
		//
		var motherduckAnimFrame = ((game.currentFrame & 8) == 8) + this.animFrameOffset;
		var animFramePosOffset = (motherduckAnimFrame*32);
		this.animFrame = motherduckAnimFrame;
		
		if(this.freed)
		{
			if((farmerXPos - this.xPos) > 0)
			{
				this.xAccel = 1;
				this.animFrameOffset = 0; // Turn motherduck around
				this.animFrame = ((game.currentFrame & 8) == 8) ? 0 : 1;
			}
			else
			{
				this.xAccel = -1;
				this.animFrameOffset = 2; // Turn motherduck around
				this.animFrame = ((game.currentFrame & 8) == 8) ? 2 : 3;
			}

			if((farmerYPos - this.yPos) > 0)
				this.yAccel = 1;
			else
				this.yAccel = -1;

			// v = u + at (t = 1)
			this.xVel += this.xAccel;
			this.yVel += this.yAccel;

			// Clamp maximum velocity
			if(this.xVel > this.maxXVel)
				this.xVel = this.maxXVel;
			if(this.xVel < -this.maxXVel)
				this.xVel = -this.maxXVel;
	
			if(this.yVel > this.maxYVel)
				this.yVel = this.maxYVel;
			if(this.yVel < -this.maxYVel)
				this.yVel = -this.maxYVel;

			// d = vt (t = 1)
			this.xPos += this.xVel;
			this.yPos += this.yVel;

			this.ScreenBoundryCollide();

			if (g_bIncludeDHTML) {
				cacheDomImgStyle.top = this.yPos - this.halfHeight;
			}
		}
		
		if (g_bIncludeDHTML) {
			cacheDomImgStyle.left = ((this.xPos - this.halfWidth)<<1) - animFramePosOffset;
			cacheDomImgStyle.clip = "rect(0," + (animFramePosOffset+32) + ",24," + animFramePosOffset + ")"; // top right bottom left
			cacheDomImgStyle = null;
		}
	}
	
	this.Draw = function() {
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();

		pSurface.setFillTexture(this.freed ? this.textureNormal : this.textureCaged);
		pSurface.setFillTextureRegion(this.animFrame);
		
		pSurface.fillPoint(((this.xPos - this.halfWidth)<<1), (this.yPos - this.halfHeight) + SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
	}
	
	
} // end of mother duck definition
