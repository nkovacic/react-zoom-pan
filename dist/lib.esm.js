import React, { createRef } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var Consts = {
    MODE_GLOBAL_PAN: 1,
    MODE_RUBER_BAND_MOVE: 2,
    MODE_RUBER_BAND_ROTATE: 3,
    MODE_RUBER_BAND_RESIZE_UL: 4,
    MODE_RUBER_BAND_RESIZE_UR: 5,
    MODE_RUBER_BAND_RESIZE_DL: 6,
    MODE_RUBER_BAND_RESIZE_DR: 7,
    MODE_RUBER_PADDING: 8,
    MODE_RUBER_ADD_LINK_LEFT: 9,
    MODE_RUBER_ADD_LINK_RIGHT: 10,
    MODE_PAGE_MOVE: 11,
    CLOCKWISE: 22,
    UNCLOCKWISE: 23,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_COPY: 67,
    KEY_CUT: 88,
    KEY_PASTE: 86,
    KEY_DELETE: 46,
    RUBBER_BAND_HANDLE_SIZE: 5,
    RUBBER_BAND_EVENT_HANDLE_SIZE: 10,
    RUBBER_BAND_EVENT_HANDLE_SIZE_HALF: 5,
};
var ObjectTypes = {
    TYPE_ITEM: 0,
    TYPE_LINK: 1,
};

var Matrix = /** @class */ (function () {
    function Matrix(data) {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.apply(data);
    }
    Matrix.prototype.apply = function (data) {
        var values = [1, 0, 0, 1, 0, 0];
        if (data) {
            values = data.split(',');
        }
        this.a = parseFloat(values[0]);
        this.b = parseFloat(values[1]);
        this.c = parseFloat(values[2]);
        this.d = parseFloat(values[3]);
        this.e = parseFloat(values[4]);
        this.f = parseFloat(values[5]);
        this.transform = this.transform.bind(this);
        this.rotate = this.rotate.bind(this);
        this.applyToPoint = this.applyToPoint.bind(this);
        this._isEqual = this._isEqual.bind(this);
    };
    Matrix.prototype.flipX = function () {
        return this.transform(-1, 0, 0, 1, 0, 0);
    };
    /**
     * Flips the vertical values.
     */
    Matrix.prototype.flipY = function () {
        return this.transform(1, 0, 0, -1, 0, 0);
    };
    Matrix.prototype.reset = function () {
        this.a = this.d = 1;
        this.b = this.c = this.e = this.f = 0;
        return this;
    };
    Matrix.prototype.rotate = function (angle) {
        var cos = Math.cos(angle * 0.017453292519943295), sin = Math.sin(angle * 0.017453292519943295);
        return this.transform(cos, sin, -sin, cos, 0, 0);
    };
    Matrix.prototype.rotateDeg = function (angle) {
        return this.rotate(angle * 0.017453292519943295);
    };
    Matrix.prototype.scale = function (sx, sy) {
        return this.transform(sx, 0, 0, sy, 0, 0);
    };
    Matrix.prototype.scaleX = function (sx) {
        return this.transform(sx, 0, 0, 1, 0, 0);
    };
    Matrix.prototype.scaleY = function (sy) {
        return this.transform(1, 0, 0, sy, 0, 0);
    };
    Matrix.prototype.skew = function (sx, sy) {
        return this.transform(1, sy, sx, 1, 0, 0);
    };
    Matrix.prototype.skewX = function (sx) {
        return this.transform(1, 0, sx, 1, 0, 0);
    };
    Matrix.prototype.skewY = function (sy) {
        return this.transform(1, sy, 0, 1, 0, 0);
    };
    Matrix.prototype.setTransform = function (a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        return this;
    };
    Matrix.prototype.translate = function (tx, ty) {
        return this.transform(1, 0, 0, 1, tx, ty);
    };
    Matrix.prototype.transform = function (a2, b2, c2, d2, e2, f2) {
        var a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, e1 = this.e, f1 = this.f;
        var result = new Matrix();
        result.a = a1 * a2 + c1 * b2;
        result.b = b1 * a2 + d1 * b2;
        result.c = a1 * c2 + c1 * d2;
        result.d = b1 * c2 + d1 * d2;
        result.e = a1 * e2 + c1 * f2 + e1;
        result.f = b1 * e2 + d1 * f2 + f1;
        return result;
    };
    Matrix.prototype.multiply = function (matrix) {
        var result = new Matrix();
        var a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, e1 = this.e, f1 = this.f;
        result.a = a1 * matrix.a + c1 * matrix.b;
        result.b = b1 * matrix.a + d1 * matrix.b;
        result.c = a1 * matrix.c + c1 * matrix.d;
        result.d = b1 * matrix.c + d1 * matrix.d;
        result.e = a1 * matrix.e + c1 * matrix.f + e1;
        result.f = b1 * matrix.e + d1 * matrix.f + f1;
        return result;
    };
    Matrix.prototype.inverse = function () {
        var a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f, m = new Matrix(), dt = a * d - b * c;
        m.a = d / dt;
        m.b = -b / dt;
        m.c = -c / dt;
        m.d = a / dt;
        m.e = (c * f - d * e) / dt;
        m.f = -(a * f - b * e) / dt;
        return m;
    };
    Matrix.prototype.interpolate = function (m2, t) {
        var m = new Matrix();
        m.a = this.a + (m2.a - this.a) * t;
        m.b = this.b + (m2.b - this.b) * t;
        m.c = this.c + (m2.c - this.c) * t;
        m.d = this.d + (m2.d - this.d) * t;
        m.e = this.e + (m2.e - this.e) * t;
        m.f = this.f + (m2.f - this.f) * t;
        return m;
    };
    Matrix.prototype.applyToPoint = function (x, y) {
        return {
            x: x * this.a + y * this.c + this.e,
            y: x * this.b + y * this.d + this.f,
        };
    };
    Matrix.prototype.applyToArray = function (points) {
        var i = 0, p, l, mxPoints = [];
        if (typeof points[0] === 'number') {
            l = points.length;
            while (i < l) {
                p = this.applyToPoint(points[i++], points[i++]);
                mxPoints.push(p.x, p.y);
            }
        }
        else {
            for (; (p = points[i]); i++) {
                mxPoints.push(this.applyToPoint(p.x, p.y));
            }
        }
        return mxPoints;
    };
    Matrix.prototype.applyToTypedArray = function (points) {
        var i = 0, p, l = points.length, mxPoints = new Float32Array(l);
        while (i < l) {
            p = this.applyToPoint(points[i], points[i + 1]);
            mxPoints[i++] = p.x;
            mxPoints[i++] = p.y;
        }
        return mxPoints;
    };
    Matrix.prototype.isIdentity = function () {
        return (this._isEqual(this.a, 1) &&
            this._isEqual(this.b, 0) &&
            this._isEqual(this.c, 0) &&
            this._isEqual(this.d, 1) &&
            this._isEqual(this.e, 0) &&
            this._isEqual(this.f, 0));
    };
    Matrix.prototype.isEqual = function (m) {
        return (this._isEqual(this.a, m.a) &&
            this._isEqual(this.b, m.b) &&
            this._isEqual(this.c, m.c) &&
            this._isEqual(this.d, m.d) &&
            this._isEqual(this.e, m.e) &&
            this._isEqual(this.f, m.f));
    };
    Matrix.prototype._isEqual = function (f1, f2) {
        return Math.abs(f1 - f2) < 1e-14;
    };
    Matrix.prototype.matrixToText = function () {
        return (this.a +
            ', ' +
            this.b +
            ', ' +
            this.c +
            ', ' +
            this.d +
            ', ' +
            this.e +
            ', ' +
            this.f);
    };
    Object.defineProperty(Matrix.prototype, "trx", {
        get: function () {
            return this.e;
        },
        set: function (value) {
            this.e = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "try", {
        get: function () {
            return this.f;
        },
        set: function (value) {
            this.f = value;
        },
        enumerable: false,
        configurable: true
    });
    return Matrix;
}());

var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Point.prototype.matrixTransform = function (matrix) {
        var x = this.x;
        var y = this.y;
        this.x = x * matrix.a + y * matrix.c + matrix.e;
        this.y = x * matrix.b + y * matrix.d + matrix.f;
    };
    return Point;
}());

