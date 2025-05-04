import { SaleItems } from "src/sale-items/entities/sale-item.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    skuCode: string;

    @Column({
        type: 'boolean',
        default: false
    })
    isByWeight: boolean;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    unitPrice: string;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    purchasePrice: string;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    stockQuantity: string;

    @OneToMany(
        () => SaleItems,
        (saleItem) => saleItem.product
    )
    saleItems: SaleItems[];

    @CreateDateColumn()
    createdAt: Date;

}
