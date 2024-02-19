
import Menu from "../components/Menu";
import { Alerts, Loading, BackToTop } from "../components/Alerts";
import { User, Langs } from "../components/Dropdowns";
import { ButtonToggle } from "../components/Butons";

const Head = (props: any) => {
    return (
        <head>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <title>{props.title}</title>
            <link rel="stylesheet" type="text/css" media="screen" href="public/css/styles-min.css"/>
            <script src="https://kit.fontawesome.com/76f12cea70.js" crossorigin="anonymous"></script>
            <script type="module" src="public/js/tests.js"></script>
        </head>
    );
}

const NavPhone = (props: any) => {
    return (
        <nav class="show-xs">
            <ButtonToggle id="menu-toggle" icon1="fas fa-arrow-left hide" icon2="fas fa-bars" />
            <button>Phone-Menu 2</button>
            <button>Phone-Menu 3</button>
        </nav>
    );
}

export default (props: any) => {
    return (
        <html lang={props.lang}>
            <Head title={props.title}/>
            <body>
                <header></header>
                <NavPhone/>
                <nav class="menu-main">
                    <div><Menu/></div>
                    <div class="separator"></div>
                    <div class="menu-group">
                        <User/>
                        <Langs/>
                        <ButtonToggle id="theme-toggle" icon1="fas fa-moon hide" icon2="fas fa-sun hide" />
                    </div>
                </nav>

                <Alerts/>
                <Loading/>
                <BackToTop/>

                <main>{props.children}</main>
                <footer>Page Footer</footer>
            </body>
        </html>
    );
}
