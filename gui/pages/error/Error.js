import Page from "../Page.js";

export default class Error extends Page{
    constructor(){
        super()
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
            messageElement.innerText = this.message;
            statusElement.innerText = this.status;
        }
    }
}