var Registry = /** @class */ (function () {
    function Registry() {
        var _this = this;
        this.addAll = function (list) {
            if (!list)
                return;
            _this.data = {};
            list.forEach(function (element) {
                _this.data[element.id] = element;
            });
        };
        this.data = {};
    }
    Registry.prototype.add = function (id, obj) {
        this.data[id] = obj;
    };
    Registry.prototype.del = function (id) {
        delete this.data[id];
    };
    Registry.prototype.get = function (id) {
        return this.data[id];
    };
    Registry.prototype.delAll = function () {
        this.data = {};
    };
    return Registry;
}());
var instanceRegistry = new Registry();

var radiansFactor = 180 / Math.PI;
var SpacialHelper = /** @class */ (function () {
    function SpacialHelper() {
    }
    SpacialHelper.normaliseVector = function (vector) {
        if (Math.abs(vector.x) > Math.abs(vector.y)) {
            return vector.x > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        }
        else {
            return vector.y > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        }
    };
    //Distance between 2 points
    SpacialHelper.calculateDistance = function (p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };
    SpacialHelper.calculateRotationsAngle = function (p1, center, p2) {
        var p1Center = SpacialHelper.calculateDistance(p1, center);
        var p2Center = SpacialHelper.calculateDistance(p2, center);
        var p1p2 = SpacialHelper.calculateDistance(p1, p2);
        var enu = Math.pow(p1Center, 2) + Math.pow(p2Center, 2) - Math.pow(p1p2, 2);
        var deno = 2 * p1Center * p2Center;
        return Math.acos(enu / deno) * radiansFactor;
    };
    SpacialHelper.getParentMatrix = function (id, combine) {
        var parentId = instanceRegistry.get(id).parent;
        if (!parentId)
            return combine;
        var parentObj = instanceRegistry.get(parentId);
        var parentMtx = parentObj.matrix;
        if (combine)
            combine = combine.multiply(parentMtx);
        else
            combine = parentMtx;
        return SpacialHelper.getParentMatrix(parentId, combine);
    };
    SpacialHelper.getCombineMatrix = function (id) {
        var combine = new Matrix(instanceRegistry.get(id).transform);
        var parentMtx = SpacialHelper.getParentMatrix(id, combine);
        return parentMtx ? parentMtx : combine;
    };
    SpacialHelper.degrees = function (radians) {
        return radians * radiansFactor;
    };
    SpacialHelper.rotateToCenter = function (cx, cy, angle, matrix) {
        if (angle == 0 || !matrix)
            return matrix;
        matrix = matrix.translate(cx, cy);
        matrix = matrix.rotate(angle);
        matrix = matrix.translate(-cx, -cy);
        return matrix;
    };
    SpacialHelper.scaleToCenter = function (cx, cy, scale, matrix) {
        if (scale == 0 || !matrix)
            return matrix;
        matrix = matrix.translate(cx, cy);
        matrix = matrix.scale(scale, scale);
        matrix = matrix.translate(-cx, -cy);
        return matrix;
    };
    SpacialHelper.getRotationDirection = function (p1, p2, center) {
        var vector = { x: p2.x - p1.x, y: p2.y - p1.y };
        vector = SpacialHelper.normaliseVector(vector);
        //we are on x
        if (vector.y === 0) {
            if (p1.y - center.y < 0) {
                return vector.x > 0 ? Consts.CLOCKWISE : Consts.UNCLOCKWISE;
            }
            else {
                return vector.x < 0 ? Consts.CLOCKWISE : Consts.UNCLOCKWISE;
            }
        }
        else {
            if (p1.x - center.x > 0) {
                return vector.y > 0 ? Consts.CLOCKWISE : Consts.UNCLOCKWISE;
            }
            else {
                return vector.y < 0 ? Consts.CLOCKWISE : Consts.UNCLOCKWISE;
            }
        }
    };
    SpacialHelper.transfromIncrement = function (dx, dy, global, selectedObjMatrix) {
        //La concatenada
        var matrix = global;
        if (global) {
            matrix = matrix.multiply(selectedObjMatrix);
        }
        else {
            matrix = selectedObjMatrix;
        }
        var pts = new Point(0, 0);
        var pte = new Point(dx, dy);
        var inverse = matrix.inverse();
        pts.matrixTransform(inverse);
        pte.matrixTransform(inverse);
        return { dx: pte.x - pts.x, dy: pte.y - pts.y };
    };
    SpacialHelper.coordinatesGlobalToLocal = function (x, y, global, parent) {
        //La concatenada
        var pts = new Point(x, y);
        if (global)
            pts.matrixTransform(global.inverse());
        if (parent)
            pts.matrixTransform(parent.inverse());
        return pts;
    };
    SpacialHelper.transformToViewPort = function (x, y, globalM, itemM, parent) {
        var pts = new Point(x, y);
        if (!globalM || !itemM)
            return pts;
        if (parent)
            globalM = globalM.multiply(parent);
        var matrix = globalM.multiply(itemM);
        pts.matrixTransform(matrix);
        return pts;
    };
    SpacialHelper.viewPorttoObject = function (x, y, globalM, parent) {
        var itemMatrix = new Matrix();
        itemMatrix.translate(x, y);
        var contextMatrix = globalM ? globalM : itemMatrix;
        if (parent)
            contextMatrix = contextMatrix.multiply(parent);
        contextMatrix = contextMatrix.inverse();
        return itemMatrix.multiply(contextMatrix);
    };
    // To calculate the rubber band position giving a selected element
    // We nede to do the following
    // 1)Get the box of the element
    // 2)Remove the rotation out of the item matrix
    // 3)Get the combine matrix of global and item without the rotation
    // 4)Get the x,y,w,h new positions
    // 5)Calculate the newmatix of the rubberband to apply rotation
    SpacialHelper.calculateRubberBandPosition = function (selectedMatrix, selectedBox, globalMatrix, parentMatrix) {
        if (!selectedMatrix) {
            return {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                transform: 0,
            };
        }
        var box = selectedBox;
        var matrix = selectedMatrix;
        //extract rotation
        box = this.calculateTrasformBox(box, globalMatrix, matrix, parentMatrix);
        box.x = box.x - Consts.RUBBER_BAND_HANDLE_SIZE;
        box.y = box.y - Consts.RUBBER_BAND_HANDLE_SIZE;
        box.w = box.w + Consts.RUBBER_BAND_HANDLE_SIZE * 2;
        box.h = box.h + Consts.RUBBER_BAND_HANDLE_SIZE * 2;
        var rubberMatrix = new Matrix();
        var cx = box.x + box.w / 2;
        var cy = box.y + box.h / 2;
        rubberMatrix = SpacialHelper.rotateToCenter(cx, cy, box.angle, rubberMatrix);
        return {
            x: box.x,
            y: box.y,
            w: box.w,
            h: box.h,
            transform: rubberMatrix.matrixToText(),
        };
    };
    //Calculates the the box position with combine matrix minus
    //taking out the item matrix rotation
    SpacialHelper.calculateTrasformBox = function (box, globalM, itemM, parentMatrix) {
        var angle = 0;
        if (itemM.b != 0)
            angle = SpacialHelper.degrees(Math.atan2(itemM.b, itemM.a));
        if (parentMatrix)
            globalM = globalM.multiply(parentMatrix);
        //Remove roation from item matrix
        var cx = box.w / 2;
        var cy = box.h / 2;
        itemM = SpacialHelper.rotateToCenter(cx, cy, -angle, itemM);
        //Combine with global
        var matrix = globalM.multiply(itemM);
        //get new point given the new combine matrix
        var pts = new Point(0, 0);
        var pte = new Point(box.w, box.h);
        pts.matrixTransform(matrix);
        pte.matrixTransform(matrix);
        pte.x = pte.x - pts.x;
        pte.y = pte.y - pts.y;
        return { x: pts.x, y: pts.y, w: pte.x, h: pte.y, angle: angle };
    };
    SpacialHelper.moveObject = function (dx, dy, state) {
        var increment = SpacialHelper.transfromIncrement(dx, dy, state.viewportMtx, state.selection.matrix);
        var objMatrix = state.selection.matrix;
        objMatrix = objMatrix.translate(-increment.dx, -increment.dy);
        return { matrix: objMatrix, box: null };
    };
    SpacialHelper.checkConstrains = function (objbox, matrix, parentbox) {
        if (!parentbox)
            return true;
        var ptl = new Point(0, 0);
        var ptr = new Point(objbox.w, 0);
        var pbl = new Point(0, objbox.h);
        var pbr = new Point(objbox.w, objbox.h);
        ptl.matrixTransform(matrix);
        if (!SpacialHelper.isPointInBox(ptl, parentbox))
            return false;
        ptr.matrixTransform(matrix);
        if (!SpacialHelper.isPointInBox(ptr, parentbox))
            return false;
        pbl.matrixTransform(matrix);
        if (!SpacialHelper.isPointInBox(pbl, parentbox))
            return false;
        pbr.matrixTransform(matrix);
        if (!SpacialHelper.isPointInBox(pbr, parentbox))
            return false;
        return true;
    };
    SpacialHelper.isPointInBox = function (point, box) {
        if (point.x < 0 || point.y < 0)
            return false;
        if (point.x > box.w || point.y > box.h)
            return false;
        return true;
    };
    SpacialHelper.rotateObject = function (x, y, lastx, lasty, state) {
        //Calculating angle giv
        var box = state.box;
        var cx = box.x + box.w / 2;
        var cy = box.y + box.h / 2;
        var p1 = { x: lastx, y: lasty };
        var p2 = { x: x, y: y };
        var center = SpacialHelper.transformToViewPort(cx, cy, state.viewportMtx, state.selection.matrix, state.parentMtx);
        var direction = SpacialHelper.getRotationDirection(p1, p2, center);
        var angle = SpacialHelper.calculateRotationsAngle(p1, center, p2);
        angle = direction == Consts.CLOCKWISE ? angle : -angle;
        var objMatrix = state.selection.matrix;
        //let inc=2.0;
        objMatrix = objMatrix.translate(cx, cy);
        objMatrix = objMatrix.rotate(angle);
        objMatrix = objMatrix.translate(-cx, -cy);
        return { matrix: objMatrix, box: null };
    };
    SpacialHelper.scaleObject = function (dx, dy, right, state) {
        var box = state.box;
        var cx = box.x + box.w / 2;
        var cy = box.y + box.h / 2;
        if (!right) {
            dx = -dx;
            dy = -dy;
        }
        //To Calculate the tramsformer right scale to increase
        var increment = SpacialHelper.transfromIncrement(dx, dy, state.viewportMtx, state.selection.matrix);
        var oldpoint = SpacialHelper.transfromIncrement(box.x + box.w - cx, box.y + box.h - cy, state.viewportMtx, state.selection.matrix);
        var newpoint = SpacialHelper.transfromIncrement(box.x + box.w - increment.dx - cx, box.y + box.h - increment.dy - cy, state.viewportMtx, state.selection.matrix);
        if (box.x + box.w - increment.dx < cx)
            return;
        if (box.y + box.h - increment.dy < cy)
            return;
        var ix = newpoint.dx / oldpoint.dx;
        var iy = newpoint.dy / oldpoint.dy;
        var objMatrix = state.selection.matrix;
        objMatrix = objMatrix.translate(cx, cy);
        objMatrix = objMatrix.scale(ix, iy);
        objMatrix = objMatrix.translate(-cx, -cy);
        return { matrix: objMatrix, box: null };
    };
    SpacialHelper.resizeObject = function (dx, dy, side, state) {
        var box = state.selection.box;
        var ix = 0;
        var iy = 0;
        //To Calculate the tramsformer right scale to increase
        var increment = SpacialHelper.transfromIncrement(dx, dy, state.viewportMtx, state.selection.matrix);
        var fdx = 0;
        var fdy = 0;
        var objMatrix = state.selection.matrix;
        switch (side) {
            case Consts.MODE_RUBER_BAND_RESIZE_UL:
                ix = -increment.dx;
                iy = -increment.dy;
                fdx = increment.dx;
                fdy = increment.dy;
                break;
            case Consts.MODE_RUBER_BAND_RESIZE_UR:
                iy = -increment.dy;
                fdx = -increment.dx;
                fdy = increment.dy;
                break;
            case Consts.MODE_RUBER_BAND_RESIZE_DL:
                ix = -increment.dx;
                fdx = increment.dx;
                fdy = -increment.dy;
                break;
            case Consts.MODE_RUBER_BAND_RESIZE_DR:
                fdx = -increment.dx;
                fdy = -increment.dy;
                break;
        }
        //ver aplicar la inversa del incremento x,y si left or up
        //return new (w,h)
        var objBox = { x: 0, y: 0, w: box.w + fdx, h: box.h + fdy };
        objMatrix = objMatrix.translate(ix, iy);
        return { matrix: objMatrix, box: objBox };
    };
    return SpacialHelper;
}());

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".rubberBand-Container{\r\n    pointer-events:none;\r\n    position:absolute;\r\n}\r\n.rubberBand{\r\n    fill:none;\r\n    pointer-events:none;\r\n    stroke:rgb(238, 99, 243);\r\n    stroke-width:1;\r\n    fill-opacity:0.0;\r\n    stroke-opacity:1;\r\n    stroke-dasharray:2\r\n}\r\n\r\n.rubberBandHandle{\r\n    fill:white;\r\n    pointer-events:fill;\r\n    stroke:#ee63f3;\r\n    stroke-width:1;\r\n    fill-opacity:1;\r\n    stroke-opacity:0.9;\r\n}\r\n\r\n.rubberConnector{\r\n    pointer-events:fill;\r\n    fill:white;\r\n    stroke:#ee63f3;\r\n    stroke-width:1;\r\n    fill-opacity:1;\r\n    stroke-opacity:0.9;\r\n}";
styleInject(css_248z);

