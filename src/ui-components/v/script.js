// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

const APP = window.APP;

export default class V extends APP.UI.UIComponent {
    constructor(root) {
        super(root);

        Object.assign(this.cache, {
            // root is already here
        });

        Object.assign(this.state, {

        });

        this.init();
        this.initAria();
        this.initEvents();
        this.initControls();
    }


    init() {
        return this;
    }


    initAria() {
        return this;
    }


    initEvents() {
        return this;
    }


    initControls() {
        return this;
    }
}

