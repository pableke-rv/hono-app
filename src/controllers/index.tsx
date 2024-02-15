// @ts-nocheck 

import { Context } from "hono";

import Layout from "../layouts/Test.tsx";
import Messages from "../components/Messages.tsx";
import { Alerts, Loading, BackToTop } from "../components/Alerts.tsx";

export const index = (ctx: Context) => {
    const messages = ["Good Morning", "Good Evening", "Good Night"];
    return ctx.html(
        <Layout>
            <header></header>
            <Alerts/>
            <Loading/>
            <BackToTop/>
            <main>
                <h1>Hello Hono!</h1>
                <Messages messages={messages} />
            </main>
            <footer>Page Footer</footer>
        </Layout>
    );
}
