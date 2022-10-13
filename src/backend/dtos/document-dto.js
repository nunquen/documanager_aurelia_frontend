export class DocumentDto{
    id;
    file_path;
    file_name;
    file_type;
    name;
    url;
    file_uploaded;
    created_at;
    modified_at;
    revisions;

    constructor(
        id=null,
        file_path_s=null,
        file_name_s=null,
        file_type_s=null,
        name_s=null,
        url_s=null,
        file_uploaded_b=null,
        created_at_dt=null,
        modified_at_dt=null,
        revisions_i=0)
    {
        this.id = id;
        this.file_path = file_path_s;
        this.file_name = file_name_s;
        this.file_type = file_type_s;
        this.name = name_s;
        this.url = url_s;
        this.file_uploaded = file_uploaded_b;
        this.created_at = created_at_dt;
        this.modified_at = modified_at_dt;
        this.revisions = revisions_i;
        this.revision_list = [];
    }

    async to_json(){
        return {
            'id': this.id,
            'file_path_s': this.file_path,
            'file_type_s': this.file_type,
            'name_s': this.name,
            'url_s': this.url,
            'file_uploaded_b': this.file_uploaded,
        }
    }
}