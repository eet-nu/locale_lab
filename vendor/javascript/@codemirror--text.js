let e="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e=>e?parseInt(e,36):1));for(let t=1;t<e.length;t++)e[t]+=e[t-1];function isExtendingChar(t){for(let n=1;n<e.length;n+=2)if(e[n]>t)return e[n-1]<=t;return false}function isRegionalIndicator(e){return e>=127462&&e<=127487}const t=8205;function findClusterBreak(e,t,n=true,i=true){return(n?nextClusterBreak:prevClusterBreak)(e,t,i)}function nextClusterBreak(e,n,i){if(n==e.length)return n;n&&surrogateLow(e.charCodeAt(n))&&surrogateHigh(e.charCodeAt(n-1))&&n--;let r=codePointAt(e,n);n+=codePointSize(r);while(n<e.length){let s=codePointAt(e,n);if(r==t||s==t||i&&isExtendingChar(s)){n+=codePointSize(s);r=s}else{if(!isRegionalIndicator(s))break;{let t=0,i=n-2;while(i>=0&&isRegionalIndicator(codePointAt(e,i))){t++;i-=2}if(t%2==0)break;n+=2}}}return n}function prevClusterBreak(e,t,n){while(t>0){let i=nextClusterBreak(e,t-2,n);if(i<t)return i;t--}return 0}function surrogateLow(e){return e>=56320&&e<57344}function surrogateHigh(e){return e>=55296&&e<56320}function codePointAt(e,t){let n=e.charCodeAt(t);if(!surrogateHigh(n)||t+1==e.length)return n;let i=e.charCodeAt(t+1);return surrogateLow(i)?i-56320+(n-55296<<10)+65536:n}function fromCodePoint(e){if(e<=65535)return String.fromCharCode(e);e-=65536;return String.fromCharCode(55296+(e>>10),56320+(1023&e))}function codePointSize(e){return e<65536?1:2}function countColumn(e,t,n=e.length){let i=0;for(let r=0;r<n;)if(9==e.charCodeAt(r)){i+=t-i%t;r++}else{i++;r=findClusterBreak(e,r)}return i}function findColumn(e,t,n,i){for(let i=0,r=0;;){if(r>=t)return i;if(i==e.length)break;r+=9==e.charCodeAt(i)?n-r%n:1;i=findClusterBreak(e,i)}return true===i?-1:e.length}class Text{constructor(){}lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,false,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,true,1,0)}replace(e,t,n){let i=[];this.decompose(0,e,i,2);n.length&&n.decompose(0,n.length,i,3);this.decompose(t,this.length,i,1);return TextNode.from(i,this.length-(t-e)+n.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,t=this.length){let n=[];this.decompose(e,t,n,0);return TextNode.from(n,t-e)}eq(e){if(e==this)return true;if(e.length!=this.length||e.lines!=this.lines)return false;let t=this.scanIdentical(e,1),n=this.length-this.scanIdentical(e,-1);let i=new RawTextCursor(this),r=new RawTextCursor(e);for(let e=t,s=t;;){i.next(e);r.next(e);e=0;if(i.lineBreak!=r.lineBreak||i.done!=r.done||i.value!=r.value)return false;s+=i.value.length;if(i.done||s>=n)return true}}iter(e=1){return new RawTextCursor(this,e)}iterRange(e,t=this.length){return new PartialTextCursor(this,e,t)}iterLines(e,t){let n;if(null==e)n=this.iter();else{null==t&&(t=this.lines+1);let i=this.line(e).from;n=this.iterRange(i,Math.max(i,t==this.lines+1?this.length:t<=1?0:this.line(t-1).to))}return new LineCursor(n)}toString(){return this.sliceString(0)}toJSON(){let e=[];this.flatten(e);return e}static of(e){if(0==e.length)throw new RangeError("A document must have at least one line");return 1!=e.length||e[0]?e.length<=32?new TextLeaf(e):TextNode.from(TextLeaf.split(e,[])):Text.empty}}class TextLeaf extends Text{constructor(e,t=textLength(e)){super();this.text=e;this.length=t}get lines(){return this.text.length}get children(){return null}lineInner(e,t,n,i){for(let r=0;;r++){let s=this.text[r],l=i+s.length;if((t?n:l)>=e)return new Line(i,l,n,s);i=l+1;n++}}decompose(e,t,n,i){let r=e<=0&&t>=this.length?this:new TextLeaf(sliceText(this.text,e,t),Math.min(t,this.length)-Math.max(0,e));if(1&i){let e=n.pop();let t=appendText(r.text,e.text.slice(),0,r.length);if(t.length<=32)n.push(new TextLeaf(t,e.length+r.length));else{let e=t.length>>1;n.push(new TextLeaf(t.slice(0,e)),new TextLeaf(t.slice(e)))}}else n.push(r)}replace(e,t,n){if(!(n instanceof TextLeaf))return super.replace(e,t,n);let i=appendText(this.text,appendText(n.text,sliceText(this.text,0,e)),t);let r=this.length+n.length-(t-e);return i.length<=32?new TextLeaf(i,r):TextNode.from(TextLeaf.split(i,[]),r)}sliceString(e,t=this.length,n="\n"){let i="";for(let r=0,s=0;r<=t&&s<this.text.length;s++){let l=this.text[s],h=r+l.length;r>e&&s&&(i+=n);e<h&&t>r&&(i+=l.slice(Math.max(0,e-r),t-r));r=h+1}return i}flatten(e){for(let t of this.text)e.push(t)}scanIdentical(){return 0}static split(e,t){let n=[],i=-1;for(let r of e){n.push(r);i+=r.length+1;if(32==n.length){t.push(new TextLeaf(n,i));n=[];i=-1}}i>-1&&t.push(new TextLeaf(n,i));return t}}class TextNode extends Text{constructor(e,t){super();this.children=e;this.length=t;this.lines=0;for(let t of e)this.lines+=t.lines}lineInner(e,t,n,i){for(let r=0;;r++){let s=this.children[r],l=i+s.length,h=n+s.lines-1;if((t?h:l)>=e)return s.lineInner(e,t,n,i);i=l+1;n=h+1}}decompose(e,t,n,i){for(let r=0,s=0;s<=t&&r<this.children.length;r++){let l=this.children[r],h=s+l.length;if(e<=h&&t>=s){let r=i&((s<=e?1:0)|(h>=t?2:0));s>=e&&h<=t&&!r?n.push(l):l.decompose(e-s,t-s,n,r)}s=h+1}}replace(e,t,n){if(n.lines<this.lines)for(let i=0,r=0;i<this.children.length;i++){let s=this.children[i],l=r+s.length;if(e>=r&&t<=l){let h=s.replace(e-r,t-r,n);let o=this.lines-s.lines+h.lines;if(h.lines<o>>4&&h.lines>o>>6){let r=this.children.slice();r[i]=h;return new TextNode(r,this.length-(t-e)+n.length)}return super.replace(r,l,h)}r=l+1}return super.replace(e,t,n)}sliceString(e,t=this.length,n="\n"){let i="";for(let r=0,s=0;r<this.children.length&&s<=t;r++){let l=this.children[r],h=s+l.length;s>e&&r&&(i+=n);e<h&&t>s&&(i+=l.sliceString(e-s,t-s,n));s=h+1}return i}flatten(e){for(let t of this.children)t.flatten(e)}scanIdentical(e,t){if(!(e instanceof TextNode))return 0;let n=0;let[i,r,s,l]=t>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;i+=t,r+=t){if(i==s||r==l)return n;let h=this.children[i],o=e.children[r];if(h!=o)return n+h.scanIdentical(o,t);n+=h.length+1}}static from(e,t=e.reduce(((e,t)=>e+t.length+1),-1)){let n=0;for(let t of e)n+=t.lines;if(n<32){let n=[];for(let t of e)t.flatten(n);return new TextLeaf(n,t)}let i=Math.max(32,n>>5),r=i<<1,s=i>>1;let l=[],h=0,o=-1,a=[];function add(e){let t;if(e.lines>r&&e instanceof TextNode)for(let t of e.children)add(t);else if(e.lines>s&&(h>s||!h)){flush();l.push(e)}else if(e instanceof TextLeaf&&h&&(t=a[a.length-1])instanceof TextLeaf&&e.lines+t.lines<=32){h+=e.lines;o+=e.length+1;a[a.length-1]=new TextLeaf(t.text.concat(e.text),t.length+1+e.length)}else{h+e.lines>i&&flush();h+=e.lines;o+=e.length+1;a.push(e)}}function flush(){if(0!=h){l.push(1==a.length?a[0]:TextNode.from(a,o));o=-1;h=a.length=0}}for(let t of e)add(t);flush();return 1==l.length?l[0]:new TextNode(l,t)}}Text.empty=new TextLeaf([""],0);function textLength(e){let t=-1;for(let n of e)t+=n.length+1;return t}function appendText(e,t,n=0,i=1e9){for(let r=0,s=0,l=true;s<e.length&&r<=i;s++){let h=e[s],o=r+h.length;if(o>=n){o>i&&(h=h.slice(0,i-r));r<n&&(h=h.slice(n-r));if(l){t[t.length-1]+=h;l=false}else t.push(h)}r=o+1}return t}function sliceText(e,t,n){return appendText(e,[""],t,n)}class RawTextCursor{constructor(e,t=1){this.dir=t;this.done=false;this.lineBreak=false;this.value="";this.nodes=[e];this.offsets=[t>0?1:(e instanceof TextLeaf?e.text.length:e.children.length)<<1]}nextInner(e,t){this.done=this.lineBreak=false;for(;;){let n=this.nodes.length-1;let i=this.nodes[n],r=this.offsets[n],s=r>>1;let l=i instanceof TextLeaf?i.text.length:i.children.length;if(s==(t>0?l:0)){if(0==n){this.done=true;this.value="";return this}t>0&&this.offsets[n-1]++;this.nodes.pop();this.offsets.pop()}else if((1&r)==(t>0?0:1)){this.offsets[n]+=t;if(0==e){this.lineBreak=true;this.value="\n";return this}e--}else if(i instanceof TextLeaf){let r=i.text[s+(t<0?-1:0)];this.offsets[n]+=t;if(r.length>Math.max(0,e)){this.value=0==e?r:t>0?r.slice(e):r.slice(0,r.length-e);return this}e-=r.length}else{let r=i.children[s+(t<0?-1:0)];if(e>r.length){e-=r.length;this.offsets[n]+=t}else{t<0&&this.offsets[n]--;this.nodes.push(r);this.offsets.push(t>0?1:(r instanceof TextLeaf?r.text.length:r.children.length)<<1)}}}}next(e=0){if(e<0){this.nextInner(-e,-this.dir);e=this.value.length}return this.nextInner(e,this.dir)}}class PartialTextCursor{constructor(e,t,n){this.value="";this.done=false;this.cursor=new RawTextCursor(e,t>n?-1:1);this.pos=t>n?e.length:0;this.from=Math.min(t,n);this.to=Math.max(t,n)}nextInner(e,t){if(t<0?this.pos<=this.from:this.pos>=this.to){this.value="";this.done=true;return this}e+=Math.max(0,t<0?this.pos-this.to:this.from-this.pos);let n=t<0?this.pos-this.from:this.to-this.pos;e>n&&(e=n);n-=e;let{value:i}=this.cursor.next(e);this.pos+=(i.length+e)*t;this.value=i.length<=n?i:t<0?i.slice(i.length-n):i.slice(0,n);this.done=!this.value;return this}next(e=0){e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos));return this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&""!=this.value}}class LineCursor{constructor(e){this.inner=e;this.afterBreak=true;this.value="";this.done=false}next(e=0){let{done:t,lineBreak:n,value:i}=this.inner.next(e);if(t){this.done=true;this.value=""}else if(n)if(this.afterBreak)this.value="";else{this.afterBreak=true;this.next()}else{this.value=i;this.afterBreak=false}return this}get lineBreak(){return false}}if("undefined"!=typeof Symbol){Text.prototype[Symbol.iterator]=function(){return this.iter()};RawTextCursor.prototype[Symbol.iterator]=PartialTextCursor.prototype[Symbol.iterator]=LineCursor.prototype[Symbol.iterator]=function(){return this}}class Line{constructor(e,t,n,i){this.from=e;this.to=t;this.number=n;this.text=i}get length(){return this.to-this.from}}export{Line,Text,codePointAt,codePointSize,countColumn,findClusterBreak,findColumn,fromCodePoint};
