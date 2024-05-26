const EMPTY="",ESCAPE_HTML=/"|'|&|<|>|\\/g,ESCAPE_MAP={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"},TR1="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ",TR2="aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY",fnSize=t=>t?t.length:0,fnLower=t=>tr(t).toLowerCase(),fnWord=t=>t.replace(/\W+/g,EMPTY),isstr=t=>"string"==typeof t||t instanceof String,insertAt=(t,s,i)=>t.substring(0,i)+s+t.substring(i),replaceAt=(t,s,i)=>t.substring(0,i)+s+t.substring(i+s.length);function tr(s){var i=fnSize(s),r=s||EMPTY;for(let t=0;t<i;t++)var e=TR1.indexOf(s.charAt(t)),r=e<0?r:replaceAt(r,TR2.charAt(e),t);return r}function StringBox(){const n=this;this.isstr=isstr,this.size=fnSize,this.insertAt=insertAt,this.replaceAt=replaceAt,this.empty=t=>fnSize(t)<1,this.unescape=t=>t?t.replace(/&#(\d+);/g,(t,s)=>String.fromCharCode(s)):null,this.escape=t=>t?t.trim().replace(ESCAPE_HTML,t=>ESCAPE_MAP[t]):null,this.substr=(t,s,i)=>t&&t.substr(s,i),this.substring=(t,s,i)=>t&&t.substring(s,i),this.iIndexOf=(t,s)=>fnLower(t).indexOf(fnLower(s)),this.ilike=(t,s)=>-1<n.iIndexOf(t,s),this.eq=(t,s)=>fnLower(t)==fnLower(s),this.lower=t=>t&&t.toLowerCase(t),this.upper=t=>t&&t.toUpperCase(t),this.starts=(t,s)=>t&&t.startsWith(s),this.ends=(t,s)=>t&&t.endsWith(s),this.prefix=(t,s)=>n.starts(t,s)?t:s+t,this.suffix=(t,s)=>n.ends(t,s)?t:t+s,this.trunc=(t,s)=>fnSize(t)>s?t.substr(0,s).trim()+"...":t,this.clean=t=>t&&t.replace(/\s+/g,EMPTY),this.minify=t=>t&&t.trim().replace(/\s+/g," "),this.trim=t=>t&&t.trim(),this.ltrim=(t,s)=>t&&t.replace(new RegExp("^"+s+"+"),EMPTY),this.rtrim=(t,s)=>t&&t.replace(new RegExp(s+"+$"),EMPTY),this.wrap=(t,s,i,r)=>{i=i||"<u><b>";var e=n.iIndexOf(t,s);return e<0?t:insertAt(insertAt(t,i,e),r||"</b></u>",e+s.length+i.length)},this.rand=t=>Math.random().toString(36).substring(2,2+(t||8)),this.randFloat=(t,s)=>Math.random()*((s||1e9)-t)+t,this.randInt=(t,s)=>Math.floor(n.randFloat(t||0,s)),this.randString=(s,i)=>{i=i||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";let r="";for(let t=0;t<s;t++)r+=i.charAt(Math.floor(Math.random()*i.length));return r},this.toDate=t=>t?new Date(t):null,this.inYear=(t,s)=>t.startsWith(n.substring(s,0,4)),this.inMonth=(t,s)=>t.startsWith(n.substring(s,0,7)),this.inDay=(t,s)=>t.startsWith(n.substring(s,0,10)),this.inHour=(t,s)=>t.startsWith(n.substring(s,0,13)),this.diffDate=(t,s)=>Date.parse(t)-Date.parse(s),this.isoDate=t=>t&&t.substring(0,10),this.isoTime=t=>t&&t.substring(11,19),this.isoTimeShort=t=>t&&t.substring(11,16),this.getHours=t=>t&&+t.substring(11,13),this.test=(t,s)=>s.test(t)?t:null,this.split=(t,s)=>t?t.split(s||","):[],this.match=(t,s)=>t?t.trim().match(s):null,this.lastId=t=>+n.match(t,/\d+$/).pop(),this.chunk=(t,s)=>t?t.trim().match(t,new RegExp(".{1,"+s+"}","g")):null,this.getCode=(t,s)=>t&&t.substring(0,t.indexOf(s||" ")),this.toCode=t=>t&&fnWord(t).toUpperCase(),this.toWord=t=>t&&fnWord(t),this.lines=t=>n.split(t,/[\n\r]+/),this.words=t=>n.split(t,/\s+/)}globalThis.isstr=isstr;export default new StringBox;