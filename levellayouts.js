/*
  levellayouts.js - Level layouts used by Chuckie Egg
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

// Level description
// size must be 20x28
//
// 0=blank
// 1=wall
// 2=grain
// 3=egg
// 4=ladder
//
// note swans 1-4 are always present,
// swans 5-8 only appear level 25+ 

var level1=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,3,4,0,2,0,0,0,3,2,0,0,0,0,3],
[0,0,0,0,0,1,1,4,1,1,0,1,1,1,1,1,1,0,1,1],
[0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,4,0,0,3,2,0,0,0,0,0,0,0,0],
[0,0,0,0,3,0,0,4,0,1,1,1,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,4,0,0,0,0,0,0,0,0,2,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,1,1,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,0,0,1,1,0,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,3,1,1,0,0,0,0,0,0,0],
[0,0,3,4,0,2,0,4,0,1,1,0,0,0,0,2,0,3,0,0],
[0,0,1,4,1,1,1,4,1,0,0,0,0,0,1,1,1,1,1,0],
[0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,0,4,0,0,0],
[0,3,0,4,0,2,0,4,0,0,0,4,0,3,2,0,4,0,3,0],
[0,1,1,1,1,1,1,4,1,1,1,4,1,1,1,1,4,1,1,0],
[0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,4,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,4,0,0,0],
[0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,4,0,0,0],
[0,0,2,0,3,0,0,4,0,0,0,4,0,2,0,0,4,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level1Hens = 
[
[5, 10],
[8, 5],
[-1, -1],
[-1, -1],
[4, 15],
[6, 20],
[12, 25],
[-1, -1]
];
var level1Farmer = [8, 27];
var level1Lift = [-1,-1,-1,-1,-1];
var level2=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[0,0,0,0,4,0,0,3,0,4,0,0,2,0,0,3,0,4,0,3],
[0,0,0,0,4,1,1,1,1,4,1,0,1,1,1,1,1,4,1,1],
[0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[0,0,4,0,4,0,4,0,0,4,0,0,0,4,0,0,0,4,0,0],
[2,0,4,0,4,0,4,3,0,4,2,0,0,4,0,0,0,4,0,0],
[1,1,4,1,1,1,4,1,1,4,1,0,1,4,1,1,1,1,1,1],
[0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,0,0,0],
[0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,0,0,0],
[0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,4,0,0],
[3,0,4,0,0,0,4,3,0,4,0,0,0,4,0,0,0,4,0,3],
[1,1,4,1,0,1,4,1,1,1,1,1,1,1,1,0,1,4,1,1],
[0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,0,4,0,0,0,4,0,0,4,0,0,0,0,0,0,0,4,0,0],
[3,0,4,0,3,0,4,0,0,4,0,0,0,3,0,0,2,4,0,0],
[1,1,4,1,1,1,1,0,1,4,1,0,1,1,1,0,1,4,1,1],
[0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0],
[2,0,4,2,0,3,0,0,0,4,0,0,3,0,0,2,0,4,0,0],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level2Hens = 
[
[1, 25],
[18, 15],
[6, 5],
[-1, -1],
[11, 15],
[13, 5],
[-1, -1],
[-1, -1]
];
var level2Farmer = [8, 27];
var level2Lift = [-1,-1,-1,-1,-1];
var level3=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
[0,0,0,4,0,0,0,0,4,0,4,0,0,4,1,1,0,0,2,3],
[0,0,0,4,3,0,0,2,4,0,4,0,0,4,0,0,1,0,1,1],
[0,0,0,4,1,0,0,1,4,1,4,1,2,4,0,0,0,0,0,0],
[0,0,0,4,0,0,0,0,4,0,4,0,1,1,0,2,0,0,0,3],
[0,0,0,4,0,0,0,0,4,0,4,0,0,0,0,1,0,3,0,4],
[2,3,0,4,0,0,0,0,4,0,4,0,0,0,0,0,0,1,0,4],
[1,1,1,4,0,0,0,0,4,0,4,0,0,0,0,0,0,0,1,4],
[0,0,0,4,0,0,0,0,4,0,4,0,0,0,0,0,0,0,0,4],
[0,0,0,4,0,0,0,0,4,0,4,0,0,2,0,3,0,0,0,4],
[0,4,0,4,0,0,0,0,4,0,4,0,1,1,0,1,0,0,0,4],
[0,4,2,4,3,0,0,0,4,0,4,0,0,0,0,0,0,0,0,4],
[1,4,1,1,1,0,0,0,4,0,4,0,0,0,0,0,0,0,1,1],
[0,4,0,0,0,0,0,0,4,0,4,0,0,0,0,3,0,1,0,0],
[0,4,0,0,0,0,0,0,4,0,4,0,0,0,0,1,0,0,0,0],
[0,4,0,0,0,0,0,2,4,3,4,0,0,0,1,0,0,0,4,0],
[0,4,0,0,0,0,0,1,1,1,1,0,1,0,0,0,3,0,4,0],
[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,4,0],
[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
[0,4,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
[0,4,2,1,1,0,0,0,0,0,0,0,0,2,0,3,0,0,4,0],
[1,1,1,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level3Hens = 
[
[17, 21],
[2, 11],
[9, 7],
[-1, -1],
[1, 25],
[8, 20],
[-1, -1],
[-1, -1]
];
var level3Farmer = [8, 27];
var level3Lift = [5,-1,-1,-1,-1];
var level4=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0],
[0,0,0,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,4],
[0,0,0,0,0,0,0,0,4,2,0,0,0,2,4,0,0,0,0,4],
[0,0,0,0,0,1,0,1,4,1,1,0,0,1,4,1,3,1,1,4],
[0,0,0,0,1,0,0,0,4,0,0,0,0,0,4,0,0,0,0,4],
[0,0,0,1,0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,4],
[3,0,1,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,4],
[1,0,0,0,0,0,0,0,4,3,0,0,0,0,4,0,0,0,0,4],
[0,0,0,0,0,0,0,0,4,1,1,0,0,1,4,0,1,3,1,4],
[0,0,0,0,0,2,0,1,4,0,0,0,0,0,4,0,0,0,0,0],
[0,0,0,0,0,1,0,0,4,0,0,0,0,0,4,0,0,0,0,0],
[3,0,0,1,0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0],
[1,1,0,0,0,0,0,0,4,0,0,0,0,3,4,0,0,0,0,0],
[0,0,0,0,0,0,0,1,4,0,0,0,0,1,1,1,1,0,0,3],
[0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,1],
[0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,0],
[2,0,0,4,0,0,0,3,4,0,0,0,0,0,0,4,3,0,0,0],
[1,1,1,4,1,0,0,1,4,1,1,0,0,1,1,4,1,1,0,0],
[0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,1],
[0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,0],
[0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,0],
[3,0,0,4,0,0,0,0,4,0,2,0,0,3,0,4,0,0,2,0],
[1,1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level4Hens = 
[
[4, 25],
[10, 5],
[17, 5],
[17, 25],
[10, 20],
[-1, -1],
[-1, -1],
[-1, -1]
];
var level4Farmer = [8, 27];
var level4Lift = [11,-1,-1,-1,-1];
var level5=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,4,3,0,2,0,0,0,0],
[0,0,0,2,4,3,2,2,0,0,0,0,4,1,1,1,0,0,2,3],
[0,0,0,1,4,1,1,1,0,0,0,0,4,0,0,0,0,0,1,1],
[0,0,0,0,4,0,0,0,0,1,0,3,4,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
[0,0,4,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
[3,0,4,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,4,1,4,1,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,4,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,4,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,4,0,4,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0],
[3,0,4,0,4,0,0,4,0,0,2,0,4,0,0,2,0,0,0,3],
[1,1,1,1,1,1,0,4,0,3,1,1,4,1,1,1,0,0,0,1],
[0,0,0,0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0],
[0,0,0,4,0,0,0,0,0,0,4,0,4,0,4,0,0,0,0,0],
[3,0,0,4,0,3,0,4,0,0,4,0,4,0,4,0,0,0,0,0],
[1,1,1,4,1,1,0,4,0,1,4,1,1,3,4,1,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,0,0],
[0,0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,0,0],
[3,0,0,4,2,2,2,4,0,0,4,0,0,2,4,2,0,0,2,0],
[1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level5Hens = 
[
[1, 20],
[3, 15],
[1, 10],
[14, 15],
[15, 20],
[-1, -1],
[-1, -1],
[-1, -1]
];
var level5Farmer = [8, 27];
var level5Lift = [16,-1,-1,-1,-1];
var level6=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,3],
[0,0,0,0,0,0,3,0,0,0,0,0,0,0,4,0,0,4,1,1],
[0,0,0,3,0,0,1,0,1,0,0,0,3,0,4,0,0,4,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,1,1,4,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[2,0,2,2,4,0,0,3,0,0,0,0,0,0,0,0,0,4,0,3],
[1,1,1,1,4,1,0,0,0,0,0,0,0,0,0,0,1,4,1,1],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0],
[0,0,0,0,4,0,0,2,0,0,0,0,3,0,4,0,3,4,0,0],
[0,0,1,1,4,1,1,1,0,0,0,0,1,1,4,1,1,4,0,2],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,4,0,0,4,1,1],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0],
[4,0,0,0,4,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0],
[4,0,0,0,4,3,0,0,0,0,0,0,3,0,4,0,0,4,0,0],
[4,1,0,1,4,1,0,0,0,0,0,0,1,1,1,0,0,4,0,0],
[4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[4,0,3,0,0,0,0,0,0,0,0,2,2,2,2,0,3,4,0,0],
[1,1,1,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level6Hens = 
[
[1, 25],
[1, 10],
[13, 20],
[18, 10],
[18, 16],
[-1, -1],
[-1, -1],
[-1, -1]
];
var level6Farmer = [8, 27];
var level6Lift = [9,-1,-1,-1,-1];
var level7=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,4,0,4,0,4,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,4,3,4,3,4,3,0,0,4,0,0,0,0,0,0],
[0,0,0,0,0,4,0,4,0,4,0,0,2,4,0,3,0,0,0,0],
[0,0,0,0,0,4,0,4,0,4,0,1,1,4,1,1,1,0,0,0],
[0,0,0,0,0,4,0,4,0,4,0,0,0,4,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
[0,4,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
[0,4,0,2,0,0,0,3,0,0,0,0,0,4,0,4,0,0,0,0],
[1,4,1,1,1,0,1,1,0,0,0,0,0,4,0,4,0,0,0,0],
[0,4,0,0,0,0,0,0,0,0,0,0,1,1,1,4,3,0,0,0],
[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0],
[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0],
[0,4,0,0,0,1,0,0,1,0,0,3,0,0,0,4,0,0,0,0],
[1,4,1,0,0,1,0,0,1,0,1,1,0,0,0,4,0,0,0,0],
[0,4,0,0,0,1,0,0,0,0,0,0,0,0,0,4,3,0,0,0],
[0,4,0,0,0,1,0,3,2,0,0,0,0,0,1,1,1,0,0,0],
[0,4,0,4,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
[0,4,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,4,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,4,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,4,0,4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0],
[0,4,3,4,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0],
[0,4,0,4,0,1,1,0,0,1,0,0,0,0,0,1,1,3,0,0],
[0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level7Hens = 
[
[1, 10],
[14, 17],
[13, 5],
[-1, -1],
[0, 22],
[2, 15],
[-1, -1],
[-1, -1]
];
var level7Farmer = [8, 27];
var level7Lift = [18,-1,-1,-1,-1];
var level8=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,1,0,3,1,3,1,1,4,1,1,3,1,3,0,1,0,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0],
[0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0],
[0,0,0,1,4,1,1,0,3,1,1,1,3,0,1,1,4,1,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0],
[0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0],
[0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0],
[0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0],
[0,0,1,1,1,1,3,0,1,1,4,1,1,0,3,1,1,1,1,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
[0,0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,4,0,0],
[0,0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,4,0,0],
[0,0,1,4,1,3,0,1,1,1,1,1,1,1,0,3,1,4,1,0],
[0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
[0,2,2,4,2,2,2,0,2,2,2,2,2,2,2,2,2,4,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var level8Hens = 
[
[10, 15],
[10, 5],
[17, 25],
[-1, -1],
[3, 10],
[17, 10],
[-1, -1],
[-1, -1]
];
var level8Farmer = [7, 27];
var level8Lift = [-1,-1,-1,-1,-1];
