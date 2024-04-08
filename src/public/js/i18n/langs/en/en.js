
export default {
    lang: "en", // English

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
    errForm: "Form validation failed",
    errRequired: "Required field!",
    errMinlength8: "The minimum required length is 8 characters",
    errMaxlength: "Max length exceded",
    errNif: "Wrong ID format",
    errCorreo: "Wrong Mail format",
    errDate: "Wrong date format",
    errDateLe: "Date must be less or equals than current",
    errDateGe: "Date must be greater or equals than current",
    errDateGt: "Date must be greater than current",
    errNumber: "Wrong number format",
    errGt0: "Price must be great than 0.00 &euro;", 
    errExceeded: "exceeded amount!", 
    errFormat: "Wrong format!",
    errReclave: "Passwords typed do not match",
    errRange: "Value out of allowed range",
    notAllowed: "Value not allowed",
    notValid: "Invalid value!",

    //confirm cuestions
    saveOk: "Element saved successfully!",
    remove: "Are you sure to delete this element?",
    removeAll: "Are you sure to delete all elements?",
    removeOk: "Element removed successfully!",
    cancel: "Are you sure to cancel element?",
    cancelOk: "Element canceled successfully!",
    unlink: "Are you sure to unlink those elements?",
    unlinkOk: "Elements unlinked successfully!",
    linkOk: "Elements linked successfully!",
    notFound: "Element not found!",
    noResults: "No results founds",
    selectOption: "Select an option",

    msgSend: "¿Confirma que desea firmar y enviar esta solicitud?",
    msgFirmar: "¿Confirma que desea firmar esta solicitud?",
    msgRechazar: "¿Confirma que desea rechazar esta solicitud?",
    msgIntegrar: "¿Confirma que desea integrar esta solicitud en UXXI-EC?",
    msgRemove: "¿Confirma que desea eliminar esta solicitud?",

    //Collections
    msgBool: ["No", "Yes"],
    descEstados: [
        "Editable", "Accepted", "Reject", "Executed", "Integrated", "In Process", "Editable", "Cancel", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
    ],

    //Datepicker language
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
}
