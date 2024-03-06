
import bcrypt from "bcrypt";

const fnError = err => (err.errno == 19) ? "Users previously registered in the system" : err; //UK violated

export default function(db) {
    this.all = () => db.list("select * from usuarios order by nif desc limit 10", []);
    this.filter = data => {
        const sql = "select * from usuarios where (? is null or nif like ?) and (? is null or email like ?)";
        //const sql2 = "select * from usuarios where nif like :nif and email like :email"; //no named parameters
        return db.list(sql, [data.nif, data.nif + "%", data.email, data.email + "%"]);
    }

    this.getById =id => db.find("select * from usuarios where id = ?", id);
    this.getByLogin = login => {
        const sql = "select * from usuarios where nif = ? or email = ?";
        return db.find(sql, [login.toUpperCase(), login.toLowerCase()]);
    }
    this.login = (login, pass) => {
        pass = pass || "__none#pass__"; // not empty avoid exception
        const fnMatch = user => user ? Promise.resolve(user) : Promise.reject("Password not match!");
        const fnCompare = (pass, user) => bcrypt.compare(pass, user.clave).then(result => fnMatch(result && user));
        return this.getByLogin(login).then(user => user ? fnCompare(pass, user) : Promise.reject("Login not found!"));
    }

    this.insert = data => {
        const sql = "insert into usuarios (nif, nombre, apellido1, apellido2, email, clave) values (?, ?, ?, ?, ?, ?)";
        const params = [data.nif.toUpperCase(), data.nombre, data.apellido1, data.apellido2, data.email.toLowerCase(), bcrypt.hashSync(data.clave, 10)];
        return db.insert(sql, params).then(lastID => { data.id = lastID; return data; });
    }
    this.update = data => {
        const sql = "update usuarios set nif = ?, nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, activado = ? where id = ?";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email, data.activado, data.id];
        return db.update(sql, params).catch(fnError);
    }
    this.activate = user => { //ej: select datetime('2023-06-07T12:00:25.0Z') -> select strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        const sql = "update usuarios set activado = datetime('now') where id = ?";
        return db.update(sql, user).catch(fnError);
    }
    this.updatePassword = (user, pass) => {
        const sql = "update usuarios set clave = ? where id = ?";
        const params = [bcrypt.hashSync(pass, 10), user]; // user = id
        return db.update(sql, params).catch(fnError);
    }
    this.save = data => data.id ? this.update(data) : this.insert(data);
    this.delete = id => db.delete("delete from usuarios where id = ?", id);
}
