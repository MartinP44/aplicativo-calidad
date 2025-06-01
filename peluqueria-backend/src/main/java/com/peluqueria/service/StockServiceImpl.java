package com.peluqueria.service;

import com.peluqueria.model.Stock;
import com.peluqueria.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Override
    public List<Stock> listarTodos() {
        return stockRepository.findAll();
    }

    @Override
    public Optional<Stock> buscarPorId(Integer id) {
        return stockRepository.findById(id);
    }

    @Override
    public Stock guardar(Stock stock) {
        return stockRepository.save(stock);
    }

    @Override
    public void eliminarPorId(Integer id) {
        stockRepository.deleteById(id);
    }
}

