/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1-BETA Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase     */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
 return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}
function b64_sha1(s) {
 return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function str_sha1(s) {
 return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
 return binb2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
 return binb2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
 return binb2str(core_hmac_sha1(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
 /* append padding */
 x[len >> 5] |= 0x80 << (24 - len % 32);
 x[((len + 64 >> 9) << 4) + 15] = len;
 var w = Array(80);
 var a = 1732584193;
 var b = -271733879;
 var c = -1732584194;
 var d = 271733878;
 var e = -1009589776;
 for (var i = 0; i < x.length; i += 16) {
  var olda = a;
  var oldb = b;
  var oldc = c;
  var oldd = d;
  var olde = e;
  for (var j = 0; j < 80; j++) {
   if (j < 16) w[j] = x[i + j];
   else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
   var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
   e = d;
   d = c;
   c = rol(b, 30);
   b = a;
   a = t;
  }
  a = safe_add(a, olda);
  b = safe_add(b, oldb);
  c = safe_add(c, oldc);
  d = safe_add(d, oldd);
  e = safe_add(e, olde);
 }
 return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
 if (t < 20) return (b & c) | ((~b) & d);
 if (t < 40) return b ^ c ^ d;
 if (t < 60) return (b & c) | (b & d) | (c & d);
 return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
 return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data) {
 var bkey = str2binb(key);
 if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
 var ipad = Array(16),
  opad = Array(16);
 for (var i = 0; i < 16; i++) {
  ipad[i] = bkey[i] ^ 0x36363636;
  opad[i] = bkey[i] ^ 0x5C5C5C5C;
 }
 var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
 return core_sha1(opad.concat(hash), 512 + 160);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
 var lsw = (x & 0xFFFF) + (y & 0xFFFF);
 var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
 return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
 return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
 var bin = Array();
 var mask = (1 << chrsz) - 1;
 for (var i = 0; i < str.length * chrsz; i += chrsz)
 bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
 return bin;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin) {
 var str = "";
 var mask = (1 << chrsz) - 1;
 for (var i = 0; i < bin.length * 32; i += chrsz)
 str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
 return str;
}
/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
 var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
 var str = "";
 for (var i = 0; i < binarray.length * 4; i++) {
  str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
 }
 return str;
}
/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
 var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 var str = "";
 for (var i = 0; i < binarray.length * 4; i += 3) {
  var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
  for (var j = 0; j < 4; j++) {
   if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
   else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
  }
 }
 return str;
}

/*
*sha1File
 */
(typeof Crypto=="undefined"||!Crypto.util)&&function(){var e=self.Crypto={},g=e.util={rotl:function(a,b){return a<<b|a>>>32-b},rotr:function(a,b){return a<<32-b|a>>>b},endian:function(a){if(a.constructor==Number)return g.rotl(a,8)&16711935|g.rotl(a,24)&4278255360;for(var b=0;b<a.length;b++)a[b]=g.endian(a[b]);return a},randomBytes:function(a){for(var b=[];a>0;a--)b.push(Math.floor(Math.random()*256));return b},bytesToWords:function(a){for(var b=[],c=0,d=0;c<a.length;c++,d+=8)b[d>>>5]|=a[c]<<24-
        d%32;return b},wordsToBytes:function(a){for(var b=[],c=0;c<a.length*32;c+=8)b.push(a[c>>>5]>>>24-c%32&255);return b},bytesToHex:function(a){for(var b=[],c=0;c<a.length;c++)b.push((a[c]>>>4).toString(16)),b.push((a[c]&15).toString(16));return b.join("")},hexToBytes:function(a){for(var b=[],c=0;c<a.length;c+=2)b.push(parseInt(a.substr(c,2),16));return b},bytesToBase64:function(a){if(typeof btoa=="function")return btoa(f.bytesToString(a));for(var b=[],c=0;c<a.length;c+=3)for(var d=a[c]<<16|a[c+1]<<8|
        a[c+2],e=0;e<4;e++)c*8+e*6<=a.length*8?b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>>6*(3-e)&63)):b.push("=");return b.join("")},base64ToBytes:function(a){if(typeof atob=="function")return f.stringToBytes(atob(a));for(var a=a.replace(/[^A-Z0-9+\/]/ig,""),b=[],c=0,d=0;c<a.length;d=++c%4)d!=0&&b.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(c-1))&Math.pow(2,-2*d+8)-1)<<d*2|"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(c))>>>
        6-d*2);return b}},e=e.charenc={};e.UTF8={stringToBytes:function(a){return f.stringToBytes(unescape(encodeURIComponent(a)))},bytesToString:function(a){return decodeURIComponent(escape(f.bytesToString(a)))}};var f=e.Binary={stringToBytes:function(a){for(var b=[],c=0;c<a.length;c++)b.push(a.charCodeAt(c)&255);return b},bytesToString:function(a){for(var b=[],c=0;c<a.length;c++)b.push(String.fromCharCode(a[c]));return b.join("")}}}();

