/*
  player.js - Management of player specific state for Chuckie Egg
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

function Player()
{
    this.prevHold = false;
    this.paused = false;
    this.score = 0;
    this.numLives = 5;
    this.numEggs = 12;
    this.levelLayoutState = new Array;
    this.levelNum = 0
    this.bonus = 1000;
    
    this.InitLevelState = function(levelLayout, levelNum)
    {
        //
        // Copy the layout
        //
		for(var y = 0; y < levelLayout.length; ++y)
		{
		    this.levelLayoutState[y] = new Array;
			for(var x = 0; x < levelLayout[y].length; ++x)
		        this.levelLayoutState[y][x] = levelLayout[y][x];
        }
        
        //
        // Twelve more eggs to collect
        //
        this.numEggs = 12;
        this.levelNum = levelNum;
    }

    this.IsGameOver = function() { return (this.numLives == 0); }
	this.GetCurrentLevel = function() {	return this.levelNum; }
    this.GetLevelState = function() { return this.levelLayoutState; }
    this.GetScore = function() { return this.score; }
    this.IncrementScore = function(amount) { this.score += amount; }
    this.GetLives = function() { return this.numLives; }
    this.DecrementLives = function() { --this.numLives; }
    this.IncrementLives = function() { ++ this.numLives; }
    this.DecrementEggs = function() { --this.numEggs; }
    this.GetNumEggs = function() { return this.numEggs; }
    this.SetBonus = function(amount) { this.bonus = amount; }
    this.GetBonus = function() { return this.bonus; }
};

