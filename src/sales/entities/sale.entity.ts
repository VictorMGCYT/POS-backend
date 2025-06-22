import { Users } from "src/auth/entities/auth.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaleItems } from '../../sale-items/entities/sale-item.entity';


@Entity()
export class Sales {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Users,
        (user) => user.sales
    )
    @JoinColumn({ name: 'userId' })
    user: Users;

    @Column()
    userId: string;

    @OneToMany(
        () => SaleItems,
        (saleItem) => saleItem.sale
    )
    saleItems: SaleItems[];

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

    @CreateDateColumn({ type: 'timestamptz' })
    saleDate: Date;

}
