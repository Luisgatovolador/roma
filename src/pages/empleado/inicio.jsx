import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Container 
} from '@mui/material';
import { 
  LocalCafe, 
  People, 
  Assessment, 
  Inventory, 
  Favorite,
  EmojiEmotions,
  Group,
  Psychology,
  Diversity3,
  Coffee,
  RestaurantMenu,
  Games,
  FamilyRestroom
} from '@mui/icons-material';

const Inicio = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f3e5d8 0%, #fafafa 100%)',
        color: 'black',
      }}
    >
      {/* HERO SECTION - Con esencia RoMa */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, md: 10 },
          py: { xs: 5, md: 10 },
          flexDirection: { xs: 'column', md: 'row' },
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(101, 67, 33, 0.05) 100%)'
        }}
      >
        {/* Texto principal con filosofía RoMa */}
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 600 }}>
          <Chip 
            label="✨ Más que una cafetería, una experiencia emocional" 
            sx={{ 
              backgroundColor: '#8B4513', 
              color: 'white', 
              mb: 2,
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }} 
          />
          
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
            Bienvenido a <span style={{ color: '#8B4513' }}>RoMa Café</span> ☕
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
            "Tu nueva pausa favorita... donde el café y el alma se encuentran"
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Un espacio con alma, creado no solo para vender productos, sino para provocar emociones, 
            reflexiones y encuentros reales. Donde cada rincón tiene un motivo y cada frase en nuestras 
            paredes tiene una historia que contar.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Button
              variant="contained"
              startIcon={<LocalCafe />}
              sx={{
                backgroundColor: '#8B4513',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { 
                  backgroundColor: '#654321',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explorar Menú
            </Button>

            <Button
              variant="outlined"
              startIcon={<People />}
              sx={{
                color: '#8B4513',
                borderColor: '#8B4513',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { 
                  backgroundColor: '#f3e5d8',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nuestra Historia
            </Button>
          </Box>

          {/* Frases inspiradoras tipo "Botiquín del Alma" */}
          <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(139, 69, 19, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" color="#8B4513" fontStyle="italic" textAlign="center">
              💫 "Que la fe y el café nunca se enfríen" • "Sonríe cada día" • "Prohibido rendirse"
            </Typography>
          </Box>
        </Box>

        {/* Imagen representativa de la experiencia RoMa */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="Experiencia RoMa Café - Espacio acogedor con juegos de mesa"
          sx={{
            width: { xs: '90%', md: '40%' },
            mt: { xs: 4, md: 0 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.2)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />
      </Box>

      {/* SECCIÓN DE VALORES Y FILOSOFÍA */}
      <Box sx={{ py: 8, px: { xs: 3, md: 10 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" color="#8B4513" gutterBottom>
              ¿Por qué RoMa Café es diferente?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
              No somos una cafetería convencional. Somos un proyecto de vida, un reflejo del amor, 
              la sensibilidad y la intención de una familia por dejar una huella positiva.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Botiquín del Alma',
                text: 'Una estación especial donde los clientes pueden tomar frases escritas con intención que llegan justo a tiempo.',
                icon: <Psychology sx={{ fontSize: 48, color: '#8B4513' }} />,
                color: '#E8F5E8'
              },
              {
                title: 'Conexión Real',
                text: 'Juegos de mesa en cada mesa para fomentar la convivencia y desconectar de lo digital para conectar con las personas.',
                icon: <Games sx={{ fontSize: 48, color: '#8B4513' }} />,
                color: '#F3E5F5'
              },
              {
                title: 'Espacio Familiar',
                text: 'Área especial para niños, permitiendo que los padres disfruten mientras los pequeños se entretienen seguros.',
                icon: <FamilyRestroom sx={{ fontSize: 48, color: '#8B4513' }} />,
                color: '#E3F2FD'
              },
              {
                title: 'Amor en Cada Detalle',
                text: 'Desde 2010 soñábamos con crear un espacio significativo donde el bienestar emocional fuera tan importante como el café.',
                icon: <Favorite sx={{ fontSize: 48, color: '#8B4513' }} />,
                color: '#FFEBEE'
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    backgroundColor: item.color,
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      boxShadow: '0 12px 40px rgba(139, 69, 19, 0.15)',
                      borderColor: '#8B4513'
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    {item.icon}
                    <Typography variant="h5" fontWeight="bold" color="#8B4513" gutterBottom sx={{ mt: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN DE NUESTROS VALORES */}
      <Box sx={{ py: 8, px: { xs: 3, md: 10 }, backgroundColor: '#f9f5f0' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" color="#8B4513" gutterBottom>
            Nuestros Valores
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Los pilares que guían cada decisión en RoMa Café
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                value: 'Amor',
                description: 'El ingrediente principal en todo lo que hacemos, desde la preparación hasta la atención.',
                icon: <Favorite />
              },
              {
                value: 'Comunicación',
                description: 'Fomentamos diálogo abierto y respetuoso con clientes y equipo.',
                icon: <EmojiEmotions />
              },
              {
                value: 'Empatía',
                description: 'Nos ponemos en el lugar de los demás para comprender necesidades y emociones.',
                icon: <Psychology />
              },
              {
                value: 'Inclusión',
                description: 'Celebramos la diversidad y creamos espacios donde todos se sientan bienvenidos.',
                icon: <Diversity3 />
              },
              {
                value: 'Pasión',
                description: 'Energía y entusiasmo en cada detalle para crear experiencias memorables.',
                icon: <LocalCafe />
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    backgroundColor: '#8B4513', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 80, 
                    height: 80, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="#8B4513" gutterBottom>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN DE EQUIPO Y SERVICIOS */}
      <Box sx={{ py: 8, px: { xs: 3, md: 10 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" color="#8B4513" gutterBottom>
                Nuestro Equipo RoMa
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                Contamos con un equipo comprometido que hace posible la magia de RoMa Café cada día:
              </Typography>
              
              <Box sx={{ space: 2 }}>
                {[
                  '👨‍💼 Gerente Operativo - Encargado de administrar y controlar las actividades',
                  '👨‍🍳 Barista - Especialista en preparar bebidas frías y calientes con pasión',
                  '👩‍💼 Mesero - Atención y servicio al cliente con calidez y profesionalismo'
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Equipo RoMa Café trabajando"
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* INFORMACIÓN DE CONTACTO Y CTA */}
      <Box sx={{ py: 8, px: { xs: 3, md: 10 }, backgroundColor: '#8B4513', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Ven a vivir la experiencia RoMa
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Puebla 62A, Dolores Hidalgo, Guanajuato
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
                Un refugio emocional donde puedes encontrar justo lo que no sabías que necesitabas. 
                Donde las paredes hablan, los juegos conectan y el café abraza el alma.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Coffee />}
                  sx={{
                    backgroundColor: 'white',
                    color: '#8B4513',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    '&:hover': { 
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Ver Menú Completo
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RestaurantMenu />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Pedir a Domicilio
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                p: 4, 
                borderRadius: 3,
                textAlign: 'center'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📞 Servicio a Domicilio
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  418 187 8577
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  También en: <strong>@romacafe_dh</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER CON HISTORIA */}
      <Box
        sx={{
          py: 4,
          textAlign: 'center',
          backgroundColor: '#654321',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            RoMa Café • 2010-2025
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            De un sueño profundo y personal nace RoMa Café. Un proyecto que evolucionó de una 
            cafetería con guardería a un espacio emocional donde cada visita es una experiencia significativa.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
            ✨ Hecho con amor para Dolores Hidalgo • @romacafe_dh • 941 seguidores • Abierto ahora
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Inicio;
