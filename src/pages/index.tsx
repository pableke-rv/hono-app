
import Layout from "../layouts/Main";
import { Tab0, Tab1 } from "../layouts/Index";

export default (props: any) => {
    return (
        <Layout {...props}>
            <Tab0/>
            <Tab1/>
        </Layout>
    );
}
