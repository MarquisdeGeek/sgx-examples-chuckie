/*
  audio.js - Audio library for Chuckie Egg
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


function onAudioLoad()
{
    //audio.numLoadedSamples++;
}


function mute(enabled)
{
    audio.stopAll();
    audio.enable(enabled);
}

//
// Audio handling
//
function AudioSystem()
{
    this.enabled = g_audioEnabled;

    // Audio samples
    this.leftRightSample = 0; // looped
    this.upDownSample = 1;    // looped
    this.applauseSample = 2;  // looped
    this.jumpSample = 3;
    this.fallSample = 4;
    this.eggSample = 5;
    this.grainSample = 6;
    this.tuneSample = 7;

    // Playing state of each sample.
    this.playing = new Array;
    this.playing.length = 8;

    // Audio support
    this.audioTypeNone = 0;
    this.audioTypeLiveAudio = 1;
    this.audioTypeQuickTime = 2;
    this.audioTypeWMP = 3; // Default windows media player in IE
    this.audioTypeWMPPlugin = 4; // Windows media player plugin for Mozilla browsers (firefox)
    this.audioTypeOther = 5;
    this.audioTypeWHATWG = 6;
	this.audioTypeSGX = 7;

    // The currently enumerated support.
    this.audioSupport = this.audioTypeNone;

    // Mimetypes to use based on detected audio support.
    // Could also try audio/mpeg mimeType.
    this.audioMimeType = ["", "audio/wav", "audio/wav", "application/x-mplayer2", "application/x-mplayer2", "audio/wav"];

    this.Init = function()
    {
        if(!this.enabled)
            return;

        // Check for audio support
		// SGX - always use SGX audio
        this.audioSupport = this.audioTypeSGX;	//this.EnumerateAudioSupport();
        if(this.audioSupport == this.audioTypeNone)
            return;
        
        if(this.audioSupport == this.audioTypeWHATWG)
        {
            this.cachedSamples = new Array;
            this.cachedSamples.length = 8;
            this.cachedSamples[this.leftRightSample] = new Audio('sounds/leftright.wav');
            this.cachedSamples[this.upDownSample] = new Audio('sounds/updown.wav');
            this.cachedSamples[this.applauseSample] = new Audio('sounds/applause.wav');
            this.cachedSamples[this.jumpSample] = new Audio('sounds/jump.wav');
            this.cachedSamples[this.fallSample] = new Audio('sounds/fall.wav');
            this.cachedSamples[this.eggSample] = new Audio('sounds/egg.wav');
            this.cachedSamples[this.grainSample] = new Audio('sounds/grain.wav');
            this.cachedSamples[this.tuneSample] = new Audio('sounds/tune.wav');
        }
		else if (this.audioSupport == this.audioTypeSGX) 
		{
			// This order matches the indices above, for convenience.
			var pSoundlist = ["leftright", "updown", "applause", "jump", "fall", "egg", "grain", "tune"];
			this.sgxSamples = new Array;
			for(var iSoundIndex=0;iSoundIndex<pSoundlist.length;++iSoundIndex) {
				this.sgxSamples[iSoundIndex] = sgx.audio.Engine.get().registerGlobalSound("sounds/" + pSoundlist[iSoundIndex]);
			}
		}
        else
        {
            // Load audio samples.
            var htmlStr = this.loadAudioSample("eggSound", "sounds/egg", false);
            htmlStr += this.loadAudioSample("grainSound", "sounds/grain", false);
            htmlStr += this.loadAudioSample("fallSound", "sounds/fall", false);
            htmlStr += this.loadAudioSample("jumpSound", "sounds/jump", false);
            htmlStr += this.loadAudioSample("tuneSound", "sounds/tune", false);
            htmlStr += this.loadAudioSample("upDownSound", "sounds/updown", true);
            htmlStr += this.loadAudioSample("applauseSound", "sounds/applause", true);
            htmlStr += this.loadAudioSample("leftRightSound", "sounds/leftright", true);

            var element = document.getElementById("audioDiv");
            element.innerHTML = htmlStr;

            // Resolve new embed elements and cache in local variables.
            this.cachedSamples = 
            [
                document.getElementById("leftRightSound"),
                document.getElementById("upDownSound"),
                document.getElementById("applauseSound"),
                document.getElementById("jumpSound"),
                document.getElementById("fallSound"),
                document.getElementById("eggSound"),
                document.getElementById("grainSound"),
                document.getElementById("tuneSound")
            ];
        }

        for(var i = 0; i < this.playing.length; ++i)
            this.playing[i] = false;
    }

    // Check browser support for audio playback
    this.EnumerateAudioSupport = function()
    {
        var agt = navigator.userAgent.toLowerCase();

        // Are we running on windows?
        if(agt.indexOf("windows") != -1)
        {
            if((agt.indexOf("msie") == -1) && navigator.mimeTypes)
            {
                // Is Windows Media Player plugin for Mozilla(firefox) available? - it provides the application/x-ms-wmp mimetype
                if(navigator.mimeTypes["application/x-ms-wmp"] && navigator.mimeTypes["application/x-ms-wmp"].enabledPlugin)
                {
                    //  Prefer this plugin due to lower latency
                    return  this.audioTypeWMPPlugin;     
                }
                // Opera supports draft spec of WHATWG Web Applications specification which includes an Audio object
                else if(agt.indexOf("opera") != -1)
                {
                     return this.audioTypeWHATWG;
                }
                else if(navigator.mimeTypes["audio/wav"] && navigator.mimeTypes["audio/wav"].enabledPlugin) 
                {
                    var pluginName  = navigator.mimeTypes["audio/wav"].enabledPlugin.name.toLowerCase();

                    //  We are probably using QuickTime, LiveAudio or Totem.
                    if(pluginName.indexOf("quicktime")  != -1)
                         return this.audioTypeQuickTime;

                    if(pluginName.indexOf("liveaudio")  != -1)
                         return this.audioTypeLiveAudio;

                    return  this.audioTypeOther;
                }
            }            
            else 
            {
                // This is Internet Explorer and everything is fully scriptable
                return this.audioTypeWMP;
            }
        }
        else // (Mac/Safari & Linux/FFox) not IE
        {
                // Could also try audio/mpeg mimeType.
                if(navigator.mimeTypes["audio/wav"] && navigator.mimeTypes["audio/wav"].enabledPlugin)
                    return this.audioTypeOther; 
        }

        return this.audioTypeNone;
    }
    
    this.enable = function(enabled)
    {
        this.enabled = enabled;
    }

    this.getMimeType = function()
    {
        return this.audioMimeType[this.audioSupport];
    }

    this.loadAudioSample = function(soundId, fileName, loop)
    {
        var str = "";
        var loopStr = (loop) ? "1" : "0";

        // Installing quicktime breaks wav playback in internet explorer because it overrides the MIME type.
        // I can make it work again by using the object tag so I can specify the plugin to use by classid
        // i.e not the QuickTime one!
        if(this.audioSupport == this.audioTypeWMP)
        {
            str = '<object id="'+soundId+'" height="0" width="0" name="'+soundId+'" data="'+fileName+'.wav" type="audio/x-ms-wma">';
            str += '<param name="src" value="'+fileName+'.wav">';
            str += '<param name="autoStart" value="0">';
            str += '<param name="Loop" value="'+loopStr+'">';
            str += '</object>';
/*
                str = '<object id="'+soundId+'" name="'+soundId+'" height="0" width="0" classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95">';
            str += '<param name="AutoStart" value="0"/>';
            str += '<param name="FileName" value="'+fileName+'.wav"/>';
            str += '<param name="Loop" value="'+loopStr+'"/>';
            str += '</object>';
*/
        }
	else if(this.audioSupport == this.audioTypeWMPPlugin)
	{
            str = '<object id="'+soundId+'" height="0" width="0" name="'+soundId+'" data="'+fileName+'.wav" type="application/x-ms-wmp">';
            str += '<param name="src" value="'+fileName+'.wav">';
            str += '<param name="autoStart" value="0">';
            str += '<param name="loop" value="'+loopStr+'">';
            str += '</object>';
	}
        else
        {
            str = '<embed id="'+soundId+'" name="'+soundId+'" src="'+fileName+'.wav" autostart="0" loop="'+loopStr+'" height="0" width="0" type="'+this.getMimeType()+'" onload="onAudioLoad();"></embed>';
        }

        return str;
    }

    this.play = function(sound)
    {
        if(!this.enabled)
            return;

        if(this.playing[sound])
            return;


        switch(this.audioSupport)
        {
			case this.audioTypeSGX:
				sgx.audio.Engine.get().playSound(this.sgxSamples[sound]);
				break;
				
            case this.audioTypeNone:
                break;
            case this.audioTypeLiveAudio:
            case this.audioTypeQuickTime:
            case this.audioTypeOther:
            case this.audioTypeWMP:
                try { this.cachedSamples[sound].Play(); } catch(e) { } // Mozilla is case sensitive here
                break;
            case this.audioTypeWMPPlugin:
                 try { this.cachedSamples[sound].controls.play(); } catch(e) { }
                break;
            case this.audioTypeWHATWG:
                if(sound < 3)
                    this.cachedSamples[sound].loop();
                else
                    this.cachedSamples[sound].play();
                break;
        };

        this.playing[sound] = true;
        
        // Also stop the samples
        switch(sound)
        {
            case this.leftRightSample:
                this.stop(this.jumpSample);
                this.stop(this.upDownSample);
                this.stop(this.fallSample);
                break;
            case this.upDownSample:
                this.stop(this.jumpSample);
                this.stop(this.leftRightSample);
                this.stop(this.fallSample);
                break;
            case this.applauseSample:
                this.stopAll();
                break;
            case this.jumpSample:
                this.stop(this.upDownSample); 
                this.stop(this.leftRightSample);
                this.stop(this.fallSample);
                break;
            case this.fallSample:
                this.stop(this.upDownSample);
                this.stop(this.leftRightSample);
                this.stop(this.jumpSample);
                break;
            case this.tuneSample:
                this.stopAll();
                break;
        };          
    }
    
    this.stop = function(sound)
    {
        if(!this.enabled)
            return;
    
        if(!this.playing[sound])
            return;

        switch(this.audioSupport)
        {
 			case this.audioTypeSGX:
				sgx.audio.Engine.get().stopSound(this.sgxSamples[sound]);
				break;
				
            case this.audioTypeNone:
                break;
            case this.audioTypeLiveAudio:
            case this.audioTypeQuickTime:
            case this.audioTypeOther:
            case this.audioTypeWMP:
                try { this.cachedSamples[sound].Stop(); } catch(e) { } // Mozilla is case sensitive here 
                try { this.cachedSamples[sound].Rewind(); } catch(e) { } // Mozilla is case sensitive here 
                break;
            case this.audioTypeWMPPlugin:
                try { this.cachedSamples[sound].controls.stop(); } catch(e) { }
                break;
            case this.audioTypeWHATWG:
                this.cachedSamples[sound].stop();
                break;
        };

        this.playing[sound] = false;
    }
    
    this.stopAll = function()
    {
        if(!this.enabled)
            return;
    
        this.stop(this.upDownSample);
        this.stop(this.leftRightSample);
        this.stop(this.jumpSample);
        this.stop(this.fallSample);
    }
    
    
} // end of audio object.
