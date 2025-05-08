import { SaleItems } from "src/sale-items/entities/sale-item.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ 
        type: 'varchar', 
        length: 100,
        unique: true, 
    })
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

    @DeleteDateColumn()
    deletedAt: Date | null;

    @BeforeInsert()
    normalizeData(){
        this.name = this.name.trim().replace(/\s+/g, ' ');;
        this.skuCode = this.skuCode.trim().toLowerCase();
    }

    @BeforeUpdate()
    normalizeUpdateDate(){
        if(this.name) this.name = this.name.trim().replace(/\s+/g, ' ');
        if(this.skuCode) this.skuCode = this.skuCode.trim().toLowerCase();
    }

}
