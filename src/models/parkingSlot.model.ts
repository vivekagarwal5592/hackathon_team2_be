import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Image} from "./image.model";
import {ParkingLot} from "./parkingLot";

@Entity()
export class ParkingSlot {

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public number: string;

    @Column()
    isAvailable: boolean;

    @Column({default:null})
    public engagedFor: number;

    @OneToOne(() => Image)
    @JoinColumn({name: "image_id"})
    image: Image;

    @ManyToOne((type) => ParkingLot, parkingLot=>parkingLot.parkingSlots)
    @JoinColumn({name: "parkinglot_id"})
    public parkingLot: ParkingLot;

}
