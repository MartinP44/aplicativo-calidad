package com.peluqueria.service;

import com.peluqueria.model.Factura;
import com.peluqueria.model.FacturaDetalle;
import com.peluqueria.model.Producto;
import com.peluqueria.model.Stock;
import com.peluqueria.repository.FacturaRepository;
import com.peluqueria.repository.ProductoRepository;
import com.peluqueria.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class FacturaServiceImpl implements FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    // Para buscar productos por nombre
    @Autowired
    private ProductoRepository productoRepository;

    // Para registrar ingresos y salidas de stock
    @Autowired
    private StockRepository stockRepository;

    @Override
    public List<Factura> listarTodas() {
        return facturaRepository.findAll();
    }

    @Override
    public Factura guardar(Factura factura) {
        // 1) validaciones (stock, cálculo de total, etc.) que ya tenías...

        // Validar stock para cada detalle de tipo PRODUCTO
        for (FacturaDetalle detalle : factura.getDetalles()) {
            if ("PRODUCTO".equalsIgnoreCase(detalle.getTipo())) {
                // Buscar el Producto por nombre (asumimos que detalle.getDescripcion() es el nombre)
                Producto producto = productoRepository.findByNombre(detalle.getDescripcion());
                if (producto == null) {
                    throw new RuntimeException("Producto no encontrado: " + detalle.getDescripcion());
                }

                // Calcular stock disponible: sumamos todas las entradas y salidas
                int stockDisponible = stockRepository.findAll()
                        .stream()
                        .filter(s -> s.getProducto().getId().equals(producto.getId()))
                        .mapToInt(Stock::getCantidad)
                        .sum();

                if (detalle.getCantidad() > stockDisponible) {
                    throw new RuntimeException(
                            "Stock insuficiente para el producto: " + detalle.getDescripcion()
                    );
                }
            }
        }

        // 2) Calcular el total de la factura
        double total = factura.getDetalles()
                .stream()
                .mapToDouble(d -> d.getPrecio() * d.getCantidad())
                .sum();
        factura.setTotal(total);

        // 3) Asociar la factura a cada detalle
        for (FacturaDetalle detalle : factura.getDetalles()) {
            detalle.setFactura(factura);
        }

        // 4) Guardar la factura (y en cascada, los detalles)
        Factura facturaGuardada = facturaRepository.save(factura);

        // 5) Ahora, **generar salidas de stock** (registros con cantidad negativa)
        LocalDate hoy = LocalDate.now();
        Date fechaHoySql = Date.valueOf(hoy);

        for (FacturaDetalle detalle : facturaGuardada.getDetalles()) {
            if ("PRODUCTO".equalsIgnoreCase(detalle.getTipo())) {
                // Buscar el Producto por nombre
                Producto producto = productoRepository.findByNombre(detalle.getDescripcion());
                if (producto != null) {
                    // Creamos un registro de Stock con cantidad NEGATIVA
                    Stock salida = new Stock();
                    salida.setProducto(producto);
                    salida.setCantidad(-detalle.getCantidad()); // <— NEGAMOS la cantidad vendida
                    salida.setFechaIngreso(fechaHoySql.toLocalDate());        // Fecha de hoy (o podrías usar facturaGuardada.getFecha())
                    stockRepository.save(salida);
                }
            }
        }

        return facturaGuardada;
    }

    @Override
    public Factura buscarPorId(Integer id) {
        return facturaRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminarPorId(Integer id) {
        facturaRepository.deleteById(id);
    }
}
