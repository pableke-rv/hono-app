
export default {
    lang: "es", // Spanish

    //PRESTO
    descTipos: [
        "Transferencia de Crédito", "Fondo de Cobertura GENCOM", "Liquidación de Contrato de Art. 83 LOU", "Generación de Crédito FA", 
        "Anticipos sobre Recaudación A83, TTPP y Cátedras", "Fondo de Cobertura", "Generación de Crédito GENCOM", "Ampliación FC"
    ],
    //PRESTO

    //IRIS
    titPerfil01: "Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio",
    titPerfil06: "Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal",
    titPerfilErr: "Perfil no encontrado",

    lblTransporte: "Por transporte interurbano (avión, tren...)",

    errItinerario: "Error al cumplimentar los datos del itinerario.",
    errItinerarioPaises: "Los paises de origen y de destino de las etapas no son consecutivos.",
    errItinerarioFechas: "Las fechas de salida y de llegada de las etapas no son consecutivas.",
    errMulticomision: "No puede solicitar multicomisiones para esta comunicación.",
    errTransporte: "Medio de Transporte incorrecto.",
    errMatricula: "Debe indicar la matricual del vehiculo privado.",

    docObligatoria: "Otra documentación acreditativa (Art. 61 NEP)",
    docMovilidad: "Documentación acreditativa del programa de movilidad",
    docOpcional: "Otra documentación (opcional)",

    // IRIS Collections
    despMun: [ "Vehículo Propio", "Transportes Públicos" ],
    despMaps: [ "Vehículo Propio", "Avión", "Tren", "Vehículo Alquiler", "Vehículo Ajeno", "Taxi Interurbano", "Bús Interurbano", "Barco", "Otros" ],
    gastosTiketIsu: [ "Peaje", "Aparcamiento", "Metro", "Taxi", "Autobús Urbano", "Tranvía", "Otros" ],
    gastosTiket: [ "Tickets de transporte (peaje, aparcamiento, etc.)" ],
    //IRIS

    //inputs errors messages
    errForm: "Error al validar los campos del formulario",
    errRequired: "¡Campo obligatorio!",
    errMinlength8: "La longitud mínima requerida es de 8 caracteres",
    errMaxlength: "Longitud máxima excedida",
    errNif: "Formato de NIF / CIF incorrecto",
    errCorreo: "Formato de E-Mail incorrecto",
    errDate: "Formato de fecha incorrecto",
    errDateLe: "La fecha debe ser menor o igual a la actual",
    errDateGe: "La fecha debe ser mayor o igual a la actual",
    errDateGt: "La fecha debe ser mayor a la actual",
    errNumber: "Valor no numérico",
    errGt0: "El importe debe ser mayor de 0,00 &euro;", 
    errExceeded: "Importe excedido", 
    errFormat: "¡Formato incorrecto!",
    errReclave: "Las claves introducidas no coinciden",
    errRange: "Valor fuera del rango permitido",
    notAllowed: "Valor no permitido",
    notValid: "Valor Incorrecto",

    //confirm cuestions
    saveOk: "Datos actualizados correctamente",
    remove: "¿Confirma que desea eliminar este registro?",
    removeAll: "¿Confirma que desea eliminar todos los elementos?",
    removeOk: "Registro eliminado correctamente.",
    cancel: "¿Confirma que desea cancelar este registro?",
    cancelOk: "Elemento cancelado correctamente.",
    unlink: "¿Confirma que desea desasociar estos registros?",
    unlinkOk: "Registros desasociados correctamente",
    linkOk: "Registros asociados correctamente.",
    notFound: "Elemento no encontrado en el sistema",
    noResults: "No se han encontrado registros asociados",
    selectOption: "Seleccione un opción",

    msgSend: "¿Confirma que desea firmar y enviar esta solicitud?",
    msgFirmar: "¿Confirma que desea firmar esta solicitud?",
    msgRechazar: "¿Confirma que desea rechazar esta solicitud?",
    msgIntegrar: "¿Confirma que desea integrar esta solicitud en UXXI-EC?",
    msgRemove: "¿Confirma que desea eliminar esta solicitud?",

    //Collections
    msgBool: ["No", "Si"],
    descEstados: [
        "Editable", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
    ],

    //Datepicker language
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
}
