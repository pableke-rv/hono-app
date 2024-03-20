
import { Layout } from "./Main";
import { Tab } from "../components/Tabs";
import { Notice } from "../components/Alerts";
import i18n from "../i18n/langs.js";

export const IndexTab0 = (props: any) => {
    const lang = i18n.getLang();
    const maps = `/${lang.lang}/maps.html`;
    const tables = `/${lang.lang}/tables.html`;
    return (
        <Tab id="tab-0" active="active" title="Hello Hono!">
            <Notice type="info" icon="fas fa-bullhorn"><b>Info:</b> <span>Area de pruebas</span></Notice>
            <Notice type="note" icon="fas fa-bell"><b>Note:</b> <span>Area de pruebas</span></Notice>
            <Notice type="ok" icon="fas fa-check-circle"><b>OK:</b> <span>Area de pruebas</span></Notice>
            <Notice type="green" icon="fas fa-thumbs-up"><b>Green:</b> <span>Area de pruebas</span></Notice>
            <Notice type="success" icon="fas fa-calendar-check"><b>Saccessfully:</b> <span>Area de pruebas</span></Notice>
            <Notice type="warn" icon="fas fa-exclamation-triangle">
                <b>Warn:</b> <span>Area de pruebas</span>
                <p><b>Extra info:</b> añkjfdsaldñlka fjasñlkadjf asñlk adñlkajf asñlkdsfdjk aslsñlkadfkjk asñsdñlkafjlk asñldkfdjk aksldjf alskfdj asñlkdsfdjk aslsñlkadfkjk asñsdñlkafjlk asñldkfdjk aksldjf alskfdj</p>
            </Notice>
            <Notice type="error" icon="fas fa-exclamation-circle"><b>Error:</b> <span>Area de pruebas</span></Notice>
            <Notice type="danger" icon="fas fa-radiation-alt"><b>Danger:</b> <span>Area de pruebas</span></Notice>
            <Notice type="dark" icon="fas fa-skull-crossbones"><b>Dark:</b> <span>Area de pruebas</span></Notice>
            <Notice type="info">
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. A, dolorum, veritatis tenetur ea dolor quo consequuntur ullam molestias fugit quam. </span>
                <a href="#toggle" class="link tab-action" data-toggle="fa-angle-double-down fa-angle-double-up" data-target=".info-test">
                    Más Info <i class="fas fa-angle-double-down"></i>
                </a>
                <div class="info-test hide"><hr/>Lorem ipsum dolor, sit amet consectetur adipisicing, elit. Corrupti rem aut, minus asperiores, sunt eligendi hic ipsum maiores itaque numquam sequi eius voluptates consequuntur debitis impedit quae dolore ad, enim?</div>
            </Notice>

            <div class="navbar">
                <a href="#next-tab" class="btn btn-primary tab-action">Sig. <i class="fas fa-angle-double-right"></i></a>
                <a href="/login" class="btn btn-primary load-main">Login <i class="fas fa-angle-double-right"></i></a>
                <a href={maps} class="btn btn-green">Go maps <i class="fas fa-share"></i></a>
                <a href="/maps" class="btn btn-green load-main">Go maps by AJAX <i class="fas fa-undo-alt"></i></a>
                <a href={tables} class="btn btn-green">Tables <i class="fas fa-table"></i></a>
                <button class="btn btn-green">Button</button>
            </div>
        </Tab>
    );
}

export const IndexTab1 = (props: any) => {
    return (
        <Tab id="tab-1" title="Actions">
            <form id="form-pokemon" action="#">
            <div class="ui-blocks">
                <label class="ui-block-xl autocomplete">
                    <div class="label required">Pokemon finder:</div>
                    <i class="fas fa-search ui-icon-left"></i>
                    <input type="search" id="pokemon" name="pokemon" class="ui-input ui-autocomplete"
                        tabindex="1" autocomplete="off" placeholder="Search a pokemon" />
                    <input type="hidden" name="id"/>
                    <ul class="results"></ul>
                    <div class="ui-errtip"></div>
                </label>
            </div>
            </form>

            <div id="info-pokemon" class="hide ui-blocks" style="align-items: end;"></div>

            <div class="navbar">
                <a href="#" class="action text-green resize">Green</a>
                <a href="#" class="action text-blue resize">Blue</a>
                <a href="#" class="action text-warn resize">Warn</a>
                <a href="#" class="action text-red text-xl resize"><i class="fas fa-times"></i></a>
            </div>

            <div class="navbar">
                <a href="#tab-0" class="btn btn-primary tab-action"><i class="fas fa-angle-double-left"></i></a>
            </div>
        </Tab>
    );
}

export const IndexTabs = (props: any) => {
    return (
        <>
            <IndexTab0/>
            <IndexTab1/>
        </>
    );
}


export const Index = (props: any) => {
    return (
        <Layout>
            <IndexTabs/>
        </Layout>
    );
}
