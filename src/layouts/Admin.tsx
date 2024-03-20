
import { Layout } from "./Main";
import i18n from "../i18n/langs.js";

export const AdminTabs = (props: any) => {
    // TODO: all admin tabs
    return ( <div></div>);
}

export const Admin = (props: any) => {
    return (
        <Layout user={props.user} menus={props.menus}>
            logout
        </Layout>
    );
}
