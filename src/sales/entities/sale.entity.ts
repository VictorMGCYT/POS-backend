import { Users } from "src/auth/entities/auth.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Sales {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Users,
        (user) => user.sales,
        { eager: true }
    )
    @JoinColumn()
    user: Users;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    totalAmount: string

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    totalProfit: string;

    @Column({
        type: 'text',
        nullable: false,
        enum: ['Efectivo','Tarjeta','Transferencia']
    })
    paymentMethod: string;

    @CreateDateColumn()
    sale_date: Date;

}
