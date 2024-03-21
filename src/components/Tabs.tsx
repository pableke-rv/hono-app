
export const Tab = (props: any) => {
    const active = "tab-content " + (props.active || "");
    return (
        <div id={props.id} class={active}>
            <h2>{props.title}</h2>
            {props.children}
        </div>
    );
}

export const TabNavigate = (props: any) => {
    return (
        <a href={props.href} class="btn btn-primary tab-action">{props.children}</a>
    );
}
export const TabNav0 = (props: any) => {
    return (
        <TabNavigate href="#tab-0"><i class="fas fa-angle-double-left"></i></TabNavigate>
    );
}
export const TabPrev = (props: any) => {
    return (
        <TabNavigate href="#next-prev"><i class="fas fa-angle-double-left"></i>{props.children}</TabNavigate>
    );
}
export const TabNext = (props: any) => {
    return (
        <TabNavigate href="#next-tab">{props.children}<i class="fas fa-angle-double-right"></i></TabNavigate>
    );
}
