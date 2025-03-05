import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTickets } from '../../API/TicketAPICall';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  ListItemButton,
} from '@mui/material';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

interface Ticket {
  id: number;
  taskTitle: string;
  description: string;
  status: string;
  assignedTo: string;
  deadline: string;
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    getUserTickets()
      .then(setTickets)
      .catch((err) => {
        setError(err.message);
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleTicketClick = (ticketId: number) => {
    navigate(`/tasks/${ticketId}`);
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </MuiAlert>
      </Snackbar>
    </Container>
  );

  return (
    <Container sx={{ mt: 4, maxWidth: 'md' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Tickets
      </Typography>
      {tickets.length === 0 ? (
        <Typography variant="body1">No tickets assigned to you.</Typography>
      ) : (
        <List>
          {tickets.map((ticket) => (
            <ListItem key={ticket.id} sx={{ border: '1px solid #ddd', borderRadius: '4px', mb: 2, p: 0, boxShadow:'0 2px 4px rgba(0,0,0,0.1)' }}>
              <ListItemButton onClick={() => handleTicketClick(ticket.id)}>
                <ListItemText
                  primary={ticket.taskTitle}
                  secondary={ticket.description}
                />
                <Chip
                  label={ticket.status}
                  color={ticket.status === "open" ? "success" : "default"}
                  sx={{ ml: 2 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default TicketsPage;