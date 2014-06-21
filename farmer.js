/*
  farmer.js - Implementation of farmer for Chuckie Egg
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
// Farmer object implementation
//
function Farmer(levmgr)
{
	this.texture = sgx.graphics.TextureManager.get().load("images/farmer");
	// Cache level info
	this.cachedLevMgr = levmgr;

	this.width = 8;
	this.height = 16;
	
	if (g_bIncludeDHTML) {
		this.farmerStyleCache = document.getElementById("farmerImage").style;
	}
	
	//
	// Sequences of images for walking animation
	//
	this.walkAnimRight = [1, 2, 1, 3];
	this.walkAnimLeft = [4, 5, 4, 6];
	this.climbAnim = [7, 8, 7, 9];
	

	this.rect = new Rect(0, 0, 0, 0);
	this.collRect = new Rect(0, 0, 0, 0);

	//
	// Possible farmer states.
	//
	this.stateWalking = 0;
	this.stateClimbing = 1;
	this.stateJumping = 2;
	this.stateFalling = 3;
	
	this.cacheAudio = audio;

	//
	// Farmer covers 160-2-8 = 150 pixels in approx 4.5 seconds.
	// This allows us to determine the update rate if the speed is 1 pixel per frame.
	//
	// 150/4.5 = 33.3 fps
	//
	
	// 15 frames of animation per second.
	// This tells us how much to increment the animation frame number by per frame.
	this.animRate = 25.0/g_frequency;
	
	//
	// Animation types
	//
	this.animClimbing = 0;
	this.animWalkLeft = 1;
	this.animWalkRight = 2;
	this.animJumpLadder = 3;
	this.animResting = 4;

	this.fallCount = 0;
	
	this.Reset = function(farmerPosition)
	{
		this.xPos = (farmerPosition[0]<<3);
		this.yPos = ((farmerPosition[1]-1)<<3) - 1;
		
		this.prevXPos = this.xPos;
		this.prevYPos = this.yPos;
		
		this.state = this.stateWalking;
		this.animFrame = 0;
		this.currentAnim = this.prevAnim = this.animWalkRight;
		
		this.xPosDelta = 0;   
		this.yVel = 0;
		this.yAccel = 0;
		
		this.dead = false;
		
        	// Initialise farmer collision rectangle.
		this.rect.left = this.xPos - (this.width>>1);
		this.rect.right = this.xPos + (this.width>>1);
		this.rect.bottom = this.yPos + 1; // inclusive rectangle.
		this.rect.top = this.yPos - this.height;

		// Reposition the farmer
		this.UpdateAnims();
	}

	this.OnEggCollision = function(xCell, yCell)
	{
		level.ClearCellAt(xCell, yCell);
		game.OnEggCollected();
		this.cacheAudio.stop(this.cacheAudio.eggSample);
		this.cacheAudio.play(this.cacheAudio.eggSample);
	}
	
	this.OnGrainCollision = function(xCell, yCell)
	{
		level.ClearCellAt(xCell, yCell);
		game.OnGrainCollected();
		this.cacheAudio.stop(this.cacheAudio.grainSample);
		this.cacheAudio.play(this.cacheAudio.grainSample);
	}
	
	this.OnHenCollide = function()
	{
		this.dead = true;
		this.cacheAudio.stop(this.cacheAudio.tuneSample); // Restart dead sample.
		this.cacheAudio.play(this.cacheAudio.tuneSample);
	}


	this.IsObstructionLeft = function(cacheLevelLayout)
	{
		var yCell = this.yPos>>3;

		// Collisions seem to occur around the middle of the character in the original. TODO: TWEAK!
		var cachedRow = cacheLevelLayout[yCell];

		//
		// Allowing the farmer to overlap obstructions slightly is the key to 
		// getting him to jump onto platforms without rebounding backwards whilst stood
		// right next to them.
		//
		// In the original, the farmer is obstructed by a wall only when 2 pixels of
		// overlap have occured. This means that the 3rd pixel will be non-overlapped.
		//
		var leftCell = (this.xPos-3)>>3;
		var leftNearCell = (this.xPos-2)>>3;

		if(leftCell < 0)
			return true;

		if(leftNearCell < 0)
			return true;

		var cacheWall = this.cachedLevMgr.wall;

		// This ensures that if the farmer is already 'inside a wall'
		// then he can walk about. i.e. an obstruction is only detected on 'entry' to a walled section.
		var obstructionToLeft = ((cachedRow[leftCell] == cacheWall) && (cachedRow[leftNearCell] != cacheWall));

		//
		// If farmer jumps up into some platform above, he is only obstructed to the left or right 
		// when he is 'centreOf' - in an x sense, of a cell. But this doesn't happen when the farmer enters 
		// a wall stack e.g. lev 4.
		// This could be because it is only legal to be in a wall stack with 'centre of' in the y sense.
		//
		
		// Futher obstruction tests only when falling...
		if(this.prevYPos < this.yPos) 
		{
			obstructionToLeft |= ((cachedRow[leftNearCell] == cacheWall) && (((this.xPos-1)%8) == 0));

			yCell -= 1;
			if(yCell >= 0)
			{
				obstructionToLeft |= ((cacheLevelLayout[yCell][leftNearCell] == cacheWall) && (((this.xPos-1)%8) == 0));
			}
		}

		cachedRow = null;

		return obstructionToLeft;
	}

	this.IsObstructionRight = function(cacheLevelLayout)
	{
		var yCell = this.yPos>>3;

		// Collisions seem to occur around the middle of the character in the original. TODO: TWEAK!
		var cachedRow = cacheLevelLayout[yCell];

		//
		// Allowing the farmer to overlap obstructions slightly is the key to 
		// getting him to jump onto platforms without rebounding backwards whilst stood
		// right next to them.
		//
		// In the original, the farmer is obstructed by a wall only when 2 pixels of
		// overlap have occured. This means that the 3rd pixel will be non-overlapped.
		//
		var rightCell = (this.xPos+2)>>3;
		var rightNearCell = (this.xPos+1)>>3;

		if(rightCell >= this.cachedLevMgr.numXCells)
			return true;

		if(rightNearCell >= this.cachedLevMgr.numXCells)
			return true;

		var cacheWall = this.cachedLevMgr.wall;

		// This ensures that if the farmer is already 'inside a wall'
		// then he can walk about. i.e. an obstruction is only detected on 'entry' to a walled section.
		var obstructionToRight = ((cachedRow[rightCell] == cacheWall) && (cachedRow[rightNearCell] != cacheWall));

		//
		// If farmer jumps up into some platform above, he is only obstructed to the left or right 
		// when he is 'centreOf' - in an x sense, of a cell. But this doesn't happen when the farmer enters 
		// a wall stack e.g. lev 4.
		// This could be because it is only legal to be in a wall stack with 'centre of' in the y sense.
		//
		
		// Futher obstruction tests only when falling...
		if(this.prevYPos < this.yPos) 
		{
			obstructionToRight |= ((cachedRow[rightNearCell] == cacheWall) && (((this.xPos+1)%8) == 0));

			yCell -= 1;
			if(yCell >= 0)
			{
				obstructionToRight |= ((cacheLevelLayout[yCell][rightNearCell] == cacheWall) && (((this.xPos+1)%8) == 0));
			}
		}

		cachedRow = null;

		return obstructionToRight;
	}
	
	this.IsOverLadder = function(cacheLevelLayout, isDismountPoint)
	{
		// Detect collision with ladder
		if((this.rect.left % 8) != 0) // If not over the centre of a cell, farmer can't be on the ladder.
			return false;

		var xCell = this.xPos>>3;
/*
		var testCell = (this.yPos>>3)-2;
		for(var i = 0; i < 4; ++i)
		{
			if((testCell <= 0) || (testCell >= this.cachedLevMgr.numYCells))
				continue;
				
			if(cacheLevelLayout[testCell][xCell] == this.cachedLevMgr.ladder)
				return true;

			++testCell;
		}
*/
		// The farmer's centre or top needs to be over a ladder in order to be able to 
		// mount a ladder from a jump. This handles jumping over gaps in ladders
		// and gives correct behaviour at the top of a ladder i.e. you can jump one
		// cell higher than just climbing along.


		var centre = ((this.yPos + 1)>>3) - 1;
		var top = ((this.yPos + 1)>>3) - 2;

		if(centre > 0 && centre < this.cachedLevMgr.numYCells)
		{
			if(cacheLevelLayout[centre][xCell] == this.cachedLevMgr.ladder)
				return true;
		}

		if(top > 0 && top < this.cachedLevMgr.numYCells) // else excludes a ladder at the bottom
		{
			if(cacheLevelLayout[top][xCell] == this.cachedLevMgr.ladder)
				return true; 
		}

		// Special case to handle ch-egg2. If a ladder finishes flush with a platform then
		// the farmer should still be able to walk over the ladder and climb down without
		// effecting the height he can jump/climb up a conventional ladder.
		// So only permit ladder testing underneath the farmers feet if level with a dismount
		// point (i.e. a platform)
		if(isDismountPoint)
		{
			var bottom = ((this.yPos + 1)>>3);
			if(bottom > 0 && bottom < this.cachedLevMgr.numYCells)
			{
				if(cacheLevelLayout[bottom][xCell] == this.cachedLevMgr.ladder)
					return true;
			}
		}

		return false;
	}

	this.CanDismount = function(cacheLevelLayout)
	{
		// Look for dismount point.
		var bottom = this.yPos + 1;
		if((bottom % 8) != 0) // If not level with a platform, we can't dismount.
			return false;

		var xCell = this.xPos>>3;
		var yCell = bottom>>3;

		var cacheWall = this.cachedLevMgr.wall;

		var testCell = xCell-1;
		if(testCell >= 0)
		{
			if(cacheLevelLayout[yCell][testCell] == cacheWall) // southWest
				return true;
		}

		testCell = xCell+1;
		if(testCell < this.cachedLevMgr.numXCells)
		{
			if(cacheLevelLayout[yCell][xCell+1] == cacheWall) // southEast
				return true;
		}

		return false;
	}

	this.JumpLeft = function()
	{
		this.state = this.stateJumping;
		this.xPosDelta = -1;
		this.yAccel = 1;
		this.yVel = (-2 << 2); 
		this.currentAnim = this.animWalkLeft;

		// Stop and restart sample
		this.cacheAudio.stop(this.cacheAudio.jumpSample);
		this.cacheAudio.play(this.cacheAudio.jumpSample);			
	}

	this.JumpRight = function()
	{
		this.state = this.stateJumping;
		this.xPosDelta = 1;
		this.yAccel = 1;
		this.yVel = (-2 << 2); 
		this.currentAnim = this.animWalkRight;

		// Stop and restart sample
		this.cacheAudio.stop(this.cacheAudio.jumpSample);
		this.cacheAudio.play(this.cacheAudio.jumpSample);
	}

	this.Jump = function(audioSample)
	{
		this.state = this.stateJumping;
		this.xPosDelta = 0;
		this.yAccel = 1;
		this.yVel = (-2 << 2);
		this.currentAnim = this.animResting;
		this.cacheAudio.play(audioSample);
	}

	this.ClimbUp = function(cacheLevelLayout)
	{
		this.state = this.stateClimbing;
		this.xPosDelta = 0;
		this.yAccel = 0;
		this.yVel = 0;
		
		// Ensure that we will always be able to line up with dismount points (odd numbers).
		this.yPos += ((this.yPos&1)==0);

		// When climbing ladders, check for available ladder above/below
		// Ladder is climbed two pixels at a time, so we must test two pixels below for an obstruction
		var yCell = (this.yPos>>3)-2;
		if(yCell >= 0)
		{
			var obstructionToTop = (cacheLevelLayout[yCell][this.xPos>>3] != this.cachedLevMgr.ladder);
			if(!obstructionToTop)
			{
				this.yPos -= 2;
				this.currentAnim = this.animClimbing;
				this.cacheAudio.play(this.cacheAudio.upDownSample);
				return false;
			}
		}

		// At top of ladder, can't climb higher, so stop audio and animation
		this.cacheAudio.stop(this.cacheAudio.upDownSample);
		this.currentAnim = this.animResting;

		// Stop any jump sample from jumping up at the top of the ladder.
		this.cacheAudio.stop(this.cacheAudio.jumpSample);

		return true; // can't climb any higher.
	}

	this.ClimbDown = function(cacheLevelLayout)
	{
		this.state = this.stateClimbing;
		this.xPosDelta = 0;
		this.yAccel = 0;
		this.yVel = 0;
		
		// Ensure that we will always be able to line up with dismount points (odd numbers).
		this.yPos += ((this.yPos&1)==0);

		// When climbing ladders, check for available ladder above/below
		// Ladder is climbed two pixels at a time, so we must test two pixels below for an obstruction
		var yCell = (this.yPos+1)>>3;
		if(yCell < this.cachedLevMgr.numYCells)
		{
			var obstructionToBottom = (cacheLevelLayout[yCell][this.xPos>>3] != this.cachedLevMgr.ladder);
			if(!obstructionToBottom)
			{
				this.yPos += 2;
				this.currentAnim = this.animClimbing;
				this.cacheAudio.play(this.cacheAudio.upDownSample);
				return;
			}
		}

		// At top of ladder, can't climb higher, so stop audio and animation
		this.cacheAudio.stop(this.cacheAudio.upDownSample);
		this.currentAnim = this.animResting;
		return true; // can't climb any higher.
	}

	this.WalkLeft = function(obstructionToLeft)
	{
		this.state = this.stateWalking;
		if(!obstructionToLeft)
		{
			this.xPosDelta = -1;
			this.currentAnim = this.animWalkLeft;
			this.cacheAudio.play(this.cacheAudio.leftRightSample);
		}
	}

	this.WalkRight = function(obstructionToRight)
	{
		this.state = this.stateWalking;
		if(!obstructionToRight)
		{
			this.xPosDelta = 1;
			this.currentAnim = this.animWalkRight;
			this.cacheAudio.play(this.cacheAudio.leftRightSample);
		}
	}

	this.UpdateJump = function(obstructionToLeft, obstructionToRight)
	{
		// Change the direction on rebound.
		if(obstructionToLeft && this.xPosDelta < 0)
			this.xPosDelta = -this.xPosDelta;
					
		if(obstructionToRight && this.xPosDelta > 0)
			this.xPosDelta = -this.xPosDelta;
	}


	this.ProcessStateMachine = function()
	{
		var cacheKeyboard = keyboard;
		var cacheLevel = level;
		var cacheLevelLayout = cacheLevel.layout;

		var left = (cacheKeyboard.left && !cacheKeyboard.right);
		var right = (!cacheKeyboard.left && cacheKeyboard.right);
		var up = (cacheKeyboard.up && !cacheKeyboard.down);
		var down = (!cacheKeyboard.up && cacheKeyboard.down);

		var jump = (cacheKeyboard.jump && !up && !down && !left && !right);
		var jumpLeft = (cacheKeyboard.jump && left);
		var jumpRight = (cacheKeyboard.jump && right);
		var jumpUp = (cacheKeyboard.jump && up);
		var jumpDown = (cacheKeyboard.jump && down);

		switch(this.state)
		{
			case this.stateWalking:

				var overLadder = this.IsOverLadder(cacheLevelLayout, this.CanDismount(cacheLevelLayout));

				if(jumpLeft)
				{
					this.JumpLeft();
				}
				else if(jumpRight)
				{
					this.JumpRight();
				}
				else if(up && overLadder)
				{
					this.ClimbUp(cacheLevelLayout);
				}
				else if(down && overLadder)
				{
					this.ClimbDown(cacheLevelLayout);
				}
				else if(left)
				{
					this.WalkLeft(this.IsObstructionLeft(cacheLevelLayout));
				}
				else if(right)
				{
					this.WalkRight(this.IsObstructionRight(cacheLevelLayout));
				}
				else if(jump)
				{
					this.Jump(this.cacheAudio.jumpSample);
				}
				else
				{
					// At rest, modify animation, update audio
					this.currentAnim = this.animResting;
					this.cacheAudio.stop(this.cacheAudio.leftRightSample);
				}
				break;

			case this.stateClimbing:

				var canDismount = this.CanDismount(cacheLevelLayout);

				if(jumpLeft)
				{
					this.JumpLeft();
				}
				else if(jumpRight)
				{
					this.JumpRight();
				}
				else if(jumpDown || jumpUp)
				{
					// Climb the ladder, but if obstructed at the top because we have run out of
					// ladder, transition to jump mode (because we have the jump key pressed)
					if(this.ClimbUp(cacheLevelLayout))
					{
						this.Jump(this.cacheAudio.upDownSample);
					}
					else
					{
						// Jumping onto a ladder and holding the jump key in the original BBC Model B
						// version caused a frame of the walk animation to be used rather than the 
						// climbing ladder animaion. This overrides the animation in this circumstance.
						if(this.prevAnim == this.animWalkLeft || this.prevAnim == this.animWalkRight)
							this.currentAnim = this.animJumpLadder;
					}
				}
				else if(left && canDismount)
				{
					this.WalkLeft(this.IsObstructionLeft(cacheLevelLayout));
				}
				else if(right && canDismount)
				{
					this.WalkRight(this.IsObstructionRight(cacheLevelLayout));
				}
				else if(up)
				{
					this.ClimbUp(cacheLevelLayout);
				}
				else if(down)
				{
					this.ClimbDown(cacheLevelLayout);
				}
				else if(jump)
				{
					this.Jump(this.cacheAudio.jumpSample);
				}
				else
				{
					// At rest on a ladder, modify animation, stop audio
					this.currentAnim = this.animResting;
					this.cacheAudio.stop(this.cacheAudio.upDownSample);
				}
				break;

			case this.stateJumping:

				this.UpdateJump(this.IsObstructionLeft(cacheLevelLayout), this.IsObstructionRight(cacheLevelLayout));

				var overLadder = this.IsOverLadder(cacheLevelLayout, this.CanDismount(cacheLevelLayout));

				if(jumpLeft && overLadder)
				{
					this.JumpLeft();
				}
				else if(jumpRight && overLadder)
				{
					this.JumpRight();
				}
				else if(up && overLadder)
				{
					this.ClimbUp(cacheLevelLayout);

					// Jumping onto a ladder and holding the jump key in the original BBC Model B
					// version caused a frame of the walk animation to be used rather than the 
					// climbing ladder animaion. This overrides the animation in this circumstance.
					if(this.prevAnim == this.animWalkLeft || this.prevAnim == this.animWalkRight)
						this.currentAnim = this.prevAnim;
				}
				else if(down && overLadder)
				{
					this.ClimbDown(cacheLevelLayout);

					// Jumping onto a ladder and holding the jump key in the original BBC Model B
					// version caused a frame of the walk animation to be used rather than the 
					// climbing ladder animaion. This overrides the animation in this circumstance.
					if(this.prevAnim == this.animWalkLeft || this.prevAnim == this.animWalkRight)
						this.currentAnim = this.prevAnim;
				}
				else
				{
					// Ensure jump is playing
					this.cacheAudio.play(this.cacheAudio.jumpSample);
				}
				break;

			case this.stateFalling:
				this.currentAnim = this.animResting;
				break;
		}

		cacheLevelLayout = null;
		cacheLevel = null;
		cacheKeyboard = null;
	}

	//
	// Shoot a ray down to find nearest wall from last frame's farmer position.
	//
	this.RayLevelCollision = function(cacheLevelLayout)
	{
		var cacheNumXCells = this.cachedLevMgr.numXCells;
		var cacheNumYCells = this.cachedLevMgr.numYCells;
		var cacheLadder = this.cachedLevMgr.ladder;
		var cacheWall = this.cachedLevMgr.wall;
	    
		var xCell = this.xPos>>3;

		// Going up?
		if(this.yPos <= this.prevYPos)
		{
			// If travelling upwards (due to a jump), only report a collison if we become exactly level
			// with a platform. Reporting sooner is incorrect because it artificially pushes the farmer
			// upwards at a rate faster than the jump.
			var yCell = (this.yPos>>3)+1;
			if(((this.yPos + 1) % 8) == 0 && (yCell < cacheNumYCells))
			{
				var row = cacheLevelLayout[yCell];
				if(row[xCell] == cacheWall)
					return this.yPos;

				// Look for wall either side of the ladder.
				if(row[xCell] == cacheLadder)
				{
					if((xCell > 0) && row[xCell-1] == cacheWall)
						return this.yPos;

					if((xCell < (cacheNumXCells-1)) && row[xCell+1] == cacheWall)
						return this.yPos;
				}
			}
			return  (cacheNumYCells<<3)-1; // no collision, report bottom of screen
		}
	    
		// Going down.
		var yCell = (this.prevYPos>>3) + 1;

		// Start at the previous cell and work our way down to the bottom of the screen
		// looking for a platform.
		var row = null;
		while(yCell < cacheNumYCells)
		{
			row = cacheLevelLayout[yCell];
			if(row[xCell] == cacheWall)
				break;

			// Look for wall either side of the ladder.
			if(row[xCell] == cacheLadder) 
			{
				if((xCell > 0) && row[xCell-1] == cacheWall)
					break;

				if((xCell < (cacheNumXCells-1)) && row[xCell+1] == cacheWall)
					break;
			}

			// Keep searching
			++yCell;
		}
		row = null;	
		return (yCell<<3) - 1;		
	}

	this.ScreenBoundryCollide = function()
	{
		//
		// Collide against edge of the screen
		//
		if(this.rect.left < this.cachedLevMgr.levelXMin)
		{
			this.xPos += (this.cachedLevMgr.levelXMin - this.rect.left);
			this.xPosDelta = -this.xPosDelta; // Reverse x delta if in flight to bounce off.
			
		} 
		else if(this.rect.right > this.cachedLevMgr.levelXMax)
		{
			this.xPos -= (this.rect.right - this.cachedLevMgr.levelXMax);
			this.xPosDelta = -this.xPosDelta; // Reverse x delta if in flight to bounce off
		}
		
		if(this.rect.top < this.cachedLevMgr.levelYMin)
		{
			this.yPos += (this.cachedLevMgr.levelYMin - this.rect.top);

			// Farmer bounces off the top of the screen. Cancelling any upward velocity is sufficient.
			this.yVel = 0;

			// This could result from staying on a lift too long, but there was a bug/feature in the
			// original chuckie egg that permitted you to fall through the ladder if you were jumping
			// whilst at the top of the playable area.
			if(this.state != this.stateJumping)
			{
				this.dead = true;
				this.cacheAudio.stop(this.cacheAudio.tuneSample); // Restart dead sample.
				this.cacheAudio.play(this.cacheAudio.tuneSample);
			}
		}
		else if(this.rect.bottom >= this.cachedLevMgr.levelYMax) 
		{
			// Farmer has fallen to bottom of the screen and is dead
			this.yPos = (this.cachedLevMgr.levelYMax-1);
			this.dead = true;
			this.cacheAudio.stop(this.cacheAudio.tuneSample); // Restart dead sample.
			this.cacheAudio.play(this.cacheAudio.tuneSample);
		}
	}

	this.UpdatePhysics = function()
	{
		this.prevYPos = this.yPos;
		this.prevXPos = this.xPos;

		// Update position
		this.yPos += this.yVel>>2;
		this.xPos += this.xPosDelta;

		// Update velocity based on gravity
		this.yVel += this.yAccel; 

        	// Initialise farmer collision rectangle.
		this.rect.left = this.xPos - (this.width>>1);
		this.rect.right = this.xPos + (this.width>>1);
		this.rect.bottom = this.yPos+1; // inclusive rectangle.
		this.rect.top = this.yPos - this.height;

	}

	this.DetectHenCollisions = function()
	{
		var cacheHens = hens;

		// Modify to allow some extra overlap with hens before a collision is dectected, like the original.
		this.collRect.left = this.rect.left + 2;
		this.collRect.right = this.rect.right - 2;
		this.collRect.top = this.rect.top + 2;
		this.collRect.bottom = this.rect.bottom - 2;
		
		//
		// Detect hen collisions
		//
		var numHens = cacheHens.GetNumDefinedHens();
		for(var i = 0; i < numHens; ++i)
		{			
			if(this.collRect.overlaps(cacheHens.GetHenRect(i)))
			{
				this.OnHenCollide();
				break;
			}
		}

		//
		// Detect motherduck collision
		//		
		if(this.collRect.overlaps(motherduck.GetRect()))
			this.OnHenCollide();
			
		cacheHens = null;
	}

	this.Landed = function(platformYPos)
	{
		if(this.state != this.stateClimbing)
		{
			this.state = this.stateWalking;		
			this.yPos = this.prevYPos = platformYPos;

			// Cancel any sideways velocity, y velocity and y acceleration.
			this.yAccel = this.yVel = this.xPosDelta = 0;

			this.cacheAudio.stop(this.cacheAudio.jumpSample);
			this.cacheAudio.stop(this.cacheAudio.fallSample);
		}
	}
	
	this.Fall = function()
	{
		if(this.state == this.stateWalking)
		{
			//
			// In the original BBC Model B version, the farmer continues to walk sideways for two
			// pixels whilst falling. This is achieved by delaying the transition to the falling
			// state by one frame, but giving the farmer an acceleration due to gravity.
			// 
			// On landing, some overlap is permitted because this is the key to getting the farmer
			// to jump onto platforms without rebounding backwards whilst stood right next to them.
			//
			if(this.yVel == 0) // first frame
			{
				this.yAccel = 1;
				this.yVel = 1<<2;
				this.yPos +=1; // Seems to be required to get farmer to take same number of frames

				this.fallCount = 1 + (this.xPosDelta == 1);
			}
			else // Second frame - allow transition to falling state for real.
			{
				// Hack when travelling right - dunno why I need this.
				if(--this.fallCount == 0)
				{
					this.state = this.stateFalling;
					this.xPosDelta = 0;
					this.cacheAudio.play(this.cacheAudio.fallSample);
				}
			}
		}		
	}
	
	this.CollisionDetection = function(cacheLevelLayout)
	{
		var cacheLevel = level;
		var cacheLevelLayout = cacheLevel.layout;

		// Collide against the screen boundry.
		this.ScreenBoundryCollide();

		// Find collision with platform and lifts
		var platformYPos = this.RayLevelCollision(cacheLevelLayout);
		var liftYPos = lifts.RayLiftCollision(this.xPos, this.prevYPos);

		// Lifts eventually reach the top of the screen, resulting in an invalid position
		// for the farmer. Ignore lift collision in this case.
		if(liftYPos >= (this.height-1))
		{
			// Pick the nearer of the two.
			if(liftYPos < platformYPos) 
				platformYPos = liftYPos;
		}
		
		// Has farmer landed or passed through the platform because of his velocity?
		if(this.yPos >= platformYPos)
			this.Landed(platformYPos);
		else
			this.Fall();

		// Check lower cell of farmer for collision with egg and grain.
		var xCell = this.xPos>>3;
		var yCell = this.yPos>>3;
		var lowerCell = cacheLevelLayout[yCell][xCell];

		// Check collision with eggs and grain
		if(lowerCell == this.cachedLevMgr.egg)
			this.OnEggCollision(xCell, yCell);
		else if(lowerCell == this.cachedLevMgr.grain)
			this.OnGrainCollision(xCell, yCell);

		// Check upper cell of farmer for collision with egg and grain.	
		if((yCell-1) >= 0)
		{
			var upperCell = cacheLevelLayout[yCell-1][xCell];

			if(upperCell == this.cachedLevMgr.egg)
				this.OnEggCollision(xCell, yCell-1);
			else if(upperCell == this.cachedLevMgr.grain)
				this.OnGrainCollision(xCell, yCell-1);
		}
			
		this.DetectHenCollisions();

		cacheLevelLayout = null;
		cacheLevel = null;
	}


	this.UpdateAnims = function()
	{
		++this.animFrame;
		var frame = Math.floor(this.animFrame>>1) % 4;
		var sequence;
		switch(this.currentAnim)
		{
			case this.animWalkLeft:
				sequence = this.walkAnimLeft[frame];
				this.prevAnim = this.currentAnim;
				break;
		
			case this.animWalkRight:
				sequence = this.walkAnimRight[frame];
				this.prevAnim = this.currentAnim;
				break;
		
			case this.animClimbing:
				sequence = this.climbAnim[frame];
				this.prevAnim = this.currentAnim;
				break;
		
			case this.animJumpLadder:
				if(this.prevAnim == this.animWalkRight)
					sequence = this.walkAnimRight[1];
				else if(this.prevAnim == this.animWalkLeft)
					sequence = this.walkAnimLeft[1];
				else if(this.prevAnim == this.animClimbing)
					sequence = this.climbAnim[0];
				break;
			
			case this.animResting:
				if(this.prevAnim == this.animWalkRight)
					sequence = this.walkAnimRight[0];
				else if(this.prevAnim == this.animWalkLeft)
					sequence = this.walkAnimLeft[0];
				else if(this.prevAnim == this.animClimbing)	
					sequence = this.climbAnim[0];
				break;				
		};

		//
		// Update graphics
		//
		if (g_bIncludeDHTML) {
			this.farmerStyleCache.clip = "rect(0," + (sequence*16) + ",18," + ((sequence-1)*16) + ")";   // top right bottom left
			this.farmerStyleCache.left = ((this.xPos - (this.width>>1))<<1) - ((sequence-1)*16);
			this.farmerStyleCache.top = (this.yPos) - this.height;
		}
		this.sequence = sequence;
	}


	this.Update = function()
	{
		this.UpdatePhysics();
		this.CollisionDetection();

		// Quit if farmer died as a result of a collision.
		if(this.dead)
			return;

		this.ProcessStateMachine();
		this.UpdateAnims();
	}
	
	this.GetXPos = function() { return this.xPos; }
	this.GetYPos = function() { return this.yPos; }


	this.Draw = function()
	{
		var x = ((this.xPos - (this.width>>1))<<1);
		var y = (this.yPos) - this.height;
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();

		pSurface.setFillTexture(this.texture);
		pSurface.setFillTextureRegion(this.sequence-1);
		pSurface.fillPoint(x, y+SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
	}
} // end of farmer object

	
