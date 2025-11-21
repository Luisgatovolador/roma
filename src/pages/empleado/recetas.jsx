import React, { useState } from "react";
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
} from "@mui/material";
import { RestaurantMenu, AccessTime, CheckCircle } from "@mui/icons-material";

// --- Datos Simulados de Recetas ---
const recetas = [
  {
    id: 1,
    nombre: "Ensalada de Frutas Fresisimo",
    tiempo: "10 min",
    dificultad: "Fácil",
    ingredientes: [
      { nombre: "Fresas frescas", cantidad: "200g" },
      { nombre: "Manzana Gala", cantidad: "1 pieza" },
      { nombre: "Plátano", cantidad: "1 pieza" },
      { nombre: "Miel natural", cantidad: "2 cucharadas" },
      { nombre: "Yogur natural", cantidad: "100 ml" },
    ],
    pasos: [
      "Lava y corta todas las frutas en trozos medianos.",
      "Coloca las frutas en un tazón grande.",
      "Agrega la miel y el yogur natural sobre las frutas.",
      "Mezcla suavemente con una cuchara.",
      "Sirve fría y decora con hojas de menta.",
    ],
  },
  {
    id: 2,
    nombre: "Smoothie de Mango y Yogur",
    tiempo: "8 min",
    dificultad: "Fácil",
    ingredientes: [
      { nombre: "Mango Ataulfo", cantidad: "1 pieza" },
      { nombre: "Yogur natural", cantidad: "150 ml" },
      { nombre: "Leche", cantidad: "50 ml" },
      { nombre: "Miel", cantidad: "1 cucharada" },
      { nombre: "Hielo", cantidad: "3 cubos" },
    ],
    pasos: [
      "Pela y corta el mango en trozos pequeños.",
      "Coloca todos los ingredientes en la licuadora.",
      "Licúa durante 1 minuto hasta obtener una mezcla homogénea.",
      "Sirve en un vaso y decora con trozos de mango encima.",
    ],
  },
];

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
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(recetas[0]);

  return (
    <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Recetario Fresisimo
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={3}>
        Selecciona una receta para ver sus ingredientes y pasos
      </Typography>

      <Grid container spacing={3}>
        {/* 📋 Columna Izquierda: Lista de Recetas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 1, minHeight: 500, backgroundColor: "#fdf3f5" }}>
            <Typography variant="subtitle1" fontWeight="bold" p={1}>
              Recetas Disponibles
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <List disablePadding>
              {recetas.map((receta) => (
                <ListItemButton
                  key={receta.id}
                  selected={recetaSeleccionada && receta.id === recetaSeleccionada.id}
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
                    secondary={`Tiempo: ${receta.tiempo}`}
                  />
                  <Chip
                    label={receta.dificultad}
                    size="small"
                    color={getDificultadColor(receta.dificultad)}
                  />
                </ListItemButton>
              ))}
            </List>
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
                  label={recetaSeleccionada.dificultad}
                  color={getDificultadColor(recetaSeleccionada.dificultad)}
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
                          <TableCell sx={{ fontWeight: "bold" }}>Ingrediente</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Cantidad
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recetaSeleccionada.ingredientes.map((ing, index) => (
                          <TableRow key={index}>
                            <TableCell>{ing.nombre}</TableCell>
                            <TableCell align="right">{ing.cantidad}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* 👨‍🍳 Pasos a seguir */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" mb={2}>
                    Pasos a Seguir
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#fdf3f5",
                      border: "1px solid #f9d4da",
                      minHeight: 300,
                    }}
                  >
                    {recetaSeleccionada.pasos.map((paso, i) => (
                      <Box key={i} display="flex" mb={1.5} alignItems="flex-start">
                        <Chip
                          label={i + 1}
                          size="small"
                          sx={{
                            backgroundColor: "#f7c0c9",
                            color: "black",
                            mr: 1.5,
                            minWidth: 24,
                          }}
                        />
                        <Typography>{paso}</Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <Chip
                  icon={<AccessTime />}
                  label={`Tiempo total: ${recetaSeleccionada.tiempo}`}
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
