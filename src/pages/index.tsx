
import Layout from "../layouts/Main";
import { Tab0, Tab1 } from "../layouts/Index";

export default (props: any) => {
    return (
        <Layout i18n={props.i18n}>
            <Tab0/>
            <Tab1/>
        </Layout>
    );
}
