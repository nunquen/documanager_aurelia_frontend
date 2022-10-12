export class Utils{
    constructor(){}

    truncate(string, length) {
        var dots = "...";
        return (string.length > length) ? string.substring(0, length - dots.length) . dots : string;
    }    
}
