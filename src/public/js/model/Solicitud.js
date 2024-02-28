
import i18n from "../i18n/langs.js";

function Firma(solicitud) {
	const self = this; //self instance

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = firma => { data = firma; return self; }

    this.isPrincipal = mask => (mask & 2);
    this.isAceptada = mask => (mask & 32);
	this.isRechazada = (mask, info) => (!self.isAceptada(mask) && info);
	this.isFirmable = mask => (mask & 64); //puesto a la firma?

    this.myFlag = (mask, info) => {
        if (self.isAceptada(mask))
            return '<i class="fas fa-flag fa-lg icon icon-green" title="Solicitud firmada"></i>';
        if (self.isRechazada(mask, info))
            return '<i class="fas fa-flag fa-lg icon icon-green" title="Solicitud firmada"></i>';
        return '<i class="fas fa-flag fa-lg icon icon-warn" title="Solicitud pendiente de firma"></i>'
    }
}

function Firmas(solicitud) {
	const self = this; //self instance
    const firma = new Firma(solicitud);

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = firmas => { data = firmas; return self; }
    this.getFirma = () => firma;

    this.getPrincipales = () => data.filter(f => firma.isFirmable(f.mask));
}

function Solicitud() {
	const self = this; //self instance
    const firmas = new Firmas(self);
    const firma = firmas.getFirma();
    const CSS_ESTADOS = [
        //"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
        "text-warn", "text-green", "text-error", "text-green", "text-green", "text-warn", "text-warn", "text-error", "text-error", "text-error", "text-error"
    ];

    let _data; // Current instance
    let nif, grupo; // User params

    this.getData = () => _data;
    this.get = name => _data[name];
    this.setData = values => { _data = values; return self; }
    this.set = (name, value) => { _data[name] = value; return self; }

    this.getNif = () => nif;
    this.setNif = val => { nif = val; return self; }
    this.isAdmin = () => ("23024374V" == nif);

    this.isUsuEc = () => !!grupo;
    this.isUxxiec = self.isUsuEc;
    this.setGrupo = val => { grupo = val; return self; }
    this.setUser = data => self.setNif(data.nif).setGrupo(data.grupo);

    this.getFirmas = () => firmas;
    this.getFirma = () => firma;

    this.getTipo = () => _data.tipo;
    this.getSubtipo = () => _data.subtipo;
    this.getEstado = () => _data.estado;

    this.isPendiente = () => (_data.estado == 5);
    this.isAceptada = () => (_data.estado == 1);
    this.isRechazada = () => (_data.estado == 2); // Rechazada no llega a estado finalizada
    this.isFinalizada = () => [1, 3, 4, 9, 10].includes(_data.estado); // Aceptada, Ejecutada, Notificada ó Erronea

    this.isUae = () => (grupo == "2"); // UAE
    this.isOtri = () => ((grupo == "8") || (grupo == "286") || (grupo == "134") || (grupo == "284")); // OTRI / UITT / UCCT / Catedras
    //this.isUtec = () => (grupo == "6");
    //this.isGaca = () => (grupo == "54");
    //this.isEut = () => (grupo == "253");
    //this.isEstudiantes = () => (grupo == "9");
    //this.isContratacion = () => (grupo == "68");

    this.isDisabled = () => _data.id;
    this.isEditable = () => !_data.id;
    this.isFirmable = () => (self.isPendiente() && firma.isFirmable(_data.fmask));
    this.isRechazable = () => (_data.id && (self.isUae() || self.isFirmable()));
	this.isEditableUae = () => (self.isEditable() || (self.isUae() && self.isFirmable()));
    this.isEjecutable = () => (self.isUae() && self.isFinalizada()); // Requiere uae + estado finalizada (mejora grupo == -1)
    this.isIntegrable = () => (self.isUae() && self.isFinalizada()); // Requiere uae + estado finalizada (mejora grupo == -1)
	this.isUrgente = () => (_data.fMax && _data.extra); //solicitud urgente?

    this.getStyleByEstado = () => CSS_ESTADOS[_data.estado] || "text-warn";

    this.validate = data => {
        return true;
    }
    this.validateReject = data => {
        return i18n.reset().size("rechazo", data.rechazo) || i18n.reject("Debe indicar un motivo para el rechazo de la solicitud."); // Required string
    }
}

export default new Solicitud();
