
export const User = (props: any) => {
    return (
        <div id="user" class="dropdown">
            <button><i class="fas fa-user"></i></button>
            <div>
                <a href="mailto:#">email@google.com</a>
                <a href="/">Home</a>
                <hr class="slim"/>
                <a href="#">Login</a>
            </div>
        </div>
    );
}

export const Langs = (props: any) => {
    return (
        <div id="languages" class="dropdown">
            <button>
                <img src="public/img/flags/spain.png"/>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div>
                <a href="?lang=es"><img src="public/img/flags/spain.png"/> ES</a>
                <a href="?lang=en"><img src="public/img/flags/great_britain.png"/> EN</a>
            </div>
        </div>
    );
}
