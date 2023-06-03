import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * This model provides a link between the recipie and Ingredient Model
 */
@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public value: string;

    @Column()
    public type: string;

    @Column({nullable: true,  default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    @Column({nullable: true, default: () => "CURRENT_TIMESTAMP"})
    updated_at: Date;

}
