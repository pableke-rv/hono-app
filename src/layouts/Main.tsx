
import { Alerts, Loading, BackToTop } from "../components/Alerts";
import { User, Langs } from "../components/Dropdowns";
import { ButtonTheme } from "../components/Buttons";
import Menu from "../components/Menu";
import i18n from "../i18n/langs.js";

export const Head = (props: any) => {
    return (
        <head>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <title>{props.title}</title>
            <link rel="icon" type="image/png" href="/public/img/png/star-yellow.png"></link>
            <link rel="stylesheet" type="text/css" media="screen" href="/public/css/styles-min.css"/>
            <script src="https://kit.fontawesome.com/76f12cea70.js" crossorigin="anonymous"></script>
            <script type="module" src="/public/js/tests.js"></script>
        </head>
    );
}

export const NavPhone = (props: any) => {
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

export const Footer = () => {
    return (<footer>Page Footer</footer>);
}

export const Layout = (props: any) => {
    const lang:any = i18n.getLang();
    return (
        <html lang={lang.lang}>
            <Head title={lang.title}/>
            <body>
                <header></header>

                <Alerts/>
                <Loading/>
                <BackToTop/>

                <NavPhone/>
                <nav class="menu-main">
                    <div><Menu>{props.menu}</Menu></div>
                    <div class="separator"></div>
                    <div class="menu-group">
                        <User user={props.user}/>
                        <Langs/>
                        <ButtonTheme/>
                    </div>
                </nav>

                <main>{props.children}</main>
                <Footer/>
            </body>
        </html>
    );
}
