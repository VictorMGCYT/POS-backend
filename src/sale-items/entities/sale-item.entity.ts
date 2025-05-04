import { Products } from "src/products/entities/product.entity";
import { Sales } from "src/sales/entities/sale.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class SaleItems {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Sales,
        (sale) => sale.saleItems
    )
    sale: Sales;

    @ManyToOne(
        () => Products,
        (product) => product.saleItems
    )
    product: Products;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    quantity: string;

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
    subtotal: string;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    profit: string;

    @CreateDateColumn()
    createAt: Date;
}
