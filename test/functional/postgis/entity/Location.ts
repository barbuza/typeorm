import "reflect-metadata";
import { Entity } from "../../../../src/decorator/entity/Entity";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn";
import { Column } from "../../../../src/decorator/columns/Column";
import { Point } from "../../../../src/driver/postgres/Point";

Point; // help retarded compiler

@Entity()
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "point", nullable: true })
    point1: Point | null;

    @Column({ type: "point", nullable: true })
    point2: Point | null;

}