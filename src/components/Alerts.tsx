
export const Alert = (props: any) => {
    return (
        <div class="hide alert alert-{props.type}">
            <div class="alert-icon"><i class={props.icon}></i></div>
            <div class="alert-text">{props.text}</div>
            <div class="alert-close"><i class="fas fa-times"></i></div>
        </div>
    );
}

export const Alerts = (props: any) => {
    return (
        <div class="alerts">
            <Alert type="success" icon="fas fa-check-circle fa-3x" text={props.ok}/>
            <Alert type="info" icon="fas fa-info fa-3x" text={props.info}/>
            <Alert type="warn" icon="fas fa-exclamation-triangle fa-3x" text={props.warn}/>
            <Alert type="error" icon="fas fa-exclamation fa-2x" text={props.error}/>
        </div>
    );
}

export const Loading = () => {
    return (
        <div class="loading hide">
            <b class="fas fa-circle-notch fa-3x fa-spin loading-content"></b>
        </div>
    );
}

export const BackToTop = () => {
    return (
        <a id="back-to-top" href="#top" class="hide back-to-top">
            <i class="fas fa-arrow-up"></i>
        </a>
    );
}