var RubberBand = /** @class */ (function (_super) {
    __extends(RubberBand, _super);
    function RubberBand(props) {
        var _this = _super.call(this, props) || this;
        _this.calculateCoordinates = _this.calculateCoordinates.bind(_this);
        return _this;
    }
    RubberBand.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (nextProps.selectedItem ||
            nextProps.viewport.viewportTr !== this.props.viewport.viewportTr ||
            nextProps.viewport.selectedTr !== this.props.viewport.viewportTr ||
            nextProps.viewport.parentTr !== this.props.viewport.viewportTr);
    };
    RubberBand.prototype.calculateCoordinates = function () {
        var box = SpacialHelper.calculateRubberBandPosition(this.props.viewport.selection.matrix, this.props.viewport.selection.box, this.props.viewport.viewportMtx, null);
        return { x: box.x, y: box.y, w: box.w, h: box.h, transform: box.transform };
    };
    RubberBand.prototype.render = function () {
        var _this = this;
        var coordinates = this.calculateCoordinates();
        var selection = this.props.selection;
        if (!selection) {
            return null;
        }
        return (React.createElement("svg", { id: "Rubberband", className: "rubberBand-Container", width: "100%", height: "100%", onMouseDown: function (event) {
                _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_MOVE);
            } },
            React.createElement("g", { transform: "matrix(" + coordinates.transform + ")" },
                React.createElement("rect", { className: "rubberBand", x: coordinates.x, y: coordinates.y, width: coordinates.w, height: coordinates.h }),
                React.createElement("rect", { className: "rubberBandHandle", x: coordinates.x - Consts.RUBBER_BAND_HANDLE_SIZE, y: coordinates.y - Consts.RUBBER_BAND_HANDLE_SIZE, width: Consts.RUBBER_BAND_HANDLE_SIZE, height: Consts.RUBBER_BAND_HANDLE_SIZE, onMouseDown: function (event) {
                        _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_RESIZE_UL);
                    } }),
                React.createElement("rect", { className: "rubberBandHandle", x: coordinates.x + coordinates.w, y: coordinates.y - Consts.RUBBER_BAND_HANDLE_SIZE, width: Consts.RUBBER_BAND_HANDLE_SIZE, height: Consts.RUBBER_BAND_HANDLE_SIZE, onMouseDown: function (event) {
                        _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_RESIZE_UR);
                    } }),
                React.createElement("rect", { className: "rubberBandHandle", x: coordinates.x - Consts.RUBBER_BAND_HANDLE_SIZE, y: coordinates.y + coordinates.h, width: Consts.RUBBER_BAND_HANDLE_SIZE, height: Consts.RUBBER_BAND_HANDLE_SIZE, onMouseDown: function (event) {
                        _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_RESIZE_DL);
                    } }),
                React.createElement("rect", { className: "rubberBandHandle", x: coordinates.x + coordinates.w, y: coordinates.y + coordinates.h, width: Consts.RUBBER_BAND_HANDLE_SIZE, height: Consts.RUBBER_BAND_HANDLE_SIZE, onMouseDown: function (event) {
                        _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_RESIZE_DR);
                    } }),
                React.createElement("rect", { className: "rubberBandHandle", x: coordinates.x + coordinates.w / 2 - Consts.RUBBER_BAND_HANDLE_SIZE, y: coordinates.y + coordinates.h * 1.5, width: Consts.RUBBER_BAND_HANDLE_SIZE, height: Consts.RUBBER_BAND_HANDLE_SIZE, onMouseDown: function (event) {
                        _this.props.doRubberMouseDown(event, Consts.MODE_RUBER_BAND_ROTATE);
                    } }))));
    };
    return RubberBand;
}(React.Component));

