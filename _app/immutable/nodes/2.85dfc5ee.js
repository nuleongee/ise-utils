import{S as dt,i as pt,s as mt,k as N,a as J,q as V,J as gt,l as H,h as I,c as q,m as Z,r as G,n as $,D as v,b as at,K as it,L as st,H as ot,M as $t,u as lt}from"../chunks/index.542e350b.js";const vt=!0,Tt=Object.freeze(Object.defineProperty({__proto__:null,prerender:vt},Symbol.toStringTag,{value:"Module"}));var _t=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function yt(d){return d&&d.__esModule&&Object.prototype.hasOwnProperty.call(d,"default")?d.default:d}var ct={exports:{}};(function(d,m){(function(h,u){d.exports=u()})(_t,function(){var h=1e3,u=6e4,g=36e5,D="millisecond",o="second",w="minute",_="hour",y="day",P="week",l="month",p="quarter",L="year",j="date",A="Invalid Date",Y=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,X=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,x={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(r){var e=["th","st","nd","rd"],t=r%100;return"["+r+(e[(t-20)%10]||e[t]||e[0])+"]"}},O=function(r,e,t){var i=String(r);return!i||i.length>=e?r:""+Array(e+1-i.length).join(t)+r},tt={s:O,z:function(r){var e=-r.utcOffset(),t=Math.abs(e),i=Math.floor(t/60),n=t%60;return(e<=0?"+":"-")+O(i,2,"0")+":"+O(n,2,"0")},m:function r(e,t){if(e.date()<t.date())return-r(t,e);var i=12*(t.year()-e.year())+(t.month()-e.month()),n=e.clone().add(i,l),a=t-n<0,s=e.clone().add(i+(a?-1:1),l);return+(-(i+(t-n)/(a?n-s:s-n))||0)},a:function(r){return r<0?Math.ceil(r)||0:Math.floor(r)},p:function(r){return{M:l,y:L,w:P,d:y,D:j,h:_,m:w,s:o,ms:D,Q:p}[r]||String(r||"").toLowerCase().replace(/s$/,"")},u:function(r){return r===void 0}},W="en",C={};C[W]=x;var z=function(r){return r instanceof K},U=function r(e,t,i){var n;if(!e)return W;if(typeof e=="string"){var a=e.toLowerCase();C[a]&&(n=a),t&&(C[a]=t,n=a);var s=e.split("-");if(!n&&s.length>1)return r(s[0])}else{var c=e.name;C[c]=e,n=c}return!i&&n&&(W=n),n||!i&&W},M=function(r,e){if(z(r))return r.clone();var t=typeof e=="object"?e:{};return t.date=r,t.args=arguments,new K(t)},f=tt;f.l=U,f.i=z,f.w=function(r,e){return M(r,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var K=function(){function r(t){this.$L=U(t.locale,null,!0),this.parse(t)}var e=r.prototype;return e.parse=function(t){this.$d=function(i){var n=i.date,a=i.utc;if(n===null)return new Date(NaN);if(f.u(n))return new Date;if(n instanceof Date)return new Date(n);if(typeof n=="string"&&!/Z$/i.test(n)){var s=n.match(Y);if(s){var c=s[2]-1||0,b=(s[7]||"0").substring(0,3);return a?new Date(Date.UTC(s[1],c,s[3]||1,s[4]||0,s[5]||0,s[6]||0,b)):new Date(s[1],c,s[3]||1,s[4]||0,s[5]||0,s[6]||0,b)}}return new Date(n)}(t),this.$x=t.x||{},this.init()},e.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},e.$utils=function(){return f},e.isValid=function(){return this.$d.toString()!==A},e.isSame=function(t,i){var n=M(t);return this.startOf(i)<=n&&n<=this.endOf(i)},e.isAfter=function(t,i){return M(t)<this.startOf(i)},e.isBefore=function(t,i){return this.endOf(i)<M(t)},e.$g=function(t,i,n){return f.u(t)?this[i]:this.set(n,t)},e.unix=function(){return Math.floor(this.valueOf()/1e3)},e.valueOf=function(){return this.$d.getTime()},e.startOf=function(t,i){var n=this,a=!!f.u(i)||i,s=f.p(t),c=function(Q,E){var B=f.w(n.$u?Date.UTC(n.$y,E,Q):new Date(n.$y,E,Q),n);return a?B:B.endOf(y)},b=function(Q,E){return f.w(n.toDate()[Q].apply(n.toDate("s"),(a?[0,0,0,0]:[23,59,59,999]).slice(E)),n)},S=this.$W,k=this.$M,R=this.$D,F="set"+(this.$u?"UTC":"");switch(s){case L:return a?c(1,0):c(31,11);case l:return a?c(1,k):c(0,k+1);case P:var et=this.$locale().weekStart||0,nt=(S<et?S+7:S)-et;return c(a?R-nt:R+(6-nt),k);case y:case j:return b(F+"Hours",0);case _:return b(F+"Minutes",1);case w:return b(F+"Seconds",2);case o:return b(F+"Milliseconds",3);default:return this.clone()}},e.endOf=function(t){return this.startOf(t,!1)},e.$set=function(t,i){var n,a=f.p(t),s="set"+(this.$u?"UTC":""),c=(n={},n[y]=s+"Date",n[j]=s+"Date",n[l]=s+"Month",n[L]=s+"FullYear",n[_]=s+"Hours",n[w]=s+"Minutes",n[o]=s+"Seconds",n[D]=s+"Milliseconds",n)[a],b=a===y?this.$D+(i-this.$W):i;if(a===l||a===L){var S=this.clone().set(j,1);S.$d[c](b),S.init(),this.$d=S.set(j,Math.min(this.$D,S.daysInMonth())).$d}else c&&this.$d[c](b);return this.init(),this},e.set=function(t,i){return this.clone().$set(t,i)},e.get=function(t){return this[f.p(t)]()},e.add=function(t,i){var n,a=this;t=Number(t);var s=f.p(i),c=function(k){var R=M(a);return f.w(R.date(R.date()+Math.round(k*t)),a)};if(s===l)return this.set(l,this.$M+t);if(s===L)return this.set(L,this.$y+t);if(s===y)return c(1);if(s===P)return c(7);var b=(n={},n[w]=u,n[_]=g,n[o]=h,n)[s]||1,S=this.$d.getTime()+t*b;return f.w(S,this)},e.subtract=function(t,i){return this.add(-1*t,i)},e.format=function(t){var i=this,n=this.$locale();if(!this.isValid())return n.invalidDate||A;var a=t||"YYYY-MM-DDTHH:mm:ssZ",s=f.z(this),c=this.$H,b=this.$m,S=this.$M,k=n.weekdays,R=n.months,F=function(E,B,ut,rt){return E&&(E[B]||E(i,a))||ut[B].slice(0,rt)},et=function(E){return f.s(c%12||12,E,"0")},nt=n.meridiem||function(E,B,ut){var rt=E<12?"AM":"PM";return ut?rt.toLowerCase():rt},Q={YY:String(this.$y).slice(-2),YYYY:f.s(this.$y,4,"0"),M:S+1,MM:f.s(S+1,2,"0"),MMM:F(n.monthsShort,S,R,3),MMMM:F(R,S),D:this.$D,DD:f.s(this.$D,2,"0"),d:String(this.$W),dd:F(n.weekdaysMin,this.$W,k,2),ddd:F(n.weekdaysShort,this.$W,k,3),dddd:k[this.$W],H:String(c),HH:f.s(c,2,"0"),h:et(1),hh:et(2),a:nt(c,b,!0),A:nt(c,b,!1),m:String(b),mm:f.s(b,2,"0"),s:String(this.$s),ss:f.s(this.$s,2,"0"),SSS:f.s(this.$ms,3,"0"),Z:s};return a.replace(X,function(E,B){return B||Q[E]||s.replace(":","")})},e.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},e.diff=function(t,i,n){var a,s=f.p(i),c=M(t),b=(c.utcOffset()-this.utcOffset())*u,S=this-c,k=f.m(this,c);return k=(a={},a[L]=k/12,a[l]=k,a[p]=k/3,a[P]=(S-b)/6048e5,a[y]=(S-b)/864e5,a[_]=S/g,a[w]=S/u,a[o]=S/h,a)[s]||S,n?k:f.a(k)},e.daysInMonth=function(){return this.endOf(l).$D},e.$locale=function(){return C[this.$L]},e.locale=function(t,i){if(!t)return this.$L;var n=this.clone(),a=U(t,i,!0);return a&&(n.$L=a),n},e.clone=function(){return f.w(this.$d,this)},e.toDate=function(){return new Date(this.valueOf())},e.toJSON=function(){return this.isValid()?this.toISOString():null},e.toISOString=function(){return this.$d.toISOString()},e.toString=function(){return this.$d.toUTCString()},r}(),T=K.prototype;return M.prototype=T,[["$ms",D],["$s",o],["$m",w],["$H",_],["$W",y],["$M",l],["$y",L],["$D",j]].forEach(function(r){T[r[1]]=function(e){return this.$g(e,r[0],r[1])}}),M.extend=function(r,e){return r.$i||(r(e,K,M),r.$i=!0),M},M.locale=U,M.isDayjs=z,M.unix=function(r){return M(1e3*r)},M.en=C[W],M.Ls=C,M.p={},M})})(ct);var Mt=ct.exports;const St=yt(Mt);function ft(d){let m,h;return{c(){m=N("span"),h=V("총근로시간 확인 필요! 😡"),this.h()},l(u){m=H(u,"SPAN",{class:!0});var g=Z(m);h=G(g,"총근로시간 확인 필요! 😡"),g.forEach(I),this.h()},h(){$(m,"class","svelte-a1ghfl")},m(u,g){at(u,m,g),v(m,h)},d(u){u&&I(m)}}}function ht(d){let m,h=d[2].hour()-12+"",u,g,D=d[2].minute().toString().padStart(2,"0")+"",o,w;return{c(){m=N("span"),u=V(h),g=V("시 "),o=V(D),w=V("분 퇴근! 👋"),this.h()},l(_){m=H(_,"SPAN",{class:!0});var y=Z(m);u=G(y,h),g=G(y,"시 "),o=G(y,D),w=G(y,"분 퇴근! 👋"),y.forEach(I),this.h()},h(){$(m,"class","svelte-a1ghfl")},m(_,y){at(_,m,y),v(m,u),v(m,g),v(m,o),v(m,w)},p(_,y){y&4&&h!==(h=_[2].hour()-12+"")&&lt(u,h),y&4&&D!==(D=_[2].minute().toString().padStart(2,"0")+"")&&lt(o,D)},d(_){_&&I(m)}}}function wt(d){let m,h,u,g,D,o,w,_,y,P,l,p,L,j,A,Y,X,x,O,tt,W,C,z=d[2].hour()-12<0,U,M=!d[3]&&Number.isInteger(d[2].hour())&&d[2].hour()-12>0&&Number.isInteger(d[2].minute()),f,K,T=z&&ft(),r=M&&ht(d);return{c(){m=N("meta"),h=N("link"),u=N("link"),g=N("link"),D=J(),o=N("section"),w=N("span"),_=N("label"),y=V("e-HR의 총근로시간 입력"),P=J(),l=N("input"),p=J(),L=N("br"),j=J(),A=N("span"),Y=N("label"),X=V("   e-HR의 출근기록 입력"),x=J(),O=N("input"),tt=J(),W=N("br"),C=J(),T&&T.c(),U=J(),r&&r.c(),this.h()},l(e){const t=gt("svelte-16mnpwj",document.head);m=H(t,"META",{name:!0,content:!0}),h=H(t,"LINK",{rel:!0,href:!0}),u=H(t,"LINK",{rel:!0,href:!0,crossorigin:!0}),g=H(t,"LINK",{href:!0,rel:!0}),t.forEach(I),D=q(e),o=H(e,"SECTION",{class:!0});var i=Z(o);w=H(i,"SPAN",{class:!0});var n=Z(w);_=H(n,"LABEL",{for:!0,class:!0});var a=Z(_);y=G(a,"e-HR의 총근로시간 입력"),a.forEach(I),P=q(n),l=H(n,"INPUT",{id:!0,type:!0,placeholder:!0,class:!0}),n.forEach(I),p=q(i),L=H(i,"BR",{}),j=q(i),A=H(i,"SPAN",{class:!0});var s=Z(A);Y=H(s,"LABEL",{for:!0,class:!0});var c=Z(Y);X=G(c,"   e-HR의 출근기록 입력"),c.forEach(I),x=q(s),O=H(s,"INPUT",{id:!0,type:!0,placeholder:!0,class:!0}),s.forEach(I),tt=q(i),W=H(i,"BR",{}),C=q(i),T&&T.l(i),U=q(i),r&&r.l(i),i.forEach(I),this.h()},h(){document.title="🍳 금요일 퇴근시간 계산기",$(m,"name","description"),$(m,"content","🍦아이스크림에듀 퇴근시간 계산기"),$(h,"rel","preconnect"),$(h,"href","https://fonts.googleapis.com"),$(u,"rel","preconnect"),$(u,"href","https://fonts.gstatic.com"),$(u,"crossorigin",""),$(g,"href","https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap"),$(g,"rel","stylesheet"),$(_,"for","workTime"),$(_,"class","svelte-a1ghfl"),$(l,"id","workTime"),$(l,"type","text"),$(l,"placeholder","00:00"),$(l,"class","svelte-a1ghfl"),$(w,"class","svelte-a1ghfl"),$(Y,"for","arrivalTime"),$(Y,"class","svelte-a1ghfl"),$(O,"id","arrivalTime"),$(O,"type","text"),$(O,"placeholder","00:00"),$(O,"class","svelte-a1ghfl"),$(A,"class","svelte-a1ghfl"),$(o,"class","svelte-a1ghfl")},m(e,t){v(document.head,m),v(document.head,h),v(document.head,u),v(document.head,g),at(e,D,t),at(e,o,t),v(o,w),v(w,_),v(_,y),v(w,P),v(w,l),it(l,d[0]),v(o,p),v(o,L),v(o,j),v(o,A),v(A,Y),v(Y,X),v(A,x),v(A,O),it(O,d[1]),v(o,tt),v(o,W),v(o,C),T&&T.m(o,null),v(o,U),r&&r.m(o,null),f||(K=[st(l,"input",d[6]),st(l,"input",d[4]),st(O,"input",d[7]),st(O,"input",d[5])],f=!0)},p(e,[t]){t&1&&l.value!==e[0]&&it(l,e[0]),t&2&&O.value!==e[1]&&it(O,e[1]),t&4&&(z=e[2].hour()-12<0),z?T||(T=ft(),T.c(),T.m(o,U)):T&&(T.d(1),T=null),t&12&&(M=!e[3]&&Number.isInteger(e[2].hour())&&e[2].hour()-12>0&&Number.isInteger(e[2].minute())),M?r?r.p(e,t):(r=ht(e),r.c(),r.m(o,null)):r&&(r.d(1),r=null)},i:ot,o:ot,d(e){I(m),I(h),I(u),I(g),e&&I(D),e&&I(o),T&&T.d(),r&&r.d(),f=!1,$t(K)}}}function bt(d,m,h){let u="",g="",D,o;function w(l){let p=l.target.value;p=p.replace(/\D/g,""),p.length>0&&(p=p.replace(/(\d{2})(\d{2})/,"$1:$2"),p=p.slice(0,5)),h(0,u=p)}function _(l){let p=l.target.value;p=p.replace(/\D/g,""),p.length>0&&(p=p.replace(/(\d{2})(\d{2})/,"$1:$2"),p=p.slice(0,5)),h(1,g=p)}function y(){u=this.value,h(0,u)}function P(){g=this.value,h(1,g)}return d.$$.update=()=>{if(d.$$.dirty&1&&u.length===5){let l=Math.max(Math.min(parseInt(u.split(":")[0]),49),37),p=Math.min(Number(u.split(":")[1]),59);h(0,u=l.toString().padStart(2,"0")+":"+p.toString().padStart(2,"0"))}if(d.$$.dirty&2&&g.length===5){let l=Math.min(parseInt(g.split(":")[0]),11),p=Math.min(Number(g.split(":")[1]),59);h(1,g=l.toString().padStart(2,"0")+":"+p.toString().padStart(2,"0"))}if(d.$$.dirty&7){let l=parseInt(u.split(":")[0]),p=parseInt(u.split(":")[1]);l<37?h(3,o="workTimeError"):h(3,o="");let L=parseInt(g.split(":")[0]),j=parseInt(g.split(":")[1]),A=St().startOf("week").add(5,"day");h(2,D=A.add(51-l,"hour").subtract(p,"minute").add(L,"hour").add(j,"minute"));let Y=A.add(16,"hour");D<Y&&h(2,D=Y)}},[u,g,D,o,w,_,y,P]}class Ot extends dt{constructor(m){super(),pt(this,m,bt,wt,mt,{})}}export{Ot as component,Tt as universal};
