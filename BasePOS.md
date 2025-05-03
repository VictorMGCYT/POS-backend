
---

# 📦 Estructura FINAL de las Tablas (Punto de Venta)

---

## 1. **users** (Usuarios del sistema)

| Columna        | Tipo         | Descripción                     |
|:---------------|:-------------|:---------------------------------|
| id             | INT PK AUTO_INCREMENT | ID único del usuario. |
| username       | VARCHAR(100) | Nombre de usuario para login.    |
| password_hash  | VARCHAR(255) | Contraseña hasheada.             |
| role           | ENUM('admin', 'cajero') | Rol dentro del sistema. |
| created_at     | DATETIME     | Fecha de creación.               |

---

## 2. **products** (Productos disponibles)

| Columna        | Tipo          | Descripción                         |
|:---------------|:--------------|:------------------------------------|
| id             | INT PK AUTO_INCREMENT | ID único del producto.        |
| name           | VARCHAR(255)  | Nombre del producto.                |
| sku_code       | VARCHAR(100) NULL | Código de barras o SKU (opcional para frutas/verduras). |
| is_by_weight   | BOOLEAN       | TRUE si se vende por peso, FALSE si es por unidad. |
| unit_price     | DECIMAL(10,2) | Precio de venta **actual** (por unidad o por kilo). |
| purchase_price | DECIMAL(10,2) | Precio de compra actual (por unidad o por kilo). |
| stock_quantity | DECIMAL(10,2) | Stock disponible (puede ser decimal para kilos). |
| created_at     | DATETIME      | Fecha de creación.                  |

---

## 3. **sales** (Ventas realizadas)

| Columna        | Tipo           | Descripción                       |
|:---------------|:---------------|:----------------------------------|
| id             | INT PK AUTO_INCREMENT | ID único de venta.           |
| user_id        | INT FK → users(id) | Usuario que hizo la venta.    |
| total_amount   | DECIMAL(10,2)   | Total de la venta.               |
| total_profit   | DECIMAL(10,2)   | Total de la **ganancia** generada en esta venta. |
| payment_method | ENUM('efectivo', 'tarjeta', 'transferencia') | Método de pago usado. |
| sale_date      | DATETIME        | Fecha y hora de la venta.         |

---

## 4. **sale_items** (Productos vendidos en cada venta)

| Columna         | Tipo          | Descripción                        |
|:----------------|:--------------|:-----------------------------------|
| id              | INT PK AUTO_INCREMENT | ID único del item.            |
| sale_id         | INT FK → sales(id) | Venta a la que pertenece.      |
| product_id      | INT FK → products(id) | Producto vendido.             |
| quantity        | DECIMAL(10,2) | Cantidad vendida (piezas o kilos). |
| unit_price      | DECIMAL(10,2) | Precio de venta al momento.         |
| purchase_price  | DECIMAL(10,2) | Precio de compra al momento.        |
| subtotal        | DECIMAL(10,2) | quantity * unit_price (antes de descuentos si tuvieras). |
| profit          | DECIMAL(10,2) | (unit_price - purchase_price) * quantity |

<!-- ---

## 5. **payments** (Pagos realizados por ventas) *(opcional pero recomendable si luego quieres pagos divididos)*

| Columna         | Tipo           | Descripción                        |
|:----------------|:---------------|:-----------------------------------|
| id              | INT PK AUTO_INCREMENT | ID del pago.                  |
| sale_id         | INT FK → sales(id) | A qué venta pertenece.         |
| amount_paid     | DECIMAL(10,2)   | Cantidad pagada.                 |
| payment_method  | ENUM('efectivo', 'tarjeta', 'transferencia') | Método de pago usado. |
| paid_at         | DATETIME        | Hora exacta del pago.            |

--- -->

# 🎯 Relaciones entre tablas

```plaintext
[users] ---> [sales] ---> [sale_items] ---> [products]
```

✅ **Notas importantes:**
- Guardas el precio de venta y compra exacto **al momento de la venta**.
- Puedes calcular **ganancias precisas** incluso si luego suben o bajan precios.
- Todo soporta venta **por pieza** y **por peso**.
- Preparado para **métodos de pago múltiples** en el futuro.

---

# 📚 Ejemplo sencillo de flujo

1. **Usuario** "Juan" vende 3 manzanas (por peso) y 2 Coca-Colas.
2. Se genera una **venta** en `sales`.
3. Cada producto queda en `sale_items` con su precio, compra, subtotal y profit registrado.
4. **Pago** en efectivo, queda guardado en `payments`.
5. El stock de **products** se actualiza restando la cantidad vendida.

---

# 🔥 BONUS: Consulta típica para reporte diario
```sql
SELECT
  SUM(total_amount) AS total_ventas,
  SUM(total_profit) AS ganancia_total
FROM
  sales
WHERE
  DATE(sale_date) = CURDATE();
```
(Total vendido y ganancia del día de hoy.)

---

# ✅ Resumen final

| Tabla | Propósito |
|:------|:----------|
| users | Usuarios y roles (admin/cajero). |
| products | Catálogo de productos, precios de compra y venta. |
| sales | Ventas generales: totales, pagos y ganancias. |
| sale_items | Productos específicos vendidos en cada venta (detalle). |
| payments | Registro de pagos múltiples o parciales (opcional pero listo). |

