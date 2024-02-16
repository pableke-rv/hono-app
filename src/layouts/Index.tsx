
export const Tab0 = (props: any) => {
    return (
        <div id="tab-0" class="tab-content active">
            <h2>Hello Hono!</h2>
            <div class="alert alert-info">
                <div class="alert-icon"><i class="fas fa-bullhorn"></i></div>
                <div class="alert-text"><b>Info:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-note">
                <div class="alert-icon"><i class="fas fa-bell"></i></div>
                <div class="alert-text"><b>Note:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-ok">
                <div class="alert-icon"><i class="fas fa-check-circle"></i></div>
                <div class="alert-text"><b>OK:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-green">
                <div class="alert-icon"><i class="far fa-thumbs-up"></i></div>
                <div class="alert-text"><b>Green:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-success">
                <div class="alert-icon"><i class="far fa-calendar-check"></i></div>
                <div class="alert-text"><b>Saccessfully:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-warn">
                <div class="alert-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="alert-text">
                    <b>Warn:</b> <span>Area de pruebas</span>
                    <p><b>Extra info:</b> añkjfdsaldñlka fjasñlkadjf asñlk adñlkajf asñlkdsfdjk aslsñlkadfkjk asñsdñlkafjlk asñldkfdjk aksldjf alskfdj asñlkdsfdjk aslsñlkadfkjk asñsdñlkafjlk asñldkfdjk aksldjf alskfdj</p>
                </div>
            </div>
            <div class="alert alert-error">
                <div class="alert-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="alert-text"><b>Error:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-danger">
                <div class="alert-icon"><i class="fas fa-radiation-alt"></i></div>
                <div class="alert-text"><b>Danger:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-dark">
                <div class="alert-icon"><i class="fas fa-skull-crossbones"></i></div>
                <div class="alert-text"><b>Dark:</b> <span>Area de pruebas</span></div>
            </div>
            <div class="alert alert-info">
                <div class="alert-text">
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. A, dolorum, veritatis tenetur ea dolor quo consequuntur ullam molestias fugit quam.</span>
                    <a href="#toggle" class="link tab-action" data-toggle="fa-angle-double-down fa-angle-double-up" data-target=".info-test">
                        Más Info <i class="fas fa-angle-double-down"></i>
                    </a>
                    <div class="info-test hide"><hr/>Lorem ipsum dolor, sit amet consectetur adipisicing, elit. Corrupti rem aut, minus asperiores, sunt eligendi hic ipsum maiores itaque numquam sequi eius voluptates consequuntur debitis impedit quae dolore ad, enim?</div>
                </div>
            </div>

            <div class="navbar">
                <a href="#next-tab" class="btn btn-primary tab-action">Sig. <i class="fas fa-angle-double-right"></i></a>
                <a href="#tab-2" class="btn btn-primary tab-action"><i class="fas fa-angle-double-right"></i></a>
                <a href="/maps" class="btn btn-green">Go maps <i class="fas fa-share"></i></a>
                <a href="/api/maps" class="btn btn-green">Go API maps <i class="fas fa-undo-alt"></i></a>
            </div>
        </div>
    );
}

export const Tab1 = (props: any) => {
    return (
        <div id="tab-1" class="tab-content">
            <h2>Actions</h2>

            <form id="form-pokemon" action="#">
            <div class="ui-blocks">
                <label class="ui-block-xl autocomplete">
                    <div class="label required">Pokemon finder:</div>
                    <i class="fas fa-search ui-icon-left"></i>
                    <input type="search" id="pokemon" name="pokemon" class="ui-input ui-text ui-autocomplete"
                        tabindex="1" autocomplete="off" placeholder="Search a pokemon" />
                    <input type="hidden" name="id"/>
                    <ul class="results"></ul>
                    <div class="ui-errtip"></div>
                </label>
            </div>
            </form>

            <div id="info-pokemon" class="hide" style="display: flex; align-items: start; gap: 2rem;">
                <div>
                <h3>Pokemon @name;</h3>
                <ul>
                    <li><b>Nombre:</b> @name;</li>
                    <li><b>Tipo:</b> @type;</li>
                    <li><b>Especie:</b> @species;</li>
                    <li><b>HP:</b> @hp;</li>
                    <li><b>Ataque:</b> @attack;</li>
                    <li><b>Defensa:</b> @defense;</li>
                </ul>
                </div>
                <img src="@img;" alt="@name;"/>
            </div>

            <div class="navbar">
                <a href="#" class="action text-green resize">Green</a>
                <a href="#" class="action text-blue resize">Blue</a>
                <a href="#" class="action text-warn resize">Warn</a>
                <a href="#" class="action text-red text-xl resize"><i class="fas fa-times"></i></a>
            </div>

            <div class="navbar">
                <a href="#tab-0" class="btn btn-primary tab-action"><i class="fas fa-angle-double-left"></i></a>
            </div>
        </div>
    );
}
