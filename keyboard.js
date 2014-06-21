/*
  keyboard.js - Keybaord handling routines for Chuckie Egg
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
// Keyboard handling
//

function DownHandler(e)
{
	if(!e) var e = window.event;
	keyboard.KeyDownHandler(e.keyCode);
	return true;
}

function UpHandler(e)
{
	if(!e) var e = window.event;
	keyboard.KeyUpHandler(e.keyCode);
	return true;
}


//
// Defines the keys used to control the farmer
//
//
// Original default keys
//
// A = 65
// Z = 90
// < or , = 188
// > or . = 190
// SPACE = 32
//
function Keyboard()
{
	this.upKeyCode = 65;
	this.downKeyCode = 90;
	this.leftKeyCode = 188;
	this.rightKeyCode = 190;
	this.jumpKeyCode = 32;
	this.holdKeyCode = 72;
	this.startKeyCode = 83;
	this.redefineKeysKeyCode = 75;
	this.oneKeyCode = 49;
	this.twoKeyCode = 50;
	this.threeKeyCode = 51;
	this.fourKeyCode = 52;
	this.escapeKeyCode = 27;
	
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.jump = false;
	this.hold = false;
	this.start = false;
	this.redefine = false;
	this.one = false;
	this.two = false;
	this.three = false;
	this.four = false;
	this.escape = false;
	
	// Initialise name array table.
	this.keyNames = new Array;
	for(var i = 0; i < 33; ++i)
		this.keyNames[i] = "";

	for(var i = 33; i < 127; ++i)
		this.keyNames[i] = String.fromCharCode(i);

	this.keyNames[8] = "Backspace";
	this.keyNames[9] = "Tab";
	this.keyNames[13] = "Return";
	this.keyNames[16] = "Shift";
	this.keyNames[17] = "Control";
	this.keyNames[18] = "Alt";
	this.keyNames[19] = "Alt Gr";
	this.keyNames[20] = "Caps Lock";
	this.keyNames[32] = "Space";
	this.keyNames[33] = "Page Up";
	this.keyNames[34] = "Page Down";
	this.keyNames[35] = "End";
	this.keyNames[36] = "Home";
	this.keyNames[37] = "Right";
	this.keyNames[38] = "Up";
	this.keyNames[39] = "Left";
	this.keyNames[40] = "Down";
	this.keyNames[46] = "Delete";
	this.keyNames[188] = "< or ,";
	this.keyNames[190] = "> or .";

	// For handling redefining of keys
	this.currentKeyCode = -1;
	
	// Existing handlers for document onkeydown and onkeypress functions.
	this.prevDocumentOnKeyDownHandler = document.onkeydown;
	this.prevDocumentOnKeyPressHandler = document.onkeypress;

	//
	// Disabling the keypress seems to make keyboard input when playing ch-egg
	// somewhat jittery. Enable/Disable is only used to on highscore entry now.
	//
	this.DisableBackspace = function()
	{
		// Remember existing handler.
		this.prevDocumentOnKeyDownHandler = document.onkeydown;
		this.prevDocumentOnKeyPressHandler = document.onkeypress;

		//
		// Disable backspace keypress
		// taken from http://www.webdeveloper.com/forum/showthread.php?t=38143
		//
		if (typeof window.event != 'undefined')
		{
			document.onkeydown = function()
			{
				if (event.srcElement.tagName.toUpperCase() != 'INPUT')
				return (event.keyCode != 8);
			}
		}
		else
		{
			document.onkeypress = function(e)
			{
				if (e.target.nodeName.toUpperCase() != 'INPUT')
				return (e.keyCode != 8);
			}
		}		
	}


	this.EnableBackspace = function()
	{
		//
		// Enable backspace keypress
		// taken from http://www.webdeveloper.com/forum/showthread.php?t=38143
		//
		if (typeof window.event != 'undefined')
		{
			document.onkeydown = this.prevDocumentOnKeyDownHandler;
		}
		else
		{
			document.onkeypress = this.prevDocumentOnKeyPressHandler;
		}
	}

	
	this.IsReserved = function(keyCode)
	{
		switch(keyCode)
		{
			case this.holdKeyCode:
			case this.escapeKeyCode:
				return true;
		};
		
		return false;
	}
	
	this.GetCurrentKeyCode = function()
	{
		return this.currentKeyCode;
	}
	
	this.GetKeyCodeString = function(keyCode)
	{
		var result = this.keyNames[keyCode];
		if(!result)
			return " ";

		return result;
	}
	
	this.SetUpCode = function(keyCode) { this.upKeyCode = keyCode; }
	this.SetDownCode = function(keyCode) { this.downKeyCode = keyCode; }
	this.SetLeftCode = function(keyCode) { this.leftKeyCode = keyCode; }
	this.SetRightCode = function(keyCode) { this.rightKeyCode = keyCode; }
	this.SetJumpCode = function(keyCode) { this.jumpKeyCode = keyCode; }
	
	this.GetUpCode = function() { return this.upKeyCode; }
	this.GetDownCode = function() { return this.downKeyCode; }
	this.GetLeftCode = function() { return this.leftKeyCode; }
	this.GetRightCode = function() { return this.rightKeyCode; }
	this.GetJumpCode = function() { return this.jumpKeyCode; }

	this.KeyDownHandler = function(keyCode)
	{		
		if(keyCode == this.startKeyCode)
			this.start = true;
		else if(keyCode == this.redefineKeysKeyCode)
			this.redefine = true;
		else if(keyCode == this.oneKeyCode)
			this.one = true;
		else if(keyCode == this.twoKeyCode)
			this.two = true;
		else if(keyCode == this.threeKeyCode)
			this.three = true;
		else if(keyCode == this.fourKeyCode)
			this.four = true;
		else if(keyCode == this.holdKeyCode)
		    this.hold = true;
		else if(keyCode == this.escapeKeyCode)
		    this.escape = true;
		
		if(keyCode == this.upKeyCode)
			this.up = true;
		else if(keyCode == this.downKeyCode)
			this.down = true;
		else if(keyCode == this.leftKeyCode)
			this.left = true;
		else if(keyCode == this.rightKeyCode)
			this.right = true;
		else if(keyCode == this.jumpKeyCode)
			this.jump = true;

		if(!this.IsReserved(keyCode))
			this.currentKeyCode = keyCode;
	}

	this.KeyUpHandler = function(keyCode)
	{
		if(keyCode == this.startKeyCode)
			this.start = false;
		else if(keyCode == this.redefineKeysKeyCode)
			this.redefine = false;		
		else if(keyCode == this.oneKeyCode)
			this.one = false;
		else if(keyCode == this.twoKeyCode)
			this.two = false;
		else if(keyCode == this.threeKeyCode)
			this.three = false;
		else if(keyCode == this.fourKeyCode)
			this.four = false;
		else if(keyCode == this.holdKeyCode)
		    this.hold = false;
		else if(keyCode == this.escapeKeyCode)
		    this.escape = false;

		if(keyCode == this.upKeyCode)
			this.up = false;
		else if(keyCode == this.downKeyCode)
			this.down = false;
		else if(keyCode == this.leftKeyCode)
			this.left = false;
		else if(keyCode == this.rightKeyCode)
			this.right = false;
		else if(keyCode == this.jumpKeyCode)
			this.jump = false;

		if(this.currentKeyCode == keyCode)
			this.currentKeyCode = -1;
	}

	this.Save = function()
	{
		var value = this.upKeyCode.toString() + "@";
		value += this.downKeyCode.toString() + "@";
		value += this.leftKeyCode.toString() + "@";
		value += this.rightKeyCode.toString() + "@";
		value += this.jumpKeyCode.toString() + "@";
		createCookie("keys", value, "/", 365);
	}

	this.Load = function()
	{
		var cookieValue = readCookie("keys");
		if(cookieValue==null || cookieValue=="")
			return;

		var fromIndex = 0;
		var cookieKeys = new Array;
		cookieKeys.length = 5;
		for(var i = 0; i < 5; ++i)
		{
			var atPos = cookieValue.indexOf("@", fromIndex);
			if(atPos == -1)
				return; // keys are somehow corrupt

			cookieKeys[i] = parseInt(cookieValue.substring(fromIndex, atPos));
			fromIndex = atPos+1;
		}

		this.upKeyCode = cookieKeys[0];
		this.downKeyCode = cookieKeys[1];
		this.leftKeyCode = cookieKeys[2];
		this.rightKeyCode = cookieKeys[3];
		this.jumpKeyCode = cookieKeys[4];

		delete cookieKeys;
		cookieKeys = null;
	}

	// If there are saved redefined keys, override the defaults.
	this.Load();
}
