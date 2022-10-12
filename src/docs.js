export class Post {

    activate(params) {
        this.url = params.url;
        this.version = params.version;
        this.document_id = params.document_id;
    }

}