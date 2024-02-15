
export default (props: any) => {
    return (
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <title>Hono Tests Page</title>
                <link rel="stylesheet" type="text/css" media="screen" href="public/css/styles-min.css"/>
                <script src="https://kit.fontawesome.com/76f12cea70.js" crossorigin="anonymous"></script>
                <script type="module" src="public/js/xeco/tests.js"></script>
            </head>
            <body>{props.children}</body>
        </html>
    );
}
