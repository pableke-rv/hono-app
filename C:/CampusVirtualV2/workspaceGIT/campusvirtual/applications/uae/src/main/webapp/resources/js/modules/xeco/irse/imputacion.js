import perfil from"./perfil.js";function IrseImputacion(){const o={1:"230",2:"230",3:"231"},f={1:"30",2:"31",3:"32"},p={1:"30",2:"32",3:"31"},s={1:"33",2:"35",3:"34"},n={1:"36",2:"38",3:"37"},a={"PDI-FU":"00","PDI-LA":"01",PAS:"02",PIN:"03",BPE:"04",ALU:"05",EXT:"06"};this.get=function(i,r){if(4==i)return perfil.isIsu()?perfil.isColaboracion()?"642.29":perfil.isTribunal()||perfil.isFormacion()?"642.39.06":"-":perfil.isInve3005(r)?perfil.isColaboracion()?"64X.29":perfil.isTribunal()||perfil.isFormacion()?"64X.39.06":"-":perfil.isColaboracion()?"227.15":perfil.isTribunal()?"233.00.06":perfil.isFormacion()?"233.01":"233.02";let e=dom.getValue("#finalidad")||"1";e=(e=(1==i?p:2==i?s:n)[e])||"XX";var l=a[perfil.getColectivo()]||"XX";return perfil.isIsu()?"642."+e+"."+l:perfil.isInve3005(r)?(perfil.is643()?"643.":"64X.")+f[i]+"."+l:(r=o[i]+".xx."+l,1==i?r.replace("xx",perfil.isMes()?"02":"00"):r.replace("xx",2==i?"01":"00"))}}export default new IrseImputacion;