import "reflect-metadata";
import { expect } from "chai";
import { Location } from "./entity/Location";
import { Connection } from "../../../src/connection/Connection";
import { createTestingConnections, closeTestingConnections } from "../../utils/test-utils";
import { Point } from "../../../src/driver/postgres/Point";

describe("point type", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Location],
        enabledDrivers: ["postgres"] // because only postgres supports jsonb type
    }));
    // beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should make correct schema with Postgres' point types", () => Promise.all(connections.map(async connection => {
        await connection.syncSchema(true);
        const queryRunner = await connection.driver.createQueryRunner();
        let schema = await queryRunner.loadTableSchema("location");
        expect(schema).not.to.be.empty;
        expect(schema!.columns.find(columnSchema => columnSchema.name === "point1" && columnSchema.type === "user-defined")).to.be.not.empty;
        expect(schema!.columns.find(columnSchema => columnSchema.name === "point2" && columnSchema.type === "user-defined")).to.be.not.empty;
    })));

    it("should persist point correctly", () => Promise.all(connections.map(async connection => {
        await connection.syncSchema(true);
        let recordRepo = connection.getRepository(Location);
        let record = new Location();
        record.point1 = new Point(-71.064544, 42.28787);
        record.point2 = new Point(-72.064544, 42.28787);
        let persistedRecord = await recordRepo.persist(record);
        let foundRecord = await recordRepo.findOneById(persistedRecord.id);
        expect(foundRecord).to.be.not.undefined;
        expect(foundRecord!.point1).not.to.be.empty;

        record.point1 = new Point(-118.25601, 34.12322);
        await recordRepo.persist(record);

        const recordByPoint1 = await recordRepo.findOne({ alias: "location", where: `location.point1 = ${record.point1.asPg()}` });
        expect(recordByPoint1).to.be.not.undefined;
        expect(recordByPoint1!.point1).to.be.instanceOf(Point);
        expect(recordByPoint1!.point2).to.be.instanceOf(Point);

        recordByPoint1!.point2 = null;
        await recordRepo.persist(recordByPoint1!);

        const recordByPoint2 = await recordRepo.findOne({ alias: "location", where: `location.point1 = ${record.point1.asPg()}` });
        expect(recordByPoint2).to.be.not.undefined;
        expect(recordByPoint2!.point1).to.be.instanceOf(Point);
        expect(recordByPoint2!.point2).to.be.undefined;
    })));

});
