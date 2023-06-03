import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Image} from "./image.model";
import {ParkingLotModel} from "./parkingLot.model";

@Entity()
export class ParkingSlot {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public number: number;

    @Column()
    isAvailable: boolean;

    @Column()
    public engagedFor: number;

    @OneToOne(() => Image)
    @JoinColumn({name: "image_id"})
    image: Image;

    @Column()
    parkingLotId: string;

    @ManyToOne((type) => ParkingLotModel, parkingLot=>parkingLot.parkingSlots,
        {cascade: true})
    @JoinColumn({name: "parkinglot_id"})
    public parkingLot: ParkingLotModel;

}
