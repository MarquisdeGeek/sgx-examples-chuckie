/*
  game.js - Main game loop for Chuckie Egg
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

function Game(levmgr)
{
	this.cachedLevMgr = levmgr;

	this.players = new Array;
	this.displayLives = new Array;

	if (g_bIncludeDHTML) {
		this.cacheTimeStyle = [document.getElementById("time1").style, document.getElementById("time10").style, document.getElementById("time100").style];
		this.cacheLevelStyle = [document.getElementById("curlevel1").style, document.getElementById("curlevel10").style];
		this.cachePlayerStyle = [document.getElementById("curplayer").style];
		this.cacheBonusStyle = [document.getElementById("bonus1000").style, document.getElementById("bonus100").style, document.getElementById("bonus10").style, document.getElementById("bonus1").style];
		this.cacheLivesStyle = [document.getElementById("lifePlayer0").style, document.getElementById("lifePlayer1").style, document.getElementById("lifePlayer2").style, document.getElementById("lifePlayer3").style];
	}

	this.cachePlayerScoresStyle = new Array;
	
	this.numPlayers = 1;
	this.currentFrame = 0;
	this.currentPlayer = 0;
	this.currentTime = 900;
	this.stopScoreTimeOut = 0;

	this.deadTuneCounter = 0;

	this.paused = false;
	this.prevhold = false;
	
	this.InitScoreDisplay = function()
	{
		var numeralBaseName = 0; // used to derive a unique digit identifier
		
		this.textureScoreBar = sgx.graphics.TextureManager.get().load("images/scorebar");
		this.textureLives = sgx.graphics.TextureManager.get().load("images/lives");
		this.textureNumerals = sgx.graphics.TextureManager.get().load("images/numerals");
		
		// Create a div to contain all scores, so we can easily delete them.
		if (g_bIncludeDHTML) {
			var scoreBar = document.getElementById("scorebar");
			var scoresDiv = document.createElement("DIV");
			scoresDiv.id = "scoresdiv";
			scoreBar.appendChild(scoresDiv);

			// numeral digits for each player to the score bar.
		
			for(var i = 0; i < this.numPlayers; ++i)
			{
				// Cache digit style objects for quick access later
				this.cachePlayerScoresStyle[i] = new Array;
				
				// 6 digits in any given score.
				for(var n = 0; n < 6; ++n)
				{
					var digitImg = document.createElement("IMG");
					digitImg.id = "numeral" + numeralBaseName;
					++numeralBaseName;
					
					digitImg.src = "images/numerals.gif";
					digitImg.style.position = "absolute";
					scoresDiv.appendChild(digitImg);
					this.cachePlayerScoresStyle[i][n] = digitImg.style;
				}
			}
		}
	}
	
	this.PlayerScore = function()
	{
		return this.players[this.currentPlayer].GetScore();
	}

	this.ClearScoreDisplay = function()
	{
		var scoresDiv = document.getElementById("scoresdiv");
		if(scoresDiv != null)
		{
			var scoreBar = document.getElementById("scorebar");
			scoreBar.removeChild(scoresDiv);
			scoresDiv = null;
		}
	}
	
	this.DrawScreen = function() {
		var i,
			ply,
			playerIndex,
			s,
			xpos,
			lives;
		
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();
	

		pSurface.setFillTexture(this.textureCage);
		pSurface.fillPoint(0, 3 + SGXOffsetY, sgx.graphics.DrawSurface.eFromTopLeft);
	
		this.DrawNumber(this.displayLevel, 2, 127, 23, true);
		this.DrawNumber(this.displayBonus, 4, 203, 23, true);
		this.DrawNumber(this.displayPlayer, 1, 55, 23, true);
		this.DrawNumber(this.displayTime, 3, 289, 23, true);
	
		for(playerIndex = 0; playerIndex < this.numPlayers; ++playerIndex) {
			ply = this.players[playerIndex];
			if (ply == undefined) {
				continue;
			}
			s = ply.GetScore();
			
			this.DrawNumber(s, 6, 55 + (68*playerIndex), 7, (playerIndex == this.currentPlayer));
			
			// Lives count - could be more efficient in SGX with only one draw, TBH
			pSurface.setFillTexture(this.textureLives);
			lives = ply.GetLives();
			if (lives > 8) {
				lives = 8;
			}
		
			for(i=0;i<lives;++i) {
				xpos = 55 + (68*playerIndex) + i*8;
				pSurface.fillPoint(xpos, 16, sgx.graphics.DrawSurface.eFromTopLeft);
			}
			
		}
	
	
	}
	
	this.DrawNumber = function(value, width, xpos, ypos, inverse) {
		
		var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();
		
		pSurface.setFillTexture(this.textureScoreBar);
		pSurface.fillPoint(0, 0, sgx.graphics.DrawSurface.eFromTopLeft);
		
		pSurface.setFillTexture(this.textureNumerals);
		
		xpos += width * 10;
	
	    for(var i = 0; i < width; ++i) {
			var digit = value % 10;
			
			xpos -= 10;	//this.textureNumerals.getRegionWidth(0);

			pSurface.setFillTextureRegion(inverse ? digit : digit+10);
			pSurface.fillPoint(xpos, ypos, sgx.graphics.DrawSurface.eFromTopLeft);
/*
		cacheObj = styleCache[i];
		cacheObj.clip = "rect(0," + ((digit+1)*10 + inv) + ",9," + ((digit*10)+inv) + ")"; // top right bottom left
		cacheObj.left = xpos + ((width-1-i)*10) - (digit*10) - inv;
	
	cacheObj.top = ypos;
	*/
			if(value > 0) {
				value = Math.floor(value/10);
			}
			
		}

		//this.PrintNumberStyle((value+1), 2, this.cacheLevelStyle, 127, 23, false);
		
	
	}

	this.Init = function(numPlayers)
	{	
		this.paused = false;
		this.prevhold = false;

		this.numPlayers = numPlayers;
    		
	        // TODO: Remove these from the global namespace.
		this.textureCage = sgx.graphics.TextureManager.get().load("images/cage");
		level = new LevelState(this.cachedLevMgr);
		motherduck = new MotherDuck(this.cachedLevMgr);
		hens = new Hens(this.cachedLevMgr);
		lifts = new Lifts(this.cachedLevMgr);
		farmer = new Farmer(this.cachedLevMgr);

		// Create players
		for(var i = 0; i < this.numPlayers; ++i)
		{
			this.players[i] = new Player;
			this.players[i].InitLevelState(g_levelLayouts[0], 0);
			if (g_bIncludeDHTML) {
				this.cacheLivesStyle[i].visibility = "visible";
			}
		}
		
		this.currentPlayer = 0;
		
		// Hide other lives
		if (g_bIncludeDHTML) {
			for(var i = this.numPlayers; i < 4; ++i)
				this.cacheLivesStyle[i].visibility = "hidden";
		}
		this.InitScoreDisplay();
    	}

    this.Exit = function()
    {
		for(var i = 0; i < this.numPlayers; ++i)
		{
			delete this.players[i];
			this.players[i] = null;
		}
		this.ClearScoreDisplay();

                delete farmer;
                delete lifts;
                delete hens;
                delete motherduck;
                delete level;

                farmer = null;
                lifts = null;
                hens = null;
                motherduck = null;
                level = null;
    }

    this.PrintNumberStyle = function(value, width, styleCache, xpos, ypos, inv)
    {
		if (!g_bIncludeDHTML) {
			return;
		}
		
        var floor = Math.floor;
        var cacheObj;
        inv *= 100; // Convert boolean into pixel width offset
        for(var i = 0; i < width; ++i)
        {
		digit = value % 10;
		cacheObj = styleCache[i];
		cacheObj.clip = "rect(0," + ((digit+1)*10 + inv) + ",9," + ((digit*10)+inv) + ")"; // top right bottom left
		cacheObj.left = xpos + ((width-1-i)*10) - (digit*10) - inv;
		cacheObj.top = ypos;
		if(value > 0)
			value = floor(value/10);
	}
	cacheObj = null;
    }

    this.SetScore = function(player, score)
    {
		this.PrintNumberStyle(score, 6, this.cachePlayerScoresStyle[player], 55 + (68*player), 7, (player != this.currentPlayer));
    }

    this.SetLives = function(player, lives)
    {
        //
        // Display maximum of 8 lives
        //
	if (g_bIncludeDHTML) {
		if(lives > 8)
				lives = 8;
				
			var cacheLives = this.cacheLivesStyle[player];
			cacheLives.clip = "rect(0," + (lives*8) + ",3,0)"; // top right bottom left	                
			cacheLives.left = 55 + (68*player);
			cacheLives.top = 16;
			cacheLives = null;
			
		}
    }

    this.SetLevelDisplay = function(value)
    {
		this.displayLevel = value+1;
		this.PrintNumberStyle((value+1), 2, this.cacheLevelStyle, 127, 23, false);
    }

    this.SetBonusDisplay = function(value)
    {
		this.displayBonus = value;
		this.PrintNumberStyle(value, 4, this.cacheBonusStyle, 203, 23, false);
    }

    this.SetPlayerDisplay = function(value)
    {
		this.displayPlayer = value+1;
		this.PrintNumberStyle((value+1), 1, this.cachePlayerStyle, 55, 23, false);
    }

    this.SetTimeDisplay = function(value)
    {
		this.displayTime = value;
        this.PrintNumberStyle(value, 3, this.cacheTimeStyle, 289, 23, false);
    }

	this.RefreshScoreBar = function()
	{
		// Refresh scores so that they are non-inverted
		for(var i = 0; i < this.numPlayers; ++i)
		{
			this.SetScore(i, this.players[i].GetScore());
			this.SetLives(i, this.players[i].GetLives());
		}		
	}

    this.IncrementScore = function(amount)
    {
		var cachePlayer = this.players[this.currentPlayer];
		cachePlayer.IncrementScore(amount);
        this.SetScore(this.currentPlayer, cachePlayer.GetScore());
        cachePlayer = null;
    }

	this.DecrementLives = function()
	{
		var cachePlayer = this.players[this.currentPlayer];
		cachePlayer.DecrementLives();
		this.SetLives(this.currentPlayer, cachePlayer.GetLives());
		cachePlayer = null;
	}

	this.IncrementLives = function()
	{
		var cachePlayer = this.players[this.currentPlayer];
		cachePlayer.IncrementLives();
		this.SetLives(this.currentPlayer, cachePlayer.GetLives());
		cachePlayer = null;
	}

	this.OnEggCollected = function()
	{
		this.IncrementScore(100);
		this.players[this.currentPlayer].DecrementEggs();
	}
	
	this.OnGrainCollected = function()
	{
		this.IncrementScore(50);
		this.stopScoreTimeOut = 128;
	}

	this.CalcNumRequiredHens = function(lev)
	{
		if(lev < 8)
			return 4;	// Upto four hens
		if(lev < 16)
			return 0;	// mother duck only
		if(lev < 24)
			return 4;	// mother duck and hens

		return 8;   // All hens
	}
	
	this.IsMotherDuckFreed = function(lev)
	{
		if(lev < 8)
			return 0; // no mother duck

		return 1; // motherduck
	}

	this.GetHenUpdateRate = function(lev)
	{
		if(lev < 32)
			return 16;

		return 10; 
	}

	this.DoLevelCompleted = function()
	{
		var cachePlayer = this.players[this.currentPlayer];
		var bonus = cachePlayer.GetBonus();
		
		if(bonus > 0)
		{
			audio.play(audio.applauseSample);
		    
			// Decrement remaining bonus and add to players score.
			bonus -= 10;
			if(bonus < 0)
			{
				this.IncrementScore(10 - bonus);
				bonus = 0;
			}
			else
				this.IncrementScore(10);
			
			this.SetBonusDisplay(bonus);	
			cachePlayer.SetBonus(bonus);	
	    }
	    else
	    {
			audio.stop(audio.applauseSample);
			
			//
			// Advance to next level
			//
			this.IncrementLives();
			this.SelectLevel(cachePlayer.GetCurrentLevel() + 1);
		}	    
	}
	
	this.SelectLevel = function(lev)
	{
		var cachePlayer = this.players[this.currentPlayer];
		var levelWrap = lev%g_levelLayouts.length;
		cachePlayer.InitLevelState(g_levelLayouts[levelWrap], lev);
		cachePlayer.SetBonus(1000);
		this.SetBonusDisplay(1000);

		this.SwitchPlayer(this.currentPlayer);		
	}
	
	this.SwitchPlayer = function(player)
	{
		this.currentPlayer = player;
		
		var cachePlayer = this.players[this.currentPlayer];
		var currentLevel = cachePlayer.GetCurrentLevel();

		// Reset the level using the players current layout.
		this.SetLevelDisplay(currentLevel);
		level.Reset(cachePlayer.GetLevelState());
		
		this.currentTime = 900;
		this.SetTimeDisplay(this.currentTime);

		hens.Reset(g_levelHens[currentLevel%g_levelLayouts.length], this.CalcNumRequiredHens(currentLevel));
		lifts.Reset(g_levelLifts[currentLevel%g_levelLayouts.length]);
		farmer.Reset(g_levelFarmers[currentLevel%g_levelLayouts.length]);
		motherduck.Reset(this.IsMotherDuckFreed(currentLevel));

		this.RefreshScoreBar();
		this.SetPlayerDisplay(this.currentPlayer);
	}
	
	this.AdvancePlayer = function()
	{
		var nextPlayer = this.FindNextPlayer();
		this.SwitchPlayer(nextPlayer);
		this.DecrementLives();
	}
	
	this.FindNextPlayer = function()
	{
		// Next players turn.
		var start = this.currentPlayer;
		do
		{
			++start;
			if(start >= this.numPlayers)
				start = 0;
			
			if(!this.players[start].IsGameOver())
				break;
				
		} while(this.currentPlayer != start);
			
		return start;
	}
	
	this.GameOver = function()
	{
		var nextPlayer = this.FindNextPlayer();
			
		// Game is finished if we fail to find a player with lives left.
		if(this.players[nextPlayer].IsGameOver())
			return true;
			
		return false;
	}
	
	this.PlayerIsOut = function()
	{
		return this.players[this.currentPlayer].IsGameOver();
	}
	
    this.Update = function ()
    {
		var cachePlayer = this.players[this.currentPlayer];
		
		if(farmer.dead)
		{
			this.deadTuneCounter = 78;
			audio.play(audio.tuneSample);
			farmer.dead = false;
		}

		// Process death until tune has finished playing.
		if(this.deadTuneCounter > 0)
		{
			--this.deadTuneCounter;
			if(this.deadTuneCounter > 0)
				return 0;
				
			return 1;
		}

		//
		// Has player cleared the level? Generate applause.
		//
		if(cachePlayer.GetNumEggs() == 0)
		{
			// Process applause until all time bonus has been collected.
			// Then advance to the next level.		
			this.DoLevelCompleted();
			return 0;
		}

	        var hold = keyboard.hold;
		if(hold && keyboard.escape)
			return 2; // quit game to highscore table.
		
		// Latch the paused state.
		if(hold && !this.prevHold)
			this.paused = !this.paused;
            
		this.prevHold = hold;
            
		if(this.paused)
			return 0;
			
		//
		// Update motherduck in time with the flapping.
		//
		if((this.currentFrame % 8) == 0)		
			motherduck.Update(farmer.GetXPos(), farmer.GetYPos());
		
		//
		// Update hens - faster if on or above level 32
		//
		if((this.currentFrame % this.GetHenUpdateRate(cachePlayer.GetCurrentLevel())) == 0)
			hens.Update();
		
		lifts.Update();
		farmer.Update();
    	
		++this.currentFrame;
    	
	    //
	    // Stop bonus and time countdown if farmer has collected grain.
	    //
	    if(this.stopScoreTimeOut > 0)
	    {
	        --this.stopScoreTimeOut;
	    }
	    else
	    {
	        // Update time.
	        if((this.currentFrame % 8) == 0)
	        { 
	            --this.currentTime;
	            this.SetTimeDisplay(this.currentTime);
	            if(this.currentTime == 0)
	            {
					this.deadTuneCounter = 78;
					audio.play(audio.tuneSample);
				}
	        }
    	    
	        if((this.currentFrame % 32) == 0)
	        {
	            var bonus = cachePlayer.GetBonus() - 1;
				cachePlayer.SetBonus(bonus);
    			this.SetBonusDisplay(bonus);
    		}
	    }
	    
	    return 0;
    }

	this.Draw = function() {
		this.DrawScreen();
		//
		level && level.Draw();
		farmer && farmer.Draw();
		lifts && lifts.Draw();
		hens && hens.Draw();
		motherduck && motherduck.Draw();
	}
    
} // end of this object
	