var ZoomPanHelper = /** @class */ (function () {
    function ZoomPanHelper() {
    }
    ZoomPanHelper.prototype.pan = function (dx, dy, transformMatrix) {
        transformMatrix.e -= dx;
        transformMatrix.f -= dy;
    };
    ZoomPanHelper.prototype.zoom = function (scale, cx, cy, transformMatrix) {
        transformMatrix.e -= cx;
        transformMatrix.f -= cy;
        transformMatrix.a *= scale;
        transformMatrix.b *= scale;
        transformMatrix.c *= scale;
        transformMatrix.d *= scale;
        transformMatrix.e *= scale;
        transformMatrix.f *= scale;
        transformMatrix.e += cx;
        transformMatrix.f += cy;
    };
    return ZoomPanHelper;
}());

var ViewPortElement = /** @class */ (function (_super) {
    __extends(ViewPortElement, _super);
    function ViewPortElement(props) {
        var _this = _super.call(this, props) || this;
        _this.x = 0;
        _this.y = 0;
        _this.w = 100;
        _this.h = 100;
        _this.transform = "1,0,0,1,0,0";
        _this.id = '';
        var propsChildren = props.children ? props.children.props : null;
        var x = propsChildren.x, y = propsChildren.y, w = propsChildren.w, h = propsChildren.h;
        _this.x = x ? x : 0;
        _this.y = y ? y : 0;
        _this.w = w ? w : 100;
        _this.h = h ? h : 100;
        _this.transform = "1,0,0,1," + _this.x + "," + _this.y;
        _this.id = props.id;
        return _this;
    }
    ViewPortElement.prototype.render = function () {
        var _this = this;
        var _a = this.props, transform = _a.transform, children = _a.children, box = _a.box;
        this.transform = transform ? transform : this.transform;
        if (box) {
            this.w = box.w;
            this.h = box.h;
        }
        return (React.createElement("div", { id: "" + this.props.id, style: {
                overflow: 'hidden',
                transformOrigin: '0% 0%',
                top: 0,
                left: 0,
                height: this.h,
                width: this.w,
                position: 'absolute',
                transform: "matrix(" + this.transform + ")",
            }, onMouseDown: function (e) { return _this.props.doObjectMouseDown(e, null, _this); } }, children));
    };
    return ViewPortElement;
}(React.PureComponent));

