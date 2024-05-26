import i18n from"../../i18n/langs.js";function Uxxiec(){const e=this;let i;this.getData=()=>i,this.get=t=>i[t],this.setData=t=>(i=t,e),this.set=(t,s)=>(i[t]=s,e),this.row=t=>`<tr class="tb-data">
            <td>${t.num}</td>
            <td>${t.uxxi}</td>
            <td class="text-right">${i18n.isoFloat(t.imp)||"-"} €</td>
            <td class="text-center">${i18n.isoDate(t.fUxxi)}</td>
            <td>${t.desc}</td>
            <td class="text-center">
                <a href="#remove" class="row-action"><i class="fas fa-times action text-red"></i></a>
            </td>
        </tr>`,this.tfoot=t=>`<tr><td colspan="99">Operaciones: ${t.size}</td></tr>`,this.autocomplete=t=>t.num+" - "+t.uxxi+"<br>"+t.desc}export default new Uxxiec;