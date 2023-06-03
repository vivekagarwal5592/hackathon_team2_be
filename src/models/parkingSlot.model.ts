import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Image} from "./image.model";
import {ParkingLot} from "./parkingLot";
import { User } from "./user.model";

@Entity()
export class ParkingSlot {

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public number: string;

    @Column()
    isAvailable: boolean;

    @Column({name:"engaged_for", default:null})
    public engagedFor: number;

    @Column({name:"user_id",nullable:true})
    public userId:number

    @OneToOne((type)=> User, {nullable:true})
    @JoinColumn({name:"user_id"})
    public user: User

    @ManyToOne((type) => ParkingLot, parkingLot=>parkingLot.parkingSlots)
    @JoinColumn({name: "parkinglot_id"})
    public parkingLot: ParkingLot;

}
