export class Point {

    public static SRID = 4326;

    constructor(public lat: number, public lng: number) {

    }

    public asPg() {
        return `ST_SetSRID(ST_MakePoint(${this.lat}, ${this.lng}), ${Point.SRID})`;
    }

    public asWhere(index: number) {
        return `ST_SetSRID(ST_MakePoint($${index + 1}, $${index + 2}), ${Point.SRID})`;
    }

    public asParams() {
        return [this.lat, this.lng];
    }
}
