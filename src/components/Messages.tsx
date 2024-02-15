
export default (props: any) => {
    return (
        <ul>
            {
                props.messages.map((msg: String) => <li>{msg}!!</li>)
            }
        </ul>
    );
}
