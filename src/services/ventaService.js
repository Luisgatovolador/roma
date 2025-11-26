import api from './api';

export const ventaService = {
  getVentas: async () => {
    try {
      console.log("🔄 Solicitando ventas al backend...");
      const response = await api.get('/ventas');
      console.log("✅ Respuesta recibida:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Error en getVentas:", error);
      if (error.response?.status === 404) {
        console.log("⚠️  Endpoint no encontrado, retornando array vacío");
        return { data: [] };
      }
      throw error;
    }
  },

  getVentasByCliente: async (clienteId) => {
    try {
      console.log(`🔄 Buscando ventas para cliente: ${clienteId}`);
      const response = await api.get(`/ventas/cliente/${clienteId}`);
      console.log("✅ Ventas del cliente:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Error en getVentasByCliente:", error);
      // Si el endpoint no existe, retornar array vacío
      if (error.response?.status === 404) {
        console.log("⚠️  Endpoint de ventas por cliente no encontrado");
        return { data: [] };
      }
      return { data: [] };
    }
  },
  
  getVentaById: async (id) => {
    try {
      const response = await api.get(`/ventas/${id}`);
      return response;
    } catch (error) {
      console.error("❌ Error en getVentaById:", error);
      throw error;
    }
  },
  
  createVenta: async (ventaData) => {
    try {
      console.log("🔄 Creando venta:", ventaData);
      const response = await api.post('/ventas/', ventaData);
      console.log("✅ Venta creada:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Error en createVenta:", error);
      throw error;
    }
  },
  
  deleteVenta: async (id) => {
    try {
      const response = await api.delete(`/ventas/${id}`);
      return response;
    } catch (error) {
      console.error("❌ Error en deleteVenta:", error);
      throw error;
    }
  },
  
  getVentasHoy: async () => {
    try {
      const response = await api.get('/ventas/estadisticas/hoy');
      return response;
    } catch (error) {
      console.error("❌ Error en getVentasHoy:", error);
      return { data: { total: 0, cantidad: 0 } };
    }
  },
  
  getTopCategorias: async () => {
    try {
      const response = await api.get('/ventas/estadisticas/categorias');
      return response;
    } catch (error) {
      console.error("❌ Error en getTopCategorias:", error);
      return { data: [
        { categoria: 'Panadería', ventas: 45 },
        { categoria: 'Pastelería', ventas: 32 },
        { categoria: 'Bebidas', ventas: 28 }
      ] };
    }
  },
  
  getVentasMensuales: async () => {
    try {
      const response = await api.get('/ventas/estadisticas/mensual');
      return response;
    } catch (error) {
      console.error("❌ Error en getVentasMensuales:", error);
      return { data: { total: 0 } };
    }
  },
 createPaymentIntent: async (amount, description) => {
  try {
    console.log("🔄 Creando PaymentIntent en backend...");
    const response = await api.post('/pagos/crear-intent', {
      amount,
      description
    });
    console.log("✅ PaymentIntent creado:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error en createPaymentIntent:", error);
    throw error;
  }
}


};
