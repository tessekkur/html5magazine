/*
  This file is part of the Ofi Labs X2 project.

  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint browser: true, sloppy: true, indent: 4 */
/*global KineticModel: true */

function FlickList(element, name) {

    var /*el = document.getElementById(id),*/
        el = element,
    	scroller = new KineticModel(),
        pressed = false,
        refPos = 0
    	idName = name;
        //console.log(el);
    function adjustRange() {
        var max = parseInt(window.getComputedStyle(el).height, 10);
        //console.log('max1: ' + max);
        //console.log('window.innerHeight: ' + window.innerHeight);
        max -= window.innerHeight;
        //console.log('max2: ' + max);
        if(max < 0)
        {
        	removeEvents(el);
        	moveToTop(el);
        	return;
        }
        addEvents(el);
        scroller.setRange(0, max);
    }
    
    function tap(e) {
        pressed = true;
        //console.log('untap: ' + idName + '');
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            refPos = e.targetTouches[0].clientY;
        } else {
            refPos = e.clientY;
        }

        scroller.resetSpeed();
        /**/
        e.preventDefault();
        //e.stopPropagation();
        return false;
        /**/
    }

    function untap(e) {
        pressed = false;
        
        scroller.release();
        /**/
        e.preventDefault();
        //e.stopPropagation();
        return false;
        /**/
    }

    function drag(e) {
        var pos, delta;

        if (!pressed) {
            return;
        }

        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            pos = e.targetTouches[0].clientY;
        } else {
            pos = e.clientY;
        }

        delta = refPos - pos;
        if (delta > 2 || delta < -2) {
            scroller.setPosition(scroller.position += delta);
            refPos = pos;
        }
        /**/
        e.preventDefault();
        //e.stopPropagation();
        return false;
        /**/
    }

    scroller.onPositionChanged = null;
    
    if (el.style.hasOwnProperty('webkitTransform')) {
        scroller.onPositionChanged = function (y) {
            el.style.webkitTransform = 'translate3d(0, -' + Math.floor(y) + 'px, 0)';
        };
    }
    
    if (!scroller.onPositionChanged && (typeof el.style['MozTransform'] === 'string')) {
        scroller.onPositionChanged = function (y) {
            el.style.MozTransform = 'translateY(-' + Math.floor(y) + 'px)';
        };
    }

    // Fall back to CSS positioning.
    if (!scroller.onPositionChanged) {
        el.style.position = 'absolute';
        el.style.left = 0;
        scroller.onPositionChanged = function (y) {
            el.style.top = '-' + Math.floor(y) + 'px';
        };
    }
    function moveToTop(el){
    	//console.log(el);
    	if(el.style.hasOwnProperty('webkitTransform')){
    		el.style.webkitTransform = 'translate3d(0, 0, 0)';
    	}
    	else if(typeof el.style['MozTransform'] === 'string'){
    		el.style.MozTransform = 'translateY(0)';
    	}
    	else{
    		el.style.top = '0px';
    	}
    }
    function addEvents(el){
	    el.addEventListener('mousedown', tap);
	    el.addEventListener('mousemove', drag);
	    el.addEventListener('mouseup', untap);
	
	    if (typeof window.ontouchstart !== 'undefined') {
	        el.addEventListener('touchstart', tap);
	        el.addEventListener('touchmove', drag);
        el.addEventListener('touchend', untap);
    }
    }
    function removeEvents(el){
    	el.removeEventListener('mousedown', tap);
        el.removeEventListener('mousemove', drag);
        el.removeEventListener('mouseup', untap);

        if (typeof window.ontouchstart !== 'undefined') {
            el.removeEventListener('touchstart', tap);
            el.removeEventListener('touchmove', drag);
            el.removeEventListener('touchend', untap);
        }
    }
    
    return {
        scroller: scroller,
        adjustRange: adjustRange
    };
}