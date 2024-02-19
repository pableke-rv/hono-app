
export const Notice = (props: any) => {
    const type = `alert alert-${props.type}`;
    const icon = props.icon ? "alert-icon" : "hide";
    return (
        <div class={type}>
            <div class={icon}><i class={props.icon}></i></div>
            <div class="alert-text">{props.children}</div>
        </div>
    );
}

export const Alert = (props: any) => {
    const type = `hide alert alert-${props.type}`;
    return (
        <div class={type}>
            <div class="alert-icon"><i class={props.icon}></i></div>
            <div class="alert-text">{props.children}</div>
            <div class="alert-close"><i class="fas fa-times"></i></div>
        </div>
    );
}

export const Alerts = (props: any) => {
    return (
        <div class="alerts">
            <Alert type="success" icon="fas fa-check-circle fa-3x">{props.ok}</Alert>
            <Alert type="info" icon="fas fa-info fa-3x">{props.info}</Alert>
            <Alert type="warn" icon="fas fa-exclamation-triangle fa-3x">{props.warn}</Alert>
            <Alert type="error" icon="fas fa-exclamation fa-2x">{props.error}</Alert>
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
