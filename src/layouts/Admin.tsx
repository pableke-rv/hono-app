
import { Layout } from "./Main";
import { Tab, TabNav0 } from "../components/Tabs";
import { ButtonSubmit } from "../components/Buttons";
import i18n from "../i18n/langs.js";

export const Actions = (props: any) => {
    return (
        <Tab id="tab-0" active="active">
            <a href="#tab-1" class="tab-action">Profile</a> 
            <a href="/logout">Logout</a>
        </Tab>
    );
}

export const Profile = (props: any) => {
    const user = props.user;
    return (
        <Tab id="tab-1" title="Profile">
        <form id="profile" action="/profile" method="post">
            <input type="hidden" id="id" name="id" class="ui-number" />
            <div class="ui-blocks">
                <label class="ui-block-xl">
                    <div class="label required">Nombre:</div>
                    <input type="text" id="nombre" name="nombre" value={user.nombre} class="ui-input" tabindex="1" placeholder="User name" />
                    <div class="ui-errtip"></div>
                </label>
                <div class="ui-block-break"></div>
                <label class="ui-block-xl">
                    <div class="label required">Logo:</div>
                    <input type="file" id="logo" name="logo" class="ui-file" tabindex="2" accept="image/*" />
                    <div class="ui-errtip"></div>
                </label>
            </div>
            <div class="navbar">
                <TabNav0/>
                <ButtonSubmit>Guardar</ButtonSubmit>
            </div>
        </form>
        </Tab>
    );
}

export const AdminTabs = (props: any) => {
    return ( <div></div> );
}

export const Admin = (props: any) => {
    return (
        <Layout user={props.user} menus={props.menus}>
            <Actions/>
            <Profile user={props.user}/>
        </Layout>
    );
}
