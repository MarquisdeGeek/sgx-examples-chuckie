/*
  highscores.js - High score management for Chuckie Egg
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

function HighScoreTable()
{
	this.maxHighScores = 10;
	this.highScoreTable = new Array;

	// Initialise default scores
	for(var i = 0; i < this.maxHighScores; ++i)
		this.highScoreTable[i] = [ 1000, "A&F"];


	this.SortOp = function(a, b)
	{
		return a[0] < b[0];
	}

	this.CalcScorePosition = function(score)
	{
		for(var i = 0; i < this.maxHighScores; ++i)
		{
			var comp = this.highScoreTable[i][0];
			if(score >= comp)
				return i;
		}
		return this.maxHighScores;
	}

	this.InsertScore = function(score)
	{
		var pos = this.CalcScorePosition(score);

		if (true) {
			for(var i=this.highScoreTable.length-1;i>pos;--i) {
				this.highScoreTable[i][0] = this.highScoreTable[i-1][0];
				this.highScoreTable[i][1] = this.highScoreTable[i-1][1];
			}
			this.highScoreTable[pos] = [score, ""];
			
		} else {
			//	This was the original code that puts an erroneous error in array index 0.
			// No idea why - no time to figure it out. So I re-wrote it into the above.
			this.highScoreTable[this.highScoreTable.length] = [score, ""];
			this.highScoreTable.sort(this.SortOp);
			this.highScoreTable.length = this.maxHighScores;
		}

		return pos;
	}

	this.SetName = function(pos, name)
	{
		this.highScoreTable[pos][1] = name;
		this.Save();
	}

	this.GetScore = function(pos)
	{
		return this.highScoreTable[pos];
	}

	this.Save = function()
	{
		var value = "";
		for(var i = 0; i < this.maxHighScores; ++i)
		{
			value += this.highScoreTable[i][0].toString();
			value += "@";
			value += escape(this.highScoreTable[i][1]);
			value += "@";
		}
		createCookie("scores", value, "/", 365);
	}

	this.Load = function()
	{
	
		var cookieValue = readCookie("scores");
		if(cookieValue==null || cookieValue=="")
			return;

		var fromIndex = 0;
		for(var i = 0; i < this.maxHighScores; i++)
		{
			var atPos = cookieValue.indexOf("@", fromIndex);
			if(atPos == -1)
				return; // scores are somehow corrupt

			this.highScoreTable[i][0] = parseInt(cookieValue.substring(fromIndex, atPos));
			fromIndex = atPos+1;

			atPos = cookieValue.indexOf("@", fromIndex);
			if(atPos == -1)
				return; // scores are somehow corrupt

			this.highScoreTable[i][1] = unescape(cookieValue.substring(fromIndex, atPos));
			fromIndex = atPos+1;
		}
	}

	// If there are saved high scores, override the defaults.
	this.Load();
}
