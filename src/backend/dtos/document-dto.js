export class DocumentDto{
    file_uploaded;
    name;
    url;
    created_at;
    modified_at;

    constructor(
        file_uploaded_b,
        name_s,
        url_s,
        created_at_dt,
        modified_at_dt)
    {
        this.file_uploaded = file_uploaded_b;
        this.name = name_s;
        this.url = url_s;
        this.created_at = created_at_dt;
        this.modified_at = modified_at_dt;
        this.revisions = [];
    }

    get_revisions(){
        return this.revisions;
    }
    
    set_revisions(revisions){
        this.revisions = revisions;
    }

    get_name(){
        return this.name;
    }

    set_name(name){
        this.name = name;
    }

    get_url(url){
        return this.url;
    }

    set_url(url){
        this.url = url;
    }

    get_file_uploaded(){
        return this.file_uploaded;
    }
}