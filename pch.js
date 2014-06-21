/*
  pch.js - Global definitions used by Chuckie Egg
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


var audio = null;
var keyboard = null;
var level = null;
var motherduck = null;
var hens = null;
var farmer = null;
var game = null;
var lifts = null;
var gui = null;

//
// Start main this update look timer callback.
//
// This allows the farmer to move 1 pixels per frame
// and cover the required distance to match approx the original this
// i.e. 150 pixels in approximately 4.5 seconds.
//
var g_frequency = 30;	// SGX change to match our clock
var g_nmsec = Math.floor(1000/g_frequency);

