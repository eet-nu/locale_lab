import{EditorView as e,showPanel as t,getPanel as r,Decoration as n,ViewPlugin as s,runScopeHandlers as i}from"@codemirror/view";import{codePointAt as o,fromCodePoint as a,codePointSize as l,EditorSelection as c,StateEffect as h,StateField as u,Facet as f,combineConfig as d,CharCategory as p,EditorState as m,findClusterBreak as g,RangeSetBuilder as v,Prec as x}from"@codemirror/state";import y from"crelt";const S=typeof String.prototype.normalize=="function"?e=>e.normalize("NFKD"):e=>e;class SearchCursor{constructor(e,t,r=0,n=e.length,s,i){this.test=i;this.value={from:0,to:0};this.done=false;this.matches=[];this.buffer="";this.bufferPos=0;this.iter=e.iterRange(r,n);this.bufferStart=r;this.normalize=s?e=>s(S(e)):S;this.query=this.normalize(t)}peek(){if(this.bufferPos==this.buffer.length){this.bufferStart+=this.buffer.length;this.iter.next();if(this.iter.done)return-1;this.bufferPos=0;this.buffer=this.iter.value}return o(this.buffer,this.bufferPos)}next(){while(this.matches.length)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0){this.done=true;return this}let t=a(e),r=this.bufferStart+this.bufferPos;this.bufferPos+=l(e);let n=this.normalize(t);if(n.length)for(let e=0,s=r;;e++){let i=n.charCodeAt(e);let o=this.match(i,s,this.bufferPos+this.bufferStart);if(e==n.length-1){if(o){this.value=o;return this}break}s==r&&e<t.length&&t.charCodeAt(e)==i&&s++}}}match(e,t,r){let n=null;for(let t=0;t<this.matches.length;t+=2){let s=this.matches[t],i=false;if(this.query.charCodeAt(s)==e)if(s==this.query.length-1)n={from:this.matches[t+1],to:r};else{this.matches[t]++;i=true}if(!i){this.matches.splice(t,2);t-=2}}this.query.charCodeAt(0)==e&&(this.query.length==1?n={from:t,to:r}:this.matches.push(1,t));n&&this.test&&!this.test(n.from,n.to,this.buffer,this.bufferStart)&&(n=null);return n}}typeof Symbol!="undefined"&&(SearchCursor.prototype[Symbol.iterator]=function(){return this});const b={from:-1,to:-1,match:/.*/.exec("")};const w="gm"+(/x/.unicode==null?"":"u");class RegExpCursor{constructor(e,t,r,n=0,s=e.length){this.text=e;this.to=s;this.curLine="";this.done=false;this.value=b;if(/\\[sWDnr]|\n|\r|\[\^/.test(t))return new MultilineRegExpCursor(e,t,r,n,s);this.re=new RegExp(t,w+((r===null||r===void 0?void 0:r.ignoreCase)?"i":""));this.test=r===null||r===void 0?void 0:r.test;this.iter=e.iter();let i=e.lineAt(n);this.curLineStart=i.from;this.matchPos=toCharEnd(e,n);this.getLine(this.curLineStart)}getLine(e){this.iter.next(e);if(this.iter.lineBreak)this.curLine="";else{this.curLine=this.iter.value;this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart));this.iter.next()}}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1;this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let t=this.matchPos<=this.to&&this.re.exec(this.curLine);if(t){let r=this.curLineStart+t.index,n=r+t[0].length;this.matchPos=toCharEnd(this.text,n+(r==n?1:0));r==this.curLineStart+this.curLine.length&&this.nextLine();if((r<n||r>this.value.to)&&(!this.test||this.test(r,n,t))){this.value={from:r,to:n,match:t};return this}e=this.matchPos-this.curLineStart}else{if(!(this.curLineStart+this.curLine.length<this.to)){this.done=true;return this}this.nextLine();e=0}}}}const C=new WeakMap;class FlattenedDoc{constructor(e,t){this.from=e;this.text=t}get to(){return this.from+this.text.length}static get(e,t,r){let n=C.get(e);if(!n||n.from>=r||n.to<=t){let n=new FlattenedDoc(t,e.sliceString(t,r));C.set(e,n);return n}if(n.from==t&&n.to==r)return n;let{text:s,from:i}=n;if(i>t){s=e.sliceString(t,i)+s;i=t}n.to<r&&(s+=e.sliceString(n.to,r));C.set(e,new FlattenedDoc(i,s));return new FlattenedDoc(t,s.slice(t-i,r-i))}}class MultilineRegExpCursor{constructor(e,t,r,n,s){this.text=e;this.to=s;this.done=false;this.value=b;this.matchPos=toCharEnd(e,n);this.re=new RegExp(t,w+((r===null||r===void 0?void 0:r.ignoreCase)?"i":""));this.test=r===null||r===void 0?void 0:r.test;this.flat=FlattenedDoc.get(e,n,this.chunkEnd(n+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from;let t=this.re.exec(this.flat.text);if(t&&!t[0]&&t.index==e){this.re.lastIndex=e+1;t=this.re.exec(this.flat.text)}if(t){let e=this.flat.from+t.index,r=e+t[0].length;if((this.flat.to>=this.to||t.index+t[0].length<=this.flat.text.length-10)&&(!this.test||this.test(e,r,t))){this.value={from:e,to:r,match:t};this.matchPos=toCharEnd(this.text,r+(e==r?1:0));return this}}if(this.flat.to==this.to){this.done=true;return this}this.flat=FlattenedDoc.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol!="undefined"&&(RegExpCursor.prototype[Symbol.iterator]=MultilineRegExpCursor.prototype[Symbol.iterator]=function(){return this});function validRegExp(e){try{new RegExp(e,w);return true}catch(e){return false}}function toCharEnd(e,t){if(t>=e.length)return t;let r,n=e.lineAt(t);while(t<n.to&&(r=n.text.charCodeAt(t-n.from))>=56320&&r<57344)t++;return t}function createLineDialog(t){let r=String(t.state.doc.lineAt(t.state.selection.main.head).number);let n=y("input",{class:"cm-textfield",name:"line",value:r});let s=y("form",{class:"cm-gotoLine",onkeydown:e=>{if(e.keyCode==27){e.preventDefault();t.dispatch({effects:M.of(false)});t.focus()}else if(e.keyCode==13){e.preventDefault();go()}},onsubmit:e=>{e.preventDefault();go()}},y("label",t.state.phrase("Go to line"),": ",n)," ",y("button",{class:"cm-button",type:"submit"},t.state.phrase("go")));function go(){let r=/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(n.value);if(!r)return;let{state:s}=t,i=s.doc.lineAt(s.selection.main.head);let[,o,a,l,h]=r;let u=l?+l.slice(1):0;let f=a?+a:i.number;if(a&&h){let e=f/100;o&&(e=e*(o=="-"?-1:1)+i.number/s.doc.lines);f=Math.round(s.doc.lines*e)}else a&&o&&(f=f*(o=="-"?-1:1)+i.number);let d=s.doc.line(Math.max(1,Math.min(s.doc.lines,f)));let p=c.cursor(d.from+Math.max(0,Math.min(u,d.length)));t.dispatch({effects:[M.of(false),e.scrollIntoView(p.from,{y:"center"})],selection:p});t.focus()}return{dom:s}}const M=h.define();const k=u.define({create(){return true},update(e,t){for(let r of t.effects)r.is(M)&&(e=r.value);return e},provide:e=>t.from(e,(e=>e?createLineDialog:null))});const gotoLine=e=>{let t=r(e,createLineDialog);if(!t){let n=[M.of(true)];e.state.field(k,false)==null&&n.push(h.appendConfig.of([k,W]));e.dispatch({effects:n});t=r(e,createLineDialog)}t&&t.dom.querySelector("input").select();return true};const W=e.baseTheme({".cm-panel.cm-gotoLine":{padding:"2px 6px 4px","& label":{fontSize:"80%"}}});const q={highlightWordAroundCursor:false,minSelectionLength:1,maxMatches:100,wholeWords:false};const L=f.define({combine(e){return d(e,q,{highlightWordAroundCursor:(e,t)=>e||t,minSelectionLength:Math.min,maxMatches:Math.min})}});function highlightSelectionMatches(e){let t=[A,E];e&&t.push(L.of(e));return t}const D=n.mark({class:"cm-selectionMatch"});const F=n.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function insideWordBoundaries(e,t,r,n){return(r==0||e(t.sliceDoc(r-1,r))!=p.Word)&&(n==t.doc.length||e(t.sliceDoc(n,n+1))!=p.Word)}function insideWord(e,t,r,n){return e(t.sliceDoc(r,r+1))==p.Word&&e(t.sliceDoc(n-1,n))==p.Word}const E=s.fromClass(class{constructor(e){this.decorations=this.getDeco(e)}update(e){(e.selectionSet||e.docChanged||e.viewportChanged)&&(this.decorations=this.getDeco(e.view))}getDeco(e){let t=e.state.facet(L);let{state:r}=e,s=r.selection;if(s.ranges.length>1)return n.none;let i,o=s.main,a=null;if(o.empty){if(!t.highlightWordAroundCursor)return n.none;let e=r.wordAt(o.head);if(!e)return n.none;a=r.charCategorizer(o.head);i=r.sliceDoc(e.from,e.to)}else{let e=o.to-o.from;if(e<t.minSelectionLength||e>200)return n.none;if(t.wholeWords){i=r.sliceDoc(o.from,o.to);a=r.charCategorizer(o.head);if(!(insideWordBoundaries(a,r,o.from,o.to)&&insideWord(a,r,o.from,o.to)))return n.none}else{i=r.sliceDoc(o.from,o.to);if(!i)return n.none}}let l=[];for(let s of e.visibleRanges){let e=new SearchCursor(r.doc,i,s.from,s.to);while(!e.next().done){let{from:s,to:i}=e.value;if(!a||insideWordBoundaries(a,r,s,i)){o.empty&&s<=o.from&&i>=o.to?l.push(F.range(s,i)):(s>=o.to||i<=o.from)&&l.push(D.range(s,i));if(l.length>t.maxMatches)return n.none}}}return n.set(l)}},{decorations:e=>e.decorations});const A=e.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}});const selectWord=({state:e,dispatch:t})=>{let{selection:r}=e;let n=c.create(r.ranges.map((t=>e.wordAt(t.head)||c.cursor(t.head))),r.mainIndex);if(n.eq(r))return false;t(e.update({selection:n}));return true};function findNextOccurrence(e,t){let{main:r,ranges:n}=e.selection;let s=e.wordAt(r.head),i=s&&s.from==r.from&&s.to==r.to;for(let r=false,s=new SearchCursor(e.doc,t,n[n.length-1].to);;){s.next();if(!s.done){if(r&&n.some((e=>e.from==s.value.from)))continue;if(i){let t=e.wordAt(s.value.from);if(!t||t.from!=s.value.from||t.to!=s.value.to)continue}return s.value}if(r)return null;s=new SearchCursor(e.doc,t,0,Math.max(0,n[n.length-1].from-1));r=true}}const selectNextOccurrence=({state:t,dispatch:r})=>{let{ranges:n}=t.selection;if(n.some((e=>e.from===e.to)))return selectWord({state:t,dispatch:r});let s=t.sliceDoc(n[0].from,n[0].to);if(t.selection.ranges.some((e=>t.sliceDoc(e.from,e.to)!=s)))return false;let i=findNextOccurrence(t,s);if(!i)return false;r(t.update({selection:t.selection.addRange(c.range(i.from,i.to),false),effects:e.scrollIntoView(i.to)}));return true};const R=f.define({combine(t){return d(t,{top:false,caseSensitive:false,literal:false,regexp:false,wholeWord:false,createPanel:e=>new SearchPanel(e),scrollToMatch:t=>e.scrollIntoView(t)})}});function search(e){return e?[R.of(e),U]:U}class SearchQuery{constructor(e){this.search=e.search;this.caseSensitive=!!e.caseSensitive;this.literal=!!e.literal;this.regexp=!!e.regexp;this.replace=e.replace||"";this.valid=!!this.search&&(!this.regexp||validRegExp(this.search));this.unquoted=this.unquote(this.search);this.wholeWord=!!e.wholeWord}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,((e,t)=>t=="n"?"\n":t=="r"?"\r":t=="t"?"\t":"\\"))}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord}create(){return this.regexp?new RegExpQuery(this):new StringQuery(this)}getCursor(e,t=0,r){let n=e.doc?e:m.create({doc:e});r==null&&(r=n.doc.length);return this.regexp?regexpCursor(this,n,t,r):stringCursor(this,n,t,r)}}class QueryType{constructor(e){this.spec=e}}function stringCursor(e,t,r,n){return new SearchCursor(t.doc,e.unquoted,r,n,e.caseSensitive?void 0:e=>e.toLowerCase(),e.wholeWord?stringWordTest(t.doc,t.charCategorizer(t.selection.main.head)):void 0)}function stringWordTest(e,t){return(r,n,s,i)=>{if(i>r||i+s.length<n){i=Math.max(0,r-2);s=e.sliceString(i,Math.min(e.length,n+2))}return(t(charBefore(s,r-i))!=p.Word||t(charAfter(s,r-i))!=p.Word)&&(t(charAfter(s,n-i))!=p.Word||t(charBefore(s,n-i))!=p.Word)}}class StringQuery extends QueryType{constructor(e){super(e)}nextMatch(e,t,r){let n=stringCursor(this.spec,e,r,e.doc.length).nextOverlapping();if(n.done){let r=Math.min(e.doc.length,t+this.spec.unquoted.length);n=stringCursor(this.spec,e,0,r).nextOverlapping()}return n.done||n.value.from==t&&n.value.to==r?null:n.value}prevMatchInRange(e,t,r){for(let n=r;;){let r=Math.max(t,n-1e4-this.spec.unquoted.length);let s=stringCursor(this.spec,e,r,n),i=null;while(!s.nextOverlapping().done)i=s.value;if(i)return i;if(r==t)return null;n-=1e4}}prevMatch(e,t,r){let n=this.prevMatchInRange(e,0,t);n||(n=this.prevMatchInRange(e,Math.max(0,r-this.spec.unquoted.length),e.doc.length));return!n||n.from==t&&n.to==r?null:n}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,t){let r=stringCursor(this.spec,e,0,e.doc.length),n=[];while(!r.next().done){if(n.length>=t)return null;n.push(r.value)}return n}highlight(e,t,r,n){let s=stringCursor(this.spec,e,Math.max(0,t-this.spec.unquoted.length),Math.min(r+this.spec.unquoted.length,e.doc.length));while(!s.next().done)n(s.value.from,s.value.to)}}function regexpCursor(e,t,r,n){return new RegExpCursor(t.doc,e.search,{ignoreCase:!e.caseSensitive,test:e.wholeWord?regexpWordTest(t.charCategorizer(t.selection.main.head)):void 0},r,n)}function charBefore(e,t){return e.slice(g(e,t,false),t)}function charAfter(e,t){return e.slice(t,g(e,t))}function regexpWordTest(e){return(t,r,n)=>!n[0].length||(e(charBefore(n.input,n.index))!=p.Word||e(charAfter(n.input,n.index))!=p.Word)&&(e(charAfter(n.input,n.index+n[0].length))!=p.Word||e(charBefore(n.input,n.index+n[0].length))!=p.Word)}class RegExpQuery extends QueryType{nextMatch(e,t,r){let n=regexpCursor(this.spec,e,r,e.doc.length).next();n.done&&(n=regexpCursor(this.spec,e,0,t).next());return n.done?null:n.value}prevMatchInRange(e,t,r){for(let n=1;;n++){let s=Math.max(t,r-n*1e4);let i=regexpCursor(this.spec,e,s,r),o=null;while(!i.next().done)o=i.value;if(o&&(s==t||o.from>s+10))return o;if(s==t)return null}}prevMatch(e,t,r){return this.prevMatchInRange(e,0,t)||this.prevMatchInRange(e,r,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g,((t,r)=>r=="$"?"$":r=="&"?e.match[0]:r!="0"&&+r<e.match.length?e.match[r]:t))}matchAll(e,t){let r=regexpCursor(this.spec,e,0,e.doc.length),n=[];while(!r.next().done){if(n.length>=t)return null;n.push(r.value)}return n}highlight(e,t,r,n){let s=regexpCursor(this.spec,e,Math.max(0,t-250),Math.min(r+250,e.doc.length));while(!s.next().done)n(s.value.from,s.value.to)}}const P=h.define();const Q=h.define();const I=u.define({create(e){return new SearchState(defaultQuery(e).create(),null)},update(e,t){for(let r of t.effects)r.is(P)?e=new SearchState(r.value.create(),e.panel):r.is(Q)&&(e=new SearchState(e.query,r.value?createSearchPanel:null));return e},provide:e=>t.from(e,(e=>e.panel))});function getSearchQuery(e){let t=e.field(I,false);return t?t.query.spec:defaultQuery(e)}function searchPanelOpen(e){var t;return((t=e.field(I,false))===null||t===void 0?void 0:t.panel)!=null}class SearchState{constructor(e,t){this.query=e;this.panel=t}}const T=n.mark({class:"cm-searchMatch"}),O=n.mark({class:"cm-searchMatch cm-searchMatch-selected"});const z=s.fromClass(class{constructor(e){this.view=e;this.decorations=this.highlight(e.state.field(I))}update(e){let t=e.state.field(I);(t!=e.startState.field(I)||e.docChanged||e.selectionSet||e.viewportChanged)&&(this.decorations=this.highlight(t))}highlight({query:e,panel:t}){if(!t||!e.spec.valid)return n.none;let{view:r}=this;let s=new v;for(let t=0,n=r.visibleRanges,i=n.length;t<i;t++){let{from:o,to:a}=n[t];while(t<i-1&&a>n[t+1].from-500)a=n[++t].to;e.highlight(r.state,o,a,((e,t)=>{let n=r.state.selection.ranges.some((r=>r.from==e&&r.to==t));s.add(e,t,n?O:T)}))}return s.finish()}},{decorations:e=>e.decorations});function searchCommand(e){return t=>{let r=t.state.field(I,false);return r&&r.query.spec.valid?e(t,r):openSearchPanel(t)}}const $=searchCommand(((e,{query:t})=>{let{to:r}=e.state.selection.main;let n=t.nextMatch(e.state,r,r);if(!n)return false;let s=c.single(n.from,n.to);let i=e.state.facet(R);e.dispatch({selection:s,effects:[announceMatch(e,n),i.scrollToMatch(s.main,e)],userEvent:"select.search"});selectSearchInput(e);return true}));const B=searchCommand(((e,{query:t})=>{let{state:r}=e,{from:n}=r.selection.main;let s=t.prevMatch(r,n,n);if(!s)return false;let i=c.single(s.from,s.to);let o=e.state.facet(R);e.dispatch({selection:i,effects:[announceMatch(e,s),o.scrollToMatch(i.main,e)],userEvent:"select.search"});selectSearchInput(e);return true}));const N=searchCommand(((e,{query:t})=>{let r=t.matchAll(e.state,1e3);if(!r||!r.length)return false;e.dispatch({selection:c.create(r.map((e=>c.range(e.from,e.to)))),userEvent:"select.search.matches"});return true}));const selectSelectionMatches=({state:e,dispatch:t})=>{let r=e.selection;if(r.ranges.length>1||r.main.empty)return false;let{from:n,to:s}=r.main;let i=[],o=0;for(let t=new SearchCursor(e.doc,e.sliceDoc(n,s));!t.next().done;){if(i.length>1e3)return false;t.value.from==n&&(o=i.length);i.push(c.range(t.value.from,t.value.to))}t(e.update({selection:c.create(i,o),userEvent:"select.search.matches"}));return true};const V=searchCommand(((t,{query:r})=>{let{state:n}=t,{from:s,to:i}=n.selection.main;if(n.readOnly)return false;let o=r.nextMatch(n,s,s);if(!o)return false;let a,l,h=[];let u=[];if(o.from==s&&o.to==i){l=n.toText(r.getReplacement(o));h.push({from:o.from,to:o.to,insert:l});o=r.nextMatch(n,o.from,o.to);u.push(e.announce.of(n.phrase("replaced match on line $",n.doc.lineAt(s).number)+"."))}if(o){let e=h.length==0||h[0].from>=o.to?0:o.to-o.from-l.length;a=c.single(o.from-e,o.to-e);u.push(announceMatch(t,o));u.push(n.facet(R).scrollToMatch(a.main,t))}t.dispatch({changes:h,selection:a,effects:u,userEvent:"input.replace"});return true}));const K=searchCommand(((t,{query:r})=>{if(t.state.readOnly)return false;let n=r.matchAll(t.state,1e9).map((e=>{let{from:t,to:n}=e;return{from:t,to:n,insert:r.getReplacement(e)}}));if(!n.length)return false;let s=t.state.phrase("replaced $ matches",n.length)+".";t.dispatch({changes:n,effects:e.announce.of(s),userEvent:"input.replace.all"});return true}));function createSearchPanel(e){return e.state.facet(R).createPanel(e)}function defaultQuery(e,t){var r,n,s,i,o;let a=e.selection.main;let l=a.empty||a.to>a.from+100?"":e.sliceDoc(a.from,a.to);if(t&&!l)return t;let c=e.facet(R);return new SearchQuery({search:((r=t===null||t===void 0?void 0:t.literal)!==null&&r!==void 0?r:c.literal)?l:l.replace(/\n/g,"\\n"),caseSensitive:(n=t===null||t===void 0?void 0:t.caseSensitive)!==null&&n!==void 0?n:c.caseSensitive,literal:(s=t===null||t===void 0?void 0:t.literal)!==null&&s!==void 0?s:c.literal,regexp:(i=t===null||t===void 0?void 0:t.regexp)!==null&&i!==void 0?i:c.regexp,wholeWord:(o=t===null||t===void 0?void 0:t.wholeWord)!==null&&o!==void 0?o:c.wholeWord})}function getSearchInput(e){let t=r(e,createSearchPanel);return t&&t.dom.querySelector("[main-field]")}function selectSearchInput(e){let t=getSearchInput(e);t&&t==e.root.activeElement&&t.select()}const openSearchPanel=e=>{let t=e.state.field(I,false);if(t&&t.panel){let r=getSearchInput(e);if(r&&r!=e.root.activeElement){let n=defaultQuery(e.state,t.query.spec);n.valid&&e.dispatch({effects:P.of(n)});r.focus();r.select()}}else e.dispatch({effects:[Q.of(true),t?P.of(defaultQuery(e.state,t.query.spec)):h.appendConfig.of(U)]});return true};const closeSearchPanel=e=>{let t=e.state.field(I,false);if(!t||!t.panel)return false;let n=r(e,createSearchPanel);n&&n.dom.contains(e.root.activeElement)&&e.focus();e.dispatch({effects:Q.of(false)});return true};const G=[{key:"Mod-f",run:openSearchPanel,scope:"editor search-panel"},{key:"F3",run:$,shift:B,scope:"editor search-panel",preventDefault:true},{key:"Mod-g",run:$,shift:B,scope:"editor search-panel",preventDefault:true},{key:"Escape",run:closeSearchPanel,scope:"editor search-panel"},{key:"Mod-Shift-l",run:selectSelectionMatches},{key:"Mod-Alt-g",run:gotoLine},{key:"Mod-d",run:selectNextOccurrence,preventDefault:true}];class SearchPanel{constructor(e){this.view=e;let t=this.query=e.state.field(I).query.spec;this.commit=this.commit.bind(this);this.searchField=y("input",{value:t.search,placeholder:phrase(e,"Find"),"aria-label":phrase(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit});this.replaceField=y("input",{value:t.replace,placeholder:phrase(e,"Replace"),"aria-label":phrase(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit});this.caseField=y("input",{type:"checkbox",name:"case",form:"",checked:t.caseSensitive,onchange:this.commit});this.reField=y("input",{type:"checkbox",name:"re",form:"",checked:t.regexp,onchange:this.commit});this.wordField=y("input",{type:"checkbox",name:"word",form:"",checked:t.wholeWord,onchange:this.commit});function button(e,t,r){return y("button",{class:"cm-button",name:e,onclick:t,type:"button"},r)}this.dom=y("div",{onkeydown:e=>this.keydown(e),class:"cm-search"},[this.searchField,button("next",(()=>$(e)),[phrase(e,"next")]),button("prev",(()=>B(e)),[phrase(e,"previous")]),button("select",(()=>N(e)),[phrase(e,"all")]),y("label",null,[this.caseField,phrase(e,"match case")]),y("label",null,[this.reField,phrase(e,"regexp")]),y("label",null,[this.wordField,phrase(e,"by word")]),...e.state.readOnly?[]:[y("br"),this.replaceField,button("replace",(()=>V(e)),[phrase(e,"replace")]),button("replaceAll",(()=>K(e)),[phrase(e,"replace all")])],y("button",{name:"close",onclick:()=>closeSearchPanel(e),"aria-label":phrase(e,"close"),type:"button"},["×"])])}commit(){let e=new SearchQuery({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});if(!e.eq(this.query)){this.query=e;this.view.dispatch({effects:P.of(e)})}}keydown(e){if(i(this.view,e,"search-panel"))e.preventDefault();else if(e.keyCode==13&&e.target==this.searchField){e.preventDefault();(e.shiftKey?B:$)(this.view)}else if(e.keyCode==13&&e.target==this.replaceField){e.preventDefault();V(this.view)}}update(e){for(let t of e.transactions)for(let e of t.effects)e.is(P)&&!e.value.eq(this.query)&&this.setQuery(e.value)}setQuery(e){this.query=e;this.searchField.value=e.search;this.replaceField.value=e.replace;this.caseField.checked=e.caseSensitive;this.reField.checked=e.regexp;this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(R).top}}function phrase(e,t){return e.state.phrase(t)}const j=30;const H=/[\s\.,:;?!]/;function announceMatch(t,{from:r,to:n}){let s=t.state.doc.lineAt(r),i=t.state.doc.lineAt(n).to;let o=Math.max(s.from,r-j),a=Math.min(i,n+j);let l=t.state.sliceDoc(o,a);if(o!=s.from)for(let e=0;e<j;e++)if(!H.test(l[e+1])&&H.test(l[e])){l=l.slice(e);break}if(a!=i)for(let e=l.length-1;e>l.length-j;e--)if(!H.test(l[e-1])&&H.test(l[e])){l=l.slice(0,e);break}return e.announce.of(`${t.state.phrase("current match")}. ${l} ${t.state.phrase("on line")} ${s.number}.`)}const J=e.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}});const U=[I,x.low(z),J];export{RegExpCursor,SearchCursor,SearchQuery,closeSearchPanel,$ as findNext,B as findPrevious,getSearchQuery,gotoLine,highlightSelectionMatches,openSearchPanel,K as replaceAll,V as replaceNext,search,G as searchKeymap,searchPanelOpen,N as selectMatches,selectNextOccurrence,selectSelectionMatches,P as setSearchQuery};

