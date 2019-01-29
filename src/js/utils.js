    export function get2dDistance(x1,y1,x2,y2){

        return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    }

    export function get1dDistance(x1,x2){

        return Math.sqrt(Math.pow(x2-x1,2));
    }

    export function map(n, start1, stop1, start2, stop2) {
          return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
    }

    export function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    export function proxy(method, scope, args) {
      if(args == undefined ) return function() { return method.apply(scope, arguments); }
      else return function() { return method.apply(scope, args); }
    }

    export function findPointFromAngle(x, y, angle, distance) {
        var result = {};

        result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
        result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

        return result;
    }

    export function calculAngle(cx, cy, ex, ey) {
      var dy = ey - cy;
      var dx = ex - cx;
      var theta = Math.atan2(dy, dx); // range (-PI, PI]
      theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
      if (theta < 0) theta = 360 + theta; // range [0, 360)
      return theta;
    }

    export function extend(obj, src) {
          for (var key in src) {
              if (src.hasOwnProperty(key)) obj[key] = src[key];
          }
          return obj;
    }

    export function deepExtend(out) {
      out = out || {};

      for (var i = 1, len = arguments.length; i < len; ++i) {
        var obj = arguments[i];

        if (!obj) {
          continue;
        }

        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }

          // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
          if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
            out[key] = deepExtend(out[key], obj[key]);
            continue;
          }

          out[key] = obj[key];
        }
      }

      return out;
    };

    // Convert HEX color to rgba
    export function hex2rgb(hex,opacity = 1){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
        }
        throw new Error('Bad Hex');
    }

    export function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }


    export function colorDiff(color1, color2) {
        return Math.sqrt(Math.pow(color1.r-color2.r,2)+Math.pow(color1.g-color2.g,2)+Math.pow(color1.b-color2.b,2)+Math.pow(color1.a-color2.a,2));
    }

    //Calcul the intersection between to line
    //line 1 [p0x,p0y] [p1x,p1y]
    //line 2 [p2x,p2y] [p3x,p3y]
    //return {x: , y:} or null
    export function intersection(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {

        var d1x = p1x - p0x,
            d1y = p1y - p0y,
            d2x = p3x - p2x,
            d2y = p3y - p2y,

            // determinator
            d = d1x * d2y - d2x * d1y,
            px, py, s, t;

        // continue if intersecting/is not parallel
        if (d) {

          px = p0x - p2x;
          py = p0y - p2y;

          s = (d1x * py - d1y * px) / d;
          if (s >= 0 && s <= 1) {

            // if s was in range, calc t
            t = (d2x * py - d2y * px) / d;
            if (t >= 0 && t <= 1) {
              return {x: p0x + (t * d1x),
                      y: p0y + (t * d1y)}
            }
          }
        }
        return null
    }
    //Clone object
    export function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = new obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }

    // Create a timeout with a pause method
    // usage : new Timer(Function, Number, arg1, arg2, arg3...)
    export function Timer(callback, delay) {
        var args = arguments,
            self = this,
            timer, start;

        this.log = function() {
          console.log(timer);
        }

        this.clear = function () {
            clearTimeout(timer);
        };

        this.pause = function () {
            this.clear();
            delay -= new Date() - start;
        };

        this.resume = function () {
            start = new Date();
            timer = setTimeout(function () {
                callback.apply(self, Array.prototype.slice.call(args, 2, args.length));
            }, delay);
        };

        this.resume();
    }

    export function serializeForm(form) {
        if (!form || form.nodeName !== "FORM") {
            return;
        }
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === "") {
                continue;
            }
            switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                case 'text':
                case 'hidden':
                case 'password':
                case 'button':
                case 'reset':
                case 'submit':
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    break;
                case 'checkbox':
                case 'radio':
                    if (form.elements[i].checked) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    }
                    break;
                }
                break;
            case 'file':
                break;
            case 'TEXTAREA':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'SELECT':
                switch (form.elements[i].type) {
                case 'select-one':
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    break;
                case 'select-multiple':
                    for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                        if (form.elements[i].options[j].selected) {
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                        }
                    }
                    break;
                }
                break;
            case 'BUTTON':
                switch (form.elements[i].type) {
                case 'reset':
                case 'submit':
                case 'button':
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    break;
                }
                break;
            }
        }
        data = q.join("&");
        return data;
    }
