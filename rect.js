/*
  rect.js - Rectangular region helpers for Chuckie Egg
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
// Rectangle management
//
function Rect(t, r, b, l)
{
    this.top = t;
    this.right = r;
    this.bottom = b;
    this.left = l;

    this.overlaps = function(rect)
    {
		return (this.left <= rect.right && this.right >= rect.left && this.bottom >= rect.top && this.top <= rect.bottom);
    }
}
