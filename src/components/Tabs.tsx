
export const Tab = (props: any) => {
    const active = "tab-content " + (props.active || "");
    return (
        <div id={props.id} class={active}>
            <h2>{props.title}</h2>
            {props.children}
        </div>
    );
}
