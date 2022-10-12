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
        id,
        file_path_s,
        file_name_s,
        file_type_s,
        name_s,
        url_s,
        file_uploaded_b,
        created_at_dt,
        modified_at_dt,
        revisions_i)
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
}