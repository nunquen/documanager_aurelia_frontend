export class RevisionDto{
    id;
    title;
    comment;
    number;
    file_name;
    file_type;
    local_full_path;
    file_uploaded;
    created_at;
    modified_at;

    constructor(
        id,
        title_s,
        comment_s,
        number_i,
        file_name_s,
        file_type_s,
        local_full_path_s,
        file_uploaded_b,
        created_at_dt,
        modified_at_dt)
    {
        this.id = id;
        this.title = title_s,
        this.comment = comment_s,
        this.number = number_i,
        this.file_name = file_name_s;
        this.file_type = file_type_s;
        this.local_full_path = local_full_path_s;
        this.file_uploaded = file_uploaded_b;
        this.created_at = created_at_dt;
        this.modified_at = modified_at_dt;
    }

}