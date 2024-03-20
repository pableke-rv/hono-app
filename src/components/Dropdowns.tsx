
export const UserPublic = (props: any) => {
    return (
        <div id="user" class="dropdown">
            <button><i class="fas fa-user"></i></button>
            <div>
                <a href="mailto:#">email@google.com</a>
                <a href="/">Home</a>
                <hr class="slim"/>
                <a href="/login">Login</a>
            </div>
        </div>
    );
}
export const UserLogged = (props: any) => {
    const { logo, email } = props.user;
    const mailto = "mailto:" + email;
    return (
        <div id="user" class="dropdown">
            <button><i class="fas fa-user"></i></button>
            <div>
                <a href={mailto}>{email}</a>
                <a href="/">Home</a>
                <hr class="slim"/>
                <a href="/logout">Logout</a>
            </div>
        </div>
    );
}
export const User = (props: any) => {
    const user = props.user ? <UserLogged user={props.user}/> : <UserPublic/>;
    return (user);
}

export const Langs = (props: any) => {
    return (
        <div id="languages" class="dropdown">
            <button>
                <img src="/public/img/flags/spain.png"/>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div>
                <a id="es" href="/es"><img src="/public/img/flags/spain.png"/> ES</a>
                <a id="en" href="/en"><img src="/public/img/flags/great_britain.png"/> EN</a>
            </div>
        </div>
    );
}