var css_248z$1 = ".zoom-pan-container {\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n  outline: 0;\r\n  overflow: hidden;\r\n  user-select: none;\r\n}\r\n";
styleInject(css_248z$1);

var ZoomPan = /** @class */ (function (_super) {
    __extends(ZoomPan, _super);
    function ZoomPan(props) {
        var _this = _super.call(this, props) || this;
        _this.containerRef = createRef();
        _this.selection = null;
        _this.draggingPositionX = 0;
        _this.draggingPositionY = 0;
        _this.mode = Consts.MODE_GLOBAL_PAN;
        _this.addRemoveMouseListener = function (newState, oldState) {
            if (newState.dragging && !oldState.dragging) {
                document.addEventListener('mousemove', _this.doMouseMove);
                document.addEventListener('mouseup', _this.doMouseUp);
            }
            else if (!newState.dragging && oldState.dragging) {
                document.removeEventListener('mousemove', _this.doMouseMove);
                document.removeEventListener('mouseup', _this.doMouseUp);
            }
        };
        _this.getSelectedObjInfo = function (item) {
            var matrix = item ? new Matrix(item.transform) : new Matrix();
            var box = item
                ? { id: item.id, x: 0, y: 0, w: item.w, h: item.h }
                : { id: '', x: 0, y: 0, w: 0, h: 0 };
            var type = item ? _this.getObjType(item) : ObjectTypes.TYPE_ITEM;
            return {
                id: item ? item.id : -1,
                item: item,
                matrix: matrix,
                transform: matrix.matrixToText(),
                box: box,
                type: type,
            };
        };
        ///////////////////
        /// MOUSE EVENT ///
        ///////////////////
        //When we click anywhere that is not an Object or the rubberband
        _this.doGlobalMouseDown = function (e) {
            if (e.button === 0) {
                _this.setDraggingPosition(e);
                _this.setState({ dragging: true });
                _this.mode = Consts.MODE_GLOBAL_PAN;
            }
        };
        _this.doObjectMouseDown = function (e, parent, item) {
            e.stopPropagation();
            _this.setDraggingPosition(e);
            _this.setState({ dragging: true });
            if (_this.props.onSelectItem)
                _this.props.onSelectItem(parent, item);
            _this.selection = item;
            //this.updateSelectedInfo(parent, item);
            var selection = _this.getSelectedObjInfo(item);
            _this.setState({ dragging: true, selection: selection });
            _this.mode = Consts.MODE_RUBER_BAND_MOVE;
        };
        _this.doRubberMouseDown = function (e, mode, item) {
            e.stopPropagation();
            _this.setDraggingPosition(e);
            _this.setState({ dragging: true });
            _this.mode = mode;
        };
        ///////////////////////
        /// MOUSE EVENTS  ////
        /////////////////////
        _this.doMouseMove = function (e) {
            if (_this.state.dragging) {
                e.stopPropagation();
                var coor = _this.adjustCoor(e.clientX, e.clientY);
                var x = coor.x;
                var y = coor.y;
                var deltaX = _this.draggingPositionX - x;
                var deltaY = _this.draggingPositionY - y;
                switch (_this.mode) {
                    case Consts.MODE_GLOBAL_PAN:
                        _this.pan(deltaX, deltaY);
                        break;
                    case Consts.MODE_RUBER_BAND_MOVE:
                        _this.updateSelectedItem(SpacialHelper.moveObject(deltaX, deltaY, _this.state));
                        break;
                    case Consts.MODE_RUBER_BAND_ROTATE:
                        _this.updateSelectedItem(SpacialHelper.rotateObject(x, y, _this.draggingPositionX, _this.draggingPositionY, _this.state));
                        break;
                    case Consts.MODE_RUBER_BAND_RESIZE_UL:
                    case Consts.MODE_RUBER_BAND_RESIZE_UR:
                    case Consts.MODE_RUBER_BAND_RESIZE_DL:
                    case Consts.MODE_RUBER_BAND_RESIZE_DR:
                        var newState = SpacialHelper.resizeObject(deltaX, deltaY, _this.mode, _this.state);
                        _this.updateSelectedItem(newState);
                        break;
                }
                _this.setDraggingPosition(e);
            }
        };
        _this.doMouseUp = function () {
            _this.setState({ dragging: false });
            if (_this.state.selection.type == ObjectTypes.TYPE_LINK) {
                if (_this.props.onSelectItem)
                    _this.props.onSelectItem(null, null);
            }
            if (_this.props.selectedItem && _this.props.onChange)
                _this.props.onChange(_this.props.selectedItem, {
                    transform: _this.state.selection.matrix.matrixToText(),
                    w: _this.state.selection.box.w,
                    h: _this.state.selection.box.h,
                });
        };
        _this.doMouseWheel = function (e) {
            e.preventDefault();
            var coor = _this.adjustCoor(e.clientX, e.clientY);
            var cx = coor.x;
            var cy = coor.y;
            var scale = e.deltaY > 0 ? 1.05 : 0.95;
            _this.zoom(scale, cx, cy);
        };
        ////////////////////////////
        //   DRAG & DROP EVENTS  //
        //////////////////////////
        _this.onDragOver = function (e) {
            e.preventDefault();
        };
        _this.onDrop = function (e) {
            // let objType = parseInt(e.dataTransfer.getData('objtype'));
            // if (
            //   objType == ObjectTypes.TYPE_PAGE ||
            //   objType == ObjectTypes.TYPE_ACTION ||
            //   objType == ObjectTypes.TYPE_REDUCER
            // ) {
            //   const adcoor: ICoor = this.adjustCoor(e.clientX, e.clientY);
            //   let x = adcoor.x;
            //   let y = adcoor.y;
            //   let coor = SpacialHelper.coordinatesGlobalToLocal(
            //     x,
            //     y,
            //     this.state.viewportMtx,
            //     null
            //   );
            //   let matrix = `1, 0, 0, 1, ${coor.x}, ${coor.y}`;
            //   this.addItem(e, null, matrix);
            // }
        };
        _this.addItem = function (e, parent, matrix) {
            var type = parseInt(e.dataTransfer.getData('type'));
            var subtype = e.dataTransfer.getData('subtype');
            var objType = parseInt(e.dataTransfer.getData('objtype'));
            var name = e.dataTransfer.getData('name');
            var data = {
                name: name,
                type: type,
                objType: objType,
                subtype: subtype,
                transform: matrix,
            };
            var onAddItem = _this.props.onAddItem;
            onAddItem && onAddItem(data, parent);
        };
        _this.updateSelectedItem = function (newState) {
            var matrix = newState.matrix;
            // newState.box?newState.box.id=this.state.box.id:null;
            var box = newState.box ? newState.box : _this.state.selection.box;
            var selection = __assign({}, _this.state.selection);
            selection.matrix = matrix;
            selection.transform = matrix.matrixToText();
            selection.box = box;
            _this.setState({ box: box, selection: selection });
        };
        //////////////////////////
        // VIEW PORT ZOOM & PAN //
        /////////////////////////
        _this.pan = function (dx, dy) {
            _this.zoomPanHelper.pan(dx, dy, _this.state.viewportMtx);
            _this.applyMatrix();
        };
        _this.zoom = function (scale, cx, cy) {
            _this.zoomPanHelper.zoom(scale, cx, cy, _this.state.viewportMtx);
            _this.applyMatrix();
        };
        _this.applyMatrix = function () {
            var newMatrix = _this.state.viewportMtx.matrixToText();
            _this.setState({
                viewportTr: newMatrix,
            });
        };
        _this.setDraggingPosition = function (e) {
            var _a, _b;
            _this.draggingPositionX =
                e.clientX - (((_a = _this.containerRef.current) === null || _a === void 0 ? void 0 : _a.offsetLeft) || 0);
            _this.draggingPositionY =
                e.clientY - (((_b = _this.containerRef.current) === null || _b === void 0 ? void 0 : _b.offsetTop) || 0);
        };
        _this.renderChildren = function () {
            var selection = _this.state.selection;
            var children = _this.props.children;
            if (children == null) {
                return null;
            }
            return React.Children.map(children, function (item, i) {
                var transform = selection.id == i ? selection.transform : null;
                var box = selection.id == i ? selection.box : null;
                return (React.createElement(ViewPortElement, { id: i.toString(), key: i, transform: transform, box: box, doObjectMouseDown: _this.doObjectMouseDown }, item));
            });
        };
        //Init Controllers
        _this.zoomPanHelper = new ZoomPanHelper();
        //Initialization of state
        _this.state = {
            dragging: false,
            viewportMtx: new Matrix(_this.props.viewportMtx),
            viewportTr: '1,0,0,1,0,0',
            selection: _this.getSelectedObjInfo(null),
        };
        _this.draggingPositionX = 0;
        _this.draggingPositionY = 0;
        _this.mode = Consts.MODE_GLOBAL_PAN;
        return _this;
    }
    ZoomPan.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (nextState.dragging !== this.state.dragging) {
            this.addRemoveMouseListener(nextState, this.state);
        }
        if (nextProps.selectedItem !== this.props.selectedItem) {
            //force state to be new selection
            nextState.selection = this.getSelectedObjInfo(nextProps.selectedItem);
        }
        return true;
    };
    ZoomPan.prototype.adjustCoor = function (x, y) {
        var _a, _b;
        var newX = x - (((_a = this.containerRef.current) === null || _a === void 0 ? void 0 : _a.offsetLeft) || 0);
        var newY = y - (((_b = this.containerRef.current) === null || _b === void 0 ? void 0 : _b.offsetTop) || 0);
        return { x: newX, y: newY };
    };
    ZoomPan.prototype.ownEvent = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    /////////////////////////
    //       HELPERS       //
    /////////////////////////
    ZoomPan.prototype.getObjType = function (item) {
        if (item.hasOwnProperty('start') &&
            item.hasOwnProperty('output') &&
            item.hasOwnProperty('end') &&
            item.hasOwnProperty('input')) {
            return ObjectTypes.TYPE_LINK;
        }
        return ObjectTypes.TYPE_ITEM;
    };
    ZoomPan.prototype.render = function () {
        var viewportTr = this.state.viewportTr;
        return (React.createElement("div", { ref: this.containerRef, className: "zoom-pan-container", onDragOver: this.onDragOver, onDrop: this.onDrop, tabIndex: 0 },
            React.createElement("div", { id: "viewport", style: { position: 'relative', userSelect: 'none', height: '100%' }, onMouseDown: this.doGlobalMouseDown, onWheel: this.doMouseWheel },
                React.createElement("div", { style: {
                        transform: "matrix(" + viewportTr + ")",
                        position: 'absolute',
                    } }, this.renderChildren()),
                React.createElement(RubberBand, { selection: this.selection, viewport: this.state, doRubberMouseDown: this.doRubberMouseDown }))));
    };
    return ZoomPan;
}(React.Component));

export { ZoomPan };
//# sourceMappingURL=lib.esm.js.map
