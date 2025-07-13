import { Content } from "pdfmake/interfaces"


export const recomendaciones = (): Content => {
    return [
        {
            text: "Recomendaciones:",
            bold: true,
            fontSize: 14,
            margin: [0,40,0,0]
        },
        {
            ul: [
                "Revisa la fecha de caducidad: Si está próxima, considera aplicar descuentos o hacer promociones rápidas para que salgan.",
                "No los escondas: A veces se quedan al fondo del estante, muévelos al frente o cerca del mostrador.",
                "Pregunta al proveedor si acepta devoluciones o cambios por otros productos.",
                "Haz paquetes combinados: Ej. “Galletas + jugo” o “Sopa + salsa” a precio especial.",
            ]
        }
    ]
}