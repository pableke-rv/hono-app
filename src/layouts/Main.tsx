
import { raw } from "hono/html";
import Menu from "../components/Menu";
import { Alerts, Loading, BackToTop } from "../components/Alerts";
import { User, Langs } from "../components/Dropdowns";

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
            <button id="menu-toggle">
                <i class="fas fa-arrow-left hide"></i>
                <i class="fas fa-bars"></i>
            </button>
            <button>Phone-Menu 2</button>
            <button>Phone-Menu 3</button>
        </nav>
    );
}

export default (props: any) => {
    return (
        <html lang={props.i18n.lang}>
            <Head title={props.i18n.title}/>
            <body>
                <header></header>
                <NavPhone/>
                <nav class="menu-main">
                    <div><Menu>{raw(props.i18n.menu)}</Menu></div>
                    <div class="separator"></div>
                    <div class="menu-group">
                        <User/>
                        <Langs/>
                        <button id="theme-toggle">
                            <i class="fas fa-moon hide"></i>
                            <i class="fas fa-sun hide"></i>
                        </button>
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