/*
*
 */
function sha1File(settings)
{
    var hash = [1732584193, -271733879, -1732584194, 271733878, -1009589776];
    var buffer = 1024 * 16 * 64;
    var sha1 = function (block, hash)
    {
        var words = [];
        var count_parts = 16;
        var h0 = hash[0],
            h1 = hash[1],
            h2 = hash[2],
            h3 = hash[3],
            h4 = hash[4];
        for(var i = 0; i < block.length; i += count_parts)
        {
            var th0 = h0,
                th1 = h1,
                th2 = h2,
                th3 = h3,
                th4 = h4;
            for(var j = 0; j < 80; j++)
            {
                if(j < count_parts)
                    words[j] = block[i + j] | 0;
                else
                {
                    var n = words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - count_parts];
                    words[j] = (n << 1) | (n >>> 31);
                }
                var f,k;
                if(j < 20)
                {
                    f = (h1 & h2 | ~h1 & h3);
                    k = 1518500249;
                }
                else if(j < 40)
                {
                    f = (h1 ^ h2 ^ h3);
                    k = 1859775393;
                }
                else if(j < 60)
                {
                    f = (h1 & h2 | h1 & h3 | h2 & h3);
                    k = -1894007588;
                }
                else
                {
                    f = (h1 ^ h2 ^ h3);
                    k = -899497514;
                }

                var t = ((h0 << 5) | (h0 >>> 27)) +h4 + (words[j] >>> 0) + f + k;
                h4 = h3;
                h3 = h2;
                h2 = (h1 << 30) | (h1 >>> 2);
                h1 = h0;
                h0 = t;
            }
            h0 = (h0 + th0) | 0;
            h1 = (h1 + th1) | 0;
            h2 = (h2 + th2) | 0;
            h3 = (h3 + th3) | 0;
            h4 = (h4 + th4) | 0;
        }
        return [h0, h1, h2, h3, h4];
    };

    var run = function(file,inStart,inEnd)
    {
        var end = Math.min(inEnd, file.size);
        var start = inStart;
        var reader = new FileReader();

        reader.onload = function()
        {
            file.sha1_progress = (end * 100 / file.size);
            var event = event || window.event;
            var result = event.result || event.target.result
            var block = Crypto.util.bytesToWords( new Uint8Array(result));

            if (end === file.size)
            {
                var bTotal, bLeft, bTotalH, bTotalL;
                bTotal = file.size * 8;
                bLeft = (end - start) * 8;

                bTotalH = Math.floor(bTotal / 0x100000000);
                bTotalL = bTotal & 0xFFFFFFFF;

                // Padding
                block[bLeft >>> 5] |= 0x80 << (24 - bLeft % 32);
                block[((bLeft + 64 >>> 9) << 4) + 14] = bTotalH;
                block[((bLeft + 64 >>> 9) << 4) + 15] = bTotalL;

                hash = sha1(block, hash);
                file.sha1_hash = Crypto.util.bytesToHex(Crypto.util.wordsToBytes(hash));
                console.log(file.sha1_hash);
                return file.sha1_hash;
            }
            else
            {
                hash = sha1(block, hash);
                start += buffer;
                end += buffer;
                run(file,start,end);
            }
        };
        var blob = file.slice(start, end);
        reader.readAsArrayBuffer(blob);
    };

    var checkApi = function()
    {
        if((typeof File == 'undefined'))
            return false;

        if (!File.prototype.slice) {
            if(File.prototype.webkitSlice)
                File.prototype.slice = File.prototype.webkitSlice;
            else if(File.prototype.mozSlice)
                File.prototype.slice = File.prototype.mozSlice;
        }

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice)
            return false;

        return true;
    };

    if(checkApi())
    {
        run(settings,0,buffer);
    }
    else
        return false;
}
