(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SpeechBallooner = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Point, Rect, Size, SpeechBallooner, closestPointToRectDiff;

closestPointToRectDiff = function(p, rect) {
  var dx, dy, maxDx, maxDy, originDx, originDy;
  originDx = rect.origin.x - p.x;
  originDy = rect.origin.y - p.y;
  maxDx = p.x - (rect.origin.x + rect.size.width);
  maxDy = p.y - (rect.origin.y + rect.size.height);
  dx = Math.max(originDx, 0, maxDx);
  dy = Math.max(originDy, 0, maxDy);
  if (dx !== 0) {
    dx = -dx * (maxDx / Math.abs(maxDx));
  }
  if (dy !== 0) {
    dy = -dy * (maxDy / Math.abs(maxDy));
  }
  return new Point(dx, dy);
};

Point = (function() {
  function Point(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  Point.prototype.toString = function() {
    return this.x + ", " + this.y;
  };

  return Point;

})();

Size = (function() {
  function Size(width1, height1) {
    this.width = width1;
    this.height = height1;
  }

  return Size;

})();

Rect = (function() {
  function Rect(x, y, width, height) {
    this.origin = new Point(x, y);
    this.size = new Size(width, height);
  }

  return Rect;

})();

SpeechBallooner = (function() {
  function SpeechBallooner(width1, height1, text) {
    this.width = width1;
    this.height = height1;
    this.tail = new Point(0.1 * this.width, 0.95 * this.height);
    this.balloon = new Rect(0.05 * this.width, 0.05 * this.height, 0.9 * this.width, 0.8 * this.height);
    this.fill = "#FFF";
    this.stroke = "#000";
    this.strokeWidth = "3";
    this.text = text || "He's dead Jim.";
  }

  SpeechBallooner.prototype.w = function(percent) {
    return (percent / 100 * this.balloon.size.width) + this.balloon.origin.x;
  };

  SpeechBallooner.prototype.h = function(percent) {
    return (percent / 100 * this.balloon.size.height) + this.balloon.origin.y;
  };

  SpeechBallooner.prototype.getBalloonPoints = function() {
    return [[new Point(this.w(0), this.h(0)), new Point(this.w(0), this.h(0)), new Point(this.w(50), this.h(0))], [new Point(this.w(100), this.h(0)), new Point(this.w(100), this.h(0)), new Point(this.w(100), this.h(50))], [new Point(this.w(100), this.h(100)), new Point(this.w(100), this.h(100)), new Point(this.w(50), this.h(100))], [new Point(this.w(0), this.h(100)), new Point(this.w(0), this.h(100)), new Point(this.w(0), this.h(50))]];
  };

  SpeechBallooner.prototype.getPath = function() {
    var component, diff, i, j, len, len1, path, point, points, tailEnd, tailEndXDiff, tailEndYDiff, tailStart;
    diff = closestPointToRectDiff(this.tail, this.balloon);
    points = this.getBalloonPoints();
    console.log('diff', diff);
    if (diff.x === 0 && diff.y === 0) {
      path = "M " + (points[3][2].toString());
    } else {
      tailStart = new Point(diff.x + this.tail.x, diff.y + this.tail.y);
      path = "M " + (this.tail.toString());
      path += " L " + (tailStart.toString());
      if (diff.x === 0 && diff.y > 0) {
        points.push(points.shift());
        tailEnd = new Point(tailStart.x - 10, tailStart.y);
        tailEndXDiff = tailEnd.x - this.balloon.origin.x;
        if (tailEndXDiff <= 0) {
          tailEnd = new Point(this.balloon.origin.x, tailStart.y + 10);
        }
      } else if (diff.x < 0 && diff.y >= 0) {
        points.push(points.shift());
        points.push(points.shift());
        tailEnd = new Point(tailStart.x, tailStart.y - 10);
        tailEndYDiff = tailEnd.y - this.balloon.origin.y;
        if (tailEndYDiff <= 0) {
          tailEnd = new Point(tailStart.x - 10, this.balloon.origin.y);
        }
      } else if (diff.x <= 0 && diff.y < 0) {
        points.unshift(points.pop());
        tailEnd = new Point(tailStart.x + 10, tailStart.y);
        tailEndXDiff = tailEnd.x - (this.balloon.origin.x + this.balloon.size.width);
        if (tailEndXDiff > 0) {
          tailEnd = new Point(this.balloon.origin.x + this.balloon.size.width, tailStart.y - 10);
        }
      } else {
        tailEnd = new Point(tailStart.x, tailStart.y + 10);
        tailEndYDiff = tailEnd.y - (this.balloon.origin.y + this.balloon.size.height);
        if (tailEndYDiff > 0) {
          tailEnd = new Point(tailStart.x + 10, this.balloon.origin.y + this.balloon.size.height);
        }
      }
      points[3][2] = tailEnd;
    }
    for (i = 0, len = points.length; i < len; i++) {
      point = points[i];
      path += " C";
      for (j = 0, len1 = point.length; j < len1; j++) {
        component = point[j];
        path += " " + component.toString();
      }
    }
    path += " Z";
    return path;
  };

  SpeechBallooner.prototype.getSVG = function() {
    return "<svg width=\"" + this.width + "\" height=\"" + this.height + "\">\n  <path fill=\"" + this.fill + "\" stroke=\"" + this.stroke + "\" stroke-width=\"" + this.strokeWidth + "\" d=\"" + (this.getPath()) + "\" />\n  <text alignment-baseline=\"central\" text-anchor=\"middle\" fill=\"" + this.stroke + "\" x=\"" + (this.w(50)) + "\" y=\"" + (this.h(45)) + "\">" + this.text + "</text>\n</svg>";
  };

  return SpeechBallooner;

})();

if (module && module.exports) {
  module.exports = SpeechBallooner;
}


},{}]},{},[1])(1)
});