import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../interfaces/user-roles.interface";
import { Sales } from "src/sales/entities/sale.entity";


@Entity()
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    firstName: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    paternalSurname: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    maternalSurname: string;

    @Column({
        type: 'text'
    })
    password: string;

    @Column({
        type: 'text',
        enum: UserRole,
    })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(
        () => Sales,
        (sale) => sale.user
    )
    sales: Sales[];

    @BeforeInsert()
    normalizeData(){
        this.username = this.username.toLowerCase().trim();
        this.firstName = this.firstName.toLowerCase().trim();
        this.paternalSurname = this.paternalSurname.toLowerCase().trim();
        this.maternalSurname = this.maternalSurname.toLowerCase().trim();
        if (!this.role) {
            this.role = UserRole.USER
        }
    }
}
