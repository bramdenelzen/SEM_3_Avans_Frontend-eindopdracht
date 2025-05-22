import WebComponent from "../../Webcomponent.js";

export default class Error extends WebComponent{
    constructor(){
        super(Error.html, Error.css)
    }

    connectedCallback(){
        this.message = this.getAttribute("message")
        this.status = this.getAttribute("status")

        const messageElement = this.shadowRoot.getElementById("message");
        const statusElement = this.shadowRoot.getElementById("status");


        if (!this.status || !this.message){
            messageElement.innerText = "An error occurred";
            statusElement.innerText = "500";
        }else {
            document.title = `${this.status} ${this.message}`
            messageElement.innerText = this.message;
            statusElement.innerText = this.status;
        }
    }
}