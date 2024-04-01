
import { Layout } from "./Main";
import { Tab, TabNav0 } from "../components/Tabs";
import { InputEmail, InputFile, InputText } from "../components/Inputs";
import { ButtonSubmit } from "../components/Buttons";
import i18n from "../i18n/langs.js";

export const Actions = (props: any) => {
    return (
        <Tab id="tab-0" active={props.active} title="">
            <a href="#tab-1" class="tab-action">Profile</a> 
            <a href="/logout">Logout</a>
        </Tab>
    );
}

export const Profile = (props: any) => {
    const user = props.user;
    return (
        <Tab id="tab-1" active={props.active} title="Profile">
        <form id="profile" action="/admin/profile" method="post" enctype="multipart/form-data">
            <input type="hidden" id="id" name="id" value={user.id} class="ui-number" />
            <div class="ui-blocks">
                <InputText name="nombre" value={user.nombre} required={true} label="Nombre" tabindex="1" placeholder="User name"/>
                <InputEmail name="email" value={user.email} required={true} label="Email" tabindex="2" placeholder="Type your Email"/>
                <div class="ui-block-break"></div>
                <InputFile name="logo" label="Logo" tabindex="3" multiple={false} accept="image/*" />
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
    return (
        <>
            <Actions active={props.actions}/>
            <Profile active={props.profile} user={props.user}/>
        </>
    );
}

export const AdminActionsTab = (props: any) => { return (<AdminTabs actions="active" user={props.user}/>); }
export const AdminProfileTab = (props: any) => { return (<AdminTabs profile="active" user={props.user}/>); }

export const Admin = (props: any) => {
    return (<Layout user={props.user} menu={props.menu}><AdminActionsTab user={props.user}/></Layout>);
}
