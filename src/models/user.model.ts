import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Image} from "./image.model";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    role: string;

    @Column({ nullable: true })
    about: string;

    @OneToOne(() => Image)
    @JoinColumn({name: "image_id"})
    image: Image;

    @Column({ nullable: true })
    slug: string;

    @Column({ nullable: true })
    password: string;

}
