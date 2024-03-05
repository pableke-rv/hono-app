
export default class Menus {
    constructor(db) {
        this.db = db;
    }

    filter(data) {
        const sql = "select * from v_menu_padre where (? is null or tipo = ?) and (? is null or nombre like ?)";
        return this.db.list(sql, [data.tipo, data.tipo, data.nombre, data.nombre + "%"]);
    }
    filterByParams(tipo, term) {
        const sql = "select * from v_menu_padre where (tipo = ?) and (UPPER(nombre) like ?)";
        return this.db.list(sql, [ tipo, "%" + term.toUpperCase() + "%" ]);
    }

    getById(id) {
        return this.db.find("select * from v_menu_padre where id = ?", id);
    }
 
    getActions(user) { return this.db.list("select * from v_actions where usuario_id = ?", user); }
    getMenus(user) { return this.db.list("select * from v_menus where usuario_id is null or usuario_id = ?", user) };

    insert(data) {
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask];
        return this.db.insert(sql, params);
    }
    insertAll(data) {
        const params = []; // values container
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values ";
        const values = data.map(row => {
            params.push(row.tipo, row.padre, row.icono, row.nombre, row.titulo, row.enlace, row.orden, row.mask);
            return "(?, ?, ?, ?, ?, ?, ?, ?)";
        }).join(",");
        return this.db.insert(sql + values, params);
    }
    update(data) {
        const sql = "update menus set tipo = ?, padre = ?, icono = ?, nombre = ?, titulo = ?, enlace = ?, orden = ?, mask = ? where id = ?";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask, data.id];
        return this.db.update(sql, params);
    }
    save(data) {
        return data.id ? this.update(data) : this.insert(data);
    }
    delete(id) {
        return this.db.delete("delete from menus where id = ?", id);
    }
}
