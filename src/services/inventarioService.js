// En src/services/inventarioService.js - REEMPLAZA TODO CON:
import api from './api';

export const inventarioService = {
  // Usar endpoints de productos para el inventario
  getInventario: () => api.get('/productos'),
  getProducto: (id) => api.get(`/productos/${id}`),
  createProducto: (productoData) => api.post('/productos', productoData),
  updateProducto: (id, productoData) => api.put(`/productos/${id}`, productoData),
  deleteProducto: (id) => api.delete(`/productos/${id}`),
  buscarProducto: (query) => {
    // Implementar búsqueda simple - puedes mejorarlo después
    return api.get('/productos').then(response => {
      const productos = response.data;
      const filtrados = productos.filter(p => 
        p.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(query.toLowerCase())
      );
      return { data: filtrados };
    });
  },
  
  // Para alertas de stock bajo
  getStockBajo: () => api.get('/alertas/generar/inventario')
};
