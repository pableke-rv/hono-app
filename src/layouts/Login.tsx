
import { Layout } from "./Main";
import { Tab } from "../components/Tabs";
import { InputText, InputPass } from "../components/Inputs";
import { ButtonSubmit } from "../components/Buttons";
import i18n from "../i18n/langs.js";

export const Contact = (props: any) => {
    // TODO tab to contact mail
    return (
        <div></div>
    );
}

export const Remember = (props: any) => {
    // TODO tab to remember pass
    return (
        <Tab id="tab-1" active={props.active} title="Remember Form">
        <form id="remember" action="/remember" method="post">
        </form>
        </Tab>
    );
}

export const LoginForm = (props: any) => {
    return (
        <Tab id="tab-0" active={props.active} title="Login Form">
        <form id="signin" action="/signin" method="post">
            <div class="ui-blocks">
                <InputText name="login" required={true} label={i18n.get("lblLogin")} icon="fas fa-user ui-icon-right" tabindex="1" placeholder="DNI, NIF or Email"/>
                <div class="ui-block-break"></div>
                <InputPass name="pass" label={i18n.get("lblPass")} tabindex="2" />
            </div>
            <div class="navbar">
                <ButtonSubmit>Entrar</ButtonSubmit>
            </div>
        </form>
        </Tab>
    );
}

export const LoginTabs = (props: any) => {
    return (
        <>
            <LoginForm active={props.login} />
            <Remember active={props.remember} />
        </>
    );
}

export const LoginActiveTab = (props: any) => { return (<LoginTabs login="active"/>); }
export const RememberActiveTab = (props: any) => { return (<LoginTabs remember="active"/>); }

export const Login = (props: any) => {
    return (<Layout><LoginActiveTab/></Layout>);
}
