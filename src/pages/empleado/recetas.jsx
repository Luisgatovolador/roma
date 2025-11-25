import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import { RestaurantMenu, AccessTime, CheckCircle, Refresh } from "@mui/icons-material";

const API_BASE = "http://localhost:4000";

// --- Ícono según dificultad ---
const getDificultadColor = (nivel) => {
  switch (nivel) {
    case "Fácil":
      return "success";
    case "Media":
      return "warning";
    case "Difícil":
      return "error";
    default:
      return "default";
  }
};

const ConsultaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/recetas`);
      if (!res.ok) throw new Error("Error al cargar recetas");
      const data = await res.json();
      setRecetas(data);
      if (data.length > 0) {
        setRecetaSeleccionada(data[0]);
      }
    } catch (err) {
      console.error('Error al cargar recetas:', err);
      setError('Error al cargar las recetas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Recetario
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestión de recetas y preparaciones
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={cargarRecetas}
          variant="outlined"
        >
          Actualizar
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarRecetas}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 📋 Columna Izquierda: Lista de Recetas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 1, minHeight: 500, backgroundColor: "#fdf3f5" }}>
            <Typography variant="subtitle1" fontWeight="bold" p={1}>
              Recetas Disponibles ({recetas.length})
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <List disablePadding>
              {recetas.map((receta) => (
                <ListItemButton
                  key={receta._id}
                  selected={recetaSeleccionada && receta._id === recetaSeleccionada._id}
                  onClick={() => setRecetaSeleccionada(receta)}
                  sx={{
                    borderRadius: 1,
                    my: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: "#fbe4e7",
                      "&:hover": { backgroundColor: "#f9d4da" },
                    },
                  }}
                >
                  <ListItemText
                    primary={receta.nombre}
                    secondary={`Producto: ${receta.productoFinal?.nombre || 'No especificado'}`}
                  />
                  <Chip
                    label={receta.dificultad || "Fácil"}
                    size="small"
                    color={getDificultadColor(receta.dificultad || "Fácil")}
                  />
                </ListItemButton>
              ))}
            </List>

            {recetas.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No hay recetas registradas
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Columna Derecha: Detalle de la Receta */}
        <Grid item xs={12} md={8}>
          {recetaSeleccionada ? (
            <Paper elevation={1} sx={{ p: 3, minHeight: 500 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {recetaSeleccionada.nombre}
                </Typography>
                <Chip
                  label={recetaSeleccionada.dificultad || "Fácil"}
                  color={getDificultadColor(recetaSeleccionada.dificultad || "Fácil")}
                  icon={<CheckCircle />}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* 🧂 Ingredientes */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" mb={2}>
                    Ingredientes
                  </Typography>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: "#fbe4e7" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Materia Prima</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Cantidad
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Unidad
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recetaSeleccionada.ingredientes?.map((ing, index) => (
                          <TableRow key={index}>
                            <TableCell>{ing.materiaPrima?.nombre || 'Materia prima no disponible'}</TableCell>
                            <TableCell align="right">{ing.cantidad}</TableCell>
                            <TableCell align="right">{ing.unidadMedida || 'unidad'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {(!recetaSeleccionada.ingredientes || recetaSeleccionada.ingredientes.length === 0) && (
                    <Box textAlign="center" py={2}>
                      <Typography variant="body2" color="text.secondary">
                        No se han definido ingredientes para esta receta
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {/* 👨‍🍳 Información Adicional */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" mb={2}>
                    Información de la Receta
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#fdf3f5",
                      border: "1px solid #f9d4da",
                      minHeight: 300,
                    }}
                  >
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Producto Final:
                      </Typography>
                      <Typography fontWeight="medium">
                        {recetaSeleccionada.productoFinal?.nombre || 'No especificado'}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Costo Total:
                      </Typography>
                      <Typography fontWeight="medium">
                        ${recetaSeleccionada.costoTotal?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Margen de Ganancia:
                      </Typography>
                      <Typography fontWeight="medium">
                        {recetaSeleccionada.margenGanancia?.toFixed(2) || '0'}%
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Producción Diaria:
                      </Typography>
                      <Typography fontWeight="medium">
                        {typeof recetaSeleccionada.produccionDiaria === 'object' 
                          ? `${recetaSeleccionada.produccionDiaria.cantidad || 0} ${recetaSeleccionada.produccionDiaria.unidad || 'unidades'}`
                          : recetaSeleccionada.produccionDiaria || 'No especificada'
                        }
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Última Actualización:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(recetaSeleccionada.fechaActualizacion).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <Chip
                  icon={<AccessTime />}
                  label={`Actualizado: ${new Date(recetaSeleccionada.fechaActualizacion).toLocaleDateString()}`}
                  color="secondary"
                  variant="outlined"
                />
                <Button
                  variant="outlined"
                  sx={{
                    color: "#e91e63",
                    borderColor: "#f7c0c9",
                    fontWeight: "bold",
                    "&:hover": { borderColor: "#f9d4da", backgroundColor: "#fce4ec" },
                  }}
                  onClick={() => window.print()}
                >
                  Imprimir Receta
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 3,
                minHeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Selecciona una receta para ver su detalle.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsultaRecetas;
