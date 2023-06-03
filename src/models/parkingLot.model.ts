import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Blog} from "./blog.model";
import {Image} from "./image.model";
import {ParkingSlot} from "./parkingSlot.model"

@Entity()
export class ParkingLotModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    public totalCapacity: number;

    @Column()
    public availableSlots: number;

    @OneToMany((type) => ParkingSlot, parkingSlot=>parkingSlot.parkingLot,
        {cascade: true})
    public parkingSlots: ParkingSlot[];

}
