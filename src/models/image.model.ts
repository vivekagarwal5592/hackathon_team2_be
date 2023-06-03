import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

/**
 * Recipie Model for storing all the details of each recipie
 */
@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true,  default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    @Column({nullable: true, default: () => "CURRENT_TIMESTAMP"})
    updated_at: Date;

    @ManyToOne((type) => User, user=>user.blogs)
    @JoinColumn({name: "user_id"})
    public user: User;

}
